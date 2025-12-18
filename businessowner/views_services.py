"""
Business Service Views
Handles business services and service bookings
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import BusinessService, ServiceBooking
from .utils import (
    check_business_owner_access, check_citizen_access,
    validate_required_field, create_booking_notification,
    format_service_response
)
from government.utils import get_user_town
from authentication.models import UserProfile
from citizen.models import CitizenProfile
import logging

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def list_business_services_view(request):
    """List business services (GET) or create service (POST)"""
    if request.method == 'GET':
        try:
            profile = UserProfile.objects.get(user=request.user)
            
            if profile.role == 'business':
                is_business_owner, _, business_profile = check_business_owner_access(request.user)
                if not is_business_owner or not business_profile:
                    return Response({
                        'error': 'Business profile not found'
                    }, status=status.HTTP_404_NOT_FOUND)
                services = BusinessService.objects.filter(business_owner=business_profile)
            else:
                # Filter services by town through business_owner -> user -> userprofile -> town
                user_town = get_user_town(request.user)
                if user_town and not request.user.is_superuser:
                    services = BusinessService.objects.filter(
                        is_active=True,
                        business_owner__user__userprofile__town=user_town
                    )
                else:
                    services = BusinessService.objects.filter(is_active=True)
            
            services = services.select_related('business_owner', 'business_owner__user').order_by('-created_at')
            
            data = [format_service_response(service) for service in services]
            
            return Response(data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error listing business services: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        # Create service
        try:
            is_business_owner, profile, business_profile = check_business_owner_access(request.user)
            
            if not is_business_owner:
                return Response({
                    'error': 'Only business owners can create services'
                }, status=status.HTTP_403_FORBIDDEN)
            
            if not business_profile:
                return Response({
                    'error': 'Business profile not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            is_valid, service_name, error = validate_required_field(request.data, 'service_name')
            if not is_valid:
                return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
            
            description = request.data.get('description', '').strip()
            category = request.data.get('category', '').strip()
            price = request.data.get('price')
            
            service = BusinessService.objects.create(
                business_owner=business_profile,
                service_name=service_name,
                description=description,
                category=category,
                price=float(price) if price else None,
                is_active=True,
            )
            
            return Response({
                'message': 'Service created successfully',
                'service': {
                    'id': service.id,
                    'service_name': service.service_name,
                    'category': service.category,
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating business service: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_service_booking_view(request):
    """Citizen books a business service"""
    try:
        is_citizen, profile = check_citizen_access(request.user)
        
        if not is_citizen:
            return Response({
                'error': 'Only citizens can book services'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            citizen_profile = CitizenProfile.objects.get(user=request.user)
        except CitizenProfile.DoesNotExist:
            return Response({
                'error': 'Citizen profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        service_id = request.data.get('service_id')
        if not service_id:
            return Response({
                'error': 'Service ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            service = BusinessService.objects.get(id=service_id, is_active=True)
        except BusinessService.DoesNotExist:
            return Response({
                'error': 'Service not found or not available'
            }, status=status.HTTP_404_NOT_FOUND)
        
        is_valid, booking_date, error = validate_required_field(request.data, 'booking_date')
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        is_valid, booking_time, error = validate_required_field(request.data, 'booking_time')
        if not is_valid:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        notes = request.data.get('notes', '').strip()
        
        booking = ServiceBooking.objects.create(
            service=service,
            citizen=citizen_profile,
            booking_date=booking_date,
            booking_time=booking_time,
            status='pending',
            notes=notes,
        )
        
        create_booking_notification(
            service.business_owner,
            service,
            citizen_profile,
            booking_date,
            booking_time
        )
        
        return Response({
            'message': 'Service booking created successfully',
            'booking': {
                'id': booking.id,
                'service_name': service.service_name,
                'booking_date': booking.booking_date.strftime('%Y-%m-%d'),
                'booking_time': booking.booking_time.strftime('%H:%M'),
                'status': booking.status,
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error creating service booking: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

