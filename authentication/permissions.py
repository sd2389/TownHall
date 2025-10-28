from rest_framework import permissions
from .models import UserProfile


class IsGovernmentOfficial(permissions.BasePermission):
    """Permission to check if user is a government official"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            profile = UserProfile.objects.get(user=request.user)
            return profile.role == 'government'
        except UserProfile.DoesNotExist:
            return False


class IsSameTown(permissions.BasePermission):
    """Permission to check if user belongs to the same town"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Superusers can access all towns
        if request.user.is_superuser:
            return True
        
        try:
            profile = UserProfile.objects.get(user=request.user)
            return profile.town is not None
        except UserProfile.DoesNotExist:
            return False
    
    def has_object_permission(self, request, view, obj):
        # Superusers can access all objects
        if request.user.is_superuser:
            return True
        
        try:
            profile = UserProfile.objects.get(user=request.user)
            
            # Check if object has town attribute
            if hasattr(obj, 'town') and obj.town:
                return obj.town == profile.town
            
            # For user profile objects
            if hasattr(obj, 'user') and isinstance(obj.user, type(request.user)):
                return obj.user == request.user
            
            # For user objects
            if isinstance(obj, type(request.user)):
                return obj == request.user
                
        except UserProfile.DoesNotExist:
            return False
        
        return False


class IsGovernmentOfTown(permissions.BasePermission):
    """Permission to check if user is government official of a specific town"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Superusers have all permissions
        if request.user.is_superuser:
            return True
        
        try:
            profile = UserProfile.objects.get(user=request.user)
            
            # Must be government official
            if profile.role != 'government':
                return False
            
            # Must have town assigned
            if not profile.town:
                return False
            
            return True
        except UserProfile.DoesNotExist:
            return False
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        
        try:
            profile = UserProfile.objects.get(user=request.user)
            
            if profile.role != 'government':
                return False
            
            if not profile.town:
                return False
            
            # Check if object belongs to their town
            if hasattr(obj, 'town') and obj.town:
                return obj.town == profile.town
            
            # For user profiles
            if hasattr(obj, 'user'):
                try:
                    obj_profile = UserProfile.objects.get(user=obj.user)
                    return obj_profile.town == profile.town
                except UserProfile.DoesNotExist:
                    return False
            
            return False
        except UserProfile.DoesNotExist:
            return False


class IsApprovedOrReadOnly(permissions.BasePermission):
    """Permission to allow read access but require approval for writes"""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.user.is_superuser:
            return True
        
        try:
            profile = UserProfile.objects.get(user=request.user)
            # Only citizens and business need approval
            if profile.role in ['citizen', 'business']:
                return profile.is_approved
            return True
        except UserProfile.DoesNotExist:
            return False


