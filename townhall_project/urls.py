"""
URL configuration for townhall_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root_view(request):
    """Root API endpoint that provides information about available endpoints"""
    return Response({
        'message': 'TownHall API',
        'version': '1.0',
        'status': 'running',
        'endpoints': {
            'authentication': '/api/auth/',
            'towns': '/api/towns/',
            'government': '/api/government/',
            'citizen': '/api/citizen/',
            'business': '/api/business/',
            'admin': '/admin/',
        },
        'documentation': 'This is the TownHall REST API backend. The frontend is served separately via Next.js.'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_help_view(request, **kwargs):
    """Helpful response for common incorrect API paths"""
    # Extract path name from URL or kwargs
    path_name = kwargs.get('path_name')
    if not path_name:
        # Extract from request path
        path_parts = request.path.strip('/').split('/')
        path_name = path_parts[0] if path_parts else 'unknown'
    
    path_mapping = {
        'citizen': '/api/citizen/',
        'government': '/api/government/',
        'auth': '/api/auth/',
        'authentication': '/api/auth/',
        'towns': '/api/towns/',
        'town': '/api/towns/',
    }
    
    correct_path = path_mapping.get(path_name.lower())
    
    if correct_path:
        return Response({
            'error': f'Path not found: /{path_name}/',
            'message': f'The correct endpoint is {correct_path}',
            'help': 'All API endpoints are prefixed with /api/',
            'available_endpoints': {
                'authentication': '/api/auth/',
                'towns': '/api/towns/',
                'government': '/api/government/',
                'citizen': '/api/citizen/',
                'business': '/api/business/',
            }
        }, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({
            'error': f'Path not found: /{path_name}/',
            'message': 'This endpoint does not exist',
            'help': 'All API endpoints are prefixed with /api/',
            'available_endpoints': {
                'authentication': '/api/auth/',
                'towns': '/api/towns/',
                'government': '/api/government/',
                'citizen': '/api/citizen/',
                'business': '/api/business/',
            }
        }, status=status.HTTP_404_NOT_FOUND)


urlpatterns = [
    path('', api_root_view, name='api_root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/towns/', include('towns.urls')),
    path('api/government/', include('government.urls')),
    path('api/citizen/', include('citizen.urls')),
    path('api/business/', include('businessowner.urls')),
    # Helpful responses for common incorrect paths (must be after all other paths)
    path('citizen/', api_help_view, {'path_name': 'citizen'}, name='citizen_help'),
    path('government/', api_help_view, {'path_name': 'government'}, name='government_help'),
    path('auth/', api_help_view, {'path_name': 'auth'}, name='auth_help'),
    path('authentication/', api_help_view, {'path_name': 'authentication'}, name='authentication_help'),
    path('towns/', api_help_view, {'path_name': 'towns'}, name='towns_help'),
    path('town/', api_help_view, {'path_name': 'town'}, name='town_help'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
