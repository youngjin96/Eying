from django.urls import path
from trade import views
from trade.views import *

urlpatterns = [
    path("api/find/all/", TradeListAPI.as_view()),
    path("api/find/uid/<int:user_id>/", TradeListFindByUserAPI.as_view()),
]
