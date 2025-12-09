"""
Citizen Complaint Views
Handles complaint CRUD operations
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import CitizenProfile, CitizenComplaint, ComplaintAttachment
from authentication.models import UserProfile
from government.utils import get_user_town, filter_by_town
from .file_validator import validate_uploaded_file, sanitize_filename
from .views_utils import check_citizen_access, get_citizen_profile, validate_required_field
import os
import logging

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def list_complaints_view(request):
    """List complaints (GET) or create complaint (POST)"""
    if request.method == 'GET':
        try:
            try:
                profile = UserProfile.objects.get(user=request.user)
            except UserProfile.DoesNotExist:
                return Response({
                    'error': 'User profile not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            complaints = filter_by_town(CitizenComplaint.objects.all(), request.user)
            
            if profile.role == 'citizen':
                citizen_profile = get_citizen_profile(request.user)
                if not citizen_profile:
                    return Response({
                        'error': 'Citizen profile not found'
                    }, status=status.HTTP_404_NOT_FOUND)
                complaints = complaints.filter(citizen=citizen_profile)
            
            status_filter = request.query_params.get('status', None)
            if status_filter and status_filter != 'all':
                complaints = complaints.filter(status=status_filter)
            
            priority_filter = request.query_params.get('priority', None)
            if priority_filter and priority_filter != 'all':
                complaints = complaints.filter(priority=priority_filter)
            
            complaints = complaints.select_related('citizen', 'citizen__user', 'town').prefetch_related('attachments', 'comments', 'comments__official', 'comments__official__user').order_by('-created_at')
            
            data = []
            for complaint in complaints:
                attachments = []
                for attachment in complaint.attachments.all():
                    attachments.append({
                        'id': attachment.id,
                        'file_name': attachment.file_name,
                        'file_type': attachment.file_type,
                        'file_size': attachment.file_size,
                        'file_url': request.build_absolute_uri(attachment.file.url) if attachment.file else None,
                    })
                
                comments = []
                for comment in complaint.comments.all():
                    comments.append({
                        'id': comment.id,
                        'text': comment.comment_text,
                        'author': comment.official.user.get_full_name() if comment.official and comment.official.user else 'System',
                        'date': comment.created_at.strftime('%Y-%m-%d %H:%M'),
                        'is_notification': comment.is_notification,
                    })
                
                data.append({
                    'id': complaint.id,
                    'title': complaint.title,
                    'description': complaint.description,
                    'status': complaint.status,
                    'priority': complaint.priority,
                    'created': complaint.created_at.strftime('%Y-%m-%d'),
                    'category': complaint.category,
                    'location': complaint.location or '',
                    'assignedTo': complaint.assigned_to or '',
                    'estimatedResolution': complaint.estimated_resolution or '',
                    'attachments': attachments,
                    'comments': comments,
                    'citizenName': complaint.citizen.user.get_full_name() or complaint.citizen.user.username,
                    'citizenEmail': complaint.citizen.user.email,
                })
            
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error listing complaints: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        return create_complaint_view(request)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_complaint_view(request):
    """Create a new complaint"""
    try:
        is_citizen, profile = check_citizen_access(request.user)
        if not is_citizen:
            return Response({
                'error': 'Only citizens can create complaints'
            }, status=status.HTTP_403_FORBIDDEN)
        
        citizen_profile = get_citizen_profile(request.user)
        if not citizen_profile:
            return Response({
                'error': 'Citizen profile not found'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        town = get_user_town(request.user)
        if not town:
            return Response({
                'error': 'User must be associated with a town to create complaints'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        is_valid, title, error = validate_required_field(request.data, 'title')
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        is_valid, description, error = validate_required_field(request.data, 'description')
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        is_valid, category, error = validate_required_field(request.data, 'category')
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
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
        
        complaint = CitizenComplaint.objects.create(
            citizen=citizen_profile,
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
        
        attachments = []
        if request.FILES:
            files = request.FILES.getlist('files') if 'files' in request.FILES else []
            if not files and 'file' in request.FILES:
                files = [request.FILES['file']]
            
            for uploaded_file in files:
                try:
                    is_valid, error_message = validate_uploaded_file(uploaded_file)
                    if not is_valid:
                        logger.warning(f"File upload rejected: {uploaded_file.name} - {error_message}")
                        continue
                    
                    sanitized_name = sanitize_filename(uploaded_file.name)
                    file_type = uploaded_file.content_type or os.path.splitext(sanitized_name)[1].lower()
                    
                    attachment = ComplaintAttachment.objects.create(
                        complaint=complaint,
                        file=uploaded_file,
                        file_name=sanitized_name,
                        file_type=file_type,
                        file_size=uploaded_file.size,
                    )
                    attachments.append({
                        'id': attachment.id,
                        'file_name': attachment.file_name,
                        'file_type': attachment.file_type,
                        'file_size': attachment.file_size,
                        'file_url': request.build_absolute_uri(attachment.file.url) if attachment.file else None,
                    })
                except Exception as e:
                    logger.error(f"Error processing file upload: {uploaded_file.name} - {str(e)}")
                    continue
        
        return Response({
            'message': 'Complaint created successfully',
            'complaint': {
                'id': complaint.id,
                'title': complaint.title,
                'description': complaint.description,
                'status': complaint.status,
                'priority': complaint.priority,
                'created': complaint.created_at.strftime('%Y-%m-%d'),
                'category': complaint.category,
                'attachments': attachments,
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error creating complaint: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def update_complaint_view(request, complaint_id):
    """Update a complaint"""
    try:
        try:
            complaint = CitizenComplaint.objects.get(id=complaint_id)
        except CitizenComplaint.DoesNotExist:
            return Response({
                'error': 'Complaint not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if profile.role == 'citizen':
            citizen_profile = get_citizen_profile(request.user)
            if not citizen_profile or complaint.citizen != citizen_profile:
                return Response({
                    'error': 'You can only update your own complaints'
                }, status=status.HTTP_403_FORBIDDEN)
        
        if 'title' in request.data:
            complaint.title = request.data.get('title', '').strip()
        if 'description' in request.data:
            complaint.description = request.data.get('description', '').strip()
        if 'category' in request.data:
            complaint.category = request.data.get('category', '').strip()
        if 'location' in request.data:
            complaint.location = request.data.get('location', '').strip()
        if 'priority' in request.data:
            complaint.priority = request.data.get('priority', 'medium')
        if 'status' in request.data and profile.role == 'government':
            complaint.status = request.data.get('status', 'pending')
        if 'assigned_to' in request.data and profile.role == 'government':
            complaint.assigned_to = request.data.get('assigned_to', '').strip()
        if 'estimated_resolution' in request.data and profile.role == 'government':
            complaint.estimated_resolution = request.data.get('estimated_resolution', '').strip()
        
        complaint.save()
        
        return Response({
            'message': 'Complaint updated successfully',
            'complaint': {
                'id': complaint.id,
                'title': complaint.title,
                'status': complaint.status,
                'priority': complaint.priority,
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error updating complaint: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

