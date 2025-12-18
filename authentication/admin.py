from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile, UserDocument


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'town', 'is_approved', 'created_at', 'updated_at')
    list_filter = ('role', 'is_approved', 'town', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'phone_number')
    readonly_fields = ('created_at', 'updated_at', 'approved_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'role', 'phone_number', 'town')
        }),
        ('Approval Status', {
            'fields': ('is_approved', 'approved_by', 'approved_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_users', 'reject_users']
    
    def approve_users(self, request, queryset):
        """Bulk approve users"""
        from django.utils import timezone
        queryset.update(
            is_approved=True,
            approved_by=request.user,
            approved_at=timezone.now()
        )
        self.message_user(request, f"{queryset.count()} users approved.")
    approve_users.short_description = "Approve selected users"
    
    def reject_users(self, request, queryset):
        """Bulk reject users"""
        count = queryset.count()
        queryset.update(is_approved=False)
        self.message_user(request, f"{count} users rejected.")
    reject_users.short_description = "Reject selected users"


@admin.register(UserDocument)
class UserDocumentAdmin(admin.ModelAdmin):
    list_display = ('user', 'document_type', 'file_name', 'file_size', 'uploaded_at')
    list_filter = ('document_type', 'uploaded_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'file_name')
    readonly_fields = ('uploaded_at', 'updated_at')
    ordering = ('-uploaded_at',)
    
    fieldsets = (
        ('Document Information', {
            'fields': ('user', 'document_type', 'description')
        }),
        ('File Information', {
            'fields': ('file', 'file_name', 'file_type', 'file_size')
        }),
        ('Timestamps', {
            'fields': ('uploaded_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
