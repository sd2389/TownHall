"""
Citizen Notification Views
Handles notification operations for citizens
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import CitizenProfile, CitizenNotification, CitizenComplaint, ComplaintComment
from government.models import GovernmentOfficial
from government.utils import get_user_town
from .views_utils import get_citizen_profile
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_notifications_view(request):
    """List notifications for the authenticated citizen"""
    try:
        citizen_profile = get_citizen_profile(request.user)
        if not citizen_profile:
            return Response({
                'error': 'Citizen profile not found'
            }, status=status.HTTP_403_FORBIDDEN)
        
        is_read = request.query_params.get('is_read')
        notification_type = request.query_params.get('type')
        
        notifications = CitizenNotification.objects.filter(citizen=citizen_profile)
        
        if is_read is not None:
            notifications = notifications.filter(is_read=is_read.lower() == 'true')
        if notification_type:
            notifications = notifications.filter(notification_type=notification_type)
        
        notifications = notifications.select_related('complaint', 'complaint__citizen').order_by('-created_at')
        
        data = []
        for notification in notifications:
            data.append({
                'id': notification.id,
                'type': notification.notification_type,
                'title': notification.title,
                'message': notification.message,
                'is_read': notification.is_read,
                'created_at': notification.created_at.strftime('%Y-%m-%d %H:%M'),
                'complaint_id': notification.complaint.id if notification.complaint else None,
                'complaint_title': notification.complaint.title if notification.complaint else None,
            })
        
        return Response({
            'notifications': data,
            'unread_count': CitizenNotification.objects.filter(citizen=citizen_profile, is_read=False).count(),
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error listing notifications: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def mark_notification_read_view(request, notification_id):
    """Mark a notification as read"""
    try:
        citizen_profile = get_citizen_profile(request.user)
        if not citizen_profile:
            return Response({
                'error': 'Citizen profile not found'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            notification = CitizenNotification.objects.get(id=notification_id, citizen=citizen_profile)
        except CitizenNotification.DoesNotExist:
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def notify_citizen_view(request, complaint_id):
    """Notify citizen about complaint update"""
    try:
        try:
            complaint = CitizenComplaint.objects.get(id=complaint_id)
        except CitizenComplaint.DoesNotExist:
            return Response({
                'error': 'Complaint not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        from authentication.models import UserProfile
        try:
            profile = UserProfile.objects.get(user=request.user)
            if profile.role != 'government' and not request.user.is_superuser:
                return Response({
                    'error': 'Only government officials can notify citizens'
                }, status=status.HTTP_403_FORBIDDEN)
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found'
            }, status=status.HTTP_403_FORBIDDEN)
        
        town = get_user_town(request.user)
        if not request.user.is_superuser and complaint.town != town:
            return Response({
                'error': 'You can only notify about complaints from your town'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            official = GovernmentOfficial.objects.get(user=request.user)
        except GovernmentOfficial.DoesNotExist:
            return Response({
                'error': 'Government official profile not found'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        notification_message = request.data.get('message', '').strip()
        if not notification_message:
            notification_message = f"Your complaint '{complaint.title}' has been updated. Status: {complaint.status.replace('_', ' ').title()}"
        
        comment = ComplaintComment.objects.create(
            complaint=complaint,
            official=official,
            comment_text=notification_message,
            is_notification=True,
        )
        
        notification = CitizenNotification.objects.create(
            citizen=complaint.citizen,
            notification_type='complaint_update',
            title=f"Update on your complaint: {complaint.title}",
            message=notification_message,
            complaint=complaint,
            is_read=False,
        )
        
        return Response({
            'message': 'Citizen notified successfully',
            'notification': {
                'id': comment.id,
                'text': comment.comment_text,
                'author': official.user.get_full_name() or official.user.username,
                'date': comment.created_at.strftime('%Y-%m-%d %H:%M'),
                'is_notification': True,
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error notifying citizen: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)









