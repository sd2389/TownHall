from django.db import models
from django.contrib.auth.models import User


class CitizenProfile(models.Model):
    """Profile model for citizens in the townhall system"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    citizen_id = models.CharField(max_length=20, unique=True)
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    billing_address = models.JSONField(default=dict, blank=True, help_text="Structured billing address")
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.citizen_id}"


class CitizenComplaint(models.Model):
    """Model for citizen complaints and issues"""
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
    
    citizen = models.ForeignKey(CitizenProfile, on_delete=models.CASCADE)
    town = models.ForeignKey('towns.Town', on_delete=models.CASCADE, related_name='citizen_complaints', null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    location = models.CharField(max_length=200, blank=True, help_text="Location of the issue")
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    assigned_to = models.CharField(max_length=200, blank=True, help_text="Department or person assigned")
    estimated_resolution = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.citizen.user.get_full_name()}"


class ComplaintAttachment(models.Model):
    """Model for complaint media attachments (images, documents, etc.)"""
    complaint = models.ForeignKey(CitizenComplaint, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='complaints/%Y/%m/%d/')
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50, help_text="MIME type or file extension")
    file_size = models.IntegerField(help_text="File size in bytes")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.file_name} - {self.complaint.title}"


class ComplaintComment(models.Model):
    """Model for comments/updates on complaints by government officials"""
    complaint = models.ForeignKey(CitizenComplaint, on_delete=models.CASCADE, related_name='comments')
    official = models.ForeignKey('government.GovernmentOfficial', on_delete=models.CASCADE, null=True, blank=True)
    comment_text = models.TextField()
    is_notification = models.BooleanField(default=False, help_text="Whether this comment should notify the citizen")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Comment on {self.complaint.title} by {self.official.user.get_full_name() if self.official else 'System'}"


class CitizenNotification(models.Model):
    """Model for notifications sent to citizens"""
    NOTIFICATION_TYPE_CHOICES = [
        ('complaint_update', 'Complaint Update'),
        ('announcement', 'Announcement'),
        ('general', 'General'),
    ]
    
    citizen = models.ForeignKey(CitizenProfile, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES, default='complaint_update')
    title = models.CharField(max_length=200)
    message = models.TextField()
    complaint = models.ForeignKey(CitizenComplaint, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['citizen', '-created_at']),
            models.Index(fields=['is_read']),
        ]
    
    def __str__(self):
        return f"Notification for {self.citizen.user.username} - {self.title}"


class CitizenFeedback(models.Model):
    """Model for citizen feedback on government services"""
    citizen = models.ForeignKey(CitizenProfile, on_delete=models.CASCADE)
    service_name = models.CharField(max_length=200)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    feedback_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.service_name} - {self.rating}/5"