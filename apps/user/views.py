from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from rest_framework.response import Response
from .models import User
from rest_framework.views import APIView
from .serializers import UserSerializer

from django.views.decorators.csrf import csrf_exempt

import firebase_admin
from firebase_admin import credentials, auth
from django.conf import settings

firebase_creds = credentials.Certificate(settings.FIREBASE_CONFIG)
firebase_app = firebase_admin.initialize_app(firebase_creds)

# Create your views here.
class UserListAPI(APIView):
    def get(self, request):
        queryset = User.objects.all()
        print(queryset)
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

        
def index(request):
    return HttpResponse("index")