from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import User
from django.db.models import Q
from .serializers import UserSerializer

from django.contrib.auth.hashers import make_password, check_password

from apps.decorator import TIME_MEASURE

class UserAPI(APIView):
    @TIME_MEASURE
    def get(self, request):
        error_message = "존재하지 않는 이메일이거나 알 수 없는 오류가 발생했습니다."
        try:
            user_email = request.GET.get("email", None)
            user_password = request.GET.get("password", None)
            
            if not user_email or not user_password:
                error_message = "아이디 / 비밀번호 입력 오류입니다."
                raise
            
            queryset = User.objects.get(Q(email=user_email))
            
            if check_password(user_password, queryset.password):
                serializer = UserSerializer(queryset, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                error_message = "비밀번호가 올바르지 않습니다."
                raise
        except Exception as e:
            print(e)
            return Response({'error_message': error_message}, status=status.HTTP_400_BAD_REQUEST)

    @TIME_MEASURE
    def post(self, request):
        error_message = "알 수 없는 오류가 발생했습니다."
        try:
            if User.objects.filter(email=request.data["email"]):
                error_message = "이미 존재하는 이메일입니다."
                raise
            
            user = User(
                username=request.data["username"],
                password=make_password(str(request.data["password"])),
                email=request.data["email"],
                age=request.data["age"],
                gender=request.data["gender"],
                job=request.data["job"],
                job_field=request.data["job_field"],
                position=request.data["position"],
                credit=request.data["credit"],
                card=request.data["card"],
            )
            user.save()
            
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error_message': error_message}, status=status.HTTP_400_BAD_REQUEST)
        
    @TIME_MEASURE
    def delete(self, request):
        try:
            print("DELETE 요청")
            return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error_message': e}, status=status.HTTP_400_BAD_REQUEST)
                
class UserSearchAPI(APIView):
    @TIME_MEASURE
    def get(self, request):
        try:
            query_email = request.GET.get("email", None)
            query_username = request.GET.get("username", None)
                
            # 쿼리 적용 (Q() = 조건 없음)
            query = Q()
            if query_email:
                query = query & Q(email=query_email)
            if query_username:
                query = query & Q(username=query_username)
            
            queryset = User.objects.filter(query)
            serializer = UserSerializer(queryset, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error_message': e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)