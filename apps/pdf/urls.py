from django.urls import path
from .views import PDFAPI

urlpatterns = [
    path('', PDFAPI.as_view()),
]