"""
Utility functions for business owner views
Provides reusable functions for authorization, validation, and notifications
"""

from rest_framework.response import Response
from rest_framework import status
from authentication.models import UserProfile
from .models import BusinessOwnerProfile, BusinessNotification
from government.utils import get_user_town
import logging

logger = logging.getLogger(__name__)


def check_business_owner_access(user):
    """
    Check if user is a business owner
    Returns: (is_business_owner, profile, business_profile) or (False, None, None)
    """
    try:
        profile = UserProfile.objects.get(user=user)
        if profile.role != 'business' and not user.is_superuser:
            return False, None, None
        
        try:
            business_profile = BusinessOwnerProfile.objects.get(user=user)
            return True, profile, business_profile
        except BusinessOwnerProfile.DoesNotExist:
            return False, profile, None
    except UserProfile.DoesNotExist:
        return False, None, None


def check_government_access(user):
    """
    Check if user is a government official
    Returns: (is_government, profile) or (False, None)
    """
    try:
        profile = UserProfile.objects.get(user=user)
        if profile.role != 'government' and not user.is_superuser:
            return False, None
        return True, profile
    except UserProfile.DoesNotExist:
        return False, None


def check_citizen_access(user):
    """
    Check if user is a citizen
    Returns: (is_citizen, profile) or (False, None)
    """
    try:
        profile = UserProfile.objects.get(user=user)
        if profile.role != 'citizen' and not user.is_superuser:
            return False, None
        return True, profile
    except UserProfile.DoesNotExist:
        return False, None


def validate_required_field(data, field_name):
    """
    Validate that a required field exists and is not empty
    Returns: (is_valid, value, error_message)
    """
    value = data.get(field_name, '').strip() if isinstance(data.get(field_name), str) else data.get(field_name)
    if not value:
        return False, None, f'{field_name.replace("_", " ").title()} is required'
    return True, value, None


def validate_rating(rating):
    """
    Validate rating is between 1 and 5
    Returns: (is_valid, rating_value, error_message)
    """
    try:
        rating_value = int(rating)
        if not (1 <= rating_value <= 5):
            return False, None, 'Rating must be between 1 and 5'
        return True, rating_value, None
    except (ValueError, TypeError):
        return False, None, 'Rating must be a valid number between 1 and 5'


def check_town_access(user, business_owner):
    """
    Check if user has access to business owner's town
    Returns: (has_access, error_message)
    """
    town = get_user_town(user)
    if not user.is_superuser:
        business_town = business_owner.user.userprofile.town
        if business_town != town:
            return False, 'You can only access resources from your town'
    return True, None


def create_license_notification(business_owner, license_obj, action):
    """
    Create notification for license application approval/rejection
    """
    notification_type = 'application_approved' if action == 'approve' else 'application_rejected'
    BusinessNotification.objects.create(
        business_owner=business_owner,
        notification_type=notification_type,
        title=f'License Application {action.capitalize()}d',
        message=f'Your license application "{license_obj.license_type}" has been {action}d by the government.',
        related_license=license_obj,
    )


def create_event_notification(business_owner, event, action):
    """
    Create notification for event approval/rejection/cancellation
    """
    notification_type = 'event_approved' if action == 'approve' else 'event_rejected'
    BusinessNotification.objects.create(
        business_owner=business_owner,
        notification_type=notification_type,
        title=f'Event {action.capitalize()}d',
        message=f'Your event "{event.title}" has been {action}d by the government.',
        related_event=event,
    )


def create_booking_notification(business_owner, service, citizen, booking_date, booking_time):
    """
    Create notification for new service booking
    """
    BusinessNotification.objects.create(
        business_owner=business_owner,
        notification_type='booking_new',
        title='New Service Booking',
        message=f'{citizen.user.get_full_name()} has booked "{service.service_name}" for {booking_date} at {booking_time}.',
    )


def format_license_response(license_obj, include_government_details=False):
    """
    Format license object for API response
    """
    data = {
        'id': license_obj.id,
        'license_type': license_obj.license_type,
        'license_number': license_obj.license_number,
        'status': license_obj.status,
        'issue_date': license_obj.issue_date.strftime('%Y-%m-%d') if license_obj.issue_date else None,
        'expiry_date': license_obj.expiry_date.strftime('%Y-%m-%d') if license_obj.expiry_date else None,
        'description': license_obj.description,
        'created_at': license_obj.created_at.strftime('%Y-%m-%d'),
        'fee': float(license_obj.fee) if license_obj.fee else None,
        'fee_paid': license_obj.fee_paid,
        'renewal_required': license_obj.renewal_required,
        'attachments': license_obj.attachments if license_obj.attachments else [],
    }
    
    # Include government review details if requested
    if include_government_details:
        data['review_comment'] = license_obj.review_comment
        data['review_date'] = license_obj.review_date.strftime('%Y-%m-%d %H:%M') if license_obj.review_date else None
        data['reviewed_by'] = {
            'id': license_obj.reviewed_by.id,
            'name': license_obj.reviewed_by.user.get_full_name() or license_obj.reviewed_by.user.username,
            'position': license_obj.reviewed_by.position,
        } if license_obj.reviewed_by else None
        data['business_name'] = license_obj.business_owner.business_name
        data['business_owner'] = license_obj.business_owner.user.get_full_name() or license_obj.business_owner.user.username
        data['business_address'] = license_obj.business_owner.business_address
    
    return data


def format_event_response(event, include_registrations=False):
    """
    Format event object for API response
    """
    from .models import EventRegistration
    
    data = {
        'id': event.id,
        'title': event.title,
        'description': event.description,
        'event_date': event.event_date.strftime('%Y-%m-%d'),
        'event_time': event.event_time.strftime('%H:%M'),
        'location': event.location,
        'status': event.status,
        'max_attendees': event.max_attendees,
        'business_name': event.business_owner.business_name,
        'created_at': event.created_at.strftime('%Y-%m-%d'),
    }
    
    if include_registrations:
        registration_count = EventRegistration.objects.filter(
            event=event, 
            status='registered'
        ).count()
        data['current_attendees'] = registration_count
    
    return data


def format_service_response(service):
    """
    Format service object for API response
    """
    return {
        'id': service.id,
        'service_name': service.service_name,
        'description': service.description,
        'category': service.category,
        'price': float(service.price) if service.price else None,
        'is_active': service.is_active,
        'business_name': service.business_owner.business_name,
        'business_owner': service.business_owner.user.get_full_name() or service.business_owner.user.username,
        'business_address': service.business_owner.business_address,
    }


def format_notification_response(notification):
    """
    Format notification object for API response
    """
    return {
        'id': notification.id,
        'type': notification.notification_type,
        'title': notification.title,
        'message': notification.message,
        'is_read': notification.is_read,
        'created_at': notification.created_at.strftime('%Y-%m-%d %H:%M'),
        'related_license_id': notification.related_license.id if notification.related_license else None,
        'related_event_id': notification.related_event.id if notification.related_event else None,
    }



