"""
Bill Proposal Views
Handles bill proposal CRUD operations, comments, and voting
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import BillProposal, BillComment, BillVote, Department, GovernmentOfficial
from authentication.models import UserProfile
from .views_utils import check_government_access, validate_required_field
from .utils import get_user_town
from django.utils import timezone
from django.db.models import Q, Count, F
from django.db import transaction
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def bills_list_create_view(request):
    """List bills (GET) or create bill (POST)"""
    if request.method == 'GET':
        try:
            user_town = get_user_town(request.user)
            bills = BillProposal.objects.all()
            
            # Filter by town if user has a town
            if user_town:
                bills = bills.filter(town=user_town)
            elif not request.user.is_superuser:
                bills = bills.none()
            
            # Apply filters
            status_filter = request.query_params.get('status', None)
            if status_filter and status_filter != 'all':
                bills = bills.filter(status=status_filter)
            
            priority_filter = request.query_params.get('priority', None)
            if priority_filter and priority_filter != 'all':
                bills = bills.filter(priority=priority_filter)
            
            # Ordering
            sort_by = request.query_params.get('sort', '-created_at')
            if sort_by == 'votes':
                bills = bills.order_by('-support_count', '-oppose_count')
            elif sort_by == 'comments':
                bills = bills.order_by('-comment_count')
            else:
                bills = bills.order_by(sort_by)
            
            bills = bills.select_related('department', 'town', 'created_by', 'created_by__user').annotate(
                total_votes=Count('votes')
            )
            
            data = []
            for bill in bills:
                # Check if current user has voted
                user_vote = None
                if request.user.is_authenticated:
                    try:
                        vote = BillVote.objects.get(bill=bill, user=request.user)
                        user_vote = vote.vote_type
                    except BillVote.DoesNotExist:
                        pass
                
                data.append({
                    'id': bill.id,
                    'title': bill.title,
                    'description': bill.description,
                    'summary': bill.summary or bill.description[:200],
                    'status': bill.status,
                    'priority': bill.priority,
                    'department': bill.department.name,
                    'created_by': bill.created_by.user.get_full_name() or bill.created_by.user.username,
                    'support_count': bill.support_count,
                    'oppose_count': bill.oppose_count,
                    'total_votes': bill.get_total_votes(),
                    'support_percentage': bill.get_support_percentage(),
                    'comment_count': bill.comment_count,
                    'views': bill.views,
                    'created_at': bill.created_at.strftime('%Y-%m-%d'),
                    'published_at': bill.published_at.strftime('%Y-%m-%d %H:%M') if bill.published_at else None,
                    'review_deadline': bill.review_deadline.strftime('%Y-%m-%d') if bill.review_deadline else None,
                    'user_vote': user_vote,
                    'tags': bill.tags or [],
                })
            
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error listing bills: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        # Create a new bill proposal using helper function
        return create_bill_helper(request)


def create_bill_helper(request):
    """Helper function to create a new bill proposal (can be called from other views)"""
    try:
        is_government, profile = check_government_access(request.user)
        if not is_government:
            return Response({
                'error': 'Only government officials can create bill proposals'
            }, status=status.HTTP_403_FORBIDDEN)
        
        town = get_user_town(request.user)
        if not town and not request.user.is_superuser:
            return Response({
                'error': 'User must be associated with a town to create bills'
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
        
        is_valid, description, error = validate_required_field(request.data, 'description')
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        status_value = request.data.get('status', 'draft')
        if status_value == 'published':
            published_at = timezone.now()
        else:
            published_at = None
        
        bill = BillProposal.objects.create(
            title=title,
            description=description,
            summary=request.data.get('summary', '').strip() or description[:200],
            department=department,
            town=town,
            status=status_value,
            priority=request.data.get('priority', 'medium'),
            created_by=official,
            published_at=published_at,
            review_deadline=request.data.get('review_deadline') or None,
            tags=request.data.get('tags', []),
            attachments=request.data.get('attachments', []),
        )
        
        return Response({
            'message': 'Bill proposal created successfully',
            'bill': {
                'id': bill.id,
                'title': bill.title,
                'status': bill.status,
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error creating bill: {str(e)}", exc_info=True)
        # Return more detailed error message for debugging
        error_message = str(e)
        if hasattr(e, '__class__'):
            error_message = f"{e.__class__.__name__}: {error_message}"
        return Response({
            'error': f'An error occurred while creating bill: {error_message}',
            'details': str(e) if settings.DEBUG else None
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def bill_detail_view(request, bill_id):
    """Get (GET), update (PATCH/PUT), or delete (DELETE) a bill"""
    try:
        try:
            bill = BillProposal.objects.get(id=bill_id)
        except BillProposal.DoesNotExist:
            return Response({
                'error': 'Bill proposal not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        user_town = get_user_town(request.user)
        if not request.user.is_superuser and bill.town != user_town:
            return Response({
                'error': 'You do not have access to this bill proposal'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if request.method == 'GET':
            # Increment views
            bill.views += 1
            bill.save(update_fields=['views'])
            
            # Get user vote
            user_vote = None
            try:
                vote = BillVote.objects.get(bill=bill, user=request.user)
                user_vote = vote.vote_type
            except BillVote.DoesNotExist:
                pass
            
            return Response({
                'id': bill.id,
                'title': bill.title,
                'description': bill.description,
                'summary': bill.summary,
                'status': bill.status,
                'priority': bill.priority,
                'department': {
                    'id': bill.department.id,
                    'name': bill.department.name,
                },
                'created_by': bill.created_by.user.get_full_name() or bill.created_by.user.username,
                'support_count': bill.support_count,
                'oppose_count': bill.oppose_count,
                'total_votes': bill.get_total_votes(),
                'support_percentage': bill.get_support_percentage(),
                'comment_count': bill.comment_count,
                'views': bill.views,
                'created_at': bill.created_at.strftime('%Y-%m-%d %H:%M'),
                'published_at': bill.published_at.strftime('%Y-%m-%d %H:%M') if bill.published_at else None,
                'review_deadline': bill.review_deadline.strftime('%Y-%m-%d') if bill.review_deadline else None,
                'implementation_date': bill.implementation_date.strftime('%Y-%m-%d') if bill.implementation_date else None,
                'user_vote': user_vote,
                'tags': bill.tags or [],
                'attachments': bill.attachments or [],
            }, status=status.HTTP_200_OK)
        
        elif request.method == 'DELETE':
            is_government, _ = check_government_access(request.user)
            if not is_government or (bill.created_by.user != request.user and not request.user.is_superuser):
                return Response({
                    'error': 'You do not have permission to delete this bill'
                }, status=status.HTTP_403_FORBIDDEN)
            
            bill.delete()
            return Response({
                'message': 'Bill proposal deleted successfully'
            }, status=status.HTTP_204_NO_CONTENT)
        
        elif request.method in ['PATCH', 'PUT']:
            is_government, _ = check_government_access(request.user)
            if not is_government or (bill.created_by.user != request.user and not request.user.is_superuser):
                return Response({
                    'error': 'You do not have permission to update this bill'
                }, status=status.HTTP_403_FORBIDDEN)
            
            if 'title' in request.data:
                bill.title = request.data.get('title', '').strip()
            if 'description' in request.data:
                bill.description = request.data.get('description', '').strip()
            if 'summary' in request.data:
                bill.summary = request.data.get('summary', '').strip()
            if 'status' in request.data:
                new_status = request.data.get('status')
                bill.status = new_status
                if new_status == 'published' and not bill.published_at:
                    bill.published_at = timezone.now()
            if 'priority' in request.data:
                bill.priority = request.data.get('priority', 'medium')
            if 'review_deadline' in request.data:
                bill.review_deadline = request.data.get('review_deadline') or None
            if 'implementation_date' in request.data:
                bill.implementation_date = request.data.get('implementation_date') or None
            if 'tags' in request.data:
                bill.tags = request.data.get('tags', [])
            if 'attachments' in request.data:
                bill.attachments = request.data.get('attachments', [])
            
            bill.save()
            
            return Response({
                'message': 'Bill proposal updated successfully',
                'bill': {
                    'id': bill.id,
                    'title': bill.title,
                    'status': bill.status,
                }
            }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error managing bill: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def bill_comments_list_create_view(request, bill_id):
    """List comments (GET) or create comment (POST) for a bill"""
    try:
        try:
            bill = BillProposal.objects.get(id=bill_id)
        except BillProposal.DoesNotExist:
            return Response({
                'error': 'Bill proposal not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'GET':
            comments = BillComment.objects.filter(bill=bill).select_related('user', 'user__userprofile').order_by('-created_at')
            
            data = []
            for comment in comments:
                try:
                    profile = UserProfile.objects.get(user=comment.user)
                    role = profile.role
                except UserProfile.DoesNotExist:
                    role = 'unknown'
                
                data.append({
                    'id': comment.id,
                    'comment_text': comment.comment_text,
                    'author': comment.user.get_full_name() or comment.user.username,
                    'author_role': role,
                    'likes': comment.likes,
                    'is_edited': comment.is_edited,
                    'created_at': comment.created_at.strftime('%Y-%m-%d %H:%M'),
                    'edited_at': comment.edited_at.strftime('%Y-%m-%d %H:%M') if comment.edited_at else None,
                })
            
            return Response(data, status=status.HTTP_200_OK)
        
        elif request.method == 'POST':
            is_valid, comment_text, error = validate_required_field(request.data, 'comment')
            if not is_valid:
                return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
            
            comment = BillComment.objects.create(
                bill=bill,
                user=request.user,
                comment_text=comment_text,
            )
            
            # Update comment count
            bill.comment_count = BillComment.objects.filter(bill=bill).count()
            bill.save(update_fields=['comment_count'])
            
            try:
                profile = UserProfile.objects.get(user=request.user)
                role = profile.role
            except UserProfile.DoesNotExist:
                role = 'unknown'
            
            return Response({
                'message': 'Comment added successfully',
                'comment': {
                    'id': comment.id,
                    'comment_text': comment.comment_text,
                    'author': comment.user.get_full_name() or comment.user.username,
                    'author_role': role,
                    'likes': comment.likes,
                    'created_at': comment.created_at.strftime('%Y-%m-%d %H:%M'),
                }
            }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error managing bill comments: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bill_vote_view(request, bill_id):
    """Vote (support/oppose) on a bill proposal"""
    try:
        try:
            bill = BillProposal.objects.get(id=bill_id)
        except BillProposal.DoesNotExist:
            return Response({
                'error': 'Bill proposal not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        vote_type = request.data.get('vote_type', '').lower()
        if vote_type not in ['support', 'oppose']:
            return Response({
                'error': 'Vote type must be "support" or "oppose"'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            # Get or create vote
            vote, created = BillVote.objects.get_or_create(
                bill=bill,
                user=request.user,
                defaults={'vote_type': vote_type}
            )
            
            if not created:
                # Update existing vote
                old_vote_type = vote.vote_type
                vote.vote_type = vote_type
                vote.save()
                
                # Update counts
                if old_vote_type == 'support':
                    bill.support_count = max(0, bill.support_count - 1)
                else:
                    bill.oppose_count = max(0, bill.oppose_count - 1)
            
            # Update counts based on new vote
            if vote_type == 'support':
                bill.support_count += 1
            else:
                bill.oppose_count += 1
            
            bill.save(update_fields=['support_count', 'oppose_count'])
        
        return Response({
            'message': f'Vote {vote_type}ed successfully',
            'vote': {
                'vote_type': vote_type,
                'support_count': bill.support_count,
                'oppose_count': bill.oppose_count,
                'total_votes': bill.get_total_votes(),
                'support_percentage': bill.get_support_percentage(),
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error voting on bill: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def bill_vote_delete_view(request, bill_id):
    """Remove vote from a bill proposal"""
    try:
        try:
            bill = BillProposal.objects.get(id=bill_id)
        except BillProposal.DoesNotExist:
            return Response({
                'error': 'Bill proposal not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        try:
            vote = BillVote.objects.get(bill=bill, user=request.user)
        except BillVote.DoesNotExist:
            return Response({
                'error': 'You have not voted on this bill'
            }, status=status.HTTP_404_NOT_FOUND)
        
        with transaction.atomic():
            vote_type = vote.vote_type
            vote.delete()
            
            # Update counts
            if vote_type == 'support':
                bill.support_count = max(0, bill.support_count - 1)
            else:
                bill.oppose_count = max(0, bill.oppose_count - 1)
            
            bill.save(update_fields=['support_count', 'oppose_count'])
        
        return Response({
            'message': 'Vote removed successfully',
            'vote': {
                'support_count': bill.support_count,
                'oppose_count': bill.oppose_count,
                'total_votes': bill.get_total_votes(),
                'support_percentage': bill.get_support_percentage(),
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error removing vote: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

