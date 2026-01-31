import os
import django
import requests
from django.core.files.base import ContentFile

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from lms_core.models import Course

def update_react_thumbnail():
    # URL for a professional coding background from Unsplash
    image_url = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200"
    
    try:
        response = requests.get(image_url)
        if response.status_code == 200:
            # Get the course
            course = Course.objects.get(id=1)
            
            # Save the image to the thumbnail field
            # This handles file saving and model updating correctly in Django
            file_name = f"coding_bg_{course.id}.jpg"
            course.thumbnail.save(file_name, ContentFile(response.content), save=True)
            
            print(f"Successfully updated image for: {course.title}")
            print(f"New thumbnail path: {course.thumbnail.name}")
        else:
            print(f"Failed to download image. Status code: {response.status_code}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    update_react_thumbnail()
