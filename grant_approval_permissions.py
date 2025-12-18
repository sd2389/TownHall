#!/usr/bin/env python
"""
Script to grant approval permissions to government officials
Run this to grant can_approve_users permission to all government officials
or to specific officials by email
"""
import os
import django
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'townhall_project.settings')
django.setup()

from django.contrib.auth.models import User
from government.models import GovernmentOfficial

def grant_approval_permissions(email=None, all_officials=False):
    """
    Grant can_approve_users permission to government officials
    
    Args:
        email: Specific email to grant permission to (optional)
        all_officials: If True, grant permission to all officials
    """
    if email:
        try:
            user = User.objects.get(email=email)
            try:
                official = GovernmentOfficial.objects.get(user=user)
                if official.can_approve_users:
                    print(f"✓ {email} already has approval permission")
                else:
                    official.can_approve_users = True
                    official.save()
                    print(f"✓ Granted approval permission to {email}")
            except GovernmentOfficial.DoesNotExist:
                print(f"✗ No government official profile found for {email}")
                print(f"  Please ensure this user has a GovernmentOfficial profile")
        except User.DoesNotExist:
            print(f"✗ User with email {email} not found")
    
    elif all_officials:
        officials = GovernmentOfficial.objects.all()
        count = 0
        for official in officials:
            if not official.can_approve_users:
                official.can_approve_users = True
                official.save()
                count += 1
                print(f"✓ Granted approval permission to {official.user.email}")
        
        print(f"\n✓ Granted approval permission to {count} government official(s)")
        print(f"  Total officials: {officials.count()}")
        print(f"  Already had permission: {officials.count() - count}")
    
    else:
        print("Please specify either --email <email> or --all")
        print("\nUsage:")
        print("  python grant_approval_permissions.py --email user@example.com")
        print("  python grant_approval_permissions.py --all")
        return
    
    print("\n" + "="*60)
    print("PERMISSION GRANT COMPLETE!")
    print("="*60)

if __name__ == '__main__':
    if len(sys.argv) > 1:
        if '--all' in sys.argv:
            grant_approval_permissions(all_officials=True)
        elif '--email' in sys.argv:
            email_index = sys.argv.index('--email')
            if email_index + 1 < len(sys.argv):
                email = sys.argv[email_index + 1]
                grant_approval_permissions(email=email)
            else:
                print("✗ Error: --email requires an email address")
                print("Usage: python grant_approval_permissions.py --email user@example.com")
        else:
            print("✗ Unknown argument. Use --email <email> or --all")
    else:
        # Interactive mode
        print("="*60)
        print("GRANT APPROVAL PERMISSIONS TO GOVERNMENT OFFICIALS")
        print("="*60)
        print("\nOptions:")
        print("1. Grant permission to all government officials")
        print("2. Grant permission to a specific official by email")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == '1':
            confirm = input("\nGrant approval permission to ALL government officials? (yes/no): ").strip().lower()
            if confirm == 'yes':
                grant_approval_permissions(all_officials=True)
            else:
                print("Cancelled.")
        elif choice == '2':
            email = input("\nEnter the email address of the government official: ").strip()
            if email:
                grant_approval_permissions(email=email)
            else:
                print("✗ No email provided")
        else:
            print("Exiting...")










