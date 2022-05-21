"""apps URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg import openapi
from drf_yasg.views import get_schema_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('user.urls')),
    path('pdf/', include('pdf.urls')),
    path('eyetracking/', include('eyetracking.urls')),
    path('cs/', include('cs.urls')),
]


schema_view_v1 = get_schema_view(
    openapi.Info(
        title="Django Backend API",
        default_version="v1",
        description="",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="kimc980106@naver.com"),
        license=openapi.License(name="Kookmin Univ.")
    ),
    validators=['flex'],
    public=True,
    permission_classes=(permissions.AllowAny, ),
    patterns=urlpatterns,
)


urlpatterns += [
    # Auto DRF API docs
    path("swagger<str:format>", schema_view_v1.without_ui(cache_timeout=0), name="schema-json"),
    path("swagger/", schema_view_v1.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path("docs/", schema_view_v1.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
]