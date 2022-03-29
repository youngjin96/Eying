from django.http import HttpResponse, JsonResponse

from rest_framework.response import Response
from .models import User
from rest_framework.views import APIView
from .serializers import UserSerializer

from django.views.decorators.csrf import csrf_exempt

import firebase_admin
from firebase_admin import credentials, auth
from django.conf import settings

import json
from django.contrib.auth.hashers import make_password


firebase_creds = credentials.Certificate(settings.FIREBASE_CONFIG)
firebase_app = firebase_admin.initialize_app(firebase_creds)


class UserAPI(APIView):
    def get(self, request):
        queryset = User.objects.all()
        print(queryset)
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
            return HttpResponse(200)
        except:
            return HttpResponse(400)