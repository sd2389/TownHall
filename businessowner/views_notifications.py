"""
Business Notification Views
Handles business owner notifications
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import BusinessNotification
from .utils import check_business_owner_access, format_notification_response
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_business_notifications_view(request):
    """List notifications for the authenticated business owner"""
    try:
        is_business_owner, profile, business_profile = check_business_owner_access(request.user)
        
        if not is_business_owner:
            return Response({
                'error': 'Only business owners can access notifications'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if not business_profile:
            return Response({
                'error': 'Business profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        is_read = request.query_params.get('is_read')
        notification_type = request.query_params.get('type')
        
        notifications = BusinessNotification.objects.filter(business_owner=business_profile)
        
        if is_read is not None:
            notifications = notifications.filter(is_read=is_read.lower() == 'true')
        if notification_type:
            notifications = notifications.filter(notification_type=notification_type)
        
        notifications = notifications.order_by('-created_at')
        
        data = [format_notification_response(notification) for notification in notifications]
        
        unread_count = BusinessNotification.objects.filter(
            business_owner=business_profile,
            is_read=False
        ).count()
        
        return Response({
            'notifications': data,
            'unread_count': unread_count,
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error listing business notifications: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def mark_business_notification_read_view(request, notification_id):
    """Mark a business notification as read"""
    try:
        is_business_owner, profile, business_profile = check_business_owner_access(request.user)
        
        if not is_business_owner:
            return Response({
                'error': 'Only business owners can access notifications'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if not business_profile:
            return Response({
                'error': 'Business profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        try:
            notification = BusinessNotification.objects.get(
                id=notification_id,
                business_owner=business_profile
            )
        except BusinessNotification.DoesNotExist:
            return Response({
                'error': 'Notification not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        notification.is_read = True
        notification.save()
        
        return Response({
            'message': 'Notification marked as read',
            'notification': {
                'id': notification.id,
                'is_read': notification.is_read,
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error marking notification as read: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

