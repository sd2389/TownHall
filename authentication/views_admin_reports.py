"""
Admin Reports Views
Provides comprehensive reporting and analytics for admin panel
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Q, Sum, Avg
from django.utils import timezone
from datetime import timedelta, datetime
from authentication.models import UserProfile
from citizen.models import CitizenComplaint, CitizenProfile
from businessowner.models import (
    BusinessComplaint, 
    BusinessLicense, 
    BusinessOwnerProfile,
    BusinessEvent,
    BusinessService
)
from towns.models import Town
import logging

logger = logging.getLogger(__name__)


def check_admin_access(user):
    """Check if user is superuser (admin panel access)"""
    return user.is_superuser


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_reports_summary_view(request):
    """
    Get comprehensive reports summary for admin panel
    Returns statistics for complaints, users, businesses, and towns
    """
    if not check_admin_access(request.user):
        return Response({
            'error': 'Access denied. Admin access required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        # Get date range from query params (optional)
        days = int(request.GET.get('days', 30))
        end_date = timezone.now()
        start_date = end_date - timedelta(days=days)
        
        # Total Complaints (Citizen + Business)
        total_complaints = (
            CitizenComplaint.objects.count() +
            BusinessComplaint.objects.count()
        )
        
        # Resolved Complaints
        resolved_complaints = (
            CitizenComplaint.objects.filter(status='resolved').count() +
            BusinessComplaint.objects.filter(status='resolved').count()
        )
        
        # Pending Complaints
        pending_complaints = (
            CitizenComplaint.objects.filter(status='pending').count() +
            BusinessComplaint.objects.filter(status='pending').count()
        )
        
        # In Progress Complaints
        in_progress_complaints = (
            CitizenComplaint.objects.filter(status='in_progress').count() +
            BusinessComplaint.objects.filter(status='in_progress').count()
        )
        
        # User Statistics
        total_users = UserProfile.objects.count()
        pending_users = UserProfile.objects.filter(is_approved=False).count()
        approved_users = UserProfile.objects.filter(is_approved=True).count()
        
        # User registrations by role
        users_by_role = UserProfile.objects.values('role').annotate(
            count=Count('id')
        )
        
        # New registrations in date range
        new_registrations = UserProfile.objects.filter(
            created_at__gte=start_date
        ).count()
        
        # Business Statistics
        total_businesses = BusinessOwnerProfile.objects.count()
        total_licenses = BusinessLicense.objects.count()
        pending_licenses = BusinessLicense.objects.filter(status='pending').count()
        approved_licenses = BusinessLicense.objects.filter(status='approved').count()
        expiring_licenses = BusinessLicense.objects.filter(
            status='approved',
            expiry_date__lte=end_date + timedelta(days=30),
            expiry_date__gte=end_date
        ).count()
        
        # Town Statistics
        total_towns = Town.objects.count()
        
        # Complaints by category (Citizen)
        citizen_complaints_by_category = CitizenComplaint.objects.values('category').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        # Complaints by status breakdown
        citizen_status_breakdown = CitizenComplaint.objects.values('status').annotate(
            count=Count('id')
        )
        business_status_breakdown = BusinessComplaint.objects.values('status').annotate(
            count=Count('id')
        )
        
        # Recent activity (last 7 days)
        recent_start = end_date - timedelta(days=7)
        recent_complaints = (
            CitizenComplaint.objects.filter(created_at__gte=recent_start).count() +
            BusinessComplaint.objects.filter(created_at__gte=recent_start).count()
        )
        recent_registrations = UserProfile.objects.filter(
            created_at__gte=recent_start
        ).count()
        
        # Business Events Statistics
        total_events = BusinessEvent.objects.count()
        approved_events = BusinessEvent.objects.filter(status='approved').count()
        pending_events = BusinessEvent.objects.filter(status='pending').count()
        
        # Business Services Statistics
        total_services = BusinessService.objects.count()
        active_services = BusinessService.objects.filter(is_active=True).count()
        
        return Response({
            'summary': {
                'total_complaints': total_complaints,
                'resolved_complaints': resolved_complaints,
                'pending_complaints': pending_complaints,
                'in_progress_complaints': in_progress_complaints,
                'total_users': total_users,
                'pending_users': pending_users,
                'approved_users': approved_users,
                'new_registrations': new_registrations,
                'total_businesses': total_businesses,
                'total_licenses': total_licenses,
                'pending_licenses': pending_licenses,
                'approved_licenses': approved_licenses,
                'expiring_licenses': expiring_licenses,
                'total_towns': total_towns,
                'recent_complaints': recent_complaints,
                'recent_registrations': recent_registrations,
                'total_events': total_events,
                'approved_events': approved_events,
                'pending_events': pending_events,
                'total_services': total_services,
                'active_services': active_services,
            },
            'users_by_role': list(users_by_role),
            'complaints_by_category': list(citizen_complaints_by_category),
            'citizen_status_breakdown': list(citizen_status_breakdown),
            'business_status_breakdown': list(business_status_breakdown),
            'date_range': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat(),
                'days': days
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error generating admin reports: {str(e)}")
        return Response({
            'error': f'An error occurred while generating reports: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_user_registrations_report_view(request):
    """
    Get user registrations report
    Returns detailed user registration data
    """
    if not check_admin_access(request.user):
        return Response({
            'error': 'Access denied. Admin access required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        days = int(request.GET.get('days', 30))
        end_date = timezone.now()
        start_date = end_date - timedelta(days=days)
        
        # Get registrations in date range
        registrations = UserProfile.objects.filter(
            created_at__gte=start_date
        ).select_related('user', 'town').order_by('-created_at')
        
        # Format response
        registration_data = []
        for profile in registrations:
            registration_data.append({
                'id': profile.id,
                'user_id': profile.user.id,
                'email': profile.user.email,
                'first_name': profile.user.first_name,
                'last_name': profile.user.last_name,
                'role': profile.role,
                'role_display': profile.get_role_display(),
                'is_approved': profile.is_approved,
                'town_id': profile.town.id if profile.town else None,
                'town_name': profile.town.name if profile.town else None,
                'created_at': profile.created_at.isoformat(),
                'approved_at': profile.approved_at.isoformat() if profile.approved_at else None,
            })
        
        # Statistics
        by_role = UserProfile.objects.filter(
            created_at__gte=start_date
        ).values('role').annotate(count=Count('id'))
        
        return Response({
            'registrations': registration_data,
            'statistics': {
                'total': len(registration_data),
                'by_role': list(by_role),
            },
            'date_range': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat(),
                'days': days
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error generating user registrations report: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_complaints_report_view(request):
    """
    Get complaints report
    Returns detailed complaints data
    """
    if not check_admin_access(request.user):
        return Response({
            'error': 'Access denied. Admin access required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        days = int(request.GET.get('days', 30))
        end_date = timezone.now()
        start_date = end_date - timedelta(days=days)
        
        # Get citizen complaints
        citizen_complaints = CitizenComplaint.objects.filter(
            created_at__gte=start_date
        ).select_related('citizen', 'citizen__user', 'town').order_by('-created_at')
        
        # Get business complaints
        business_complaints = BusinessComplaint.objects.filter(
            created_at__gte=start_date
        ).select_related('business_owner', 'business_owner__user').order_by('-created_at')
        
        # Format citizen complaints
        citizen_data = []
        for complaint in citizen_complaints:
            citizen_data.append({
                'id': complaint.id,
                'type': 'citizen',
                'title': complaint.title,
                'category': complaint.category,
                'status': complaint.status,
                'priority': complaint.priority,
                'citizen_name': complaint.citizen.user.get_full_name(),
                'town_name': complaint.town.name if complaint.town else None,
                'created_at': complaint.created_at.isoformat(),
                'updated_at': complaint.updated_at.isoformat(),
            })
        
        # Format business complaints
        business_data = []
        for complaint in business_complaints:
            business_data.append({
                'id': complaint.id,
                'type': 'business',
                'title': complaint.title,
                'category': complaint.category,
                'status': complaint.status,
                'priority': complaint.priority,
                'business_name': complaint.business_owner.business_name,
                'created_at': complaint.created_at.isoformat(),
                'updated_at': complaint.updated_at.isoformat(),
            })
        
        # Combine and sort by date
        all_complaints = sorted(
            citizen_data + business_data,
            key=lambda x: x['created_at'],
            reverse=True
        )
        
        # Statistics
        citizen_by_status = CitizenComplaint.objects.filter(
            created_at__gte=start_date
        ).values('status').annotate(count=Count('id'))
        
        business_by_status = BusinessComplaint.objects.filter(
            created_at__gte=start_date
        ).values('status').annotate(count=Count('id'))
        
        return Response({
            'complaints': all_complaints,
            'statistics': {
                'total': len(all_complaints),
                'citizen_total': len(citizen_data),
                'business_total': len(business_data),
                'citizen_by_status': list(citizen_by_status),
                'business_by_status': list(business_by_status),
            },
            'date_range': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat(),
                'days': days
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error generating complaints report: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_business_licenses_report_view(request):
    """
    Get business licenses report
    Returns detailed license data
    """
    if not check_admin_access(request.user):
        return Response({
            'error': 'Access denied. Admin access required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        status_filter = request.GET.get('status', None)
        
        # Get licenses
        licenses_query = BusinessLicense.objects.select_related(
            'business_owner', 'business_owner__user'
        ).order_by('-created_at')
        
        if status_filter:
            licenses_query = licenses_query.filter(status=status_filter)
        
        licenses = licenses_query
        
        # Format response
        license_data = []
        for license in licenses:
            license_data.append({
                'id': license.id,
                'license_type': license.license_type,
                'license_number': license.license_number,
                'status': license.status,
                'business_name': license.business_owner.business_name,
                'business_owner': license.business_owner.user.get_full_name(),
                'issue_date': license.issue_date.isoformat() if license.issue_date else None,
                'expiry_date': license.expiry_date.isoformat() if license.expiry_date else None,
                'created_at': license.created_at.isoformat(),
            })
        
        # Statistics
        by_status = BusinessLicense.objects.values('status').annotate(count=Count('id'))
        
        # Expiring soon (next 30 days)
        end_date = timezone.now().date()
        expiring_soon = BusinessLicense.objects.filter(
            status='approved',
            expiry_date__lte=end_date + timedelta(days=30),
            expiry_date__gte=end_date
        ).count()
        
        return Response({
            'licenses': license_data,
            'statistics': {
                'total': len(license_data),
                'by_status': list(by_status),
                'expiring_soon': expiring_soon,
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error generating business licenses report: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_town_statistics_report_view(request):
    """
    Get town-level statistics report
    Returns statistics grouped by town
    """
    if not check_admin_access(request.user):
        return Response({
            'error': 'Access denied. Admin access required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        towns = Town.objects.all().order_by('name')
        
        town_stats = []
        for town in towns:
            # Count users by town
            users_count = UserProfile.objects.filter(town=town).count()
            citizens_count = UserProfile.objects.filter(town=town, role='citizen').count()
            businesses_count = UserProfile.objects.filter(town=town, role='business').count()
            government_count = UserProfile.objects.filter(town=town, role='government').count()
            
            # Count complaints by town
            complaints_count = CitizenComplaint.objects.filter(town=town).count()
            resolved_complaints = CitizenComplaint.objects.filter(town=town, status='resolved').count()
            
            town_stats.append({
                'town_id': town.id,
                'town_name': town.name,
                'users': {
                    'total': users_count,
                    'citizens': citizens_count,
                    'businesses': businesses_count,
                    'government': government_count,
                },
                'complaints': {
                    'total': complaints_count,
                    'resolved': resolved_complaints,
                    'pending': complaints_count - resolved_complaints,
                }
            })
        
        return Response({
            'towns': town_stats,
            'statistics': {
                'total_towns': len(town_stats),
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error generating town statistics report: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

