from io import BytesIO
from rest_framework.response import Response
from rest_framework.status import *
from rest_framework.views import APIView

from .models import User
from django.db.models import Q, F
from .serializers import UserSerializer

from django.contrib.auth.hashers import make_password, check_password

from apps.decorator import TIME_MEASURE
import config.policy as POLICY

from drf_yasg.utils import swagger_auto_schema
from drf_yasg       import openapi

class UserAPI(APIView):
    # 사용자 유효성 검사 (DB)
    @swagger_auto_schema(
        operation_summary='/user/',
        operation_description="로그인 기능을 하는 API입니다.",
        manual_parameters=[
            openapi.Parameter('email', openapi.IN_QUERY, description="사용자 이메일", type=openapi.TYPE_STRING),
            openapi.Parameter('password', openapi.IN_QUERY, description="사용자 비밀번호", type=openapi.TYPE_STRING)
        ],
        responses={
            200 : UserSerializer,
            400: openapi.Response(
                description="",
                examples={
                    "application/json": {
                        "error_message": "포함되지 않은 또는 잘못된 데이터 정보"
                    }
                }
            ),
            500: openapi.Response(
                description="",
                examples={
                    "application/json": {
                        "error_message": "서버 내부에서 발생한 오류 내용"
                    }
                }
            )
        }
    )
    @TIME_MEASURE
    def get(self, request):
        try:
            queryDict = {
                "email": request.GET.get("email"),
                "password": request.GET.get("password"),
            }
            
            if not queryDict["email"] or not queryDict["password"]:
                return Response({"error_message": "이메일 / 패스워드 입력 오류입니다."}, status=HTTP_400_BAD_REQUEST)
            
            user = User.objects.get(Q(email=queryDict["email"]))
            
            if check_password(queryDict["password"], user.password):
                serializer = UserSerializer(user, many=False)
                return Response(serializer.data)
            else:
                return Response({"error_message": "패스워드가 올바르지 않습니다."}, status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)

    # 회원가입
    @swagger_auto_schema(
        operation_summary="/user/", 
        operation_description="회원가입시 요청되는 API입니다.", 
        request_body=openapi.Schema(
            '회원가입',
            type=openapi.TYPE_OBJECT,
            properties={
                "email": openapi.Schema('이메일', type=openapi.TYPE_STRING),
                "password": openapi.Schema('비밀번호', type=openapi.TYPE_STRING),
                "username": openapi.Schema('닉네임', type=openapi.TYPE_STRING),
                "age": openapi.Schema('나이', type=openapi.TYPE_INTEGER),
                "job": openapi.Schema('직업', type=openapi.TYPE_STRING),
                "job_field": openapi.Schema('직무 분야', type=openapi.TYPE_STRING),
                "position": openapi.Schema('직급', type=openapi.TYPE_STRING),
                "gender": openapi.Schema('성별', type=openapi.TYPE_STRING),
                "credit": openapi.Schema('크레딧', type=openapi.TYPE_INTEGER),
                "card": openapi.Schema('명함 이미지', type=openapi.TYPE_OBJECT),
            }
        ),
        responses={
            200: UserSerializer,
            406: openapi.Response(
                description="",
                examples={
                    "application/json": {
                        "error_message": "포함되지 않은 또는 잘못된 데이터 정보"
                    }
                }
            ),
            500: openapi.Response(
                description="",
                examples={
                    "application/json": {
                        "error_message": "서버 내부에서 발생한 오류 내용"
                    }
                }
            )
        }
    )
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
                    return Response({"error_message": "%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH[key]}, status=HTTP_406_NOT_ACCEPTABLE)
            
            # 중복 이메일 체크
            if User.objects.filter(email=dataDict["email"]):
                return Response({"error_message": "중복된 이메일입니다."}, status=HTTP_406_NOT_ACCEPTABLE)
                
            # 중복 닉네임 체크
            if User.objects.filter(username=dataDict["username"]):
                return Response({"error_message": "중복된 닉네임입니다."}, status=HTTP_406_NOT_ACCEPTABLE)
            
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
            return Response({'error_message': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
        
    # 사용자 수정
    @swagger_auto_schema(
        operation_summary="/user/", 
        operation_description="사용자 정보 수정 시 요청되는 API입니다.", 
        request_body=openapi.Schema(
            '개인정보 변경',
            type=openapi.TYPE_OBJECT,
            properties={
                "email": openapi.Schema('이메일', type=openapi.TYPE_STRING),
                "password": openapi.Schema('비밀번호', type=openapi.TYPE_STRING),
                "username": openapi.Schema('사용자 이름', type=openapi.TYPE_STRING),
                "age": openapi.Schema('나이', type=openapi.TYPE_INTEGER),
                "job": openapi.Schema('직업', type=openapi.TYPE_STRING),
                "job_field": openapi.Schema('직무 분야', type=openapi.TYPE_STRING),
                "position": openapi.Schema('직급', type=openapi.TYPE_STRING),
                "gender": openapi.Schema('성별', type=openapi.TYPE_STRING),
                "credit": openapi.Schema('크레딧', type=openapi.TYPE_INTEGER),
                "operator": openapi.Schema('크레딧 연산', type=openapi.TYPE_STRING),
            }
        ),
        responses={
            200: UserSerializer,
            406: openapi.Response(
                description="",
                examples={
                    "application/json": {
                        "error_message": "포함되지 않은 또는 잘못된 데이터 정보"
                    }
                }
            ),
            500: openapi.Response(
                description="",
                examples={
                    "application/json": {
                        "error_message": "서버 내부에서 발생한 오류 내용"
                    }
                }
            )
        }
    )
    @TIME_MEASURE
    def put(self, request):
        try:
            dataDict = {
                "email": request.data.get("email"),
                "new_email": request.data.get("new_email"),
                "operator": request.data.get("operator"),
                "credit": request.data.get("credit"),
                "username": request.data.get("username"),
                "age": request.data.get("age"),
                "job": request.data.get("job"),
                "job_field": request.data.get("job_field"),
                "position": request.data.get("position"),
                "gender": request.data.get("gender"),
                "password": request.data.get("password"),
                "card": request.data.get("card"),
            }
            
            # 필수 항목 누락 검증
            if not dataDict["email"]:
                return Response({"error_message": "%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH['email']}, status=HTTP_406_NOT_ACCEPTABLE)
            
            user = User.objects.filter(email=dataDict["email"])
            if not user:
                return Response({"error_message": "해당 이메일의 사용자가 존재하지 않습니다."}, status=HTTP_406_NOT_ACCEPTABLE)
            
            if User.objects.filter(email=dataDict["new_email"]):
                return Response({"error_message": "변경할 이메일이 이미 사용 중입니다."}, status=HTTP_406_NOT_ACCEPTABLE)

            if User.objects.filter(username=dataDict["username"]):
                return Response({"error_message": "변경할 닉네임이 이미 사용 중입니다."}, status=HTTP_406_NOT_ACCEPTABLE)
            
            # 업데이트 (개별 업데이트는 user.save(update_fields=['', '', '', ...]))
            if dataDict["operator"] in ["+", "-", "="] and dataDict["credit"]:
                if dataDict["operator"] == "+":
                    user.update(credit=F("credit")+int(dataDict["credit"]))
                elif dataDict["operator"] == "-":
                    user.update(credit=F("credit")-int(dataDict["credit"]))
                elif dataDict["operator"] == "=":
                    user.update(credit=int(dataDict["credit"]))
                
            if dataDict["new_email"]:
                user.update(email=dataDict["new_email"])
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
            if dataDict["card"]:
                u = User.objects.get(email=dataDict["email"])
                u.card = dataDict["card"]
                u.save()

            serializer = UserSerializer(user, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)

       
    @swagger_auto_schema(
        operation_summary="/user/", 
        operation_description="회원탈퇴 시 요청되는 API입니다.", 
        request_body=openapi.Schema(
            '회원 탈퇴', 
            type=openapi.TYPE_OBJECT, 
            properties={
                "email": openapi.Schema('이메일', type=openapi.TYPE_STRING),
            }
        ),
        responses={
            200: UserSerializer,
            406: openapi.Response(
                description="",
                examples={
                    "application/json": {
                        "error_message": "포함되지 않은 또는 잘못된 데이터 정보"
                    }
                }
            ),
            500: openapi.Response(
                description="",
                examples={
                    "application/json": {
                        "error_message": "서버 내부에서 발생한 오류 내용"
                    }
                }
            )
        }
    )
    @TIME_MEASURE
    def delete(self, request):
        try:
            dataDict = {
                "email": request.data.get("email"),
            }
            
            # 요청 데이터 누락 처리
            if not dataDict["email"]:
                return Response({"error_message": "%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH['email']}, status=HTTP_406_NOT_ACCEPTABLE)
            
            # 사용자 검증
            user = User.objects.filter(email=dataDict["email"])
            if not user:
                return Response({"error_message": "해당 이메일의 사용자가 존재하지 않습니다."}, status=HTTP_406_NOT_ACCEPTABLE)
            
            user.delete()
            
            serializer = UserSerializer(user, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
                
class UserSearchAPI(APIView):
    @swagger_auto_schema(
        operation_summary='/user/search/',
        operation_description="사용자의 정보를 검색하는 API입니다.",
        manual_parameters=[
            openapi.Parameter('user_id', openapi.IN_QUERY, description="사용자 고유 ID", type=openapi.TYPE_INTEGER),
            openapi.Parameter('email', openapi.IN_QUERY, description="사용자 이메일", type=openapi.TYPE_STRING),
            openapi.Parameter('username', openapi.IN_QUERY, description="사용자 이름", type=openapi.TYPE_STRING)
        ],
        responses={
            200: UserSerializer,
            400: openapi.Response(
                description="",
                examples={
                    "application/json": {
                        "error_message": "포함되지 않은 또는 잘못된 데이터 정보"
                    }
                }
            ),
            500: openapi.Response(
                description="",
                examples={
                    "application/json": {
                        "error_message": "서버 내부에서 발생한 오류 내용"
                    }
                }
            )
        }
    )
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
                return Response({"error_message": "일치하는 데이터가 없습니다."}, status=HTTP_400_BAD_REQUEST)
            
            serializer = UserSerializer(user, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)