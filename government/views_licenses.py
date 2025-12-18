"""
Government License Management Views
Handles license and permit review and management by government officials
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from businessowner.models import BusinessLicense
from businessowner.utils import format_license_response
from .utils import get_user_town
from .views_utils import check_government_access
from .models import GovernmentOfficial
from django.utils import timezone
from datetime import date, timedelta
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_licenses_view(request):
    """List all licenses/permits for government review (filtered by town)"""
    try:
        is_government, profile = check_government_access(request.user)
        
        if not is_government:
            return Response({
                'error': 'Only government officials can access this endpoint'
            }, status=status.HTTP_403_FORBIDDEN)
        
        user_town = get_user_town(request.user)
        
        if not user_town and not request.user.is_superuser:
            return Response({
                'error': 'You must be associated with a town to view licenses'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get query parameters
        status_filter = request.query_params.get('status', None)
        license_type_filter = request.query_params.get('license_type', None)
        
        # Filter licenses by town
        licenses = BusinessLicense.objects.select_related(
            'business_owner', 
            'business_owner__user',
            'business_owner__user__userprofile',
            'reviewed_by',
            'reviewed_by__user'
        )
        
        if not request.user.is_superuser:
            licenses = licenses.filter(
                business_owner__user__userprofile__town=user_town
            )
        
        # Apply filters
        if status_filter and status_filter != 'all':
            licenses = licenses.filter(status=status_filter)
        
        if license_type_filter:
            licenses = licenses.filter(license_type__icontains=license_type_filter)
        
        licenses = licenses.order_by('-created_at')
        
        data = [format_license_response(license_obj, include_government_details=True) for license_obj in licenses]
        
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error listing licenses: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_license_detail_view(request, license_id):
    """Get detailed information about a specific license"""
    try:
        is_government, profile = check_government_access(request.user)
        
        if not is_government:
            return Response({
                'error': 'Only government officials can access this endpoint'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            license_obj = BusinessLicense.objects.select_related(
                'business_owner',
                'business_owner__user',
                'business_owner__user__userprofile',
                'reviewed_by',
                'reviewed_by__user'
            ).get(id=license_id)
        except BusinessLicense.DoesNotExist:
            return Response({
                'error': 'License not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check town access
        user_town = get_user_town(request.user)
        if not request.user.is_superuser:
            business_town = license_obj.business_owner.user.userprofile.town
            if business_town != user_town:
                return Response({
                    'error': 'You can only access licenses from your town'
                }, status=status.HTTP_403_FORBIDDEN)
        
        data = format_license_response(license_obj, include_government_details=True)
        
        # Add additional business details
        data['business_registration_number'] = license_obj.business_owner.business_registration_number
        data['business_type'] = license_obj.business_owner.business_type
        data['business_phone'] = license_obj.business_owner.phone_number
        data['business_website'] = license_obj.business_owner.website
        
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error getting license detail: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def review_license_view(request, license_id):
    """Review and approve/reject a license application"""
    try:
        is_government, profile = check_government_access(request.user)
        
        if not is_government:
            return Response({
                'error': 'Only government officials can review licenses'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            license_obj = BusinessLicense.objects.select_related(
                'business_owner',
                'business_owner__user',
                'business_owner__user__userprofile'
            ).get(id=license_id)
        except BusinessLicense.DoesNotExist:
            return Response({
                'error': 'License not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check town access
        user_town = get_user_town(request.user)
        if not request.user.is_superuser:
            business_town = license_obj.business_owner.user.userprofile.town
            if business_town != user_town:
                return Response({
                    'error': 'You can only review licenses from your town'
                }, status=status.HTTP_403_FORBIDDEN)
        
        # Get government official
        try:
            government_official = GovernmentOfficial.objects.get(user=request.user)
        except GovernmentOfficial.DoesNotExist:
            return Response({
                'error': 'Government official profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        action = request.data.get('action', '').lower()
        if action not in ['approve', 'reject']:
            return Response({
                'error': 'Action must be "approve" or "reject"'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        review_comment = request.data.get('review_comment', '').strip()
        fee = request.data.get('fee', None)
        expiry_days = request.data.get('expiry_days', 365)  # Default 1 year
        
        if action == 'approve':
            license_obj.status = 'approved'
            license_obj.issue_date = date.today()
            license_obj.expiry_date = date.today() + timedelta(days=int(expiry_days))
            if fee:
                try:
                    license_obj.fee = float(fee)
                except (ValueError, TypeError):
                    pass
        else:
            license_obj.status = 'rejected'
        
        # Set government review information
        license_obj.reviewed_by = government_official
        license_obj.review_comment = review_comment
        license_obj.review_date = timezone.now()
        license_obj.save()
        
        # Create notification for business owner
        from businessowner.utils import create_license_notification
        create_license_notification(license_obj.business_owner, license_obj, action)
        
        return Response({
            'message': f'License application {action}d successfully',
            'license': format_license_response(license_obj, include_government_details=True)
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error reviewing license: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def license_statistics_view(request):
    """Get statistics about licenses for government dashboard"""
    try:
        is_government, profile = check_government_access(request.user)
        
        if not is_government:
            return Response({
                'error': 'Only government officials can access this endpoint'
            }, status=status.HTTP_403_FORBIDDEN)
        
        user_town = get_user_town(request.user)
        
        if not user_town and not request.user.is_superuser:
            return Response({
                'error': 'You must be associated with a town to view statistics'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Filter licenses by town
        licenses = BusinessLicense.objects.select_related(
            'business_owner',
            'business_owner__user',
            'business_owner__user__userprofile'
        )
        
        if not request.user.is_superuser:
            licenses = licenses.filter(
                business_owner__user__userprofile__town=user_town
            )
        
        # Calculate statistics
        total_licenses = licenses.count()
        pending_licenses = licenses.filter(status='pending').count()
        approved_licenses = licenses.filter(status='approved').count()
        rejected_licenses = licenses.filter(status='rejected').count()
        
        # Expiring licenses (within 30 days)
        from django.utils import timezone
        today = timezone.now().date()
        expiring_soon = licenses.filter(
            status='approved',
            expiry_date__gte=today,
            expiry_date__lte=today + timedelta(days=30)
        ).count()
        
        # Expired licenses
        expired_licenses = licenses.filter(
            status='approved',
            expiry_date__lt=today
        ).count()
        
        return Response({
            'total_licenses': total_licenses,
            'pending_licenses': pending_licenses,
            'approved_licenses': approved_licenses,
            'rejected_licenses': rejected_licenses,
            'expiring_soon': expiring_soon,
            'expired_licenses': expired_licenses,
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error getting license statistics: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

