"""
Business Feedback Views
Handles business feedback to government and citizen feedback on businesses
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import BusinessFeedback, CitizenBusinessFeedback
from .utils import (
    check_business_owner_access, check_citizen_access,
    validate_required_field, validate_rating
)
from citizen.models import CitizenProfile
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_business_feedback_view(request):
    """Create business feedback to government - POST /business/feedback/"""
    """Business owner provides feedback on government services"""
    try:
        is_business_owner, profile, business_profile = check_business_owner_access(request.user)
        
        if not is_business_owner:
            return Response({
                'error': 'Only business owners can provide feedback'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if not business_profile:
            return Response({
                'error': 'Business profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        is_valid, service_name, error = validate_required_field(request.data, 'service_name')
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        is_valid, rating_value, error = validate_rating(request.data.get('rating'))
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        is_valid, feedback_text, error = validate_required_field(request.data, 'feedback_text')
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        feedback = BusinessFeedback.objects.create(
            business_owner=business_profile,
            service_name=service_name,
            rating=rating_value,
            feedback_text=feedback_text,
        )
        
        return Response({
            'message': 'Feedback submitted successfully',
            'feedback': {
                'id': feedback.id,
                'service_name': feedback.service_name,
                'rating': feedback.rating,
                'created_at': feedback.created_at.strftime('%Y-%m-%d'),
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error creating business feedback: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_citizen_business_feedback_view(request):
    """Create citizen feedback on business - POST /business/business-feedback/"""
    """Citizen provides feedback on a business"""
    try:
        is_citizen, profile = check_citizen_access(request.user)
        
        if not is_citizen:
            return Response({
                'error': 'Only citizens can provide business feedback'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            citizen_profile = CitizenProfile.objects.get(user=request.user)
        except CitizenProfile.DoesNotExist:
            return Response({
                'error': 'Citizen profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        business_id = request.data.get('business_id')
        if not business_id:
            return Response({
                'error': 'Business ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            from .models import BusinessOwnerProfile
            business_profile = BusinessOwnerProfile.objects.get(id=business_id)
        except BusinessOwnerProfile.DoesNotExist:
            return Response({
                'error': 'Business not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        is_valid, rating_value, error = validate_rating(request.data.get('rating'))
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        is_valid, feedback_text, error = validate_required_field(request.data, 'feedback_text')
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        feedback, created = CitizenBusinessFeedback.objects.update_or_create(
            citizen=citizen_profile,
            business=business_profile,
            defaults={
                'rating': rating_value,
                'feedback_text': feedback_text,
            }
        )
        
        return Response({
            'message': 'Feedback submitted successfully',
            'feedback': {
                'id': feedback.id,
                'rating': feedback.rating,
                'created_at': feedback.created_at.strftime('%Y-%m-%d'),
            }
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error creating citizen business feedback: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

