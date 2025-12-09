"""
Business Complaint Views
Handles business complaints to government
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import BusinessComplaint
from .utils import check_business_owner_access, validate_required_field
from government.utils import filter_by_town
from authentication.models import UserProfile
import logging

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def list_business_complaints_view(request):
    """List complaints (GET) or create complaint (POST) filed by business owners"""
    if request.method == 'GET':
        try:
            profile = UserProfile.objects.get(user=request.user)
            
            if profile.role == 'business':
                is_business_owner, _, business_profile = check_business_owner_access(request.user)
                if not is_business_owner or not business_profile:
                    return Response({
                        'error': 'Business profile not found'
                    }, status=status.HTTP_404_NOT_FOUND)
                
                if not request.user.is_superuser:
                    complaints = BusinessComplaint.objects.filter(business_owner=business_profile)
                else:
                    complaints = BusinessComplaint.objects.all()
            elif profile.role == 'government':
                complaints = filter_by_town(BusinessComplaint.objects.all(), request.user)
            else:
                return Response({
                    'error': 'Access denied'
                }, status=status.HTTP_403_FORBIDDEN)
            
            status_filter = request.query_params.get('status', None)
            if status_filter and status_filter != 'all':
                complaints = complaints.filter(status=status_filter)
            
            priority_filter = request.query_params.get('priority', None)
            if priority_filter and priority_filter != 'all':
                complaints = complaints.filter(priority=priority_filter)
            
            complaints = complaints.order_by('-created_at')
            
            data = []
            for complaint in complaints:
                data.append({
                    'id': complaint.id,
                    'title': complaint.title,
                    'description': complaint.description,
                    'category': complaint.category,
                    'priority': complaint.priority,
                    'status': complaint.status,
                    'created_at': complaint.created_at.strftime('%Y-%m-%d'),
                    'business_name': complaint.business_owner.business_name,
                })
            
            return Response(data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error listing business complaints: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        # Create complaint
        try:
            is_business_owner, profile, business_profile = check_business_owner_access(request.user)
            
            if not is_business_owner:
                return Response({
                    'error': 'Only business owners can create complaints'
                }, status=status.HTTP_403_FORBIDDEN)
            
            if not business_profile:
                return Response({
                    'error': 'Business profile not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            is_valid, title, error = validate_required_field(request.data, 'title')
            if not is_valid:
                return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
            
            is_valid, description, error = validate_required_field(request.data, 'description')
            if not is_valid:
                return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
            
            is_valid, category, error = validate_required_field(request.data, 'category')
            if not is_valid:
                return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
            
            priority = request.data.get('priority', 'medium')
            
            complaint = BusinessComplaint.objects.create(
                business_owner=business_profile,
                title=title,
                description=description,
                category=category,
                priority=priority,
                status='pending',
            )
            
            return Response({
                'message': 'Complaint created successfully',
                'complaint': {
                    'id': complaint.id,
                    'title': complaint.title,
                    'description': complaint.description,
                    'status': complaint.status,
                    'priority': complaint.priority,
                    'created_at': complaint.created_at.strftime('%Y-%m-%d'),
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating business complaint: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

