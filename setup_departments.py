#!/usr/bin/env python
"""
Setup script to create example departments and positions
Run this to populate departments and positions for the signup form
"""
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'townhall_project.settings')
django.setup()

from government.models import Department, Position

def setup_departments_and_positions():
    """Create example departments and positions"""
    
    departments_data = [
        {
            'name': 'Public Works',
            'description': 'Responsible for infrastructure maintenance, road repairs, and public facilities management.',
            'contact_email': 'publicworks@city.gov',
            'contact_phone': '(555) 100-1000',
            'positions': [
                'Director of Public Works',
                'Deputy Director',
                'Road Maintenance Supervisor',
                'Infrastructure Engineer',
                'Maintenance Technician',
                'Fleet Manager',
                'Project Coordinator'
            ]
        },
        {
            'name': 'Parks & Recreation',
            'description': 'Manages public parks, recreational facilities, and community programs.',
            'contact_email': 'parks@city.gov',
            'contact_phone': '(555) 100-2000',
            'positions': [
                'Director of Parks & Recreation',
                'Recreation Program Manager',
                'Park Maintenance Supervisor',
                'Community Events Coordinator',
                'Sports Facility Manager',
                'Lifeguard Supervisor',
                'Park Ranger'
            ]
        },
        {
            'name': 'Public Safety',
            'description': 'Oversees police, fire, and emergency services coordination.',
            'contact_email': 'safety@city.gov',
            'contact_phone': '(555) 100-3000',
            'positions': [
                'Public Safety Director',
                'Police Chief',
                'Fire Chief',
                'Emergency Management Coordinator',
                'Safety Inspector',
                'Dispatch Supervisor',
                'Community Relations Officer'
            ]
        },
        {
            'name': 'Planning & Zoning',
            'description': 'Handles urban planning, zoning regulations, and building permits.',
            'contact_email': 'planning@city.gov',
            'contact_phone': '(555) 100-4000',
            'positions': [
                'Planning Director',
                'Zoning Administrator',
                'Urban Planner',
                'Building Inspector',
                'Permit Coordinator',
                'Code Enforcement Officer',
                'GIS Specialist'
            ]
        },
        {
            'name': 'Finance & Administration',
            'description': 'Manages city budget, accounting, and administrative operations.',
            'contact_email': 'finance@city.gov',
            'contact_phone': '(555) 100-5000',
            'positions': [
                'Finance Director',
                'Budget Analyst',
                'Accountant',
                'Payroll Administrator',
                'Procurement Officer',
                'Administrative Assistant',
                'Records Manager'
            ]
        },
        {
            'name': 'Environmental Services',
            'description': 'Oversees waste management, recycling, and environmental protection.',
            'contact_email': 'environment@city.gov',
            'contact_phone': '(555) 100-6000',
            'positions': [
                'Environmental Services Director',
                'Waste Management Supervisor',
                'Recycling Coordinator',
                'Environmental Inspector',
                'Sustainability Manager',
                'Sanitation Supervisor',
                'Environmental Technician'
            ]
        },
        {
            'name': 'City Administration',
            'description': 'Central administration and executive functions of the city government.',
            'contact_email': 'admin@city.gov',
            'contact_phone': '(555) 100-7000',
            'positions': [
                'City Manager',
                'Deputy City Manager',
                'City Clerk',
                'Executive Assistant',
                'Human Resources Director',
                'IT Director',
                'Communications Director'
            ]
        },
        {
            'name': 'Water & Sewer',
            'description': 'Manages water supply, wastewater treatment, and utility services.',
            'contact_email': 'water@city.gov',
            'contact_phone': '(555) 100-8000',
            'positions': [
                'Water & Sewer Director',
                'Water Treatment Plant Manager',
                'Distribution Supervisor',
                'Water Quality Specialist',
                'Maintenance Technician',
                'Customer Service Manager',
                'Utility Billing Coordinator'
            ]
        },
        {
            'name': 'Code Enforcement',
            'description': 'Enforces building codes, property maintenance standards, and city ordinances.',
            'contact_email': 'code@city.gov',
            'contact_phone': '(555) 100-9000',
            'positions': [
                'Code Enforcement Director',
                'Senior Code Enforcement Officer',
                'Code Enforcement Officer',
                'Housing Inspector',
                'Property Maintenance Inspector',
                'Compliance Coordinator',
                'Administrative Support'
            ]
        },
        {
            'name': 'Community Development',
            'description': 'Promotes economic development, housing programs, and community revitalization.',
            'contact_email': 'development@city.gov',
            'contact_phone': '(555) 101-0000',
            'positions': [
                'Community Development Director',
                'Economic Development Manager',
                'Housing Coordinator',
                'Grants Administrator',
                'Business Development Specialist',
                'Community Outreach Coordinator',
                'Program Manager'
            ]
        }
    ]
    
    created_count = 0
    position_count = 0
    
    for dept_data in departments_data:
        department, created = Department.objects.get_or_create(
            name=dept_data['name'],
            defaults={
                'description': dept_data['description'],
                'contact_email': dept_data['contact_email'],
                'contact_phone': dept_data['contact_phone'],
            }
        )
        
        if created:
            created_count += 1
            print(f"✓ Created department: {department.name}")
        else:
            print(f"  Department already exists: {department.name}")
        
        # Create positions for this department
        for position_name in dept_data['positions']:
            position, pos_created = Position.objects.get_or_create(
                name=position_name,
                department=department,
                defaults={
                    'description': f'{position_name} in {department.name}',
                    'is_active': True
                }
            )
            
            if pos_created:
                position_count += 1
    
    print("\n" + "="*60)
    print("DEPARTMENTS AND POSITIONS SETUP COMPLETE!")
    print("="*60)
    print(f"\nCreated {created_count} new departments")
    print(f"Created {position_count} new positions")
    print(f"\nTotal departments: {Department.objects.count()}")
    print(f"Total positions: {Position.objects.count()}")
    print("\nDepartments available for signup:")
    for dept in Department.objects.all().order_by('name'):
        pos_count = Position.objects.filter(department=dept, is_active=True).count()
        print(f"  - {dept.name} ({pos_count} positions)")
    print("="*60)

if __name__ == '__main__':
    setup_departments_and_positions()

