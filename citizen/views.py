from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import CitizenProfile, CitizenComplaint, ComplaintAttachment, ComplaintComment, CitizenNotification
from authentication.models import UserProfile
from django.db.models import Q
from government.utils import get_user_town, filter_by_town
from government.models import GovernmentOfficial
import os


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_complaints_view(request):
    """List complaints filtered by user's town"""
    try:
        # Get user profile
        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Filter by town
        complaints = filter_by_town(CitizenComplaint.objects.all(), request.user)
        
        # If user is citizen, only show their own complaints
        if profile.role == 'citizen':
            try:
                citizen_profile = CitizenProfile.objects.get(user=request.user)
                complaints = complaints.filter(citizen=citizen_profile)
            except CitizenProfile.DoesNotExist:
                return Response({
                    'error': 'Citizen profile not found'
                }, status=status.HTTP_404_NOT_FOUND)
        
        # Apply filters
        status_filter = request.query_params.get('status', None)
        if status_filter and status_filter != 'all':
            complaints = complaints.filter(status=status_filter)
        
        priority_filter = request.query_params.get('priority', None)
        if priority_filter and priority_filter != 'all':
            complaints = complaints.filter(priority=priority_filter)
        
        # Order by created_at descending
        complaints = complaints.select_related('citizen', 'citizen__user', 'town').prefetch_related('attachments', 'comments', 'comments__official', 'comments__official__user').order_by('-created_at')
        
        data = []
        for complaint in complaints:
            # Get attachments
            attachments = []
            for attachment in complaint.attachments.all():
                attachments.append({
                    'id': attachment.id,
                    'file_name': attachment.file_name,
                    'file_type': attachment.file_type,
                    'file_size': attachment.file_size,
                    'file_url': request.build_absolute_uri(attachment.file.url) if attachment.file else None,
                })
            
            # Get comments
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
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_complaint_view(request):
    """Create a new complaint"""
    try:
        # Check if user is citizen
        try:
            profile = UserProfile.objects.get(user=request.user)
            if profile.role != 'citizen' and not request.user.is_superuser:
                return Response({
                    'error': 'Only citizens can create complaints'
                }, status=status.HTTP_403_FORBIDDEN)
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get citizen profile
        try:
            citizen_profile = CitizenProfile.objects.get(user=request.user)
        except CitizenProfile.DoesNotExist:
            return Response({
                'error': 'Citizen profile not found'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get user's town
        town = get_user_town(request.user)
        if not town:
            return Response({
                'error': 'User must be associated with a town to create complaints'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate required fields
        # Handle both JSON and FormData
        title = request.data.get('title', '')
        if isinstance(title, list):
            title = title[0] if title else ''
        title = str(title).strip()
        if not title:
            return Response({
                'error': 'Title is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        description = request.data.get('description', '')
        if isinstance(description, list):
            description = description[0] if description else ''
        description = str(description).strip()
        if not description:
            return Response({
                'error': 'Description is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        category = request.data.get('category', '')
        if isinstance(category, list):
            category = category[0] if category else ''
        category = str(category).strip()
        if not category:
            return Response({
                'error': 'Category is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get optional fields (handle FormData lists)
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
        
        # Create complaint
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
        
        # Handle file uploads
        attachments = []
        if request.FILES:
            # Handle multiple files
            files = request.FILES.getlist('files') if 'files' in request.FILES else []
            if not files and 'file' in request.FILES:
                files = [request.FILES['file']]
            
            for uploaded_file in files:
                # Validate file size (max 10MB)
                if uploaded_file.size > 10 * 1024 * 1024:
                    continue  # Skip files larger than 10MB
                
                # Get file extension
                file_name = uploaded_file.name
                file_ext = os.path.splitext(file_name)[1].lower()
                file_type = uploaded_file.content_type or file_ext
                
                # Create attachment
                attachment = ComplaintAttachment.objects.create(
                    complaint=complaint,
                    file=uploaded_file,
                    file_name=file_name,
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
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_complaint_view(request, complaint_id):
    """Update a complaint"""
    try:
        # Get complaint
        try:
            complaint = CitizenComplaint.objects.get(id=complaint_id)
        except CitizenComplaint.DoesNotExist:
            return Response({
                'error': 'Complaint not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get user profile
        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check permissions
        # Citizens can only update their own complaints
        # Government officials can update complaints from their town
        if profile.role == 'citizen':
            if complaint.citizen.user != request.user:
                return Response({
                    'error': 'You can only update your own complaints'
                }, status=status.HTTP_403_FORBIDDEN)
        elif profile.role == 'government':
            town = get_user_town(request.user)
            if not request.user.is_superuser and complaint.town != town:
                return Response({
                    'error': 'You can only update complaints from your town'
                }, status=status.HTTP_403_FORBIDDEN)
        elif not request.user.is_superuser:
            return Response({
                'error': 'You do not have permission to update complaints'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Update fields
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
        if 'status' in request.data:
            complaint.status = request.data.get('status', 'pending')
        if 'assigned_to' in request.data:
            complaint.assigned_to = request.data.get('assigned_to', '').strip()
        if 'estimated_resolution' in request.data:
            complaint.estimated_resolution = request.data.get('estimated_resolution', '').strip()
        
        complaint.save()
        
        # Handle attachment deletion
        if 'delete_attachments' in request.data:
            attachment_ids_to_delete = request.data.get('delete_attachments', [])
            if isinstance(attachment_ids_to_delete, str):
                # Handle single ID as string
                attachment_ids_to_delete = [attachment_ids_to_delete]
            ComplaintAttachment.objects.filter(
                id__in=attachment_ids_to_delete,
                complaint=complaint
            ).delete()
        
        # Handle new file uploads
        new_attachments = []
        if request.FILES:
            files = request.FILES.getlist('files') if 'files' in request.FILES else []
            if not files and 'file' in request.FILES:
                files = [request.FILES['file']]
            
            for uploaded_file in files:
                # Validate file size (max 10MB)
                if uploaded_file.size > 10 * 1024 * 1024:
                    continue  # Skip files larger than 10MB
                
                # Get file extension
                file_name = uploaded_file.name
                file_ext = os.path.splitext(file_name)[1].lower()
                file_type = uploaded_file.content_type or file_ext
                
                # Create attachment
                attachment = ComplaintAttachment.objects.create(
                    complaint=complaint,
                    file=uploaded_file,
                    file_name=file_name,
                    file_type=file_type,
                    file_size=uploaded_file.size,
                )
                new_attachments.append({
                    'id': attachment.id,
                    'file_name': attachment.file_name,
                    'file_type': attachment.file_type,
                    'file_size': attachment.file_size,
                    'file_url': request.build_absolute_uri(attachment.file.url) if attachment.file else None,
                })
        
        # Get all attachments after update
        all_attachments = []
        for attachment in complaint.attachments.all():
            all_attachments.append({
                'id': attachment.id,
                'file_name': attachment.file_name,
                'file_type': attachment.file_type,
                'file_size': attachment.file_size,
                'file_url': request.build_absolute_uri(attachment.file.url) if attachment.file else None,
            })
        
        return Response({
            'message': 'Complaint updated successfully',
            'complaint': {
                'id': complaint.id,
                'title': complaint.title,
                'description': complaint.description,
                'status': complaint.status,
                'priority': complaint.priority,
                'attachments': all_attachments,
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_complaint_comment_view(request, complaint_id):
    """Add a comment to a complaint"""
    try:
        # Get complaint
        try:
            complaint = CitizenComplaint.objects.get(id=complaint_id)
        except CitizenComplaint.DoesNotExist:
            return Response({
                'error': 'Complaint not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check permissions - only government officials can add comments
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
        
        # Check town access
        town = get_user_town(request.user)
        if not request.user.is_superuser and complaint.town != town:
            return Response({
                'error': 'You can only comment on complaints from your town'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get government official
        try:
            official = GovernmentOfficial.objects.get(user=request.user)
        except GovernmentOfficial.DoesNotExist:
            return Response({
                'error': 'Government official profile not found'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate comment text
        comment_text = request.data.get('comment', '').strip()
        if not comment_text:
            return Response({
                'error': 'Comment text is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create comment
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
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def notify_citizen_view(request, complaint_id):
    """Notify citizen about complaint update"""
    try:
        # Get complaint
        try:
            complaint = CitizenComplaint.objects.get(id=complaint_id)
        except CitizenComplaint.DoesNotExist:
            return Response({
                'error': 'Complaint not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check permissions - only government officials can notify
        try:
            profile = UserProfile.objects.get(user=request.user)
            if profile.role != 'government' and not request.user.is_superuser:
                return Response({
                    'error': 'Only government officials can notify citizens'
                }, status=status.HTTP_403_FORBIDDEN)
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check town access
        town = get_user_town(request.user)
        if not request.user.is_superuser and complaint.town != town:
            return Response({
                'error': 'You can only notify about complaints from your town'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get government official
        try:
            official = GovernmentOfficial.objects.get(user=request.user)
        except GovernmentOfficial.DoesNotExist:
            return Response({
                'error': 'Government official profile not found'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get notification message
        notification_message = request.data.get('message', '').strip()
        if not notification_message:
            # Default notification message
            notification_message = f"Your complaint '{complaint.title}' has been updated. Status: {complaint.status.replace('_', ' ').title()}"
        
        # Create notification comment
        comment = ComplaintComment.objects.create(
            complaint=complaint,
            official=official,
            comment_text=notification_message,
            is_notification=True,
        )
        
        # Create notification record for the citizen
        notification = CitizenNotification.objects.create(
            citizen=complaint.citizen,
            notification_type='complaint_update',
            title=f"Update on your complaint: {complaint.title}",
            message=notification_message,
            complaint=complaint,
            is_read=False,
        )
        
        return Response({
            'message': 'Citizen notified successfully',
            'notification': {
                'id': comment.id,
                'text': comment.comment_text,
                'author': official.user.get_full_name() or official.user.username,
                'date': comment.created_at.strftime('%Y-%m-%d %H:%M'),
                'is_notification': True,
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_notifications_view(request):
    """List notifications for the authenticated citizen"""
    try:
        # Check if user is a citizen
        try:
            citizen_profile = CitizenProfile.objects.get(user=request.user)
        except CitizenProfile.DoesNotExist:
            return Response({
                'error': 'Citizen profile not found'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get filter parameters
        is_read = request.query_params.get('is_read')
        notification_type = request.query_params.get('type')
        
        # Get notifications for this citizen
        notifications = CitizenNotification.objects.filter(citizen=citizen_profile)
        
        # Apply filters
        if is_read is not None:
            notifications = notifications.filter(is_read=is_read.lower() == 'true')
        if notification_type:
            notifications = notifications.filter(notification_type=notification_type)
        
        # Order by created_at descending
        notifications = notifications.select_related('complaint', 'complaint__citizen').order_by('-created_at')
        
        data = []
        for notification in notifications:
            data.append({
                'id': notification.id,
                'type': notification.notification_type,
                'title': notification.title,
                'message': notification.message,
                'is_read': notification.is_read,
                'created_at': notification.created_at.strftime('%Y-%m-%d %H:%M'),
                'complaint_id': notification.complaint.id if notification.complaint else None,
                'complaint_title': notification.complaint.title if notification.complaint else None,
            })
        
        return Response({
            'notifications': data,
            'unread_count': CitizenNotification.objects.filter(citizen=citizen_profile, is_read=False).count(),
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read_view(request, notification_id):
    """Mark a notification as read"""
    try:
        # Check if user is a citizen
        try:
            citizen_profile = CitizenProfile.objects.get(user=request.user)
        except CitizenProfile.DoesNotExist:
            return Response({
                'error': 'Citizen profile not found'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get notification
        try:
            notification = CitizenNotification.objects.get(id=notification_id, citizen=citizen_profile)
        except CitizenNotification.DoesNotExist:
            return Response({
                'error': 'Notification not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Mark as read
        notification.is_read = True
        notification.save()
        
        return Response({
            'message': 'Notification marked as read',
            'notification': {
                'id': notification.id,
                'is_read': notification.is_read,
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
