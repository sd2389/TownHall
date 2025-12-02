from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile with user data"""
    email = serializers.EmailField(source='user.email', read_only=True)
    firstName = serializers.CharField(source='user.first_name', read_only=True)
    lastName = serializers.CharField(source='user.last_name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'role', 'phone_number', 'town', 'is_approved',
            'approved_by', 'approved_at', 'created_at', 'updated_at',
            'email', 'firstName', 'lastName', 'username'
        ]
        read_only_fields = [
            'id', 'approved_by', 'approved_at', 'created_at', 'updated_at'
        ]


class LoginSerializer(serializers.Serializer):
    """Serializer for login endpoint"""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        style={'input_type': 'password'},
        write_only=True
    )
    userType = serializers.ChoiceField(
        choices=['citizen', 'business', 'government'],
        required=True
    )


class SignupSerializer(serializers.Serializer):
    """Serializer for signup endpoint"""
    # Basic fields
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        min_length=8,
        style={'input_type': 'password'},
        write_only=True
    )
    firstName = serializers.CharField(required=True, max_length=150)
    lastName = serializers.CharField(required=True, max_length=150)
    phone = serializers.CharField(required=False, allow_blank=True, max_length=15)
    userType = serializers.ChoiceField(
        choices=['citizen', 'business', 'government'],
        required=True
    )
    townId = serializers.IntegerField(required=True)
    
    # Address fields (required for citizen and business, optional for government)
    streetAddress = serializers.CharField(required=False, allow_blank=True)
    aptSuite = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    zipCode = serializers.CharField(required=False, allow_blank=True)
    
    # Citizen specific
    dateOfBirth = serializers.DateField(required=False, allow_null=True)
    
    # Business specific
    businessName = serializers.CharField(required=False, allow_blank=True)
    businessType = serializers.CharField(required=False, allow_blank=True)
    businessRegistrationNumber = serializers.CharField(required=False, allow_blank=True)
    businessAddress = serializers.CharField(required=False, allow_blank=True)
    website = serializers.URLField(required=False, allow_blank=True)
    
    # Government specific
    employeeId = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    position = serializers.CharField(required=False, allow_blank=True)
    officeAddress = serializers.CharField(required=False, allow_blank=True)
    
    def validate_email(self, value):
        """Check if email already exists"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return value.lower()
    
    def validate(self, attrs):
        """Validate user type specific fields"""
        user_type = attrs.get('userType')
        
        if user_type == 'business':
            if not attrs.get('businessName'):
                raise serializers.ValidationError({
                    'businessName': 'Business name is required for business accounts.'
                })
            # Business and citizen require address fields
            if not attrs.get('streetAddress'):
                raise serializers.ValidationError({
                    'streetAddress': 'Street address is required for business accounts.'
                })
            if not attrs.get('city'):
                raise serializers.ValidationError({
                    'city': 'City is required for business accounts.'
                })
            if not attrs.get('state'):
                raise serializers.ValidationError({
                    'state': 'State is required for business accounts.'
                })
            if not attrs.get('zipCode'):
                raise serializers.ValidationError({
                    'zipCode': 'ZIP code is required for business accounts.'
                })
        
        elif user_type == 'citizen':
            # Citizen requires address fields
            if not attrs.get('streetAddress'):
                raise serializers.ValidationError({
                    'streetAddress': 'Street address is required for citizen accounts.'
                })
            if not attrs.get('city'):
                raise serializers.ValidationError({
                    'city': 'City is required for citizen accounts.'
                })
            if not attrs.get('state'):
                raise serializers.ValidationError({
                    'state': 'State is required for citizen accounts.'
                })
            if not attrs.get('zipCode'):
                raise serializers.ValidationError({
                    'zipCode': 'ZIP code is required for citizen accounts.'
                })
        
        elif user_type == 'government':
            if not attrs.get('employeeId'):
                raise serializers.ValidationError({
                    'employeeId': 'Employee ID is required for government accounts.'
                })
            # Government users don't require address fields (they use officeAddress)
        
        return attrs


class PendingUserSerializer(serializers.Serializer):
    """Serializer for pending users list"""
    user_id = serializers.IntegerField()
    email = serializers.EmailField()
    firstName = serializers.CharField()
    lastName = serializers.CharField()
    role = serializers.CharField()
    created_at = serializers.DateTimeField()






