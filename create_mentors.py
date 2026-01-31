import os
import django
import random

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from lms_core.models import Course

User = get_user_model()

def create_mentors():
    mentors_data = [
        {'username': 'dr_smith', 'first_name': 'Dr. Julian', 'last_name': 'Smith', 'email': 'julian@station.edu', 'role': 'instructor'},
        {'username': 'sarah_dev', 'first_name': 'Sarah', 'last_name': 'Jenkins', 'email': 'sarah@station.edu', 'role': 'instructor'},
        {'username': 'alex_design', 'first_name': 'Alex', 'last_name': 'Vance', 'email': 'alex@station.edu', 'role': 'instructor'},
        {'username': 'michael_data', 'first_name': 'Michael', 'last_name': 'Ross', 'email': 'michael@station.edu', 'role': 'instructor'},
    ]

    mentors = []
    for data in mentors_data:
        user, created = User.objects.get_or_create(
            username=data['username'],
            defaults={
                'first_name': data['first_name'],
                'last_name': data['last_name'],
                'email': data['email'],
                'role': data['role']
            }
        )
        if created:
            user.set_password('mentor123')
            user.save()
            print(f"Created mentor: {user.username}")
        else:
            print(f"Mentor already exists: {user.username}")
        mentors.append(user)

    # Assign courses to mentors
    courses = list(Course.objects.all())
    for course in courses:
        instructor = random.choice(mentors)
        course.instructor = instructor
        course.save()
        print(f"Assigned '{course.title}' to {instructor.username}")

if __name__ == '__main__':
    create_mentors()
