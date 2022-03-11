from django.urls import path
from trade import views

urlpatterns = [
    # READ ALL
    path('find/all/', views.get_all, name="trade-get-all"),
    path('find/uid/<int:user_id>/', views.get_by_id, name="trade-get-by-id"),
]
