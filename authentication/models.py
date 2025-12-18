from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser


class UserProfile(models.Model):
    """Extended user profile with role information"""
    ROLE_CHOICES = [
        ('citizen', 'Citizen'),
        ('business', 'Business Owner'),
        ('government', 'Government Official'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=15, blank=True)
    town = models.ForeignKey('towns.Town', on_delete=models.SET_NULL, null=True, blank=True)
    is_approved = models.BooleanField(default=False)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_users')
    approved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.get_role_display()}"
    
    @property
    def is_citizen(self):
        return self.role == 'citizen'
    
    @property
    def is_business_owner(self):
        return self.role == 'business'
    
    @property
    def is_government_official(self):
        return self.role == 'government'


class UserDocument(models.Model):
    """Model for storing user-uploaded documents (ID documents, profile files, etc.)"""
    DOCUMENT_TYPE_CHOICES = [
        ('id_document', 'ID Document'),
        ('drivers_license', "Driver's License"),
        ('state_id', 'State ID'),
        ('passport', 'Passport'),
        ('government_id', 'Government ID'),
        ('business_document', 'Business Document'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPE_CHOICES, default='id_document')
    file = models.FileField(upload_to='user_documents/%Y/%m/%d/')
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50, help_text="MIME type or file extension")
    file_size = models.IntegerField(help_text="File size in bytes")
    description = models.TextField(blank=True, help_text="Optional description of the document")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['user', '-uploaded_at']),
            models.Index(fields=['document_type']),
        ]
    
    def __str__(self):
        return f"{self.file_name} - {self.user.get_full_name()}"