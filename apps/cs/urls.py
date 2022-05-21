from django.urls import path
from .views import CSAPI, CSSearchAPI

urlpatterns = [
    path('', CSAPI.as_view()),
    path('search/', CSSearchAPI.as_view()),
]
