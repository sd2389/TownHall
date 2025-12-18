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
from government.utils import filter_by_town, get_user_town
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
                    'location': complaint.location,
                    'priority': complaint.priority,
                    'status': complaint.status,
                    'created_at': complaint.created_at.strftime('%Y-%m-%d'),
                    'created': complaint.created_at.strftime('%Y-%m-%d'),
                    'business_name': complaint.business_owner.business_name,
                    'assigned_to': complaint.assigned_to,
                    'estimated_resolution': complaint.estimated_resolution,
                    'town_name': complaint.town.name if complaint.town else None,
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
            
            # Get user's town
            town = get_user_town(request.user)
            if not town:
                return Response({
                    'error': 'User must be associated with a town to create complaints'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get optional fields
            location = request.data.get('location', '')
            if isinstance(location, list):
                location = location[0] if location else ''
            location = str(location).strip()
            
            priority = request.data.get('priority', 'medium')
            if isinstance(priority, list):
                priority = priority[0] if priority else 'medium'
            priority = str(priority).strip() or 'medium'
            
            assigned_to = request.data.get('assigned_to', '')
            if isinstance(assigned_to, list):
                assigned_to = assigned_to[0] if assigned_to else ''
            assigned_to = str(assigned_to).strip()
            
            estimated_resolution = request.data.get('estimated_resolution', '')
            if isinstance(estimated_resolution, list):
                estimated_resolution = estimated_resolution[0] if estimated_resolution else ''
            estimated_resolution = str(estimated_resolution).strip()
            
            complaint = BusinessComplaint.objects.create(
                business_owner=business_profile,
                town=town,
                title=title,
                description=description,
                category=category,
                location=location,
                priority=priority,
                status='pending',
                assigned_to=assigned_to,
                estimated_resolution=estimated_resolution,
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
                    'category': complaint.category,
                    'location': complaint.location,
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating business complaint: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def business_complaint_detail_view(request, complaint_id):
    """Get complaint details (GET) or update complaint (PATCH)"""
    try:
        complaint = BusinessComplaint.objects.get(id=complaint_id)
        profile = UserProfile.objects.get(user=request.user)
        
        # Check access permissions
        if profile.role == 'business':
            is_business_owner, _, business_profile = check_business_owner_access(request.user)
            if not is_business_owner or complaint.business_owner != business_profile:
                if not request.user.is_superuser:
                    return Response({
                        'error': 'Access denied'
                    }, status=status.HTTP_403_FORBIDDEN)
        elif profile.role == 'government':
            # Government can view complaints from their town
            if complaint.town and not request.user.is_superuser:
                user_town = get_user_town(request.user)
                if user_town != complaint.town:
                    return Response({
                        'error': 'Access denied'
                    }, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({
                'error': 'Access denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if request.method == 'GET':
            return Response({
                'id': complaint.id,
                'title': complaint.title,
                'description': complaint.description,
                'category': complaint.category,
                'location': complaint.location,
                'priority': complaint.priority,
                'status': complaint.status,
                'created_at': complaint.created_at.strftime('%Y-%m-%d'),
                'updated_at': complaint.updated_at.strftime('%Y-%m-%d'),
                'business_name': complaint.business_owner.business_name,
                'assigned_to': complaint.assigned_to,
                'estimated_resolution': complaint.estimated_resolution,
                'town_name': complaint.town.name if complaint.town else None,
            }, status=status.HTTP_200_OK)
        
        elif request.method == 'PATCH':
            # Only government can update complaints
            if profile.role != 'government' and not request.user.is_superuser:
                return Response({
                    'error': 'Only government officials can update complaints'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Update fields
            if 'status' in request.data:
                complaint.status = request.data.get('status')
            if 'priority' in request.data:
                complaint.priority = request.data.get('priority')
            if 'assigned_to' in request.data:
                complaint.assigned_to = request.data.get('assigned_to', '')
            if 'estimated_resolution' in request.data:
                complaint.estimated_resolution = request.data.get('estimated_resolution', '')
            
            complaint.save()
            
            return Response({
                'message': 'Complaint updated successfully',
                'complaint': {
                    'id': complaint.id,
                    'title': complaint.title,
                    'status': complaint.status,
                    'priority': complaint.priority,
                    'assigned_to': complaint.assigned_to,
                    'estimated_resolution': complaint.estimated_resolution,
                }
            }, status=status.HTTP_200_OK)
            
    except BusinessComplaint.DoesNotExist:
        return Response({
            'error': 'Complaint not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error managing business complaint: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

