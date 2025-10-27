from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import transaction
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import UserProfile
from .serializers import LoginSerializer, SignupSerializer
from citizen.models import CitizenProfile
from businessowner.models import BusinessOwnerProfile
from government.models import GovernmentOfficial
from towns.models import Town


class LoginThrottle(UserRateThrottle):
    """Custom throttle for login endpoint"""
    scope = 'login'


class SignupThrottle(UserRateThrottle):
    """Custom throttle for signup endpoint"""
    scope = 'signup'


class ApiThrottle(UserRateThrottle):
    """General API throttle"""
    scope = 'api'


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([LoginThrottle])
def login_view(request):
    """Handle user login with rate limiting and validation"""
    # Validate input using serializer
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'error': 'Validation failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    user_type = serializer.validated_data['userType']
    
    # Authenticate user
    user = authenticate(username=email, password=password)
    if not user:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    # Check if user has a profile
    try:
        profile = UserProfile.objects.get(user=user)
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found. Please complete your registration.'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Check role match (bypass for superusers)
    is_superuser = user.is_superuser
    if not is_superuser and profile.role != user_type:
        return Response({
            'error': f'Invalid account type. Your account is registered as {profile.get_role_display()}, not {user_type}.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Check approval status for citizens and businesses
    if profile.role in ['citizen', 'business'] and not profile.is_approved and not is_superuser:
        return Response({
            'error': 'Account pending approval',
            'pending_approval': True,
            'message': 'Your account is pending approval from government officials.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Create or get token
    token, created = Token.objects.get_or_create(user=user)
    
    # For superusers, use the requested portal role instead of their profile role
    effective_role = user_type if is_superuser else profile.role
    
    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'email': user.email,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'role': effective_role,
            'phoneNumber': profile.phone_number or '',
            'is_superuser': is_superuser,
            'is_approved': profile.is_approved,
            'town': profile.town.name if profile.town else None,
        },
        'message': 'Login successful'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([SignupThrottle])
def signup_view(request):
    """Handle user registration with validation and rate limiting"""
    # Validate input using serializer
    serializer = SignupSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'error': 'Validation failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    
    # Additional password validation
    try:
        validate_password(data['password'])
    except DjangoValidationError as e:
        return Response({
            'error': 'Password validation failed',
            'details': list(e.messages)
        }, status=status.HTTP_400_BAD_REQUEST)
    
    email = data['email']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    user_type = data['userType']
    phone_number = data.get('phone', '')
    town_id = data.get('townId')
    
    # Validate town for citizens and businesses
    town = None
    if user_type in ['citizen', 'business', 'government']:
        if not town_id:
            return Response({
                'error': 'Town is required for this user type'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            town = Town.objects.get(id=town_id, is_active=True)
        except Town.DoesNotExist:
            return Response({
                'error': 'Invalid or inactive town selected'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    # Determine if user needs approval
    needs_approval = user_type in ['citizen', 'business']
    
    try:
        with transaction.atomic():
            # Create user
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            
            # Create user profile
            profile = UserProfile.objects.create(
                user=user,
                role=user_type,
                phone_number=phone_number,
                town=town,
                is_approved=not needs_approval  # Government and superuser are auto-approved
            )
            
            # Create role-specific profile
            if user_type == 'citizen':
                # Store structured address
                billing_address = {
                    'street': data.get('streetAddress', ''),
                    'apt_suite': data.get('aptSuite', ''),
                    'city': data.get('city', ''),
                    'state': data.get('state', ''),
                    'zip_code': data.get('zipCode', '')
                }
                # Concatenate for address field
                address_parts = [data.get('streetAddress', ''), data.get('aptSuite', ''), data.get('city', ''), data.get('state', ''), data.get('zipCode', '')]
                address = ', '.join([part for part in address_parts if part])
                
                CitizenProfile.objects.create(
                    user=user,
                    citizen_id=f"C{user.id:06d}",
                    phone_number=phone_number,
                    address=address,
                    billing_address=billing_address,
                    date_of_birth=data.get('dateOfBirth') or None
                )
            elif user_type == 'business':
                # Store structured billing address
                billing_address = {
                    'street': data.get('streetAddress', ''),
                    'apt_suite': data.get('aptSuite', ''),
                    'city': data.get('city', ''),
                    'state': data.get('state', ''),
                    'zip_code': data.get('zipCode', '')
                }
                
                BusinessOwnerProfile.objects.create(
                    user=user,
                    business_name=data.get('businessName', ''),
                    business_registration_number=data.get('businessRegistrationNumber', ''),
                    business_type=data.get('businessType', ''),
                    phone_number=phone_number,
                    business_address=data.get('businessAddress', ''),
                    billing_address=billing_address,
                    website=data.get('website', '')
                )
            elif user_type == 'government':
                GovernmentOfficial.objects.create(
                    user=user,
                    employee_id=data.get('employeeId', ''),
                    department=data.get('department', ''),
                    position=data.get('position', ''),
                    phone_number=phone_number,
                    office_address=data.get('officeAddress', ''),
                    town=town
                )
            
            # Create token only if approved
            token = None
            if profile.is_approved:
                token = Token.objects.create(user=user)
            
            response_data = {
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'role': profile.role,
                    'phoneNumber': profile.phone_number,
                    'is_approved': profile.is_approved,
                },
            }
            
            if token:
                response_data['token'] = token.key
                response_data['message'] = 'Account created successfully'
            else:
                response_data['pending_approval'] = True
                response_data['message'] = 'Account created. Please wait for government approval.'
            
            return Response(response_data, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        return Response({
            'error': f'Error creating account: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Handle user logout"""
    try:
        request.user.auth_token.delete()
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': f'Error during logout: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """Get current user profile"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        
        # Get role-specific profile data
        role_data = {}
        if profile.is_citizen:
            try:
                citizen_profile = CitizenProfile.objects.get(user=request.user)
                role_data = {
                    'citizenId': citizen_profile.citizen_id,
                    'address': citizen_profile.address,
                    'dateOfBirth': citizen_profile.date_of_birth,
                }
            except CitizenProfile.DoesNotExist:
                pass
        elif profile.is_business_owner:
            try:
                business_profile = BusinessOwnerProfile.objects.get(user=request.user)
                role_data = {
                    'businessName': business_profile.business_name,
                    'businessType': business_profile.business_type,
                    'businessAddress': business_profile.business_address,
                    'businessRegistrationNumber': business_profile.business_registration_number,
                    'website': business_profile.website,
                }
            except BusinessOwnerProfile.DoesNotExist:
                pass
        elif profile.is_government_official:
            try:
                gov_profile = GovernmentOfficial.objects.get(user=request.user)
                role_data = {
                    'employeeId': gov_profile.employee_id,
                    'department': gov_profile.department,
                    'position': gov_profile.position,
                    'officeAddress': gov_profile.office_address,
                }
            except GovernmentOfficial.DoesNotExist:
                pass
        
        return Response({
            'user': {
                'id': request.user.id,
                'email': request.user.email,
                'firstName': request.user.first_name,
                'lastName': request.user.last_name,
                'role': profile.role,
                'phoneNumber': profile.phone_number,
                'is_superuser': request.user.is_superuser,  # Include superuser status
                **role_data
            }
        }, status=status.HTTP_200_OK)
        
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_pending_users_view(request):
    """List pending approval users (government only)"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        
        # Allow superusers to access this view
        is_superuser = request.user.is_superuser
        
        if profile.role != 'government' and not is_superuser:
            return Response({
                'error': 'Only government officials or superusers can view pending users'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get unapproved users
        # Superusers can see all, government officials see only their town
        if is_superuser:
            # Superusers see all pending users
            pending_profiles = UserProfile.objects.filter(
                is_approved=False,
                role__in=['citizen', 'business']
            ).select_related('user')
        else:
            # Government officials see only their town
            if not profile.town:
                return Response({
                    'error': 'You are not assigned to a town'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            pending_profiles = UserProfile.objects.filter(
                town=profile.town,
                is_approved=False,
                role__in=['citizen', 'business']
            ).select_related('user')
        
        data = []
        for pending_profile in pending_profiles:
            data.append({
                'user_id': pending_profile.user.id,
                'email': pending_profile.user.email,
                'firstName': pending_profile.user.first_name,
                'lastName': pending_profile.user.last_name,
                'role': pending_profile.role,
                'town': pending_profile.town.name if pending_profile.town else None,
                'created_at': pending_profile.created_at
            })
        
        return Response(data, status=status.HTTP_200_OK)
        
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_all_users_view(request):
    """List all users for admin management (including approved, pending, and inactive)"""
    try:
        # Allow superusers only
        if not request.user.is_superuser:
            return Response({
                'error': 'Only superusers can view all users'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get all user profiles
        all_profiles = UserProfile.objects.all().select_related('user').order_by('-created_at')
        
        data = []
        for profile in all_profiles:
            data.append({
                'user_id': profile.user.id,
                'email': profile.user.email,
                'firstName': profile.user.first_name,
                'lastName': profile.user.last_name,
                'role': profile.role,
                'is_approved': profile.is_approved,
                'town': profile.town.name if profile.town else None,
                'created_at': profile.created_at,
                'approved_at': profile.approved_at,
                'approved_by': profile.approved_by.id if profile.approved_by else None,
            })
        
        return Response(data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_user_view(request, user_id):
    """Approve a user (government only)"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        
        if profile.role != 'government':
            return Response({
                'error': 'Only government officials can approve users'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user_to_approve = User.objects.get(id=user_id)
            pending_profile = UserProfile.objects.get(user=user_to_approve)
        except (User.DoesNotExist, UserProfile.DoesNotExist):
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if pending_profile.town != profile.town:
            return Response({
                'error': 'You can only approve users from your town'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Approve user
        pending_profile.is_approved = True
        pending_profile.approved_by = request.user
        pending_profile.approved_at = timezone.now()
        pending_profile.save()
        
        # Create token for the approved user
        token, created = Token.objects.get_or_create(user=user_to_approve)
        
        return Response({
            'message': 'User approved successfully',
            'token': token.key
        }, status=status.HTTP_200_OK)
        
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_user_view(request, user_id):
    """Reject a user (government only)"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        
        if profile.role != 'government':
            return Response({
                'error': 'Only government officials can reject users'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user_to_reject = User.objects.get(id=user_id)
            pending_profile = UserProfile.objects.get(user=user_to_reject)
        except (User.DoesNotExist, UserProfile.DoesNotExist):
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if pending_profile.town != profile.town:
            return Response({
                'error': 'You can only reject users from your town'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Delete user account
        user_to_reject.delete()
        
        return Response({
            'message': 'User rejected and removed successfully'
        }, status=status.HTTP_200_OK)
        
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)