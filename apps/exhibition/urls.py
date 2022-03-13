from django.urls import path
from . import views
from .views import ExhibitionListAPI
urlpatterns = [
    path('', views.index, name="index"),
    path('api/',ExhibitionListAPI.as_view())
]