from django.urls import path
from nft import views

urlpatterns = [
    path('', views.CRUD, name="nft"),
]
