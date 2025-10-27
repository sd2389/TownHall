from django.contrib import admin
from .models import GovernmentOfficial, Department, Service, Announcement, ComplaintResponse


@admin.register(GovernmentOfficial)
class GovernmentOfficialAdmin(admin.ModelAdmin):
    list_display = ('user', 'employee_id', 'department', 'position', 'town', 'created_at')
    list_filter = ('department', 'position', 'town', 'created_at')
    search_fields = ('employee_id', 'user__email', 'user__first_name', 'user__last_name', 'department', 'position')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Official Information', {
            'fields': ('user', 'employee_id', 'department', 'position')
        }),
        ('Contact', {
            'fields': ('phone_number', 'office_address', 'town')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class ServiceInline(admin.TabularInline):
    model = Service
    extra = 1
    fields = ('name', 'status', 'processing_time')


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'head', 'contact_email', 'contact_phone', 'created_at')
    search_fields = ('name', 'description', 'contact_email', 'contact_phone')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [ServiceInline]
    
    fieldsets = (
        ('Department Information', {
            'fields': ('name', 'description', 'head')
        }),
        ('Contact', {
            'fields': ('contact_email', 'contact_phone')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'department', 'status', 'processing_time', 'created_at')
    list_filter = ('status', 'department', 'created_at')
    search_fields = ('name', 'description', 'department__name')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('department', 'name')
    
    fieldsets = (
        ('Service Information', {
            'fields': ('name', 'description', 'department', 'status')
        }),
        ('Details', {
            'fields': ('processing_time', 'requirements')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['activate_services', 'deactivate_services']
    
    def activate_services(self, request, queryset):
        """Bulk activate services"""
        count = queryset.update(status='active')
        self.message_user(request, f"{count} services activated.")
    activate_services.short_description = "Activate selected services"
    
    def deactivate_services(self, request, queryset):
        """Bulk deactivate services"""
        count = queryset.update(status='inactive')
        self.message_user(request, f"{count} services deactivated.")
    deactivate_services.short_description = "Deactivate selected services"


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title', 'department', 'priority', 'is_published', 'created_by', 'created_at')
    list_filter = ('is_published', 'priority', 'department', 'created_at')
    search_fields = ('title', 'content', 'department__name')
    readonly_fields = ('created_at', 'updated_at', 'published_at')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Announcement Information', {
            'fields': ('title', 'content', 'department', 'priority')
        }),
        ('Publication', {
            'fields': ('is_published', 'published_at', 'created_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['publish_announcements', 'unpublish_announcements']
    
    def publish_announcements(self, request, queryset):
        """Bulk publish announcements"""
        from django.utils import timezone
        updated = queryset.update(is_published=True, published_at=timezone.now())
        self.message_user(request, f"{updated} announcements published.")
    publish_announcements.short_description = "Publish selected announcements"
    
    def unpublish_announcements(self, request, queryset):
        """Bulk unpublish announcements"""
        count = queryset.update(is_published=False, published_at=None)
        self.message_user(request, f"{count} announcements unpublished.")
    unpublish_announcements.short_description = "Unpublish selected announcements"


@admin.register(ComplaintResponse)
class ComplaintResponseAdmin(admin.ModelAdmin):
    list_display = ('complaint_id', 'complaint_type', 'official', 'status', 'created_at')
    list_filter = ('complaint_type', 'status', 'created_at')
    search_fields = ('complaint_id', 'response_text', 'official__user__email')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
