"""
Utility functions for government views
Provides reusable functions for authorization, validation, and common operations
"""

from rest_framework.response import Response
from rest_framework import status
from authentication.models import UserProfile
from .models import GovernmentOfficial
from .utils import get_user_town, filter_by_town
import logging

logger = logging.getLogger(__name__)


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


def check_admin_access(user):
    """
    Check if user is admin or superuser
    Returns: (is_admin, profile) or (False, None)
    """
    if user.is_superuser:
        return True, None
    
    try:
        profile = UserProfile.objects.get(user=user)
        if profile.role == 'government':
            return True, profile
        return False, None
    except UserProfile.DoesNotExist:
        return False, None


def validate_required_field(data, field_name):
    """
    Validate that a required field exists and is not empty
    Returns: (is_valid, value, error_message)
    """
    value = data.get(field_name, '').strip()
    if not value:
        return False, None, f'{field_name.replace("_", " ").title()} is required'
    return True, value, None


def format_department_response(department):
    """Format department data for API response"""
    return {
        'id': department.id,
        'name': department.name,
        'description': department.description,
        'contact_email': department.contact_email,
        'contact_phone': department.contact_phone,
    }


def format_position_response(position):
    """Format position data for API response"""
    return {
        'id': position.id,
        'name': position.name,
        'department_id': position.department.id,
        'department_name': position.department.name,
        'description': position.description,
    }

