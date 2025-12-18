from django.urls import path
from . import (
    views_auth,
    views_users,
    views_admin_reports,
    views_documents,
    views_password,
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
    
    # Admin Reports - RESTful
    # GET /auth/admin/reports/summary/ - Get comprehensive reports summary
    # GET /auth/admin/reports/users/ - Get user registrations report
    # GET /auth/admin/reports/complaints/ - Get complaints report
    # GET /auth/admin/reports/licenses/ - Get business licenses report
    # GET /auth/admin/reports/towns/ - Get town statistics report
    path('admin/reports/summary/', views_admin_reports.admin_reports_summary_view, name='admin_reports_summary'),
    path('admin/reports/users/', views_admin_reports.admin_user_registrations_report_view, name='admin_user_registrations_report'),
    path('admin/reports/complaints/', views_admin_reports.admin_complaints_report_view, name='admin_complaints_report'),
    path('admin/reports/licenses/', views_admin_reports.admin_business_licenses_report_view, name='admin_business_licenses_report'),
    path('admin/reports/towns/', views_admin_reports.admin_town_statistics_report_view, name='admin_town_statistics_report'),
    
    # User Documents - RESTful
    # GET /auth/documents/ - List user documents
    # POST /auth/documents/ - Upload document
    # DELETE /auth/documents/<id>/ - Delete document
    path('documents/', views_documents.user_documents_view, name='user_documents_list_create'),
    path('documents/<int:document_id>/', views_documents.user_document_detail_view, name='user_document_detail'),
    
    # Password Change
    # POST /auth/change-password/ - Change user password
    path('change-password/', views_password.change_password_view, name='change_password'),
]
