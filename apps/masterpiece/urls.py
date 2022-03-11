from django.urls import path
from masterpiece.views import *

urlpatterns = [
    path("api/find/all/", MasterpieceListAPI.as_view()),
    path("api/find/uid/<int:user_id>/", MasterpieceListFindByUserAPI.as_view()),
    path("api/find/eid/<int:exhibition_id>/", MasterpieceListFindByExhibitionAPI.as_view()),
]
