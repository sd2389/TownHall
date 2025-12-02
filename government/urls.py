from django.urls import path
from . import views

urlpatterns = [
    path('departments/', views.list_departments_view, name='list_departments'),
    path('departments/create/', views.create_department_view, name='create_department'),
    path('departments/<int:department_id>/', views.update_department_view, name='update_department'),
    path('departments/<int:department_id>/delete/', views.delete_department_view, name='delete_department'),
    path('positions/', views.list_positions_view, name='list_positions'),
    path('positions/create/', views.create_position_view, name='create_position'),
    path('announcements/', views.list_announcements_view, name='list_announcements'),
    path('announcements/create/', views.create_announcement_view, name='create_announcement'),
    path('announcements/<int:announcement_id>/', views.update_announcement_view, name='update_announcement'),
    path('announcements/<int:announcement_id>/delete/', views.delete_announcement_view, name='delete_announcement'),
    path('announcements/<int:announcement_id>/questions/', views.list_announcement_questions_view, name='list_announcement_questions'),
    path('announcements/<int:announcement_id>/questions/create/', views.create_announcement_question_view, name='create_announcement_question'),
    path('announcements/questions/<int:question_id>/answer/', views.answer_announcement_question_view, name='answer_announcement_question'),
]

