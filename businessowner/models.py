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
    billing_address = models.JSONField(default=dict, blank=True, help_text="Structured billing address for verification")
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


class BusinessEvent(models.Model):
    """Model for business events that citizens can attend"""
    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    ]
    
    business_owner = models.ForeignKey(BusinessOwnerProfile, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    event_date = models.DateField()
    event_time = models.TimeField()
    location = models.CharField(max_length=200)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    max_attendees = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-event_date', '-event_time']
    
    def __str__(self):
        return f"{self.title} - {self.business_owner.business_name}"


class BusinessService(models.Model):
    """Model for business services that citizens can use"""
    business_owner = models.ForeignKey(BusinessOwnerProfile, on_delete=models.CASCADE)
    service_name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.service_name} - {self.business_owner.business_name}"


class CitizenBusinessFeedback(models.Model):
    """Model for citizen feedback on businesses"""
    citizen = models.ForeignKey('citizen.CitizenProfile', on_delete=models.CASCADE)
    business = models.ForeignKey(BusinessOwnerProfile, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    feedback_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['citizen', 'business']  # One feedback per citizen per business
    
    def __str__(self):
        return f"{self.business.business_name} - {self.rating}/5 by {self.citizen.user.get_full_name()}"


class EventRegistration(models.Model):
    """Model for citizen event registrations/RSVPs"""
    STATUS_CHOICES = [
        ('registered', 'Registered'),
        ('cancelled', 'Cancelled'),
        ('attended', 'Attended'),
    ]
    
    event = models.ForeignKey(BusinessEvent, on_delete=models.CASCADE, related_name='registrations')
    citizen = models.ForeignKey('citizen.CitizenProfile', on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='registered')
    registered_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-registered_at']
        unique_together = ['event', 'citizen']  # One registration per citizen per event
    
    def __str__(self):
        return f"{self.citizen.user.get_full_name()} - {self.event.title}"


class ServiceBooking(models.Model):
    """Model for citizen service bookings/appointments"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    service = models.ForeignKey(BusinessService, on_delete=models.CASCADE, related_name='bookings')
    citizen = models.ForeignKey('citizen.CitizenProfile', on_delete=models.CASCADE)
    booking_date = models.DateField()
    booking_time = models.TimeField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.citizen.user.get_full_name()} - {self.service.service_name} on {self.booking_date}"


class BusinessNotification(models.Model):
    """Model for notifications to business owners"""
    NOTIFICATION_TYPE_CHOICES = [
        ('application_approved', 'Application Approved'),
        ('application_rejected', 'Application Rejected'),
        ('event_approved', 'Event Approved'),
        ('event_rejected', 'Event Rejected'),
        ('complaint_response', 'Complaint Response'),
        ('booking_new', 'New Booking'),
        ('general', 'General'),
    ]
    
    business_owner = models.ForeignKey(BusinessOwnerProfile, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES, default='general')
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    related_license = models.ForeignKey(BusinessLicense, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    related_event = models.ForeignKey(BusinessEvent, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['business_owner', '-created_at']),
            models.Index(fields=['is_read']),
        ]
    
    def __str__(self):
        return f"Notification for {self.business_owner.business_name} - {self.title}"