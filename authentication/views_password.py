"""
Password Change Views
Handles password change operations
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    """Change user password"""
    try:
        old_password = request.data.get('old_password', '').strip()
        new_password = request.data.get('new_password', '').strip()
        confirm_password = request.data.get('confirm_password', '').strip()
        
        # Validate required fields
        if not old_password:
            return Response({
                'error': 'Current password is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not new_password:
            return Response({
                'error': 'New password is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not confirm_password:
            return Response({
                'error': 'Please confirm your new password'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify old password
        if not request.user.check_password(old_password):
            return Response({
                'error': 'Current password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if new password matches confirmation
        if new_password != confirm_password:
            return Response({
                'error': 'New password and confirmation do not match'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if new password is different from old password
        if old_password == new_password:
            return Response({
                'error': 'New password must be different from current password'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate new password using Django's validators
        try:
            validate_password(new_password, user=request.user)
        except DjangoValidationError as e:
            errors = [str(error) for error in e.messages]
            return Response({
                'error': 'Password validation failed',
                'details': errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update password
        request.user.set_password(new_password)
        request.user.save()
        
        # Update session to prevent logout
        update_session_auth_hash(request, request.user)
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error changing password: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)







