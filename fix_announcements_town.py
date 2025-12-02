#!/usr/bin/env python
"""
Script to fix announcements that don't have a town assigned
Run this to assign towns to existing announcements
"""
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'townhall_project.settings')
django.setup()

from government.models import Announcement
from towns.models import Town

def fix_announcements_town():
    """Assign towns to announcements that don't have one"""
    # Get announcements without towns
    announcements = Announcement.objects.filter(town__isnull=True)
    
    if not announcements.exists():
        print("No announcements without towns found.")
        return
    
    print(f"Found {announcements.count()} announcements without towns")
    
    # List all towns
    towns = Town.objects.all()
    print("\nAvailable towns:")
    for town in towns:
        print(f"  ID: {town.id}, Name: {town.name}")
    
    # For now, assign to Secaucus (ID=1) if it exists
    # You can modify this to assign based on the creator's town or other logic
    try:
        default_town = Town.objects.get(id=1)  # Secaucus
        print(f"\nAssigning announcements to: {default_town.name} (ID: {default_town.id})")
        
        updated = announcements.update(town=default_town)
        print(f"Updated {updated} announcements")
        
        # Verify
        print("\nUpdated announcements:")
        for announcement in Announcement.objects.filter(town=default_town):
            print(f"  ID: {announcement.id}, Title: {announcement.title}, Town: {announcement.town.name}")
            
    except Town.DoesNotExist:
        print("Default town (ID=1) not found. Please assign towns manually.")

if __name__ == '__main__':
    fix_announcements_town()














