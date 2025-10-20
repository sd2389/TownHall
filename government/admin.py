from django.contrib import admin
from .models import GovernmentOfficial, Department, Service, Announcement, ComplaintResponse


@admin.register(GovernmentOfficial)
class GovernmentOfficialAdmin(admin.ModelAdmin):
    list_display = ['user', 'employee_id', 'department', 'position', 'created_at']
    list_filter = ['department', 'position', 'created_at']
    search_fields = ['user__username', 'user__email', 'employee_id']


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'head', 'contact_email', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'department', 'status', 'created_at']
    list_filter = ['status', 'department', 'created_at']
    search_fields = ['name', 'description']


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'department', 'priority', 'is_published', 'created_at']
    list_filter = ['priority', 'is_published', 'department', 'created_at']
    search_fields = ['title', 'content']


@admin.register(ComplaintResponse)
class ComplaintResponseAdmin(admin.ModelAdmin):
    list_display = ['complaint_id', 'complaint_type', 'official', 'status', 'created_at']
    list_filter = ['complaint_type', 'status', 'created_at']
    search_fields = ['complaint_id', 'response_text']