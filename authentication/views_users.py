"""
User Management Views
Handles user profile and user management operations
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.utils import timezone
from .models import UserProfile
from citizen.models import CitizenProfile
from businessowner.models import BusinessOwnerProfile
from government.models import GovernmentOfficial
import logging

logger = logging.getLogger(__name__)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """Get (GET) or update (PATCH) current user profile"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        
        if request.method == 'GET':
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
                    'is_superuser': request.user.is_superuser,
                    **role_data
                }
            }, status=status.HTTP_200_OK)
        
        elif request.method == 'PATCH':
            if 'firstName' in request.data:
                request.user.first_name = request.data.get('firstName', '').strip()
            if 'lastName' in request.data:
                request.user.last_name = request.data.get('lastName', '').strip()
            if 'phoneNumber' in request.data:
                profile.phone_number = request.data.get('phoneNumber', '').strip()
            request.user.save()
            profile.save()
            
            return Response({
                'message': 'Profile updated successfully',
                'user': {
                    'id': request.user.id,
                    'email': request.user.email,
                    'firstName': request.user.first_name,
                    'lastName': request.user.last_name,
                    'role': profile.role,
                    'phoneNumber': profile.phone_number,
                }
            }, status=status.HTTP_200_OK)
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error managing user profile: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users_list_view(request):
    """List users with filters (GET /users/?status=pending or /users/)"""
    try:
        is_superuser = request.user.is_superuser
        status_filter = request.query_params.get('status', None)
        
        if not is_superuser:
            try:
                viewer_profile = UserProfile.objects.get(user=request.user)
                if viewer_profile.role != 'government':
                    return Response({
                        'error': 'Only government officials or administrators can view users'
                    }, status=status.HTTP_403_FORBIDDEN)
                
                from government.models import GovernmentOfficial
                try:
                    gov_official = GovernmentOfficial.objects.get(user=request.user)
                    if status_filter == 'pending' and not gov_official.can_approve_users:
                        return Response({
                            'error': 'You do not have permission to view pending users'
                        }, status=status.HTTP_403_FORBIDDEN)
                    if not status_filter and not gov_official.can_view_users:
                        return Response({
                            'error': 'You do not have permission to view users'
                        }, status=status.HTTP_403_FORBIDDEN)
                except GovernmentOfficial.DoesNotExist:
                    return Response({
                        'error': 'Government official profile not found'
                    }, status=status.HTTP_404_NOT_FOUND)
                
                if not viewer_profile.town:
                    return Response({
                        'error': 'You must be assigned to a town to view users'
                    }, status=status.HTTP_403_FORBIDDEN)
            except UserProfile.DoesNotExist:
                return Response({
                    'error': 'User profile not found'
                }, status=status.HTTP_404_NOT_FOUND)
        
        if status_filter == 'pending':
            if is_superuser:
                profiles = UserProfile.objects.filter(is_approved=False).select_related('user', 'town')
            else:
                viewer_profile = UserProfile.objects.get(user=request.user)
                profiles = UserProfile.objects.filter(
                    town=viewer_profile.town,
                    is_approved=False,
                    role__in=['citizen', 'business']
                ).select_related('user', 'town')
        else:
            if is_superuser:
                profiles = UserProfile.objects.all().select_related('user', 'town').order_by('-created_at')
            else:
                viewer_profile = UserProfile.objects.get(user=request.user)
                profiles = UserProfile.objects.filter(
                    town=viewer_profile.town,
                    role__in=['citizen', 'business']
                ).select_related('user', 'town').order_by('-created_at')
        
        data = []
        for profile in profiles:
            data.append({
                'user_id': profile.user.id,
                'email': profile.user.email,
                'firstName': profile.user.first_name,
                'lastName': profile.user.last_name,
                'role': profile.role,
                'is_approved': profile.is_approved,
                'town': profile.town.name if profile.town else None,
                'created_at': profile.created_at,
            })
        
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error listing users: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_detail_action_view(request, user_id):
    """Get (GET) or perform action (PATCH) on a user"""
    try:
        is_superuser = request.user.is_superuser
        
        try:
            target_user = User.objects.get(id=user_id)
            target_profile = UserProfile.objects.get(user=target_user)
        except (User.DoesNotExist, UserProfile.DoesNotExist):
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'GET':
            if not is_superuser:
                try:
                    viewer_profile = UserProfile.objects.get(user=request.user)
                    if viewer_profile.role != 'government':
                        return Response({
                            'error': 'Only government officials can view user details'
                        }, status=status.HTTP_403_FORBIDDEN)
                    
                    from government.models import GovernmentOfficial
                    gov_official = GovernmentOfficial.objects.get(user=request.user)
                    if not gov_official.can_view_users:
                        return Response({
                            'error': 'You do not have permission to view user details'
                        }, status=status.HTTP_403_FORBIDDEN)
                    
                    if target_profile.town != viewer_profile.town:
                        return Response({
                            'error': 'You can only view users from your town'
                        }, status=status.HTTP_403_FORBIDDEN)
                except (UserProfile.DoesNotExist, GovernmentOfficial.DoesNotExist):
                    return Response({
                        'error': 'Permission denied'
                    }, status=status.HTTP_403_FORBIDDEN)
            
            role_data = {}
            if target_profile.is_citizen:
                try:
                    citizen_profile = CitizenProfile.objects.get(user=target_user)
                    role_data = {
                        'citizenId': citizen_profile.citizen_id,
                        'address': citizen_profile.address,
                        'dateOfBirth': citizen_profile.date_of_birth,
                    }
                except CitizenProfile.DoesNotExist:
                    pass
            elif target_profile.is_business_owner:
                try:
                    business_profile = BusinessOwnerProfile.objects.get(user=target_user)
                    role_data = {
                        'businessName': business_profile.business_name,
                        'businessType': business_profile.business_type,
                        'businessAddress': business_profile.business_address,
                        'businessRegistrationNumber': business_profile.business_registration_number,
                        'website': business_profile.website,
                    }
                except BusinessOwnerProfile.DoesNotExist:
                    pass
            
            return Response({
                'user': {
                    'id': target_user.id,
                    'email': target_user.email,
                    'firstName': target_user.first_name,
                    'lastName': target_user.last_name,
                    'role': target_profile.role,
                    'phoneNumber': target_profile.phone_number,
                    'town': target_profile.town.name if target_profile.town else None,
                    'is_approved': target_profile.is_approved,
                    **role_data
                }
            }, status=status.HTTP_200_OK)
        
        elif request.method == 'PATCH':
            action = request.data.get('status') or request.data.get('action')
            
            if action == 'approved' or request.data.get('is_approved') is True:
                return approve_user_action(request, target_user, target_profile, is_superuser)
            elif action == 'rejected':
                return reject_user_action(request, target_user, target_profile, is_superuser)
            elif action == 'deactivate' or request.data.get('is_active') is False:
                return deactivate_user_action(request, target_user, target_profile, is_superuser)
            else:
                return Response({
                    'error': 'Invalid action. Use status: "approved", "rejected", or "deactivate"'
                }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error managing user: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def approve_user_action(request, target_user, target_profile, is_superuser):
    """Approve a user"""
    if target_profile.is_approved:
        return Response({
            'error': 'User is already approved'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not is_superuser:
        try:
            approver_profile = UserProfile.objects.get(user=request.user)
            if approver_profile.role != 'government':
                return Response({
                    'error': 'Only government officials can approve users'
                }, status=status.HTTP_403_FORBIDDEN)
            
            from government.models import GovernmentOfficial
            gov_official = GovernmentOfficial.objects.get(user=request.user)
            if not gov_official.can_approve_users:
                return Response({
                    'error': 'You do not have permission to approve users'
                }, status=status.HTTP_403_FORBIDDEN)
            
            if target_profile.town != approver_profile.town:
                return Response({
                    'error': 'You can only approve users from your town'
                }, status=status.HTTP_403_FORBIDDEN)
        except (UserProfile.DoesNotExist, GovernmentOfficial.DoesNotExist):
            return Response({
                'error': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)
    
    target_profile.is_approved = True
    target_profile.approved_by = request.user
    target_profile.approved_at = timezone.now()
    target_profile.save()
    
    token, created = Token.objects.get_or_create(user=target_user)
    
    return Response({
        'message': 'User approved successfully',
        'token': token.key
    }, status=status.HTTP_200_OK)


def reject_user_action(request, target_user, target_profile, is_superuser):
    """Reject a user"""
    if not is_superuser:
        try:
            rejecter_profile = UserProfile.objects.get(user=request.user)
            if rejecter_profile.role != 'government':
                return Response({
                    'error': 'Only government officials can reject users'
                }, status=status.HTTP_403_FORBIDDEN)
            
            from government.models import GovernmentOfficial
            gov_official = GovernmentOfficial.objects.get(user=request.user)
            if not gov_official.can_approve_users:
                return Response({
                    'error': 'You do not have permission to reject users'
                }, status=status.HTTP_403_FORBIDDEN)
            
            if target_profile.town != rejecter_profile.town:
                return Response({
                    'error': 'You can only reject users from your town'
                }, status=status.HTTP_403_FORBIDDEN)
        except (UserProfile.DoesNotExist, GovernmentOfficial.DoesNotExist):
            return Response({
                'error': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)
    
    target_user.delete()
    return Response({
        'message': 'User rejected and removed successfully'
    }, status=status.HTTP_200_OK)


def deactivate_user_action(request, target_user, target_profile, is_superuser):
    """Deactivate a user"""
    if not is_superuser:
        try:
            deactivator_profile = UserProfile.objects.get(user=request.user)
            if deactivator_profile.role != 'government':
                return Response({
                    'error': 'Only government officials can deactivate users'
                }, status=status.HTTP_403_FORBIDDEN)
            
            from government.models import GovernmentOfficial
            gov_official = GovernmentOfficial.objects.get(user=request.user)
            if not gov_official.can_approve_users:
                return Response({
                    'error': 'You do not have permission to deactivate users'
                }, status=status.HTTP_403_FORBIDDEN)
            
            if target_profile.town != deactivator_profile.town:
                return Response({
                    'error': 'You can only deactivate users from your town'
                }, status=status.HTTP_403_FORBIDDEN)
        except (UserProfile.DoesNotExist, GovernmentOfficial.DoesNotExist):
            return Response({
                'error': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)
    
    target_profile.is_approved = False
    target_profile.save()
    target_user.is_active = False
    target_user.save()
    
    return Response({
        'message': 'User deactivated successfully'
    }, status=status.HTTP_200_OK)









