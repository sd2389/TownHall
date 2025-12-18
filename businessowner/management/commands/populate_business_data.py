"""
Django management command to populate sample business licenses and permits data
Usage: python manage.py populate_business_data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import date, timedelta
from businessowner.models import BusinessOwnerProfile, BusinessLicense
from authentication.models import UserProfile
import random


class Command(BaseCommand):
    help = 'Populate sample business licenses and permits data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing licenses before adding new ones',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing licenses...')
            BusinessLicense.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Cleared existing licenses'))

        # Get all business owners
        business_profiles = BusinessOwnerProfile.objects.all()
        
        if not business_profiles.exists():
            self.stdout.write(
                self.style.WARNING('No business owners found. Please create business owners first.')
            )
            return

        # Sample license types and permits
        license_types = [
            {
                'license_type': 'Business Operating License',
                'description': 'General business operating license required for all commercial establishments',
                'fee': 250.00,
                'renewal_required': True,
                'status': 'approved',
                'expiry_days': 365
            },
            {
                'license_type': 'Food Service Permit',
                'description': 'Permit required for restaurants, cafes, and food service establishments',
                'fee': 150.00,
                'renewal_required': True,
                'status': 'approved',
                'expiry_days': 365
            },
            {
                'license_type': 'Retail License',
                'description': 'License for retail stores and shops',
                'fee': 200.00,
                'renewal_required': True,
                'status': 'approved',
                'expiry_days': 365
            },
            {
                'license_type': 'Construction Permit',
                'description': 'Permit for construction and renovation projects',
                'fee': 500.00,
                'renewal_required': False,
                'status': 'pending',
                'expiry_days': None
            },
            {
                'license_type': 'Sign Permit',
                'description': 'Permit for business signs and outdoor advertising',
                'fee': 75.00,
                'renewal_required': False,
                'status': 'approved',
                'expiry_days': 730
            },
            {
                'license_type': 'Liquor License',
                'description': 'License for selling alcoholic beverages',
                'fee': 1000.00,
                'renewal_required': True,
                'status': 'approved',
                'expiry_days': 365
            },
            {
                'license_type': 'Health Department Permit',
                'description': 'Health and safety compliance permit',
                'fee': 300.00,
                'renewal_required': True,
                'status': 'approved',
                'expiry_days': 365
            },
            {
                'license_type': 'Parking Lot Permit',
                'description': 'Permit for commercial parking lots',
                'fee': 400.00,
                'renewal_required': True,
                'status': 'pending',
                'expiry_days': None
            },
            {
                'license_type': 'Special Event Permit',
                'description': 'Temporary permit for special events and festivals',
                'fee': 100.00,
                'renewal_required': False,
                'status': 'approved',
                'expiry_days': 30
            },
            {
                'license_type': 'Home Occupation Permit',
                'description': 'Permit for operating a business from home',
                'fee': 50.00,
                'renewal_required': True,
                'status': 'rejected',
                'expiry_days': None
            }
        ]

        created_count = 0
        for business_profile in business_profiles:
            # Create 2-4 licenses per business
            num_licenses = random.randint(2, 4)
            selected_licenses = random.sample(license_types, min(num_licenses, len(license_types)))
            
            for license_data in selected_licenses:
                # Generate unique license number
                license_number = f"LIC-{business_profile.id:04d}-{random.randint(1000, 9999)}"
                
                # Check if license number already exists
                while BusinessLicense.objects.filter(license_number=license_number).exists():
                    license_number = f"LIC-{business_profile.id:04d}-{random.randint(1000, 9999)}"
                
                # Set dates based on status
                issue_date = None
                expiry_date = None
                if license_data['status'] == 'approved':
                    issue_date = date.today() - timedelta(days=random.randint(0, 180))
                    if license_data['expiry_days']:
                        expiry_date = issue_date + timedelta(days=license_data['expiry_days'])
                        # Some licenses might be expired
                        if random.random() < 0.2:  # 20% chance of expired
                            expiry_date = date.today() - timedelta(days=random.randint(1, 90))
                            license_data['status'] = 'expired'
                
                # Randomly set fee_paid
                fee_paid = random.choice([True, True, True, False])  # 75% paid
                
                # Create license
                license_obj = BusinessLicense.objects.create(
                    business_owner=business_profile,
                    license_type=license_data['license_type'],
                    license_number=license_number,
                    status=license_data['status'],
                    issue_date=issue_date,
                    expiry_date=expiry_date,
                    description=license_data['description'],
                    fee=license_data['fee'],
                    fee_paid=fee_paid,
                    renewal_required=license_data['renewal_required'],
                    attachments=[]  # Empty attachments for now
                )
                
                created_count += 1
                self.stdout.write(
                    f'Created {license_data["license_type"]} for {business_profile.business_name}'
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSuccessfully created {created_count} business licenses/permits'
            )
        )







