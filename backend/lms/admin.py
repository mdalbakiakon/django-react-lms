from django.contrib import admin

# Register your models here.
from .models import Category, Course, Enrollment

admin.site.register(Category)
admin.site.register(Course)
admin.site.register(Enrollment)
