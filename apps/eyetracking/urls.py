from django.urls import path
# from .views import EyetrackList,EyetrackVisualization,EyetrackPdf,EyetrackUser
from .views import EyetrackList,EyetrackPdf,EyetrackUser

urlpatterns = [
    path('', EyetrackList.as_view()),
    path('pdf/',EyetrackPdf.as_view()),
    # path('visualization/',EyetrackVisualization.as_view()),
    path('user/',EyetrackUser.as_view()),
]