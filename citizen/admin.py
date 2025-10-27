from django.contrib import admin
from .models import CitizenProfile, CitizenComplaint, CitizenFeedback


@admin.register(CitizenProfile)
class CitizenProfileAdmin(admin.ModelAdmin):
    list_display = ('citizen_id', 'user', 'phone_number', 'town_display', 'date_of_birth', 'created_at')
    list_filter = ('created_at', 'date_of_birth')
    search_fields = ('citizen_id', 'user__email', 'user__first_name', 'user__last_name', 'phone_number', 'address')
    readonly_fields = ('citizen_id', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Citizen Information', {
            'fields': ('user', 'citizen_id', 'phone_number', 'date_of_birth')
        }),
        ('Address', {
            'fields': ('address', 'billing_address')
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


@admin.register(CitizenComplaint)
class CitizenComplaintAdmin(admin.ModelAdmin):
    list_display = ('title', 'citizen', 'category', 'priority', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'priority', 'category', 'created_at')
    search_fields = ('title', 'description', 'citizen__citizen_id', 'citizen__user__email')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Complaint Information', {
            'fields': ('citizen', 'title', 'description', 'category')
        }),
        ('Status', {
            'fields': ('priority', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_resolved', 'mark_as_closed']
    
    def mark_as_resolved(self, request, queryset):
        """Bulk mark complaints as resolved"""
        count = queryset.update(status='resolved')
        self.message_user(request, f"{count} complaints marked as resolved.")
    mark_as_resolved.short_description = "Mark selected as resolved"
    
    def mark_as_closed(self, request, queryset):
        """Bulk close complaints"""
        count = queryset.update(status='closed')
        self.message_user(request, f"{count} complaints closed.")
    mark_as_closed.short_description = "Close selected complaints"


@admin.register(CitizenFeedback)
class CitizenFeedbackAdmin(admin.ModelAdmin):
    list_display = ('service_name', 'citizen', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('service_name', 'citizen__user__email', 'feedback_text')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
