from django.urls import path
from .views import PDFAPI, PDFSearchAPI

urlpatterns = [
    path('', PDFAPI.as_view()),
    path('search/', PDFSearchAPI.as_view()),
]