"""
Position Views
Handles position CRUD operations
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Department, Position
from .views_utils import check_admin_access, validate_required_field, format_position_response
import logging

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def list_positions_view(request):
    """List positions (GET) or create position (POST)"""
    if request.method == 'GET':
        try:
            department_id = request.query_params.get('department_id', None)
            
            if department_id:
                try:
                    department = Department.objects.get(id=department_id)
                    positions = Position.objects.filter(department=department, is_active=True).order_by('name')
                except Department.DoesNotExist:
                    return Response({
                        'error': 'Department not found'
                    }, status=status.HTTP_404_NOT_FOUND)
            else:
                positions = Position.objects.filter(is_active=True).order_by('department__name', 'name')
            
            data = [format_position_response(pos) for pos in positions]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error listing positions: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        # Create position - requires authentication
        if not request.user.is_authenticated:
            return Response({
                'error': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        return create_position_view(request)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_position_view(request):
    """Create a new position"""
    try:
        is_admin, _ = check_admin_access(request.user)
        if not is_admin:
            return Response({
                'error': 'Only administrators can create positions'
            }, status=status.HTTP_403_FORBIDDEN)
        
        is_valid, name, error = validate_required_field(request.data, 'name')
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        department_id = request.data.get('department_id')
        if not department_id:
            return Response({
                'error': 'Department ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            department = Department.objects.get(id=department_id)
        except Department.DoesNotExist:
            return Response({
                'error': 'Department not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if Position.objects.filter(name__iexact=name, department=department).exists():
            return Response({
                'error': 'A position with this name already exists in this department'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        position = Position.objects.create(
            name=name,
            department=department,
            description=request.data.get('description', '').strip(),
            is_active=request.data.get('is_active', True)
        )
        
        return Response({
            'message': 'Position created successfully',
            'position': format_position_response(position)
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error creating position: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)









