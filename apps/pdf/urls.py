from django.urls import path
from . import views
from .views import PDFListAPI, PDFViewAPI

urlpatterns = [
    path('api/', PDFListAPI.as_view()),
    path('api/<int:pdf_id>/', PDFViewAPI.as_view()),
]