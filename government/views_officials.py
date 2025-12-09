"""
Government Official Views
Handles government official management operations
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import GovernmentOfficial
from authentication.models import UserProfile
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_government_officials_view(request):
    """List all government officials (admin/superuser only)"""
    try:
        if not request.user.is_superuser:
            return Response({
                'error': 'Only administrators can view government officials'
            }, status=status.HTTP_403_FORBIDDEN)
        
        officials = GovernmentOfficial.objects.select_related('user', 'town').all().order_by('-created_at')
        
        data = []
        for official in officials:
            try:
                profile = UserProfile.objects.get(user=official.user)
                data.append({
                    'id': official.id,
                    'user_id': official.user.id,
                    'email': official.user.email,
                    'first_name': official.user.first_name,
                    'last_name': official.user.last_name,
                    'employee_id': official.employee_id,
                    'department': official.department,
                    'position': official.position,
                    'phone_number': official.phone_number,
                    'office_address': official.office_address,
                    'town': {
                        'id': official.town.id,
                        'name': official.town.name,
                        'state': official.town.state
                    } if official.town else None,
                    'can_view_users': official.can_view_users,
                    'can_approve_users': official.can_approve_users,
                    'is_approved': profile.is_approved,
                    'created_at': official.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    'updated_at': official.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
                })
            except UserProfile.DoesNotExist:
                continue
        
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error listing officials: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def update_government_official_permissions_view(request, official_id):
    """Get (GET) or update (PATCH/PUT) government official permissions"""
    try:
        if not request.user.is_superuser:
            return Response({
                'error': 'Only administrators can manage government official permissions'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            official = GovernmentOfficial.objects.get(id=official_id)
        except GovernmentOfficial.DoesNotExist:
            return Response({
                'error': 'Government official not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'GET':
            return Response({
                'id': official.id,
                'email': official.user.email,
                'can_view_users': official.can_view_users,
                'can_approve_users': official.can_approve_users,
            }, status=status.HTTP_200_OK)
        
        elif request.method in ['PATCH', 'PUT']:
            can_view_users = request.data.get('can_view_users')
            can_approve_users = request.data.get('can_approve_users')
            
            if can_view_users is not None:
                official.can_view_users = bool(can_view_users)
            if can_approve_users is not None:
                official.can_approve_users = bool(can_approve_users)
            
            official.save()
            
            return Response({
                'message': 'Permissions updated successfully',
                'official': {
                    'id': official.id,
                    'email': official.user.email,
                    'can_view_users': official.can_view_users,
                    'can_approve_users': official.can_approve_users,
                }
            }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error updating official permissions: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


