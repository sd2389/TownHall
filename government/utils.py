"""
Utility functions for government app
"""
from authentication.models import UserProfile
from government.models import GovernmentOfficial


def get_user_town(user):
    """
    Get the town associated with a user.
    Returns the town object or None.
    """
    try:
        profile = UserProfile.objects.get(user=user)
        return profile.town
    except UserProfile.DoesNotExist:
        # Try to get from government official
        try:
            official = GovernmentOfficial.objects.get(user=user)
            return official.town
        except GovernmentOfficial.DoesNotExist:
            return None


def filter_by_town(queryset, user, allow_superuser=True):
    """
    Filter a queryset by the user's town.
    Superusers can see all towns if allow_superuser is True.
    """
    if allow_superuser and user.is_superuser:
        return queryset
    
    town = get_user_town(user)
    if town:
        return queryset.filter(town=town)
    else:
        # If user has no town, return empty queryset
        return queryset.none()














