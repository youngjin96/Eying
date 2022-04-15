from django.urls import path
from .views import CSAPI

urlpatterns = [
    path('', CSAPI.as_view()),
]
