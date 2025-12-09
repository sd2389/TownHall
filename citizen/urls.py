from django.urls import path
from . import (
    views_complaints,
    views_comments,
    views_notifications,
)

urlpatterns = [
    # Complaints - RESTful
    # GET /citizen/complaints/ - List complaints
    # POST /citizen/complaints/ - Create complaint
    # PATCH/PUT /citizen/complaints/<id>/ - Update complaint
    path('complaints/', views_complaints.list_complaints_view, name='complaints_list'),
    path('complaints/<int:complaint_id>/', views_complaints.update_complaint_view, name='complaint_detail'),
    
    # Comments - RESTful
    # POST /citizen/complaints/<id>/comments/ - Add comment
    path('complaints/<int:complaint_id>/comments/', views_comments.add_complaint_comment_view, name='complaint_comments_create'),
    
    # Notifications - RESTful
    # GET /citizen/notifications/ - List notifications
    # PATCH /citizen/notifications/<id>/ - Mark notification as read
    # POST /citizen/complaints/<id>/notifications/ - Notify citizen
    path('notifications/', views_notifications.list_notifications_view, name='notifications_list'),
    path('notifications/<int:notification_id>/', views_notifications.mark_notification_read_view, name='notification_detail'),
    path('complaints/<int:complaint_id>/notifications/', views_notifications.notify_citizen_view, name='complaint_notifications_create'),
]



