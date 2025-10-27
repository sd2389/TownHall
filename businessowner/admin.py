from django.contrib import admin
from .models import BusinessOwnerProfile, BusinessLicense, BusinessComplaint, BusinessFeedback


@admin.register(BusinessOwnerProfile)
class BusinessOwnerProfileAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'business_registration_number', 'business_type', 'town_display', 'created_at')
    list_filter = ('business_type', 'created_at')
    search_fields = ('business_name', 'business_registration_number', 'user__email', 'phone_number')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Business Information', {
            'fields': ('user', 'business_name', 'business_registration_number', 'business_type', 'phone_number')
        }),
        ('Addresses', {
            'fields': ('business_address', 'billing_address')
        }),
        ('Contact', {
            'fields': ('website',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def town_display(self, obj):
        """Display town information"""
        if hasattr(obj.user, 'userprofile') and obj.user.userprofile.town:
            return obj.user.userprofile.town.name
        return "Not assigned"
    town_display.short_description = 'Town'


@admin.register(BusinessLicense)
class BusinessLicenseAdmin(admin.ModelAdmin):
    list_display = ('license_type', 'business_owner', 'license_number', 'status', 'issue_date', 'expiry_date')
    list_filter = ('status', 'license_type', 'issue_date', 'expiry_date')
    search_fields = ('license_type', 'license_number', 'business_owner__business_name', 'business_owner__business_registration_number')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'issue_date'
    ordering = ('-created_at',)
    
    fieldsets = (
        ('License Information', {
            'fields': ('business_owner', 'license_type', 'license_number', 'description')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Dates', {
            'fields': ('issue_date', 'expiry_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_licenses', 'reject_licenses', 'mark_expired']
    
    def approve_licenses(self, request, queryset):
        """Bulk approve licenses"""
        count = queryset.update(status='approved')
        self.message_user(request, f"{count} licenses approved.")
    approve_licenses.short_description = "Approve selected licenses"
    
    def reject_licenses(self, request, queryset):
        """Bulk reject licenses"""
        count = queryset.update(status='rejected')
        self.message_user(request, f"{count} licenses rejected.")
    reject_licenses.short_description = "Reject selected licenses"
    
    def mark_expired(self, request, queryset):
        """Bulk mark licenses as expired"""
        count = queryset.update(status='expired')
        self.message_user(request, f"{count} licenses marked as expired.")
    mark_expired.short_description = "Mark selected as expired"


@admin.register(BusinessComplaint)
class BusinessComplaintAdmin(admin.ModelAdmin):
    list_display = ('title', 'business_owner', 'category', 'priority', 'status', 'created_at')
    list_filter = ('status', 'priority', 'category', 'created_at')
    search_fields = ('title', 'description', 'business_owner__business_name')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Complaint Information', {
            'fields': ('business_owner', 'title', 'description', 'category')
        }),
        ('Status', {
            'fields': ('priority', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(BusinessFeedback)
class BusinessFeedbackAdmin(admin.ModelAdmin):
    list_display = ('service_name', 'business_owner', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('service_name', 'business_owner__business_name', 'feedback_text')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
