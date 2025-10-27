from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.user_profile_view, name='user_profile'),
    path('pending-users/', views.list_pending_users_view, name='list_pending_users'),
    path('all-users/', views.list_all_users_view, name='list_all_users'),
    path('approve-user/<int:user_id>/', views.approve_user_view, name='approve_user'),
    path('reject-user/<int:user_id>/', views.reject_user_view, name='reject_user'),
]
