"""
Complaint Comment Views
Handles comment operations on complaints
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import CitizenComplaint, ComplaintComment
from authentication.models import UserProfile
from government.models import GovernmentOfficial
from government.utils import get_user_town
from .views_utils import validate_required_field
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_complaint_comment_view(request, complaint_id):
    """Add a comment to a complaint"""
    try:
        try:
            complaint = CitizenComplaint.objects.get(id=complaint_id)
        except CitizenComplaint.DoesNotExist:
            return Response({
                'error': 'Complaint not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        try:
            profile = UserProfile.objects.get(user=request.user)
            if profile.role != 'government' and not request.user.is_superuser:
                return Response({
                    'error': 'Only government officials can add comments'
                }, status=status.HTTP_403_FORBIDDEN)
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found'
            }, status=status.HTTP_403_FORBIDDEN)
        
        town = get_user_town(request.user)
        if not request.user.is_superuser and complaint.town != town:
            return Response({
                'error': 'You can only comment on complaints from your town'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            official = GovernmentOfficial.objects.get(user=request.user)
        except GovernmentOfficial.DoesNotExist:
            return Response({
                'error': 'Government official profile not found'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        is_valid, comment_text, error = validate_required_field(request.data, 'comment')
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        comment = ComplaintComment.objects.create(
            complaint=complaint,
            official=official,
            comment_text=comment_text,
            is_notification=False,
        )
        
        return Response({
            'message': 'Comment added successfully',
            'comment': {
                'id': comment.id,
                'text': comment.comment_text,
                'author': official.user.get_full_name() or official.user.username,
                'date': comment.created_at.strftime('%Y-%m-%d %H:%M'),
                'is_notification': comment.is_notification,
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error adding comment: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


