from django.urls import path
from . import (
    views_profile,
    views_licenses,
    views_complaints,
    views_feedback,
    views_events,
    views_services,
    views_notifications,
)

urlpatterns = [
    # Business Profile - GET /business/profile/
    path('profile/', views_profile.get_business_profile_view, name='business_profile'),
    
    # Licenses & Permits - RESTful
    # GET /business/licenses/ - List licenses
    # POST /business/licenses/ - Create license application
    path('licenses/', views_licenses.list_licenses_view, name='licenses_list'),
    
    # Business Complaints - RESTful
    # GET /business/complaints/ - List complaints
    # POST /business/complaints/ - Create complaint
    # GET /business/complaints/<id>/ - Get complaint details
    # PATCH /business/complaints/<id>/ - Update complaint (government only)
    path('complaints/', views_complaints.list_business_complaints_view, name='complaints_list'),
    path('complaints/<int:complaint_id>/', views_complaints.business_complaint_detail_view, name='complaint_detail'),
    
    # Government Review (for government officials) - RESTful
    # GET /business/applications/?status=pending - List pending applications
    # PATCH /business/licenses/<id>/ - Review/approve/reject license
    path('applications/', views_licenses.list_pending_applications_view, name='applications_list'),
    path('licenses/<int:license_id>/', views_licenses.review_license_application_view, name='license_detail'),
    
    # Business Feedback - RESTful
    # POST /business/feedback/ - Create feedback
    path('feedback/', views_feedback.create_business_feedback_view, name='feedback_create'),
    
    # Business Events - RESTful
    # GET /business/events/ - List events
    # POST /business/events/ - Create event
    # PATCH /business/events/<id>/ - Review/approve/reject event (government)
    # POST /business/events/<id>/registrations/ - Register for event
    # GET /business/events/<id>/registrations/ - List event registrations
    path('events/', views_events.list_business_events_view, name='events_list'),
    path('events/<int:event_id>/', views_events.review_business_event_view, name='event_detail'),
    path('events/<int:event_id>/registrations/', views_events.register_for_event_view, name='event_registrations'),
    
    # Business Services - RESTful
    # GET /business/services/ - List services
    # POST /business/services/ - Create service
    # POST /business/service-bookings/ - Book a service
    path('services/', views_services.list_business_services_view, name='services_list'),
    path('service-bookings/', views_services.create_service_booking_view, name='service_bookings_create'),
    
    # Citizen Feedback on Businesses - RESTful
    # POST /business/business-feedback/ - Create feedback on business
    path('business-feedback/', views_feedback.create_citizen_business_feedback_view, name='business_feedback_create'),
    
    # Business Notifications - RESTful
    # GET /business/notifications/ - List notifications
    # PATCH /business/notifications/<id>/ - Mark notification as read
    path('notifications/', views_notifications.list_business_notifications_view, name='notifications_list'),
    path('notifications/<int:notification_id>/', views_notifications.mark_business_notification_read_view, name='notification_detail'),
]

