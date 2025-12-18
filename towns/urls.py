from django.urls import path
from . import (
    views_towns,
    views_change_requests,
)

urlpatterns = [
    # Towns - RESTful
    # GET /towns/active/ - List active towns
    # GET /towns/me/emergency-contacts/ - Get emergency contacts
    # GET /town-change-requests/ - List change requests
    # POST /town-change-requests/ - Create change request
    # GET /town-change-requests/<id>/ - Get change request
    # PATCH /town-change-requests/<id>/ - Approve/reject change request
    path('active/', views_towns.active_towns_view, name='active_towns'),
    path('towns/me/emergency-contacts/', views_towns.user_town_emergency_contacts, name='user_town_emergency_contacts'),
    path('town-change-requests/', views_change_requests.list_town_change_requests, name='town_change_requests_list_create'),
    path('town-change-requests/<int:request_id>/', views_change_requests.town_change_request_detail_action_view, name='town_change_request_detail_action'),
    # Alias for frontend compatibility
    path('change-requests/', views_change_requests.list_town_change_requests, name='change_requests_list_create'),
    path('change-requests/<int:request_id>/', views_change_requests.town_change_request_detail_action_view, name='change_request_detail_action'),
]

