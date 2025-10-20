from django.contrib import admin
from .models import BusinessOwnerProfile, BusinessLicense, BusinessComplaint, BusinessFeedback


@admin.register(BusinessOwnerProfile)
class BusinessOwnerProfileAdmin(admin.ModelAdmin):
    list_display = ['business_name', 'user', 'business_type', 'created_at']
    list_filter = ['business_type', 'created_at']
    search_fields = ['business_name', 'user__username', 'business_registration_number']


@admin.register(BusinessLicense)
class BusinessLicenseAdmin(admin.ModelAdmin):
    list_display = ['license_type', 'business_owner', 'status', 'issue_date', 'expiry_date']
    list_filter = ['status', 'license_type', 'issue_date']
    search_fields = ['license_type', 'license_number', 'business_owner__business_name']


@admin.register(BusinessComplaint)
class BusinessComplaintAdmin(admin.ModelAdmin):
    list_display = ['title', 'business_owner', 'category', 'priority', 'status', 'created_at']
    list_filter = ['status', 'priority', 'category', 'created_at']
    search_fields = ['title', 'description', 'business_owner__business_name']


@admin.register(BusinessFeedback)
class BusinessFeedbackAdmin(admin.ModelAdmin):
    list_display = ['service_name', 'business_owner', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['service_name', 'feedback_text', 'business_owner__business_name']