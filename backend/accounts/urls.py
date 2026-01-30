from django.urls import path
from .views import RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import ProfileView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', TokenObtainPairView.as_view()),
    path('profile/', ProfileView.as_view()),
]
