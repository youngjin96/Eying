from django.urls import path
from .views import UserAPI, UserSearchAPI

urlpatterns = [
    path('', UserAPI.as_view()),
    path('search/', UserSearchAPI.as_view()),
]