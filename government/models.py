from django.db import models
from django.contrib.auth.models import User


class GovernmentOfficial(models.Model):
    """Profile model for government officials"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, blank=True)
    office_address = models.TextField(blank=True)
    town = models.ForeignKey('towns.Town', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Permissions granted by admin
    can_view_users = models.BooleanField(
        default=False,
        help_text="If True, this government official can view and manage citizen/business owner details"
    )
    can_approve_users = models.BooleanField(
        default=False,
        help_text="If True, this government official can approve/reject citizens and business owners from their town"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.position}"


class Department(models.Model):
    """Model for government departments"""
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField()
    head = models.ForeignKey(GovernmentOfficial, on_delete=models.SET_NULL, null=True, blank=True, related_name='headed_departments')
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name


class Position(models.Model):
    """Model for government positions/job titles"""
    name = models.CharField(max_length=200)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='positions')
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['department', 'name']
        unique_together = [['name', 'department']]
    
    def __str__(self):
        return f"{self.name} - {self.department.name}"


class Service(models.Model):
    """Model for government services"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('maintenance', 'Under Maintenance'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='active')
    processing_time = models.CharField(max_length=100, blank=True)
    requirements = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.department.name}"


class Announcement(models.Model):
    """Model for government announcements"""
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    TYPE_CHOICES = [
        ('event', 'Event'),
        ('alert', 'Alert'),
        ('meeting', 'Meeting'),
        ('policy', 'Policy'),
    ]
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    description = models.TextField(blank=True, help_text="Short description for preview")
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    town = models.ForeignKey('towns.Town', on_delete=models.CASCADE, related_name='announcements', null=True, blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='alert')
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(GovernmentOfficial, on_delete=models.CASCADE)
    views = models.IntegerField(default=0)
    tags = models.JSONField(default=list, blank=True, help_text="List of tags")
    expiry_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.department.name}"


class ComplaintResponse(models.Model):
    """Model for government responses to complaints"""
    complaint_id = models.CharField(max_length=50)  # Reference to citizen or business complaint
    complaint_type = models.CharField(max_length=20)  # 'citizen' or 'business'
    official = models.ForeignKey(GovernmentOfficial, on_delete=models.CASCADE)
    response_text = models.TextField()
    status = models.CharField(max_length=20, default='responded')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Response to {self.complaint_type} complaint #{self.complaint_id}"


class AnnouncementQuestion(models.Model):
    """Model for citizen questions about announcements"""
    announcement = models.ForeignKey(Announcement, on_delete=models.CASCADE, related_name='questions')
    citizen = models.ForeignKey('citizen.CitizenProfile', on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField(blank=True, null=True)
    answered_by = models.ForeignKey(GovernmentOfficial, on_delete=models.SET_NULL, null=True, blank=True, related_name='answered_questions')
    answered_at = models.DateTimeField(null=True, blank=True)
    is_answered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Question on {self.announcement.title} by {self.citizen.user.get_full_name()}"