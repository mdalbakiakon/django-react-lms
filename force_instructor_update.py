import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from lms_core.models import Course
from users.models import User

def force_update():
    # Find all instructors
    instructors = list(User.objects.filter(role='instructor'))
    if not instructors:
        print("No instructors found!")
        return

    courses = Course.objects.all()
    for i, course in enumerate(courses):
        # Rotate through instructors
        instructor = instructors[i % len(instructors)]
        course.instructor = instructor
        course.save()
        print(f"Updated '{course.title}' -> {instructor.username} ({instructor.first_name} {instructor.last_name})")

if __name__ == '__main__':
    force_update()
