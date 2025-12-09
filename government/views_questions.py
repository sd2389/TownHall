"""
Announcement Question Views
Handles question and answer operations for announcements
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Announcement, AnnouncementQuestion, GovernmentOfficial
from authentication.models import UserProfile
from citizen.models import CitizenProfile
from .views_utils import check_government_access, validate_required_field
from .utils import get_user_town
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def list_announcement_questions_view(request, announcement_id):
    """List questions (GET) or create question (POST) for an announcement"""
    if request.method == 'GET':
        try:
            try:
                announcement = Announcement.objects.get(id=announcement_id)
            except Announcement.DoesNotExist:
                return Response({
                    'error': 'Announcement not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            user_town = get_user_town(request.user)
            if not request.user.is_superuser and announcement.town != user_town:
                return Response({
                    'error': 'You do not have access to this announcement'
                }, status=status.HTTP_403_FORBIDDEN)
            
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
            logger.error(f"Error listing questions: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        return create_announcement_question_view(request, announcement_id)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_announcement_question_view(request, announcement_id):
    """Create a question for an announcement"""
    try:
        try:
            announcement = Announcement.objects.get(id=announcement_id)
        except Announcement.DoesNotExist:
            return Response({
                'error': 'Announcement not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        user_town = get_user_town(request.user)
        if not request.user.is_superuser and announcement.town != user_town:
            return Response({
                'error': 'You do not have access to this announcement'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            citizen = CitizenProfile.objects.get(user=request.user)
        except CitizenProfile.DoesNotExist:
            return Response({
                'error': 'Citizen profile not found. Only citizens can ask questions.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        is_valid, question_text, error = validate_required_field(request.data, 'question')
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
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
                'created_at': question.created_at.strftime('%Y-%m-%d %H:%M'),
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error creating question: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def answer_announcement_question_view(request, announcement_id, question_id):
    """Answer a question for an announcement"""
    try:
        try:
            question = AnnouncementQuestion.objects.get(id=question_id, announcement_id=announcement_id)
        except AnnouncementQuestion.DoesNotExist:
            return Response({
                'error': 'Question not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        is_government, profile = check_government_access(request.user)
        if not is_government:
            return Response({
                'error': 'Only government officials can answer questions'
            }, status=status.HTTP_403_FORBIDDEN)
        
        user_town = get_user_town(request.user)
        if not request.user.is_superuser and question.announcement.town != user_town:
            return Response({
                'error': 'You do not have access to answer questions for this announcement'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            official = GovernmentOfficial.objects.get(user=request.user)
        except GovernmentOfficial.DoesNotExist:
            return Response({
                'error': 'Government official profile not found'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        is_valid, answer_text, error = validate_required_field(request.data, 'answer')
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
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
                'answered_at': question.answered_at.strftime('%Y-%m-%d %H:%M'),
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error answering question: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
