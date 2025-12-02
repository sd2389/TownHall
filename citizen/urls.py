from django.urls import path
from . import views

urlpatterns = [
    path('complaints/', views.list_complaints_view, name='list_complaints'),
    path('complaints/create/', views.create_complaint_view, name='create_complaint'),
    path('complaints/<int:complaint_id>/', views.update_complaint_view, name='update_complaint'),
    path('complaints/<int:complaint_id>/comments/', views.add_complaint_comment_view, name='add_complaint_comment'),
    path('complaints/<int:complaint_id>/notify/', views.notify_citizen_view, name='notify_citizen'),
    path('notifications/', views.list_notifications_view, name='list_notifications'),
    path('notifications/<int:notification_id>/read/', views.mark_notification_read_view, name='mark_notification_read'),
]



