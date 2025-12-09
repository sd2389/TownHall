from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Department, Position, Announcement, GovernmentOfficial, AnnouncementQuestion
from authentication.models import UserProfile
from citizen.models import CitizenProfile
from django.db.models import Q
from django.utils import timezone
from .utils import get_user_town, filter_by_town
from towns.models import Town


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def list_departments_view(request):
    """List departments (GET) or create department (POST)"""
    if request.method == 'GET':
        try:
            departments = Department.objects.all().order_by('name')
            data = [
                {
                    'id': dept.id,
                    'name': dept.name,
                    'description': dept.description,
                    'contact_email': dept.contact_email,
                    'contact_phone': dept.contact_phone,
                }
                for dept in departments
            ]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        # Create department - requires authentication
        if not request.user.is_authenticated:
            return Response({
                'error': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Use create_department_view logic
        return create_department_view(request)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_positions_view(request):
    """List positions, optionally filtered by department (public endpoint for signup)"""
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
        
        data = [
            {
                'id': pos.id,
                'name': pos.name,
                'department_id': pos.department.id,
                'department_name': pos.department.name,
                'description': pos.description,
            }
            for pos in positions
        ]
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_department_view(request):
    """Create a new department (admin or superuser only)"""
    try:
        # Check if user is superuser or admin
        is_superuser = request.user.is_superuser
        
        # For non-superusers, check if they are government officials
        if not is_superuser:
            try:
                profile = UserProfile.objects.get(user=request.user)
                if profile.role != 'government':
                    return Response({
                        'error': 'Only administrators can create departments'
                    }, status=status.HTTP_403_FORBIDDEN)
            except UserProfile.DoesNotExist:
                return Response({
                    'error': 'User profile not found. Only administrators can create departments.'
                }, status=status.HTTP_403_FORBIDDEN)
        
        # Validate required fields
        name = request.data.get('name', '').strip()
        if not name:
            return Response({
                'error': 'Department name is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if department already exists
        if Department.objects.filter(name__iexact=name).exists():
            return Response({
                'error': 'A department with this name already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create department
        department = Department.objects.create(
            name=name,
            description=request.data.get('description', '').strip(),
            contact_email=request.data.get('contact_email', '').strip(),
            contact_phone=request.data.get('contact_phone', '').strip(),
        )
        
        return Response({
            'message': 'Department created successfully',
            'department': {
                'id': department.id,
                'name': department.name,
                'description': department.description,
                'contact_email': department.contact_email,
                'contact_phone': department.contact_phone,
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_position_view(request):
    """Create a new position (admin or superuser only)"""
    try:
        # Check if user is superuser or admin
        is_superuser = request.user.is_superuser
        
        # For non-superusers, check if they are government officials
        if not is_superuser:
            try:
                profile = UserProfile.objects.get(user=request.user)
                if profile.role != 'government':
                    return Response({
                        'error': 'Only administrators can create positions'
                    }, status=status.HTTP_403_FORBIDDEN)
            except UserProfile.DoesNotExist:
                return Response({
                    'error': 'User profile not found. Only administrators can create positions.'
                }, status=status.HTTP_403_FORBIDDEN)
        
        # Validate required fields
        name = request.data.get('name', '').strip()
        department_id = request.data.get('department_id')
        
        if not name:
            return Response({
                'error': 'Position name is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
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
        
        # Check if position already exists for this department
        if Position.objects.filter(name__iexact=name, department=department).exists():
            return Response({
                'error': 'A position with this name already exists in this department'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create position
        position = Position.objects.create(
            name=name,
            department=department,
            description=request.data.get('description', '').strip(),
            is_active=request.data.get('is_active', True)
        )
        
        return Response({
            'message': 'Position created successfully',
            'position': {
                'id': position.id,
                'name': position.name,
                'department_id': position.department.id,
                'department_name': position.department.name,
                'description': position.description,
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_department_view(request, department_id):
    """Get (GET), update (PUT/PATCH), or delete (DELETE) a department"""
    try:
        # Check if user is superuser or admin
        is_superuser = request.user.is_superuser
        
        # For non-superusers, check if they are government officials
        if not is_superuser:
            try:
                profile = UserProfile.objects.get(user=request.user)
                if profile.role != 'government':
                    return Response({
                        'error': 'Only administrators can manage departments'
                    }, status=status.HTTP_403_FORBIDDEN)
            except UserProfile.DoesNotExist:
                return Response({
                    'error': 'User profile not found. Only administrators can manage departments.'
                }, status=status.HTTP_403_FORBIDDEN)
        
        # Get department
        try:
            department = Department.objects.get(id=department_id)
        except Department.DoesNotExist:
            return Response({
                'error': 'Department not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'GET':
            # Get department details
            return Response({
                'id': department.id,
                'name': department.name,
                'description': department.description,
                'contact_email': department.contact_email,
                'contact_phone': department.contact_phone,
            }, status=status.HTTP_200_OK)
        
        elif request.method == 'DELETE':
            # Delete department
            department.delete()
            return Response({
                'message': 'Department deleted successfully'
            }, status=status.HTTP_204_NO_CONTENT)
        
        elif request.method in ['PUT', 'PATCH']:
            # Update fields
            if 'name' in request.data:
                name = request.data.get('name', '').strip()
                if name and name != department.name:
                    # Check if another department with this name exists
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
                'department': {
                    'id': department.id,
                    'name': department.name,
                    'description': department.description,
                    'contact_email': department.contact_email,
                    'contact_phone': department.contact_phone,
                }
            }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def list_announcements_view(request):
    """List announcements (GET) or create announcement (POST)"""
    if request.method == 'GET':
        try:
            # Get user's town
            user_town = get_user_town(request.user)
            
            # Start with all announcements
            announcements = Announcement.objects.all()
            
            # Filter by town - only if user has a town
            if user_town:
                announcements = announcements.filter(town_id=user_town.id)
            elif not request.user.is_superuser:
                announcements = announcements.none()
            
            # Apply status filter
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
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        # Create announcement - use create_announcement_view logic
        return create_announcement_view(request)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_announcement_view(request):
    """Create a new announcement"""
    try:
        # Check if user is government official
        try:
            profile = UserProfile.objects.get(user=request.user)
            if profile.role != 'government' and not request.user.is_superuser:
                return Response({
                    'error': 'Only government officials can create announcements'
                }, status=status.HTTP_403_FORBIDDEN)
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get user's town
        town = get_user_town(request.user)
        if not town and not request.user.is_superuser:
            return Response({
                'error': 'User must be associated with a town to create announcements'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get government official
        try:
            official = GovernmentOfficial.objects.get(user=request.user)
        except GovernmentOfficial.DoesNotExist:
            return Response({
                'error': 'Government official profile not found'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get department
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
        
        # Validate required fields
        title = request.data.get('title', '').strip()
        if not title:
            return Response({
                'error': 'Title is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        content = request.data.get('content', '').strip()
        if not content:
            return Response({
                'error': 'Content is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get is_published value - handle both boolean and string
        is_published = request.data.get('is_published', False)
        if isinstance(is_published, str):
            is_published = is_published.lower() in ('true', '1', 'yes')
        elif not isinstance(is_published, bool):
            is_published = bool(is_published)
        
        # Create announcement
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
                'description': announcement.description,
                'content': announcement.content,
                'date': announcement.created_at.strftime('%Y-%m-%d'),
                'priority': announcement.priority,
                'type': announcement.type,
                'status': 'published' if announcement.is_published else 'draft',
                'town_id': announcement.town.id if announcement.town else None,
                'town_name': announcement.town.name if announcement.town else None,
                'is_published': announcement.is_published,
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_announcement_view(request, announcement_id):
    """Get (GET), update (PUT/PATCH), or delete (DELETE) an announcement"""
    try:
        # Get announcement
        try:
            announcement = Announcement.objects.get(id=announcement_id)
        except Announcement.DoesNotExist:
            return Response({
                'error': 'Announcement not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check permissions - must be creator or superuser
        if not request.user.is_superuser and announcement.created_by.user != request.user:
            return Response({
                'error': 'You do not have permission to manage this announcement'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check town access
        town = get_user_town(request.user)
        if not request.user.is_superuser and announcement.town != town:
            return Response({
                'error': 'You can only manage announcements from your town'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if request.method == 'GET':
            # Get announcement details
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
            # Delete announcement
            announcement.delete()
            return Response({
                'message': 'Announcement deleted successfully'
            }, status=status.HTTP_204_NO_CONTENT)
        
        elif request.method in ['PUT', 'PATCH']:
            # Update fields
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
                    'description': announcement.description,
                    'content': announcement.content,
                    'date': announcement.created_at.strftime('%Y-%m-%d'),
                    'priority': announcement.priority,
                    'type': announcement.type,
                    'status': 'published' if announcement.is_published else 'draft',
                }
            }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def list_announcement_questions_view(request, announcement_id):
    """List all questions for a specific announcement"""
    try:
        # Get announcement
        try:
            announcement = Announcement.objects.get(id=announcement_id)
        except Announcement.DoesNotExist:
            return Response({
                'error': 'Announcement not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if user has access to this announcement's town
        user_town = get_user_town(request.user)
        if not request.user.is_superuser and announcement.town != user_town:
            return Response({
                'error': 'You do not have access to this announcement'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get questions
        questions = AnnouncementQuestion.objects.filter(announcement=announcement).select_related(
            'citizen', 'citizen__user', 'answered_by', 'answered_by__user'
        ).order_by('-created_at')
        
        data = []
        for question in questions:
            data.append({
                'id': question.id,
                'question': question.question,
                'answer': question.answer,
                'is_answered': question.is_answered,
                'citizen_name': question.citizen.user.get_full_name() or question.citizen.user.username,
                'answered_by': question.answered_by.user.get_full_name() if question.answered_by else None,
                'answered_at': question.answered_at.strftime('%Y-%m-%d %H:%M') if question.answered_at else None,
                'created_at': question.created_at.strftime('%Y-%m-%d %H:%M'),
            })
        
        return Response(data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_announcement_question_view(request, announcement_id):
    """Create a question for an announcement"""
    try:
        # Get announcement
        try:
            announcement = Announcement.objects.get(id=announcement_id)
        except Announcement.DoesNotExist:
            return Response({
                'error': 'Announcement not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if user has access to this announcement's town
        user_town = get_user_town(request.user)
        if not request.user.is_superuser and announcement.town != user_town:
            return Response({
                'error': 'You do not have access to this announcement'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get citizen profile
        try:
            citizen = CitizenProfile.objects.get(user=request.user)
        except CitizenProfile.DoesNotExist:
            return Response({
                'error': 'Citizen profile not found. Only citizens can ask questions.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Validate question
        question_text = request.data.get('question', '').strip()
        if not question_text:
            return Response({
                'error': 'Question text is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create question
        question = AnnouncementQuestion.objects.create(
            announcement=announcement,
            citizen=citizen,
            question=question_text,
        )
        
        return Response({
            'message': 'Question submitted successfully',
            'question': {
                'id': question.id,
                'question': question.question,
                'is_answered': question.is_answered,
                'citizen_name': citizen.user.get_full_name() or citizen.user.username,
                'created_at': question.created_at.strftime('%Y-%m-%d %H:%M'),
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def answer_announcement_question_view(request, announcement_id, question_id):
    """Answer a question for an announcement - POST /announcements/<id>/questions/<id>/answers/"""
    try:
        # Get question
        try:
            question = AnnouncementQuestion.objects.get(id=question_id)
        except AnnouncementQuestion.DoesNotExist:
            return Response({
                'error': 'Question not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if user is government official
        try:
            profile = UserProfile.objects.get(user=request.user)
            if profile.role != 'government' and not request.user.is_superuser:
                return Response({
                    'error': 'Only government officials can answer questions'
                }, status=status.HTTP_403_FORBIDDEN)
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check if user has access to this announcement's town
        user_town = get_user_town(request.user)
        if not request.user.is_superuser and question.announcement.town != user_town:
            return Response({
                'error': 'You do not have access to answer questions for this announcement'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get government official
        try:
            official = GovernmentOfficial.objects.get(user=request.user)
        except GovernmentOfficial.DoesNotExist:
            return Response({
                'error': 'Government official profile not found'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate answer
        answer_text = request.data.get('answer', '').strip()
        if not answer_text:
            return Response({
                'error': 'Answer text is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update question with answer
        question.answer = answer_text
        question.answered_by = official
        question.answered_at = timezone.now()
        question.is_answered = True
        question.save()
        
        return Response({
            'message': 'Answer submitted successfully',
            'question': {
                'id': question.id,
                'question': question.question,
                'answer': question.answer,
                'is_answered': question.is_answered,
                'answered_by': official.user.get_full_name() or official.user.username,
                'answered_at': question.answered_at.strftime('%Y-%m-%d %H:%M'),
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_government_officials_view(request):
    """List all government officials (admin/superuser only)"""
    try:
        # Only superusers can access this endpoint
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
                # Skip officials without user profiles
                continue
        
        return Response(data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_government_official_permissions_view(request, official_id):
    """Update government official permissions (admin/superuser only)"""
    try:
        # Only superusers can access this endpoint
        if not request.user.is_superuser:
            return Response({
                'error': 'Only administrators can update government official permissions'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            official = GovernmentOfficial.objects.get(id=official_id)
        except GovernmentOfficial.DoesNotExist:
            return Response({
                'error': 'Government official not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Update permissions
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
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
