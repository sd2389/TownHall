from django.urls import path
from . import (
    views_departments,
    views_positions,
    views_announcements,
    views_questions,
    views_officials,
)

urlpatterns = [
    # Departments - RESTful
    # GET /government/departments/ - List departments
    # POST /government/departments/ - Create department
    # GET /government/departments/<id>/ - Get department
    # PATCH/PUT /government/departments/<id>/ - Update department
    # DELETE /government/departments/<id>/ - Delete department
    path('departments/', views_departments.list_departments_view, name='departments_list'),
    path('departments/<int:department_id>/', views_departments.update_department_view, name='department_detail'),
    
    # Positions - RESTful
    # GET /government/positions/ - List positions
    # POST /government/positions/ - Create position
    path('positions/', views_positions.list_positions_view, name='positions_list'),
    
    # Announcements - RESTful
    # GET /government/announcements/ - List announcements
    # POST /government/announcements/ - Create announcement
    # GET /government/announcements/<id>/ - Get announcement
    # PATCH/PUT /government/announcements/<id>/ - Update announcement
    # DELETE /government/announcements/<id>/ - Delete announcement
    path('announcements/', views_announcements.list_announcements_view, name='announcements_list'),
    path('announcements/<int:announcement_id>/', views_announcements.update_announcement_view, name='announcement_detail'),
    
    # Questions - RESTful
    # GET /government/announcements/<id>/questions/ - List questions
    # POST /government/announcements/<id>/questions/ - Create question
    # POST /government/announcements/<id>/questions/<id>/answers/ - Answer question
    path('announcements/<int:announcement_id>/questions/', views_questions.list_announcement_questions_view, name='announcement_questions_list'),
    path('announcements/<int:announcement_id>/questions/<int:question_id>/answers/', views_questions.answer_announcement_question_view, name='question_answer_create'),
    
    # Government Officials - RESTful
    # GET /government/officials/ - List officials
    # GET /government/officials/<id>/ - Get official
    # PATCH /government/officials/<id>/ - Update official permissions
    path('officials/', views_officials.list_government_officials_view, name='officials_list'),
    path('officials/<int:official_id>/', views_officials.update_government_official_permissions_view, name='official_detail'),
]

