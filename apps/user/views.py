from rest_framework.response import Response
from rest_framework import status
from .models import User
from rest_framework.views import APIView
from .serializers import UserSerializer

from django.views.decorators.csrf import csrf_exempt

import firebase_admin
from firebase_admin import credentials
from django.conf import settings

import json
from django.contrib.auth.hashers import make_password


firebase_creds = credentials.Certificate(settings.FIREBASE_CONFIG)
firebase_app = firebase_admin.initialize_app(firebase_creds)


class UserAPI(APIView):
    def get(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))

            if "user_id" in data:
                queryset = User.objects.filter(pk=data["user_id"])
            else:
                raise
        except:
            queryset = User.objects.all()
        finally:
            serializer = UserSerializer(queryset, many=True)
            return Response(serializer.data)

    @csrf_exempt
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        try:
            user = User(
                username=data["username"],
                password=make_password(data["password"]),
                email=data["email"],
                birth_year=data["birth_year"],
                gender=data["gender"],
                job=data["job"],
            )
            user.save()
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data)
        except:
            return Response({'data': ""}, status=status.HTTP_400_BAD_REQUEST)