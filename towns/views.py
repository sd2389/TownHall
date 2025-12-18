from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Town, TownChangeRequest
from authentication.models import UserProfile
from django.db import transaction
from django.utils import timezone


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def active_towns_view(request):
    """Get all active towns for dropdown (GET) or create new town (POST - admin only)"""
    if request.method == 'GET':
        towns = Town.objects.filter(is_active=True).order_by('name')
        data = [
            {
                'id': town.id,
                'name': town.name,
                'state': town.state,
                'is_active': town.is_active,
                'zip_codes': town.zip_codes or []
            }
            for town in towns
        ]
        return Response(data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        # Require authentication for POST
        if not request.user.is_authenticated:
            return Response({
                'error': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Only superusers can create towns
        if not request.user.is_superuser:
            return Response({
                'error': 'Only administrators can create towns'
            }, status=status.HTTP_403_FORBIDDEN)
        
        name = request.data.get('name', '').strip()
        state = request.data.get('state', '').strip()
        zip_codes = request.data.get('zip_codes', [])
        
        if not name or not state:
            return Response({
                'error': 'Town name and state are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if town already exists
        if Town.objects.filter(name__iexact=name, state__iexact=state).exists():
            return Response({
                'error': 'A town with this name and state already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate slug from name
        from django.utils.text import slugify
        slug = slugify(name)
        
        # Ensure slug is unique
        base_slug = slug
        counter = 1
        while Town.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        # Create town
        town = Town.objects.create(
            name=name,
            slug=slug,
            state=state,
            zip_codes=zip_codes if isinstance(zip_codes, list) else [],
            is_active=True
        )
        
        return Response({
            'message': 'Town created successfully',
            'town': {
                'id': town.id,
                'name': town.name,
                'state': town.state,
                'is_active': town.is_active,
                'zip_codes': town.zip_codes or []
            }
        }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_town_emergency_contacts(request):
    """Get emergency contacts for the authenticated user's town"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        
        if not profile.town:
            return Response({
                'error': 'You are not assigned to a town'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        town = profile.town
        data = {
            'town_name': town.name,
            'emergency_contacts': {
                'police': town.emergency_police,
                'fire': town.emergency_fire,
                'medical': town.emergency_medical,
                'non_urgent': town.emergency_non_urgent if town.emergency_non_urgent else None,
                'dispatch': town.emergency_dispatch if town.emergency_dispatch else None,
                'animal_control': town.emergency_animal_control if town.emergency_animal_control else None,
                'poison_control': town.emergency_poison_control if town.emergency_poison_control else None,
                'utilities': town.emergency_utilities if town.emergency_utilities else None,
                'public_works': town.emergency_public_works if town.emergency_public_works else None,
                'mental_health': town.emergency_mental_health if town.emergency_mental_health else None,
                'child_protective': town.emergency_child_protective if town.emergency_child_protective else None,
                'road_department': town.emergency_road_department if town.emergency_road_department else None,
            }
        }
        
        return Response(data, status=status.HTTP_200_OK)
        
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_town_change_request(request):
    """Create a town change request"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        
        if profile.role == 'government':
            return Response({
                'error': 'Government officials cannot change towns'
            }, status=status.HTTP_403_FORBIDDEN)
        
        new_town_id = request.data.get('requested_town_id')
        billing_address = request.data.get('billing_address')
        
        if not new_town_id or not billing_address:
            return Response({
                'error': 'New town and billing address are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            new_town = Town.objects.get(id=new_town_id)
        except Town.DoesNotExist:
            return Response({
                'error': 'Invalid town selected'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check for existing pending request
        existing = TownChangeRequest.objects.filter(
            user=request.user,
            status__in=['pending', 'approved_current']
        ).first()
        
        if existing:
            return Response({
                'error': 'You already have a pending town change request'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create new request
        change_request = TownChangeRequest.objects.create(
            user=request.user,
            current_town=profile.town,
            requested_town=new_town,
            billing_address=billing_address,
            status='pending'
        )
        
        return Response({
            'message': 'Town change request created successfully',
            'request_id': change_request.id
        }, status=status.HTTP_201_CREATED)
        
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_town_change_requests(request):
    """List town change requests for government officials"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        
        # Allow superusers to access this view
        is_superuser = request.user.is_superuser
        
        if profile.role != 'government' and not is_superuser:
            return Response({
                'error': 'Only government officials or superusers can view requests'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get requests for their town
        user_town = profile.town
        status_filter = request.query_params.get('status')
        
        # Superusers can see all requests, government officials see only their town
        if is_superuser:
            # Superusers see all town change requests
            if status_filter:
                requests = TownChangeRequest.objects.filter(status=status_filter)
            else:
                requests = TownChangeRequest.objects.all()
        else:
            # Government officials see only their town
            if not user_town:
                return Response({
                    'error': 'You are not assigned to a town'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if status_filter:
                requests = TownChangeRequest.objects.filter(
                    current_town=user_town,
                    status=status_filter
                )
            else:
                requests = TownChangeRequest.objects.filter(current_town=user_town)
        
        data = []
        for req in requests:
            data.append({
                'id': req.id,
                'user_name': f"{req.user.first_name} {req.user.last_name}",
                'user_email': req.user.email,
                'current_town': req.current_town.name if req.current_town else None,
                'requested_town': req.requested_town.name if req.requested_town else None,
                'billing_address': req.billing_address,
                'status': req.status,
                'requested_at': req.requested_at
            })
        
        return Response(data, status=status.HTTP_200_OK)
        
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_town_change_request(request, request_id):
    """Approve town change request (government only)"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        
        if profile.role != 'government':
            return Response({
                'error': 'Only government officials can approve requests'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            change_request = TownChangeRequest.objects.get(id=request_id)
        except TownChangeRequest.DoesNotExist:
            return Response({
                'error': 'Request not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        user_town = profile.town
        if not user_town:
            return Response({
                'error': 'You are not assigned to a town'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if this is approval from current town
        if change_request.current_town == user_town and change_request.status == 'pending':
            change_request.approve_by_current_town(request.user)
            return Response({
                'message': 'Request approved by current town. Awaiting approval from new town.'
            }, status=status.HTTP_200_OK)
        
        # Check if this is approval from new town
        elif change_request.requested_town == user_town and change_request.status == 'approved_current':
            change_request.approve_by_new_town(request.user)
            
            # Update user's town
            with transaction.atomic():
                user_profile = UserProfile.objects.get(user=change_request.user)
                user_profile.town = change_request.requested_town
                user_profile.save()
            
            return Response({
                'message': 'Town change completed successfully'
            }, status=status.HTTP_200_OK)
        
        else:
            return Response({
                'error': 'You are not authorized to approve this request'
            }, status=status.HTTP_403_FORBIDDEN)
            
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_town_change_request(request, request_id):
    """Reject town change request (government only)"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        
        if profile.role != 'government':
            return Response({
                'error': 'Only government officials can reject requests'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            change_request = TownChangeRequest.objects.get(id=request_id)
        except TownChangeRequest.DoesNotExist:
            return Response({
                'error': 'Request not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        user_town = profile.town
        if change_request.current_town != user_town and change_request.requested_town != user_town:
            return Response({
                'error': 'You are not authorized to reject this request'
            }, status=status.HTTP_403_FORBIDDEN)
        
        reason = request.data.get('reason', 'No reason provided')
        change_request.reject(reason, request.user)
        
        return Response({
            'message': 'Request rejected successfully'
        }, status=status.HTTP_200_OK)
        
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
