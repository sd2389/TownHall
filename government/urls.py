from django.urls import path
from . import (
    views_departments,
    views_positions,
    views_announcements,
    views_questions,
    views_officials,
    views_bills,
    views_licenses,
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
    
    # Bill Proposals - RESTful
    # GET /government/bills/ - List bills
    # POST /government/bills/ - Create bill
    # GET /government/bills/<id>/ - Get bill
    # PATCH /government/bills/<id>/ - Update bill
    # DELETE /government/bills/<id>/ - Delete bill
    # GET /government/bills/<id>/comments/ - List comments
    # POST /government/bills/<id>/comments/ - Create comment
    # POST /government/bills/<id>/vote/ - Vote on bill
    # DELETE /government/bills/<id>/vote/ - Remove vote
    path('bills/', views_bills.bills_list_create_view, name='bills_list_create'),
    path('bills/<int:bill_id>/', views_bills.bill_detail_view, name='bill_detail'),
    path('bills/<int:bill_id>/comments/', views_bills.bill_comments_list_create_view, name='bill_comments_list_create'),
    path('bills/<int:bill_id>/vote/', views_bills.bill_vote_view, name='bill_vote'),
    path('bills/<int:bill_id>/vote/delete/', views_bills.bill_vote_delete_view, name='bill_vote_delete'),
    
    # Business Licenses & Permits - RESTful (Government Management)
    # GET /government/licenses/ - List all licenses (filtered by town)
    # GET /government/licenses/<id>/ - Get license details
    # PATCH /government/licenses/<id>/review/ - Review and approve/reject license
    # GET /government/licenses/statistics/ - Get license statistics
    path('licenses/', views_licenses.list_licenses_view, name='government_licenses_list'),
    path('licenses/<int:license_id>/', views_licenses.get_license_detail_view, name='government_license_detail'),
    path('licenses/<int:license_id>/review/', views_licenses.review_license_view, name='government_license_review'),
    path('licenses/statistics/', views_licenses.license_statistics_view, name='government_license_statistics'),
]

