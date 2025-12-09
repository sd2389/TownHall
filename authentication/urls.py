from django.urls import path
from . import (
    views_auth,
    views_users,
)

urlpatterns = [
    # Authentication endpoints (actions are acceptable for auth)
    path('login/', views_auth.login_view, name='login'),
    path('admin-login/', views_auth.admin_login_view, name='admin_login'),
    path('signup/', views_auth.signup_view, name='signup'),
    path('logout/', views_auth.logout_view, name='logout'),
    
    # Users - RESTful
    # GET /auth/users/me/ - Get current user profile
    # PATCH /auth/users/me/ - Update current user profile
    # GET /auth/users/?status=pending - List pending users
    # GET /auth/users/ - List all users
    # GET /auth/users/<id>/ - Get user details
    # PATCH /auth/users/<id>/ - Approve/reject/deactivate user
    path('users/me/', views_users.user_profile_view, name='user_profile'),
    path('users/', views_users.users_list_view, name='users_list'),
    path('users/<int:user_id>/', views_users.user_detail_action_view, name='user_detail_action'),
]
