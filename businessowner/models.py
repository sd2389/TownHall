from django.db import models
from django.contrib.auth.models import User


class BusinessOwnerProfile(models.Model):
    """Profile model for business owners in the townhall system"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    business_name = models.CharField(max_length=200)
    business_registration_number = models.CharField(max_length=50, unique=True)
    business_type = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, blank=True)
    business_address = models.TextField()
    website = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.business_name} - {self.user.get_full_name()}"


class BusinessLicense(models.Model):
    """Model for business licenses and permits"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    ]
    
    business_owner = models.ForeignKey(BusinessOwnerProfile, on_delete=models.CASCADE)
    license_type = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    issue_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.license_type} - {self.business_owner.business_name}"


class BusinessComplaint(models.Model):
    """Model for business-related complaints and issues"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    business_owner = models.ForeignKey(BusinessOwnerProfile, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.business_owner.business_name}"


class BusinessFeedback(models.Model):
    """Model for business feedback on government services"""
    business_owner = models.ForeignKey(BusinessOwnerProfile, on_delete=models.CASCADE)
    service_name = models.CharField(max_length=200)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    feedback_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.service_name} - {self.rating}/5"