"""
Town Change Request Views
Handles town change request operations
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Town, TownChangeRequest
from authentication.models import UserProfile
from django.db import transaction
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_town_change_request(request):
    """Create a town change request"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        
        if profile.role == 'government':
            return Response({
                'error': 'Government officials cannot change towns'
            }, status=status.HTTP_403_FORBIDDEN)
        
        new_town_id = request.data.get('requested_town_id')
        billing_address = request.data.get('billing_address')
        
        if not new_town_id or not billing_address:
            return Response({
                'error': 'New town and billing address are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            new_town = Town.objects.get(id=new_town_id)
        except Town.DoesNotExist:
            return Response({
                'error': 'Invalid town selected'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        existing = TownChangeRequest.objects.filter(
            user=request.user,
            status__in=['pending', 'approved_current']
        ).first()
        
        if existing:
            return Response({
                'error': 'You already have a pending town change request'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        change_request = TownChangeRequest.objects.create(
            user=request.user,
            current_town=profile.town,
            requested_town=new_town,
            billing_address=billing_address,
            status='pending'
        )
        
        return Response({
            'message': 'Town change request created successfully',
            'request_id': change_request.id
        }, status=status.HTTP_201_CREATED)
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error creating town change request: {str(e)}")
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def list_town_change_requests(request):
    """List town change requests (GET) or create request (POST)"""
    if request.method == 'GET':
        try:
            profile = UserProfile.objects.get(user=request.user)
            is_superuser = request.user.is_superuser
            
            if profile.role != 'government' and not is_superuser:
                return Response({
                    'error': 'Only government officials or superusers can view requests'
                }, status=status.HTTP_403_FORBIDDEN)
            
            user_town = profile.town
            status_filter = request.query_params.get('status')
            
            if is_superuser:
                if status_filter:
                    requests = TownChangeRequest.objects.filter(status=status_filter)
                else:
                    requests = TownChangeRequest.objects.all()
            else:
                if not user_town:
                    return Response({
                        'error': 'You are not assigned to a town'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                if status_filter:
                    requests = TownChangeRequest.objects.filter(
                        current_town=user_town,
                        status=status_filter
                    )
                else:
                    requests = TownChangeRequest.objects.filter(current_town=user_town)
            
            data = []
            for req in requests:
                data.append({
                    'id': req.id,
                    'user_name': f"{req.user.first_name} {req.user.last_name}",
                    'user_email': req.user.email,
                    'current_town': req.current_town.name if req.current_town else None,
                    'requested_town': req.requested_town.name if req.requested_town else None,
                    'billing_address': req.billing_address,
                    'status': req.status,
                    'requested_at': req.requested_at
                })
            
            return Response(data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error listing town change requests: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        return create_town_change_request(request)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def town_change_request_detail_action_view(request, request_id):
    """Get (GET) or approve/reject (PATCH) a town change request"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        
        if profile.role != 'government' and not request.user.is_superuser:
            return Response({
                'error': 'Only government officials can manage requests'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            change_request = TownChangeRequest.objects.get(id=request_id)
        except TownChangeRequest.DoesNotExist:
            return Response({
                'error': 'Request not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'GET':
            return Response({
                'id': change_request.id,
                'user_name': f"{change_request.user.first_name} {change_request.user.last_name}",
                'user_email': change_request.user.email,
                'current_town': change_request.current_town.name if change_request.current_town else None,
                'requested_town': change_request.requested_town.name if change_request.requested_town else None,
                'billing_address': change_request.billing_address,
                'status': change_request.status,
                'requested_at': change_request.requested_at
            }, status=status.HTTP_200_OK)
        
        elif request.method == 'PATCH':
            action = request.data.get('action', '')
            user_town = profile.town
            
            if not user_town:
                return Response({
                    'error': 'You are not assigned to a town'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if action == 'approve':
                if change_request.current_town == user_town and change_request.status == 'pending':
                    change_request.approve_by_current_town(request.user)
                    return Response({
                        'message': 'Request approved by current town. Awaiting approval from new town.'
                    }, status=status.HTTP_200_OK)
                elif change_request.requested_town == user_town and change_request.status == 'approved_current':
                    change_request.approve_by_new_town(request.user)
                    with transaction.atomic():
                        user_profile = UserProfile.objects.get(user=change_request.user)
                        user_profile.town = change_request.requested_town
                        user_profile.save()
                    return Response({
                        'message': 'Town change completed successfully'
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        'error': 'You are not authorized to approve this request'
                    }, status=status.HTTP_403_FORBIDDEN)
            
            elif action == 'reject':
                if change_request.current_town != user_town and change_request.requested_town != user_town:
                    return Response({
                        'error': 'You are not authorized to reject this request'
                    }, status=status.HTTP_403_FORBIDDEN)
                
                reason = request.data.get('reason', 'No reason provided')
                change_request.reject(reason, request.user)
                return Response({
                    'message': 'Request rejected successfully'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid action. Use action: "approve" or "reject"'
                }, status=status.HTTP_400_BAD_REQUEST)
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error managing town change request: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)









