from django.urls import path
from .views import *

urlpatterns = [
    path('categories/', CategoryListView.as_view()),
    path('categories/create/', CategoryCreateView.as_view()),

    path('courses/', CourseListView.as_view()),
    path('courses/create/', CourseCreateView.as_view()),

    path('enroll/', EnrollmentCreateView.as_view()),
    path('dashboard/', DashboardView.as_view()),
]
