from django.contrib import admin
from .models import CitizenProfile, CitizenComplaint, CitizenFeedback


@admin.register(CitizenProfile)
class CitizenProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'citizen_id', 'phone_number', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'user__email', 'citizen_id']


@admin.register(CitizenComplaint)
class CitizenComplaintAdmin(admin.ModelAdmin):
    list_display = ['title', 'citizen', 'category', 'priority', 'status', 'created_at']
    list_filter = ['status', 'priority', 'category', 'created_at']
    search_fields = ['title', 'description', 'citizen__user__username']


@admin.register(CitizenFeedback)
class CitizenFeedbackAdmin(admin.ModelAdmin):
    list_display = ['service_name', 'citizen', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['service_name', 'feedback_text', 'citizen__user__username']