from django.contrib import admin
from .models import (
    GovernmentOfficial, Department, Position, Service, Announcement, 
    ComplaintResponse, BillProposal, BillComment, BillVote
)


@admin.register(GovernmentOfficial)
class GovernmentOfficialAdmin(admin.ModelAdmin):
    list_display = ('user', 'employee_id', 'department', 'position', 'town', 'can_view_users', 'can_approve_users', 'created_at')
    list_filter = ('department', 'position', 'town', 'can_view_users', 'can_approve_users', 'created_at')
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
        ('Permissions', {
            'fields': ('can_view_users', 'can_approve_users'),
            'description': 'Grant permissions to this government official. can_view_users allows viewing citizen/business owner details. can_approve_users allows approving/rejecting users from their town.'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['grant_view_permission', 'revoke_view_permission', 'grant_approval_permission', 'revoke_approval_permission']
    
    def grant_view_permission(self, request, queryset):
        """Grant view permission to selected officials"""
        count = queryset.update(can_view_users=True)
        self.message_user(request, f"View permission granted to {count} official(s).")
    grant_view_permission.short_description = "Grant view permission to selected officials"
    
    def revoke_view_permission(self, request, queryset):
        """Revoke view permission from selected officials"""
        count = queryset.update(can_view_users=False)
        self.message_user(request, f"View permission revoked from {count} official(s).")
    revoke_view_permission.short_description = "Revoke view permission from selected officials"
    
    def grant_approval_permission(self, request, queryset):
        """Grant approval permission to selected officials"""
        count = queryset.update(can_approve_users=True)
        self.message_user(request, f"Approval permission granted to {count} official(s).")
    grant_approval_permission.short_description = "Grant approval permission to selected officials"
    
    def revoke_approval_permission(self, request, queryset):
        """Revoke approval permission from selected officials"""
        count = queryset.update(can_approve_users=False)
        self.message_user(request, f"Approval permission revoked from {count} official(s).")
    revoke_approval_permission.short_description = "Revoke approval permission from selected officials"


class PositionInline(admin.TabularInline):
    model = Position
    extra = 1
    fields = ('name', 'description', 'is_active')


class ServiceInline(admin.TabularInline):
    model = Service
    extra = 1
    fields = ('name', 'status', 'processing_time')


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'head', 'contact_email', 'contact_phone', 'created_at')
    search_fields = ('name', 'description', 'contact_email', 'contact_phone')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [PositionInline, ServiceInline]
    
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


@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ('name', 'department', 'is_active', 'created_at')
    list_filter = ('is_active', 'department', 'created_at')
    search_fields = ('name', 'description', 'department__name')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('department', 'name')
    
    fieldsets = (
        ('Position Information', {
            'fields': ('name', 'department', 'description', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['activate_positions', 'deactivate_positions']
    
    def activate_positions(self, request, queryset):
        """Bulk activate positions"""
        count = queryset.update(is_active=True)
        self.message_user(request, f"{count} positions activated.")
    activate_positions.short_description = "Activate selected positions"
    
    def deactivate_positions(self, request, queryset):
        """Bulk deactivate positions"""
        count = queryset.update(is_active=False)
        self.message_user(request, f"{count} positions deactivated.")
    deactivate_positions.short_description = "Deactivate selected positions"


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


@admin.register(BillProposal)
class BillProposalAdmin(admin.ModelAdmin):
    list_display = ('title', 'department', 'status', 'priority', 'support_count', 'oppose_count', 'created_by', 'created_at')
    list_filter = ('status', 'priority', 'department', 'created_at')
    search_fields = ('title', 'description', 'department__name')
    readonly_fields = ('created_at', 'updated_at', 'published_at', 'support_count', 'oppose_count', 'views', 'comment_count')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Bill Information', {
            'fields': ('title', 'description', 'summary', 'department', 'town', 'priority')
        }),
        ('Status', {
            'fields': ('status', 'published_at', 'review_deadline', 'implementation_date')
        }),
        ('Engagement', {
            'fields': ('support_count', 'oppose_count', 'views', 'comment_count')
        }),
        ('Metadata', {
            'fields': ('tags', 'attachments', 'created_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(BillComment)
class BillCommentAdmin(admin.ModelAdmin):
    list_display = ('bill', 'user', 'likes', 'created_at')
    list_filter = ('created_at', 'is_edited')
    search_fields = ('comment_text', 'bill__title', 'user__email')
    readonly_fields = ('created_at', 'updated_at', 'edited_at')
    ordering = ('-created_at',)


@admin.register(BillVote)
class BillVoteAdmin(admin.ModelAdmin):
    list_display = ('bill', 'user', 'vote_type', 'created_at')
    list_filter = ('vote_type', 'created_at')
    search_fields = ('bill__title', 'user__email')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
