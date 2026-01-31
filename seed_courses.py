import os
import django

# Setup django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from lms_core.models import Category, Course
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
import requests

User = get_user_model()

def download_image(url):
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            return ContentFile(response.content)
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return None

def seed_data():
    # 1. Ensure Categories exist
    se_cat, _ = Category.objects.get_or_create(
        name="Software Engineering",
        description="Master the art of coding and building scalable systems."
    )
    ai_cat, _ = Category.objects.get_or_create(
        name="Artificial Intelligence",
        description="Explore the future with Machine Learning, Deep Learning, and Neural Networks."
    )
    cyber_cat, _ = Category.objects.get_or_create(
        name="Cybersecurity",
        description="Protect systems and networks from digital attacks."
    )
    
    # 2. Get an instructor
    instructor = User.objects.filter(role='admin').first()
    if not instructor:
        instructor = User.objects.filter(is_superuser=True).first()
    
    if not instructor:
        print("Error: No instructor or admin user found.")
        return

    # 3. Create Demo Courses with Images
    demo_courses = [
        {
            "title": "React & Next.js: The Enterprise Guide",
            "description": "Learn to build high-performance, SEO-friendly web applications using the latest features of Next.js 15 and React Server Components.",
            "duration": "24 Hours",
            "price": 89.99,
            "category": se_cat,
            "img": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80"
        },
        {
            "title": "Natural Language Processing with Transformers",
            "description": "Master BERT, GPT, and modern transformer architectures to build conversational AI and text analysis tools.",
            "duration": "45 Hours",
            "price": 149.00,
            "category": ai_cat,
            "img": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80"
        },
        {
            "title": "Ethical Hacking: Zero to Hero",
            "description": "Learn network penetration testing, web application security, and exploit development from a white-hat perspective.",
            "duration": "50 Hours",
            "price": 129.99,
            "category": cyber_cat,
            "img": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
        },
        {
            "title": "Python for Data Science & AI",
            "description": "A comprehensive journey from Python basics to advanced machine learning models using NumPy, Pandas, and Scikit-learn.",
            "duration": "32 Hours",
            "price": 120.00,
            "category": se_cat,
            "img": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80"
        },
        {
            "title": "Mastering Go (Golang) Microservices",
            "description": "Deep dive into cloud-native development. Build scalable, concurrent systems with gRPC, Docker, and Kubernetes.",
            "duration": "18 Hours",
            "price": 75.00,
            "category": se_cat,
            "img": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80"
        },
        {
            "title": "Full Stack Django & React Blueprint",
            "description": "Bridge the gap between backend and frontend. Master REST APIs, JWT authentication, and state management in a real-world LMS project.",
            "duration": "40 Hours",
            "price": 99.00,
            "category": se_cat,
            "img": "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80"
        }
    ]

    for course_data in demo_courses:
        course, created = Course.objects.update_or_create(
            title=course_data['title'],
            defaults={
                'description': course_data['description'],
                'category': course_data['category'],
                'instructor': instructor,
                'duration': course_data['duration'],
                'price': course_data['price']
            }
        )
        
        # Always refresh image for demo purposes
        img_content = download_image(course_data['img'])
        if img_content:
            filename = f"{course_data['title'].lower().replace(' ', '_')}.jpg"
            course.thumbnail.save(filename, img_content, save=True)
            print(f"Updated image for: {course.title}")

        if created:
            print(f"Course created: {course.title}")
        else:
            print(f"Course updated: {course.title}")

if __name__ == "__main__":
    seed_data()
