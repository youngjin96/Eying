from django.urls import path
from trade import views

urlpatterns = [
    path('', views.CRUD, name="trade"),
]
