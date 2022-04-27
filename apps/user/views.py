from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import User
from django.db.models import Q
from .serializers import UserSerializer

from django.contrib.auth.hashers import make_password, check_password

from apps.decorator import TIME_MEASURE

class UserAPI(APIView):
    # 사용자 유효성 검사 (DB)
    @TIME_MEASURE
    def get(self, request):
        try:
            if not request.GET.get("email") or not request.GET.get("password"):
                raise Exception("아이디 / 패스워드 입력 오류입니다.")
            
            user = User.objects.get(Q(email=request.GET.get("email")))
            
            if check_password(request.GET.get("password"), user.password):
                serializer = UserSerializer(user, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                raise Exception("패스워드가 올바르지 않습니다.")
        except Exception as e:
            print(e)
            return Response({'error_message': e}, status=status.HTTP_400_BAD_REQUEST)

    # 회원가입
    @TIME_MEASURE
    def post(self, request):
        try:
            # 중복 이메일 체크
            if User.objects.filter(email=request.POST.get("email")):
                raise Exception("이미 존재하는 이메일입니다.")
            
            # 비밀번호 재검증
            if not request.POST.get("password"):
                raise Exception("패스워드가 입력되지 않았습니다.")
                
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
            return Response({'error_message': e}, status=status.HTTP_400_BAD_REQUEST)
        
    # 사용자 수정
    @TIME_MEASURE
    def put(self, request):
        try:
            # 사용자 검증
            if not request.POST.get("email"):
                raise Exception("이메일이 입력되지 않았습니다.")
            
            user = User.objects.get(email=request.POST.get("email"))
            if not user:
                raise Exception("해당 이메일의 사용자가 존재하지 않습니다.")
            
            # 업데이트 (개별 업데이트는 user.save(update_fields=['', '', '', ...]))
            if request.POST.get("operator") in ["+", "-", "="] and request.POST.get("credit"):
                if request.POST.get("operator") == "+":
                    user.credit = user.credit + int(request.POST.get("credit"))
                elif request.POST.get("operator") == "-":
                    user.credit = user.credit - int(request.POST.get("credit"))
                elif request.POST.get("operator") == "=":
                    user.credit = int(request.POST.get("credit"))
                
            if request.POST.get("username"):
                user.username = request.POST.get("username")
            if request.POST.get("age"):
                user.age = request.POST.get("age")
            if request.POST.get("job"):
                user.job = request.POST.get("job")
            if request.POST.get("job_field"):
                user.job_field = request.POST.get("job_field")
            if request.POST.get("position"):
                user.position = request.POST.get("position")
            if request.POST.get("gender"):
                user.gender = request.POST.get("gender")
            user.save()
            
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error_message': e}, status=status.HTTP_400_BAD_REQUEST)
        
    @TIME_MEASURE
    def delete(self, request):
        try:
            # 요청 데이터 누락 처리
            if not request.POST.get("email"):
                raise Exception("이메일이 입력되지 않았습니다.")
            
            # 사용자 검증
            user = User.objects.get(email=request.POST.get("email"))
            if not user:
                raise Exception("해당 이메일의 사용자가 존재하지 않습니다.")
            
            user.delete()
            
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error_message': e}, status=status.HTTP_400_BAD_REQUEST)
                
class UserSearchAPI(APIView):
    @TIME_MEASURE
    def get(self, request):
        try:
            # 쿼리 적용 (Q() = 조건 없음)
            query = Q()
            if request.GET.get("email"):
                query &= Q(email=request.GET.get("email"))
            if request.GET.get("username"):
                query &= Q(username=request.GET.get("username"))
            
            user = User.objects.filter(query)
            
            serializer = UserSerializer(user, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error_message': e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)