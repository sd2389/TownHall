"""
Authentication Views
Handles login, logout, and signup operations
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.throttling import UserRateThrottle
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import transaction
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import UserProfile
from .serializers import LoginSerializer, SignupSerializer
from citizen.models import CitizenProfile
from businessowner.models import BusinessOwnerProfile
from government.models import GovernmentOfficial
from towns.models import Town
import logging

logger = logging.getLogger(__name__)


class LoginThrottle(UserRateThrottle):
    """Custom throttle for login endpoint"""
    scope = 'login'


class SignupThrottle(UserRateThrottle):
    """Custom throttle for signup endpoint"""
    scope = 'signup'


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([LoginThrottle])
def login_view(request):
    """Handle user login"""
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'error': 'Validation failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    user_type = serializer.validated_data['userType']
    
    user = authenticate(username=email, password=password)
    if not user:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        profile = UserProfile.objects.get(user=user)
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found. Please complete your registration.'
        }, status=status.HTTP_404_NOT_FOUND)
    
    is_superuser = user.is_superuser
    if not is_superuser and profile.role != user_type:
        return Response({
            'error': f'Invalid account type. Your account is registered as {profile.get_role_display()}, not {user_type}.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    if not profile.is_approved and not is_superuser:
        if profile.role == 'government':
            return Response({
                'error': 'Account pending approval',
                'pending_approval': True,
                'message': 'Your account is pending approval from an administrator.'
            }, status=status.HTTP_403_FORBIDDEN)
        elif profile.role in ['citizen', 'business']:
            return Response({
                'error': 'Account pending approval',
                'pending_approval': True,
                'message': 'Your account is pending approval from government officials.'
            }, status=status.HTTP_403_FORBIDDEN)
    
    token, created = Token.objects.get_or_create(user=user)
    effective_role = user_type if is_superuser else profile.role
    
    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'email': user.email,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'role': effective_role,
            'phoneNumber': profile.phone_number,
            'is_superuser': is_superuser,
        }
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([SignupThrottle])
def signup_view(request):
    """Handle user signup"""
    serializer = SignupSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'error': 'Validation failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    user_type = serializer.validated_data['userType']
    
    if User.objects.filter(email=email).exists():
        return Response({
            'error': 'Email already registered'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        with transaction.atomic():
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=serializer.validated_data.get('firstName', ''),
                last_name=serializer.validated_data.get('lastName', ''),
            )
            
            town_id = serializer.validated_data.get('townId')
            town = None
            if town_id:
                try:
                    town = Town.objects.get(id=town_id)
                except Town.DoesNotExist:
                    pass
            
            profile = UserProfile.objects.create(
                user=user,
                role=user_type,
                phone_number=serializer.validated_data.get('phoneNumber', ''),
                town=town,
                is_approved=False,
            )
            
            if user_type == 'citizen':
                CitizenProfile.objects.create(
                    user=user,
                    citizen_id=serializer.validated_data.get('citizenId', ''),
                    address=serializer.validated_data.get('address', ''),
                    date_of_birth=serializer.validated_data.get('dateOfBirth'),
                )
            elif user_type == 'business':
                BusinessOwnerProfile.objects.create(
                    user=user,
                    business_name=serializer.validated_data.get('businessName', ''),
                    business_type=serializer.validated_data.get('businessType', ''),
                    business_address=serializer.validated_data.get('businessAddress', ''),
                    business_registration_number=serializer.validated_data.get('businessRegistrationNumber', ''),
                    website=serializer.validated_data.get('website', ''),
                )
            elif user_type == 'government':
                GovernmentOfficial.objects.create(
                    user=user,
                    employee_id=serializer.validated_data.get('employeeId', ''),
                    department=serializer.validated_data.get('department', ''),
                    position=serializer.validated_data.get('position', ''),
                    phone_number=serializer.validated_data.get('phoneNumber', ''),
                    office_address=serializer.validated_data.get('officeAddress', ''),
                    town=town,
                )
        
        return Response({
            'message': 'Account created successfully. Please wait for approval.',
            'user': {
                'id': user.id,
                'email': user.email,
                'role': user_type,
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error during signup: {str(e)}")
        return Response({
            'error': f'An error occurred during signup: {str(e)}'
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
        logger.error(f"Error during logout: {str(e)}")
        return Response({
            'error': f'Error during logout: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([LoginThrottle])
def admin_login_view(request):
    """Handle admin login"""
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'error': 'Validation failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    
    user = authenticate(username=email, password=password)
    if not user:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    if not user.is_superuser:
        return Response({
            'error': 'Access denied. Admin access required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    token, created = Token.objects.get_or_create(user=user)
    
    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'email': user.email,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'is_superuser': True,
        }
    }, status=status.HTTP_200_OK)


