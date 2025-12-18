"""
Business Event Views
Handles business events and event registrations
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import BusinessEvent, EventRegistration
from .utils import (
    check_business_owner_access, check_government_access, check_citizen_access,
    validate_required_field, check_town_access, create_event_notification,
    format_event_response
)
from government.utils import get_user_town
from authentication.models import UserProfile
from citizen.models import CitizenProfile
from datetime import datetime, date, time
import logging

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def list_business_events_view(request):
    """List business events (GET) or create event (POST)"""
    if request.method == 'GET':
        try:
            profile = UserProfile.objects.get(user=request.user)
            
            if profile.role == 'business':
                is_business_owner, _, business_profile = check_business_owner_access(request.user)
                if not is_business_owner or not business_profile:
                    return Response({
                        'error': 'Business profile not found'
                    }, status=status.HTTP_404_NOT_FOUND)
                events = BusinessEvent.objects.filter(business_owner=business_profile)
            elif profile.role == 'government':
                # Government can see all events (pending, approved, rejected) for review
                events = BusinessEvent.objects.all()
            elif profile.role == 'citizen':
                # Citizens only see approved events
                events = BusinessEvent.objects.filter(status='approved')
            else:
                events = BusinessEvent.objects.filter(status='approved')
            
            # Apply status filter if provided
            status_filter = request.query_params.get('status', None)
            if status_filter and status_filter != 'all':
                events = events.filter(status=status_filter)
            
            events = events.select_related('business_owner', 'business_owner__user').order_by('event_date', 'event_time')
            
            data = []
            for event in events:
                event_data = format_event_response(event, include_registrations=True)
                event_data['business_owner'] = event.business_owner.user.get_full_name() or event.business_owner.user.username
                data.append(event_data)
            
            return Response(data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error listing business events: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        # Create event
        try:
            is_business_owner, profile, business_profile = check_business_owner_access(request.user)
            
            if not is_business_owner:
                return Response({
                    'error': 'Only business owners can create events'
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
            
            event_date_str = request.data.get('event_date')
            event_time_str = request.data.get('event_time')
            location = request.data.get('location', '').strip()
            max_attendees = request.data.get('max_attendees')
            
            # Validate and parse date
            if not event_date_str:
                return Response({'error': 'Event date is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                # Parse date string (format: YYYY-MM-DD)
                event_date = datetime.strptime(event_date_str, '%Y-%m-%d').date()
            except (ValueError, TypeError):
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate and parse time
            if not event_time_str:
                return Response({'error': 'Event time is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                # Parse time string (format: HH:MM or HH:MM:SS)
                if len(event_time_str.split(':')) == 2:
                    time_obj = datetime.strptime(event_time_str, '%H:%M').time()
                else:
                    time_obj = datetime.strptime(event_time_str, '%H:%M:%S').time()
                event_time = time_obj
            except (ValueError, TypeError):
                return Response({'error': 'Invalid time format. Use HH:MM'}, status=status.HTTP_400_BAD_REQUEST)
            
            event = BusinessEvent.objects.create(
                business_owner=business_profile,
                title=title,
                description=description,
                event_date=event_date,
                event_time=event_time,
                location=location,
                status='pending',
                max_attendees=int(max_attendees) if max_attendees else None,
            )
            
            # Refresh from database to ensure we have the proper date/time objects
            event.refresh_from_db()
            
            return Response({
                'message': 'Event created successfully. Pending government approval.',
                'event': {
                    'id': event.id,
                    'title': event.title,
                    'status': event.status,
                    'event_date': event.event_date.strftime('%Y-%m-%d') if hasattr(event.event_date, 'strftime') else str(event.event_date),
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating business event: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def review_business_event_view(request, event_id):
    """Government review and approve/reject business event"""
    try:
        is_government, profile = check_government_access(request.user)
        
        if not is_government:
            return Response({
                'error': 'Only government officials can review events'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            event = BusinessEvent.objects.get(id=event_id)
        except BusinessEvent.DoesNotExist:
            return Response({
                'error': 'Event not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        has_access, error = check_town_access(request.user, event.business_owner)
        if not has_access:
            return Response({'error': error}, status=status.HTTP_403_FORBIDDEN)
        
        action = request.data.get('action', '').lower()
        if action not in ['approve', 'reject', 'cancel']:
            return Response({
                'error': 'Action must be "approve", "reject", or "cancel"'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if action == 'approve':
            event.status = 'approved'
        elif action == 'reject':
            event.status = 'rejected'
        else:
            event.status = 'cancelled'
        
        event.save()
        
        create_event_notification(event.business_owner, event, action)
        
        return Response({
            'message': f'Event {action}d successfully',
            'event': {
                'id': event.id,
                'status': event.status,
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error reviewing business event: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def register_for_event_view(request, event_id):
    """List registrations (GET) or register for event (POST) - /events/<id>/registrations/"""
    if request.method == 'GET':
        # List registrations
        try:
            profile = UserProfile.objects.get(user=request.user)
            
            try:
                event = BusinessEvent.objects.get(id=event_id)
            except BusinessEvent.DoesNotExist:
                return Response({
                    'error': 'Event not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            if profile.role == 'business':
                if event.business_owner.user != request.user and not request.user.is_superuser:
                    return Response({
                        'error': 'You can only view registrations for your own events'
                    }, status=status.HTTP_403_FORBIDDEN)
            elif profile.role != 'citizen' and not request.user.is_superuser:
                return Response({
                    'error': 'Access denied'
                }, status=status.HTTP_403_FORBIDDEN)
            
            registrations = EventRegistration.objects.filter(
                event=event
            ).select_related('citizen', 'citizen__user').order_by('-registered_at')
            
            data = []
            for registration in registrations:
                data.append({
                    'id': registration.id,
                    'citizen_name': registration.citizen.user.get_full_name() or registration.citizen.user.username,
                    'citizen_email': registration.citizen.user.email,
                    'status': registration.status,
                    'registered_at': registration.registered_at.strftime('%Y-%m-%d %H:%M'),
                    'notes': registration.notes,
                })
            
            return Response(data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error listing event registrations: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        # Register for event
        try:
            is_citizen, profile = check_citizen_access(request.user)
            
            if not is_citizen:
                return Response({
                    'error': 'Only citizens can register for events'
                }, status=status.HTTP_403_FORBIDDEN)
            
            try:
                citizen_profile = CitizenProfile.objects.get(user=request.user)
            except CitizenProfile.DoesNotExist:
                return Response({
                    'error': 'Citizen profile not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            try:
                event = BusinessEvent.objects.get(id=event_id, status='approved')
            except BusinessEvent.DoesNotExist:
                return Response({
                    'error': 'Event not found or not approved'
                }, status=status.HTTP_404_NOT_FOUND)
            
            existing_registration = EventRegistration.objects.filter(
                event=event,
                citizen=citizen_profile,
                status='registered'
            ).first()
            
            if existing_registration:
                return Response({
                    'error': 'You are already registered for this event'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if event.max_attendees:
                current_registrations = EventRegistration.objects.filter(
                    event=event,
                    status='registered'
                ).count()
                if current_registrations >= event.max_attendees:
                    return Response({
                        'error': 'Event is full'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            registration = EventRegistration.objects.create(
                event=event,
                citizen=citizen_profile,
                status='registered',
                notes=request.data.get('notes', '').strip(),
            )
            
            return Response({
                'message': 'Successfully registered for event',
                'registration': {
                    'id': registration.id,
                    'event_title': event.title,
                    'event_date': event.event_date.strftime('%Y-%m-%d'),
                    'status': registration.status,
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error registering for event: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

