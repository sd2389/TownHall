from django.urls import path
from . import views

urlpatterns = [
    path('active/', views.active_towns_view, name='active-towns'),
    path('emergency-contacts/', views.user_town_emergency_contacts, name='user-town-emergency-contacts'),
    path('change-request/', views.create_town_change_request, name='create-town-change-request'),
    path('change-requests/', views.list_town_change_requests, name='list-town-change-requests'),
    path('change-request/<int:request_id>/approve/', views.approve_town_change_request, name='approve-town-change-request'),
    path('change-request/<int:request_id>/reject/', views.reject_town_change_request, name='reject-town-change-request'),
]

