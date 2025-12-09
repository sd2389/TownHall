"""
Business License Views
Handles license and permit operations
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import BusinessLicense
from .utils import (
    check_business_owner_access, check_government_access,
    validate_required_field, check_town_access,
    create_license_notification, format_license_response
)
from government.utils import get_user_town, filter_by_town
import uuid
from datetime import date, timedelta
import logging

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def list_licenses_view(request):
    """List licenses (GET) or create license application (POST) for the authenticated business owner"""
    if request.method == 'GET':
        try:
            is_business_owner, profile, business_profile = check_business_owner_access(request.user)
            
            if not is_business_owner:
                return Response({
                    'error': 'Only business owners can access this endpoint'
                }, status=status.HTTP_403_FORBIDDEN)
            
            if not business_profile:
                return Response({
                    'error': 'Business profile not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            licenses = BusinessLicense.objects.filter(business_owner=business_profile)
            
            status_filter = request.query_params.get('status', None)
            if status_filter and status_filter != 'all':
                licenses = licenses.filter(status=status_filter)
            
            licenses = licenses.order_by('-created_at')
            
            data = [format_license_response(license_obj) for license_obj in licenses]
            
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error listing licenses: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        # Create license application
        try:
            is_business_owner, profile, business_profile = check_business_owner_access(request.user)
            
            if not is_business_owner:
                return Response({
                    'error': 'Only business owners can create license applications'
                }, status=status.HTTP_403_FORBIDDEN)
            
            if not business_profile:
                return Response({
                    'error': 'Business profile not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            town = get_user_town(request.user)
            if not town:
                return Response({
                    'error': 'Business must be associated with a town'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            is_valid, license_type, error = validate_required_field(request.data, 'license_type')
            if not is_valid:
                return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
            
            description = request.data.get('description', '').strip()
            
            license_number = f"LIC-{uuid.uuid4().hex[:8].upper()}"
            
            license_obj = BusinessLicense.objects.create(
                business_owner=business_profile,
                license_type=license_type,
                license_number=license_number,
                status='pending',
                description=description,
            )
            
            return Response({
                'message': 'License application created successfully',
                'license': format_license_response(license_obj)
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating license application: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    """Create a new license/permit application (for government review)"""
    try:
        is_business_owner, profile, business_profile = check_business_owner_access(request.user)
        
        if not is_business_owner:
            return Response({
                'error': 'Only business owners can create license applications'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if not business_profile:
            return Response({
                'error': 'Business profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        town = get_user_town(request.user)
        if not town:
            return Response({
                'error': 'Business must be associated with a town'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        is_valid, license_type, error = validate_required_field(request.data, 'license_type')
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        description = request.data.get('description', '').strip()
        
        license_number = f"LIC-{uuid.uuid4().hex[:8].upper()}"
        
        license_obj = BusinessLicense.objects.create(
            business_owner=business_profile,
            license_type=license_type,
            license_number=license_number,
            status='pending',
            description=description,
        )
        
        return Response({
            'message': 'License application created successfully',
            'license': format_license_response(license_obj)
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error creating license application: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_pending_applications_view(request):
    """List pending business applications for government review"""
    try:
        is_government, profile = check_government_access(request.user)
        
        if not is_government:
            return Response({
                'error': 'Only government officials can review applications'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Filter by status=pending from query params
        status_filter = request.query_params.get('status', 'pending')
        licenses = filter_by_town(
            BusinessLicense.objects.filter(status=status_filter),
            request.user
        ).select_related('business_owner', 'business_owner__user', 'business_owner__user__userprofile')
        
        licenses = licenses.filter(
            business_owner__user__userprofile__town=get_user_town(request.user)
        )
        
        licenses = licenses.order_by('-created_at')
        
        data = []
        for license_obj in licenses:
            data.append({
                'id': license_obj.id,
                'license_type': license_obj.license_type,
                'license_number': license_obj.license_number,
                'status': license_obj.status,
                'description': license_obj.description,
                'created_at': license_obj.created_at.strftime('%Y-%m-%d'),
                'business_name': license_obj.business_owner.business_name,
                'business_owner': license_obj.business_owner.user.get_full_name() or license_obj.business_owner.user.username,
                'business_address': license_obj.business_owner.business_address,
            })
        
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error listing pending applications: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def review_license_application_view(request, license_id):
    """Government review and approve/reject license application"""
    try:
        is_government, profile = check_government_access(request.user)
        
        if not is_government:
            return Response({
                'error': 'Only government officials can review applications'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            license_obj = BusinessLicense.objects.get(id=license_id)
        except BusinessLicense.DoesNotExist:
            return Response({
                'error': 'License application not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        has_access, error = check_town_access(request.user, license_obj.business_owner)
        if not has_access:
            return Response({'error': error}, status=status.HTTP_403_FORBIDDEN)
        
        action = request.data.get('action', '').lower()
        if action not in ['approve', 'reject']:
            return Response({
                'error': 'Action must be "approve" or "reject"'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if action == 'approve':
            license_obj.status = 'approved'
            license_obj.issue_date = date.today()
            license_obj.expiry_date = date.today() + timedelta(days=365)
        else:
            license_obj.status = 'rejected'
        
        license_obj.save()
        
        create_license_notification(license_obj.business_owner, license_obj, action)
        
        return Response({
            'message': f'License application {action}d successfully',
            'license': {
                'id': license_obj.id,
                'status': license_obj.status,
                'issue_date': license_obj.issue_date.strftime('%Y-%m-%d') if license_obj.issue_date else None,
                'expiry_date': license_obj.expiry_date.strftime('%Y-%m-%d') if license_obj.expiry_date else None,
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error reviewing license application: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

