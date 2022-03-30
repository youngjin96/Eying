from django.urls import path
from . import views
from .views import EyetrackList 

urlpatterns = [
    path('', EyetrackList.as_view()),
    # path('',views.index)
]