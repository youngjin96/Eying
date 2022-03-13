from django.shortcuts import render
from django.http import HttpResponse

from rest_framework.response import Response
from .models import User
from rest_framework.views import APIView
from .serializers import UserSerializer

# Create your views here.
class UserListAPI(APIView):
    def get(self, request):
        queryset = User.objects.all()
        print(queryset)
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

def index(request):
    return HttpResponse("index")