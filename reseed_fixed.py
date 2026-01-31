import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from lms_core.models import Course, Category
from users.models import User

def deep_clean_and_reseed():
    print("Clearing all data...")
    Course.objects.all().delete()
    
    # Get instructors
    instructors = list(User.objects.filter(role='instructor'))
    if not instructors:
        print("Creating instructors...")
        # Create professional mentors
        mentors = [
            {'u': 'dr_smith', 'f': 'Julian', 'l': 'Smith'},
            {'u': 'sarah_dev', 'f': 'Sarah', 'l': 'Jenkins'},
            {'u': 'alex_design', 'f': 'Alex', 'l': 'Vance'},
        ]
        instructors = []
        for m in mentors:
            u, _ = User.objects.get_or_create(username=m['u'], defaults={'first_name': m['f'], 'last_name': m['l'], 'role': 'instructor', 'email': f"{m['u']}@example.com"})
            u.set_password('mentor123')
            u.save()
            instructors.append(u)
    
    categories = list(Category.objects.all())
    if not categories:
        Category.objects.create(name="Computer Science")
        categories = list(Category.objects.all())

    print("Seeding new courses with correct instructors...")
    course_list = [
        ("React & Next.js: The Enterprise Guide", "Master the modern web stack."),
        ("Python for Data Science & AI", "Build intelligent applications."),
        ("Mastering Go Microservices", "Scalable backend architecture."),
        ("Ethical Hacking: Zero to Hero", "Security and penetration testing."),
    ]
    
    for title, desc in course_list:
        instr = random.choice(instructors)
        Course.objects.create(
            title=title,
            description=desc,
            instructor=instr,
            category=random.choice(categories),
            price=random.randint(49, 199),
            duration="12h 45m"
        )
        print(f"Created: {title} -> {instr.username}")

if __name__ == '__main__':
    deep_clean_and_reseed()
