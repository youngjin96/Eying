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
                error_message = "아이디 / 패스워드 입력 오류입니다."
                raise
            
            queryset = User.objects.get(Q(email=user_email))
            
            if check_password(user_password, queryset.password):
                serializer = UserSerializer(queryset, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                error_message = "패스워드가 올바르지 않습니다."
                raise
        except Exception as e:
            print(e)
            return Response({'error_message': error_message}, status=status.HTTP_400_BAD_REQUEST)

    @TIME_MEASURE
    def post(self, request):
        error_message = "알 수 없는 오류가 발생했습니다."
        try:
            # 중복 이메일 체크
            if User.objects.filter(email=request.data["email"]):
                error_message = "이미 존재하는 이메일입니다."
                raise
            
            # 비밀번호 재검증
            if request.POST.get("password") == None:
                error_message = "패스워드가 입력되지 않았습니다."
                raise
                
            user = User(
                username=request.POST.get("username"),
                password=make_password(request.POST.get("password")),
                email=request.POST.get("email"),
                age=request.POST.get("age", 0),
                gender=request.POST.get("gender"),
                job=request.POST.get("job"),
                job_field=request.POST.get("job_field"),
                position=request.POST.get("position"),
                credit=request.POST.get("credit", 0),
                card=request.FILES.get("card"),
            )
            user.save()
            
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error_message': error_message}, status=status.HTTP_400_BAD_REQUEST)
        
    @TIME_MEASURE
    def put(self, request):
        try:
            user_email = request.POST.get("email")
            operator = request.POST.get("operator")
            credit = int(request.POST.get("credit"))
            
            # 요청 데이터 누락 처리
            if user_email == None or operator == None or credit == None:
                error_message = "이메일 | 연산자 | 크레딧이 입력되지 않았습니다."
                raise
            elif operator not in ["+", "-", "="]:
                error_message = "연산자가 올바르지 않습니다."
                raise
            
            # 사용자 검증
            user = User.objects.get(email=user_email)
            if not user:
                error_message = "해당 이메일의 사용자가 존재하지 않습니다."
                raise
            
            # 업데이트
            if operator == "+":
                user.credit = user.credit + credit
            elif operator == "-":
                user.credit = user.credit - credit
            elif operator == "=":
                user.credit = credit
            user.save(update_fields=['credit'])
            
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error_message': error_message}, status=status.HTTP_400_BAD_REQUEST)
        
    @TIME_MEASURE
    def delete(self, request):
        try:
            # 요청 데이터 누락 처리
            user_email = request.POST.get("email")
            if user_email == None:
                error_message = "이메일이 입력되지 않았습니다."
                raise
            
            # 사용자 검증
            user = User.objects.get(email=user_email)
            if not user:
                error_message = "해당 이메일의 사용자가 존재하지 않습니다."
                raise
            
            user.delete()
            
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error_message': error_message}, status=status.HTTP_400_BAD_REQUEST)
                
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