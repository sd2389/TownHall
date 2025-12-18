"""
Town Views
Handles town-related operations
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Town
from authentication.models import UserProfile
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([AllowAny])
def active_towns_view(request):
    """Get all active towns"""
    towns = Town.objects.filter(is_active=True).order_by('name')
    data = [
        {
            'id': town.id,
            'name': town.name,
            'state': town.state
        }
        for town in towns
    ]
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_town_emergency_contacts(request):
    """Get emergency contacts for the authenticated user's town"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        
        if not profile.town:
            return Response({
                'error': 'You are not assigned to a town'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        town = profile.town
        data = {
            'town_name': town.name,
            'emergency_contacts': {
                'police': town.emergency_police,
                'fire': town.emergency_fire,
                'medical': town.emergency_medical,
                'non_urgent': town.emergency_non_urgent if town.emergency_non_urgent else None,
                'dispatch': town.emergency_dispatch if town.emergency_dispatch else None,
                'animal_control': town.emergency_animal_control if town.emergency_animal_control else None,
                'poison_control': town.emergency_poison_control if town.emergency_poison_control else None,
                'utilities': town.emergency_utilities if town.emergency_utilities else None,
                'public_works': town.emergency_public_works if town.emergency_public_works else None,
                'mental_health': town.emergency_mental_health if town.emergency_mental_health else None,
                'child_protective': town.emergency_child_protective if town.emergency_child_protective else None,
                'road_department': town.emergency_road_department if town.emergency_road_department else None,
            }
        }
        
        return Response(data, status=status.HTTP_200_OK)
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error getting emergency contacts: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)









