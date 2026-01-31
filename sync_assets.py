import os
import django
import requests
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from lms_core.models import Course
from users.models import User

def download_and_save_image(url, filename):
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            return ContentFile(response.content, name=filename)
    except Exception as e:
        print(f"Failed to download {url}: {e}")
    return None

def seed_images():
    print("Seeding course thumbnails...")
    # Map keywords to courses
    course_images = {
        "React": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        "Python": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
        "Go": "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800&q=80",
        "Hacking": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    }

    for course in Course.objects.all():
        for keyword, url in course_images.items():
            if keyword.lower() in course.title.lower():
                img_file = download_and_save_image(url, f"course_{course.id}.jpg")
                if img_file:
                    course.thumbnail.save(img_file.name, img_file, save=True)
                    print(f"Updated thumbnail for: {course.title}")
                break

    print("\nSeeding instructor avatars...")
    # Professional headshots
    avatars = [
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80",
    ]

    instructors = list(User.objects.filter(role='instructor'))
    for i, user in enumerate(instructors):
        url = avatars[i % len(avatars)]
        img_file = download_and_save_image(url, f"avatar_{user.username}.jpg")
        if img_file:
            user.avatar.save(img_file.name, img_file, save=True)
            print(f"Updated avatar for: {user.username}")

if __name__ == '__main__':
    seed_images()
