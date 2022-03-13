from django.urls import path
from . import views
from .views import UserListAPI
urlpatterns = [
    path('', views.index, name="index"),
    path('api/',UserListAPI.as_view())
]