from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import transaction
from .models import UserProfile
from citizen.models import CitizenProfile
from businessowner.models import BusinessOwnerProfile
from government.models import GovernmentOfficial


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Handle user login"""
    email = request.data.get('email')
    password = request.data.get('password')
    user_type = request.data.get('userType')
    
    if not email or not password or not user_type:
        return Response({
            'error': 'Email, password, and user type are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Authenticate user
    user = authenticate(username=email, password=password)
    if not user:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    # Check if user has the correct role
    try:
        profile = UserProfile.objects.get(user=user)
        if profile.role != user_type:
            return Response({
                'error': f'User is not a {user_type}'
            }, status=status.HTTP_403_FORBIDDEN)
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Create or get token
    token, created = Token.objects.get_or_create(user=user)
    
    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'email': user.email,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'role': profile.role,
            'phoneNumber': profile.phone_number,
        },
        'message': 'Login successful'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    """Handle user registration"""
    data = request.data
    
    # Validate required fields
    required_fields = ['email', 'password', 'firstName', 'lastName', 'userType']
    for field in required_fields:
        if not data.get(field):
            return Response({
                'error': f'{field} is required'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    user_type = data.get('userType')
    phone_number = data.get('phone', '')
    
    # Check if user already exists
    if User.objects.filter(email=email).exists():
        return Response({
            'error': 'User with this email already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
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
                phone_number=phone_number
            )
            
            # Create role-specific profile
            if user_type == 'citizen':
                CitizenProfile.objects.create(
                    user=user,
                    citizen_id=f"C{user.id:06d}",
                    phone_number=phone_number,
                    address=data.get('address', ''),
                    date_of_birth=data.get('dateOfBirth') or None
                )
            elif user_type == 'business':
                BusinessOwnerProfile.objects.create(
                    user=user,
                    business_name=data.get('businessName', ''),
                    business_registration_number=data.get('businessRegistrationNumber', ''),
                    business_type=data.get('businessType', ''),
                    phone_number=phone_number,
                    business_address=data.get('businessAddress', ''),
                    website=data.get('website', '')
                )
            elif user_type == 'government':
                GovernmentOfficial.objects.create(
                    user=user,
                    employee_id=data.get('employeeId', ''),
                    department=data.get('department', ''),
                    position=data.get('position', ''),
                    phone_number=phone_number,
                    office_address=data.get('officeAddress', '')
                )
            
            # Create token
            token = Token.objects.create(user=user)
            
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'role': profile.role,
                    'phoneNumber': profile.phone_number,
                },
                'message': 'Account created successfully'
            }, status=status.HTTP_201_CREATED)
            
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
                **role_data
            }
        }, status=status.HTTP_200_OK)
        
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)