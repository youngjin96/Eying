from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from django.db.models import Q, F
from .serializers import UserSerializer

from django.contrib.auth.hashers import make_password, check_password

from apps.decorator import TIME_MEASURE
import config.policy as POLICY

class UserAPI(APIView):
    # 사용자 유효성 검사 (DB)
    @TIME_MEASURE
    def get(self, request):
        try:
            queryDict = {
                "email": request.GET.get("email"),
                "password": request.GET.get("password"),
            }
            
            if not queryDict["email"] or not queryDict["password"]:
                raise Exception("아이디 / 패스워드 입력 오류입니다.")
            
            user = User.objects.get(Q(email=queryDict["email"]))
            
            if check_password(queryDict["password"], user.password):
                serializer = UserSerializer(user, many=False)
                return Response(serializer.data)
            else:
                raise Exception("패스워드가 올바르지 않습니다.")
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)})

    # 회원가입
    @TIME_MEASURE
    def post(self, request):
        try:
            dataDict = {
                "email": request.data.get("email"),
                "password": request.data.get("password"),
                "username": request.data.get("username"),
                "age": request.data.get("age", 0),
                "job": request.data.get("job"),
                "job_field": request.data.get("job_field"),
                "position": request.data.get("position"),
                "gender": request.data.get("gender"),
                "credit": request.data.get("credit", POLICY.ENROLL_CREDIT),
                "card": request.data.get("card"),
            }
            
            # 필수 항목 누락 검증
            for key in dataDict.keys():
                if not dataDict[key]:
                    raise Exception("%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH[key])
            
            # 중복 이메일 체크
            if User.objects.filter(email=dataDict["email"]):
                raise Exception("이미 존재하는 이메일입니다.")
                
            user = User(
                username=dataDict["username"],
                password=make_password(dataDict["password"]),
                email=dataDict["email"],
                age=dataDict["age"],
                gender=dataDict["gender"],
                job=dataDict["job"],
                job_field=dataDict["job_field"],
                position=dataDict["position"],
                credit=dataDict["credit"],
                card=dataDict["card"],
            )
            user.save()
            
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)})
        
    # 사용자 수정
    @TIME_MEASURE
    def put(self, request):
        try:
            dataDict = {
                "email": request.data.get("email"),
                "operator": request.data.get("operator"),
                "credit": request.data.get("credit"),
                "username": request.data.get("username"),
                "age": request.data.get("age"),
                "job": request.data.get("job"),
                "job_field": request.data.get("job_field"),
                "position": request.data.get("position"),
                "gender": request.data.get("gender"),
                "password": request.data.get("password"),
            }
            
            # 필수 항목 누락 검증
            if not dataDict["email"]:
                raise Exception("%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH['email'])
            
            user = User.objects.filter(email=dataDict["email"])
            if not user:
                raise Exception("해당 이메일의 사용자가 존재하지 않습니다.")
            
            # 업데이트 (개별 업데이트는 user.save(update_fields=['', '', '', ...]))
            if dataDict["operator"] in ["+", "-", "="] and dataDict["credit"]:
                if dataDict["operator"] == "+":
                    user.update(credit=F("credit")+int(dataDict["credit"]))
                elif dataDict["operator"] == "-":
                    user.update(credit=F("credit")-int(dataDict["credit"]))
                elif dataDict["operator"] == "=":
                    user.update(credit=int(dataDict["credit"]))
                
            if dataDict["username"]:
                user.update(username=dataDict["username"])
            if dataDict["age"]:
                user.update(age=dataDict["age"])
            if dataDict["job"]:
                user.update(job=dataDict["job"])
            if dataDict["job_field"]:
                user.update(job_field=dataDict["job_field"])
            if dataDict["position"]:
                user.update(position=dataDict["position"])
            if dataDict["gender"]:
                user.update(gender=dataDict["gender"])
            if dataDict["password"]:
                user.update(password=make_password(dataDict["password"]))
            
            serializer = UserSerializer(user, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)})
        
    @TIME_MEASURE
    def delete(self, request):
        try:
            dataDict = {
                "email": request.data.get("email"),
            }
            
            # 요청 데이터 누락 처리
            if not dataDict["email"]:
                raise Exception("%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH['email'])
            
            # 사용자 검증
            user = User.objects.filter(email=dataDict["email"])
            if not user:
                raise Exception("해당 이메일의 사용자가 존재하지 않습니다.")
            
            user.delete()
            
            serializer = UserSerializer(user, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)})
                
class UserSearchAPI(APIView):
    @TIME_MEASURE
    def get(self, request):
        try:
            queryDict = {
                "user_id": request.GET.get("user_id"),
                "email": request.GET.get("email"),
                "username": request.GET.get("username"),
            }
            
            # 쿼리 적용 (Q() = 조건 없음)
            query = Q()
            if queryDict["user_id"]:
                query &= Q(id=queryDict["user_id"])
            if queryDict["email"]:
                query &= Q(email=queryDict["email"])
            if queryDict["username"]:
                query &= Q(username=queryDict["username"])
            
            user = User.objects.filter(query)
            
            # 일치하는 데이터가 없는 경우
            if not user:
                raise Exception("일치하는 데이터가 없습니다.")
            
            serializer = UserSerializer(user, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)})