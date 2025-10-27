from django.db import models
from django.contrib.auth.models import User


class Town(models.Model):
    """Model for towns in the TownHall system"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    state = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    zip_codes = models.JSONField(default=list, blank=True, help_text="List of ZIP codes for this town")
    
    # Emergency contacts
    emergency_police = models.CharField(max_length=20, default='911', help_text="Police emergency number")
    emergency_fire = models.CharField(max_length=20, default='911', help_text="Fire department emergency number")
    emergency_medical = models.CharField(max_length=20, default='911', help_text="Medical/EMS emergency number")
    emergency_non_urgent = models.CharField(max_length=20, blank=True, help_text="Non-urgent dispatch number")
    emergency_dispatch = models.CharField(max_length=20, blank=True, help_text="Emergency dispatch number")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Towns'
    
    def __str__(self):
        return f"{self.name}, {self.state}"


class TownChangeRequest(models.Model):
    """Model for town change requests from citizens and businesses"""
    STATUS_CHOICES = [
        ('pending', 'Pending Current Town Approval'),
        ('approved_current', 'Approved by Current Town'),
        ('approved_new', 'Approved by New Town'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='town_change_requests')
    current_town = models.ForeignKey(Town, on_delete=models.CASCADE, related_name='outgoing_requests')
    requested_town = models.ForeignKey(Town, on_delete=models.CASCADE, related_name='incoming_requests')
    billing_address = models.JSONField(help_text="Structured billing address for verification")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True)
    
    requested_at = models.DateTimeField(auto_now_add=True)
    approved_by_current_town = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='approved_outgoing_town_changes'
    )
    approved_by_new_town = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='approved_incoming_town_changes'
    )
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-requested_at']
        verbose_name_plural = 'Town Change Requests'
    
    def __str__(self):
        return f"{self.user.username} - {self.current_town.name} to {self.requested_town.name}"
    
    def approve_by_current_town(self, approver):
        """Approve by current town's government"""
        from django.utils import timezone
        self.status = 'approved_current'
        self.approved_by_current_town = approver
        self.save()
    
    def approve_by_new_town(self, approver):
        """Approve by new town's government and complete the change"""
        from django.utils import timezone
        self.status = 'approved_new'
        self.approved_by_new_town = approver
        self.completed_at = timezone.now()
        self.save()
    
    def reject(self, reason, rejected_by):
        """Reject the town change request"""
        self.status = 'rejected'
        self.rejection_reason = reason
        self.save()
