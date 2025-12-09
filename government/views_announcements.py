"""
Announcement Views
Handles announcement CRUD operations
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Announcement, Department, GovernmentOfficial
from authentication.models import UserProfile
from .views_utils import check_government_access
from .utils import get_user_town
from .views_utils import validate_required_field
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def list_announcements_view(request):
    """List announcements (GET) or create announcement (POST)"""
    if request.method == 'GET':
        try:
            user_town = get_user_town(request.user)
            announcements = Announcement.objects.all()
            
            if user_town:
                announcements = announcements.filter(town_id=user_town.id)
            elif not request.user.is_superuser:
                announcements = announcements.none()
            
            status_filter = request.query_params.get('status', None)
            if status_filter:
                if status_filter == 'published':
                    announcements = announcements.filter(is_published=True)
                elif status_filter == 'draft':
                    announcements = announcements.filter(is_published=False)
            
            type_filter = request.query_params.get('type', None)
            if type_filter and type_filter != 'all':
                announcements = announcements.filter(type=type_filter)
            
            announcements = announcements.select_related('town', 'department', 'created_by', 'created_by__user').prefetch_related('questions').order_by('-created_at')
            
            data = []
            for announcement in announcements:
                questions_list = list(announcement.questions.all())
                total_questions = len(questions_list)
                answered_questions = sum(1 for q in questions_list if q.is_answered)
                pending_questions = total_questions - answered_questions
                
                data.append({
                    'id': announcement.id,
                    'title': announcement.title,
                    'description': announcement.description or announcement.content[:200],
                    'content': announcement.content,
                    'date': announcement.created_at.strftime('%Y-%m-%d'),
                    'priority': announcement.priority,
                    'type': announcement.type,
                    'status': 'published' if announcement.is_published else 'draft',
                    'views': announcement.views,
                    'author': announcement.created_by.user.get_full_name() or announcement.created_by.user.username,
                    'department': announcement.department.name,
                    'tags': announcement.tags or [],
                    'lastUpdated': announcement.updated_at.strftime('%Y-%m-%d'),
                    'publishDate': announcement.published_at.strftime('%Y-%m-%d') if announcement.published_at else None,
                    'expiryDate': announcement.expiry_date.strftime('%Y-%m-%d') if announcement.expiry_date else None,
                    'town_id': announcement.town.id if announcement.town else None,
                    'town_name': announcement.town.name if announcement.town else None,
                    'is_published': announcement.is_published,
                    'question_count': total_questions,
                    'answered_count': answered_questions,
                    'pending_count': pending_questions,
                })
            
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error listing announcements: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        return create_announcement_view(request)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_announcement_view(request):
    """Create a new announcement"""
    try:
        is_government, profile = check_government_access(request.user)
        if not is_government:
            return Response({
                'error': 'Only government officials can create announcements'
            }, status=status.HTTP_403_FORBIDDEN)
        
        town = get_user_town(request.user)
        if not town and not request.user.is_superuser:
            return Response({
                'error': 'User must be associated with a town to create announcements'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            official = GovernmentOfficial.objects.get(user=request.user)
        except GovernmentOfficial.DoesNotExist:
            return Response({
                'error': 'Government official profile not found'
            }, status=status.HTTP_400_BAD_REQUEST)
        
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
        
        is_valid, title, error = validate_required_field(request.data, 'title')
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        is_valid, content, error = validate_required_field(request.data, 'content')
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        is_published = request.data.get('is_published', False)
        if isinstance(is_published, str):
            is_published = is_published.lower() in ('true', '1', 'yes')
        elif not isinstance(is_published, bool):
            is_published = bool(is_published)
        
        announcement = Announcement.objects.create(
            title=title,
            content=content,
            description=request.data.get('description', '').strip() or content[:200],
            department=department,
            town=town,
            priority=request.data.get('priority', 'medium'),
            type=request.data.get('type', 'alert'),
            is_published=is_published,
            created_by=official,
            tags=request.data.get('tags', []),
        )
        
        if announcement.is_published:
            announcement.published_at = timezone.now()
            announcement.save()
        
        return Response({
            'message': 'Announcement created successfully',
            'announcement': {
                'id': announcement.id,
                'title': announcement.title,
                'status': 'published' if announcement.is_published else 'draft',
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error creating announcement: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_announcement_view(request, announcement_id):
    """Get (GET), update (PATCH/PUT), or delete (DELETE) an announcement"""
    try:
        try:
            announcement = Announcement.objects.get(id=announcement_id)
        except Announcement.DoesNotExist:
            return Response({
                'error': 'Announcement not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if not request.user.is_superuser and announcement.created_by.user != request.user:
            return Response({
                'error': 'You do not have permission to update this announcement'
            }, status=status.HTTP_403_FORBIDDEN)
        
        town = get_user_town(request.user)
        if not request.user.is_superuser and announcement.town != town:
            return Response({
                'error': 'You can only manage announcements from your town'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if request.method == 'GET':
            questions_list = list(announcement.questions.all())
            return Response({
                'id': announcement.id,
                'title': announcement.title,
                'description': announcement.description,
                'content': announcement.content,
                'date': announcement.created_at.strftime('%Y-%m-%d'),
                'priority': announcement.priority,
                'type': announcement.type,
                'status': 'published' if announcement.is_published else 'draft',
                'question_count': len(questions_list),
            }, status=status.HTTP_200_OK)
        
        elif request.method == 'DELETE':
            announcement.delete()
            return Response({
                'message': 'Announcement deleted successfully'
            }, status=status.HTTP_204_NO_CONTENT)
        
        elif request.method in ['PATCH', 'PUT']:
            if 'title' in request.data:
                announcement.title = request.data.get('title', '').strip()
            if 'content' in request.data:
                announcement.content = request.data.get('content', '').strip()
            if 'description' in request.data:
                announcement.description = request.data.get('description', '').strip()
            if 'priority' in request.data:
                announcement.priority = request.data.get('priority', 'medium')
            if 'type' in request.data:
                announcement.type = request.data.get('type', 'alert')
            if 'tags' in request.data:
                announcement.tags = request.data.get('tags', [])
            if 'is_published' in request.data:
                is_published = request.data.get('is_published', False)
                if is_published and not announcement.is_published:
                    announcement.published_at = timezone.now()
                announcement.is_published = is_published
            
            announcement.save()
        
        return Response({
            'message': 'Announcement updated successfully',
            'announcement': {
                'id': announcement.id,
                'title': announcement.title,
                'status': 'published' if announcement.is_published else 'draft',
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error managing announcement: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

