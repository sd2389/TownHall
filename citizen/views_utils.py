"""
Utility functions for citizen views
Provides reusable functions for authorization, validation, and common operations
"""

from rest_framework.response import Response
from rest_framework import status
from authentication.models import UserProfile
from .models import CitizenProfile
from government.utils import get_user_town
import logging

logger = logging.getLogger(__name__)


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


def get_citizen_profile(user):
    """
    Get citizen profile for a user
    Returns: CitizenProfile or None
    """
    try:
        return CitizenProfile.objects.get(user=user)
    except CitizenProfile.DoesNotExist:
        return None


def validate_required_field(data, field_name):
    """
    Validate that a required field exists and is not empty
    Handles both JSON and FormData
    Returns: (is_valid, value, error_message)
    """
    value = data.get(field_name, '')
    if isinstance(value, list):
        value = value[0] if value else ''
    value = str(value).strip()
    if not value:
        return False, None, f'{field_name.replace("_", " ").title()} is required'
    return True, value, None









