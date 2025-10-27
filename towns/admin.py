from django.contrib import admin
from .models import Town, TownChangeRequest


@admin.register(Town)
class TownAdmin(admin.ModelAdmin):
    list_display = ('name', 'state', 'is_active', 'created_at')
    list_filter = ('is_active', 'state', 'created_at')
    search_fields = ('name', 'state', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'state', 'is_active')
        }),
        ('Location Details', {
            'fields': ('zip_codes',)
        }),
        ('Emergency Contacts', {
            'fields': ('emergency_police', 'emergency_fire', 'emergency_medical', 'emergency_non_urgent', 'emergency_dispatch'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')


@admin.register(TownChangeRequest)
class TownChangeRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'current_town', 'requested_town', 'status', 'requested_at')
    list_filter = ('status', 'current_town', 'requested_town', 'requested_at')
    search_fields = ('user__username', 'user__email', 'current_town__name', 'requested_town__name')
    readonly_fields = ('user', 'current_town', 'requested_town', 'billing_address', 'requested_at', 'approved_by_current_town', 'approved_by_new_town', 'completed_at')
    ordering = ('-requested_at',)
    
    fieldsets = (
        ('Request Information', {
            'fields': ('user', 'current_town', 'requested_town', 'billing_address')
        }),
        ('Status', {
            'fields': ('status', 'rejection_reason')
        }),
        ('Approval Details', {
            'fields': ('approved_by_current_town', 'approved_by_new_town', 'requested_at', 'completed_at')
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + ('status', 'rejection_reason')
        return self.readonly_fields
