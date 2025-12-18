"""
Business Profile Views
Handles business owner profile operations
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import BusinessOwnerProfile
from .utils import check_business_owner_access
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_business_profile_view(request):
    """Get current business owner's profile"""
    try:
        is_business_owner, profile, business_profile = check_business_owner_access(request.user)
        
        if not is_business_owner:
            return Response({
                'error': 'Only business owners can access this endpoint'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if not business_profile:
            return Response({
                'error': 'Business profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'business_name': business_profile.business_name,
            'business_registration_number': business_profile.business_registration_number,
            'business_type': business_profile.business_type,
            'phone_number': business_profile.phone_number,
            'business_address': business_profile.business_address,
            'website': business_profile.website,
            'town': business_profile.user.userprofile.town.name if business_profile.user.userprofile.town else None,
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error getting business profile: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)









