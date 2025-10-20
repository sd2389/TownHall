from django.db import models
from django.contrib.auth.models import User


class GovernmentOfficial(models.Model):
    """Profile model for government officials"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, blank=True)
    office_address = models.TextField()
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
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(GovernmentOfficial, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
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