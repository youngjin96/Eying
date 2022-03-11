from django.urls import path
from masterpiece import views

urlpatterns = [
    # READ ALL
    path('find/all/', views.get_all, name="masterpiece-get-all"),
    path('find/uid/<int:user_id>/', views.get_by_user, name="masterpiece-get-by-user"),
    path('find/mid/<int:masterpiece_id>/', views.get_by_exhibition, name="masterpiece-get-by-exhibition"),
]
