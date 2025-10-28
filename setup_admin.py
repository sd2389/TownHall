#!/usr/bin/env python
"""
Setup script to create initial admin and test data
Run this to set up the admin panel with initial data
"""
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'townhall_project.settings')
django.setup()

from django.contrib.auth.models import User
from authentication.models import UserProfile
from towns.models import Town
from government.models import GovernmentOfficial

def setup_admin():
    """Create superuser and initial data"""
    
    # Check if superuser exists
    if User.objects.filter(is_superuser=True).exists():
        print("✓ Superuser already exists")
        superuser = User.objects.filter(is_superuser=True).first()
        print(f"  Username: {superuser.username}")
        print(f"  Email: {superuser.email}")
    else:
        print("Creating superuser...")
        superuser = User.objects.create_superuser(
            username='admin',
            email='admin@townhall.com',
            password='admin123',
            first_name='Admin',
            last_name='User'
        )
        print(f"✓ Superuser created:")
        print(f"  Username: admin")
        print(f"  Email: admin@townhall.com")
        print(f"  Password: admin123")
    
    # Create example town if it doesn't exist
    if not Town.objects.exists():
        print("\nCreating example towns...")
        secaucus = Town.objects.create(
            name='Secaucus',
            slug='secaucus',
            state='NJ',
            is_active=True,
            zip_codes=['07094', '07096']
        )
        jersey_city = Town.objects.create(
            name='Jersey City',
            slug='jersey-city',
            state='NJ',
            is_active=True,
            zip_codes=['07302', '07304', '07305']
        )
        hoboken = Town.objects.create(
            name='Hoboken',
            slug='hoboken',
            state='NJ',
            is_active=True,
            zip_codes=['07030']
        )
        print("✓ Towns created:")
        print(f"  - {secaucus.name}, {secaucus.state}")
        print(f"  - {jersey_city.name}, {jersey_city.state}")
        print(f"  - {hoboken.name}, {hoboken.state}")
    else:
        print("\n✓ Towns already exist")
    
    # Create government official for Secaucus
    secaucus = Town.objects.filter(name='Secaucus').first()
    if secaucus and not GovernmentOfficial.objects.filter(town=secaucus).exists():
        print("\nCreating government official...")
        gov_user = User.objects.create_user(
            username='gov@secaucus.gov',
            email='gov@secaucus.gov',
            password='gov123',
            first_name='Government',
            last_name='Official'
        )
        UserProfile.objects.create(
            user=gov_user,
            role='government',
            phone_number='+1234567890',
            town=secaucus,
            is_approved=True
        )
        GovernmentOfficial.objects.create(
            user=gov_user,
            employee_id='GOV001',
            department='City Administration',
            position='Town Administrator',
            phone_number='+1234567890',
            office_address='1203 Paterson Plank Road, Secaucus, NJ 07094',
            town=secaucus
        )
        print("✓ Government official created:")
        print(f"  Username: gov@secaucus.gov")
        print(f"  Password: gov123")
        print(f"  Town: Secaucus")
    
    print("\n" + "="*60)
    print("ADMIN PANEL READY!")
    print("="*60)
    print("\nAccess the admin panel at: http://localhost:8000/admin")
    print("\nLogin credentials:")
    print(f"  Username: admin")
    print(f"  Password: admin123")
    print("\nGovernment Official credentials:")
    print(f"  Username: gov@secaucus.gov")
    print(f"  Password: gov123")
    print("\nFeatures available:")
    print("  - User approval and management")
    print("  - Town management")
    print("  - Complaint tracking")
    print("  - License management")
    print("  - Announcement publishing")
    print("  - Bulk actions on many sections")
    print("\nStart the server with:")
    print("  python manage.py runserver")
    print("="*60)

if __name__ == '__main__':
    setup_admin()


