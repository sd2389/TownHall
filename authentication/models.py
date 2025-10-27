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