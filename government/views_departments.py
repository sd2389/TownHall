"""
Department Views
Handles department CRUD operations
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Department
from .views_utils import check_admin_access, validate_required_field, format_department_response
import logging

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def list_departments_view(request):
    """List departments (GET) or create department (POST)"""
    if request.method == 'GET':
        try:
            departments = Department.objects.all().order_by('name')
            data = [format_department_response(dept) for dept in departments]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error listing departments: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({
                'error': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)
        return create_department_view(request)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_department_view(request):
    """Create a new department"""
    try:
        is_admin, _ = check_admin_access(request.user)
        if not is_admin:
            return Response({
                'error': 'Only administrators can create departments'
            }, status=status.HTTP_403_FORBIDDEN)
        
        is_valid, name, error = validate_required_field(request.data, 'name')
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        if Department.objects.filter(name__iexact=name).exists():
            return Response({
                'error': 'A department with this name already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        department = Department.objects.create(
            name=name,
            description=request.data.get('description', '').strip(),
            contact_email=request.data.get('contact_email', '').strip(),
            contact_phone=request.data.get('contact_phone', '').strip(),
        )
        
        return Response({
            'message': 'Department created successfully',
            'department': format_department_response(department)
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error creating department: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_department_view(request, department_id):
    """Get (GET), update (PATCH/PUT), or delete (DELETE) a department"""
    try:
        is_admin, _ = check_admin_access(request.user)
        if not is_admin:
            return Response({
                'error': 'Only administrators can manage departments'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            department = Department.objects.get(id=department_id)
        except Department.DoesNotExist:
            return Response({
                'error': 'Department not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'GET':
            return Response(format_department_response(department), status=status.HTTP_200_OK)
        
        elif request.method == 'DELETE':
            department.delete()
            return Response({
                'message': 'Department deleted successfully'
            }, status=status.HTTP_204_NO_CONTENT)
        
        elif request.method in ['PATCH', 'PUT']:
            if 'name' in request.data:
                name = request.data.get('name', '').strip()
                if name and name != department.name:
                    if Department.objects.filter(name__iexact=name).exclude(id=department_id).exists():
                        return Response({
                            'error': 'A department with this name already exists'
                        }, status=status.HTTP_400_BAD_REQUEST)
                    department.name = name
            
            if 'description' in request.data:
                department.description = request.data.get('description', '').strip()
            
            if 'contact_email' in request.data:
                department.contact_email = request.data.get('contact_email', '').strip()
            
            if 'contact_phone' in request.data:
                department.contact_phone = request.data.get('contact_phone', '').strip()
            
            department.save()
            
            return Response({
                'message': 'Department updated successfully',
                'department': format_department_response(department)
            }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error managing department: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

