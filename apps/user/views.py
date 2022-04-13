from rest_framework.response import Response
from rest_framework import status
from .models import User
from django.db.models import Q
from rest_framework.views import APIView
from .serializers import UserSerializer

from django.views.decorators.csrf import csrf_exempt

import firebase_admin
from firebase_admin import credentials

from django.conf import settings

import json
from django.contrib.auth.hashers import make_password


# firebase_creds = credentials.Certificate(settings.FIREBASE_CONFIG)
# firebase_app = firebase_admin.initialize_app(firebase_creds)


class UserAPI(APIView):
    def get(self, request):
        error_message = "알 수 없는 오류가 발생했습니다."
        try:
            user_email = request.GET.get("email", None)
            user_password = request.GET.get("password", None)
            
            if user_email == None or user_password == None:
                error_message = "아이디 / 비밀번호 입력 오류입니다."
            print(user_email, user_password)
            
            queryset = User.objects.get(Q(email=user_email))
            print(queryset, queryset.password, make_password(user_password))
            serializer = UserSerializer(queryset, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'error_message': error_message}, status=status.HTTP_400_BAD_REQUEST)

    @csrf_exempt
    def post(self, request):
        error_message = "알 수 없는 오류가 발생했습니다."
        try:
            data = json.loads(request.body.decode('utf-8'))
            
            if len(User.objects.filter(email=data["email"])) >= 1:
                error_message = "이미 존재하는 이메일입니다."
                raise
            
            user = User(
                username=data["username"],
                password=data["password"],
                email=data["email"],
                birth_year=data["birth_year"],
                gender=data["gender"],
                job=data["job"],
            )
            user.save()
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'error_message': error_message}, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request):
        try:
            print("DELETE 요청")
            return Response({}, status=status.HTTP_200_OK)
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
                
class UserSearchAPI(APIView):
    def get(self, request):
        try:
            query_user_id = request.GET.get("user_id", None)
            query_user_name = request.GET.get("user_name", None)
                
            if len(request.GET) == 0:   # 조건 미입력
                queryset = User.objects.all()
                serializer = UserSerializer(queryset, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:                       # 조건 입력
                query = Q()
                if query_user_id != None:
                    query = query & Q(pk=query_user_id)
                if query_user_name != None:
                    query = query & Q(username=query_user_name)
                
                if query == Q():
                    raise
                
                queryset = User.objects.filter(query)
                serializer = UserSerializer(queryset, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)