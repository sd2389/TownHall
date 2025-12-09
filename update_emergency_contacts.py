#!/usr/bin/env python
"""
Script to update emergency contacts for all towns with default national numbers
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'townhall_project.settings')
django.setup()

from towns.models import Town

def update_emergency_contacts():
    """Update all towns with default emergency contact numbers"""
    
    # Default national numbers
    defaults = {
        'emergency_poison_control': '1-800-222-1222',  # National Poison Control
        'emergency_mental_health': '988',  # National Suicide & Crisis Lifeline
    }
    
    towns = Town.objects.all()
    updated_count = 0
    
    for town in towns:
        updated = False
        
        # Set poison control if empty
        if not town.emergency_poison_control:
            town.emergency_poison_control = defaults['emergency_poison_control']
            updated = True
        
        # Set mental health if empty
        if not town.emergency_mental_health:
            town.emergency_mental_health = defaults['emergency_mental_health']
            updated = True
        
        if updated:
            town.save()
            updated_count += 1
            print(f"Updated emergency contacts for {town.name}")
    
    print(f"\nUpdated {updated_count} town(s) with default emergency contact numbers")
    print("Note: Services without universal numbers (Animal Control, Utilities, etc.)")
    print("      should be added manually through the Django admin for each town.")

if __name__ == '__main__':
    update_emergency_contacts()


















