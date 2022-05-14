from rest_framework.response import Response
from rest_framework.status import *
from rest_framework.views import APIView

from .models import PDFModel
from user.models import User
from django.db.models import Q, F
from .serializers import PDFSerializer

from apps.decorator import TIME_MEASURE
import config.policy as POLICY
from apps.settings import DEBUG

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from unicodedata import normalize
from datetime import datetime

class PDFAPI(APIView):
    @swagger_auto_schema(
        operation_summary="/pdf/", 
        operation_description="등록된 파일을 검색하는 API 입니다.<br><strong>/pdf/search/ 와 동일합니다."
    )
    @TIME_MEASURE
    def get(self, request):
        return PDFSearchAPI.get(self, request)
    
    @swagger_auto_schema(
        operation_summary="/pdf/", 
        operation_description="파일을 등록하는 API입니다.", 
        request_body=openapi.Schema(
            '파일 등록',
            type=openapi.TYPE_OBJECT,
            properties={
                "email": openapi.Schema('이메일', type=openapi.TYPE_STRING),
                "job_field": openapi.Schema('분야', type=openapi.TYPE_STRING),
                "pdf": openapi.Schema('파일', type=openapi.TYPE_OBJECT),
                "deadline": openapi.Schema('보관기간(0000-00-00)', type=openapi.TYPE_STRING),
            }
        ),
        responses={
            200: PDFSerializer,
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
                "deadline": request.data.get("deadline", POLICY.DEADLINE()),
                "email": request.data.get("email"),
                "job_field": request.data.get("job_field"),
                "pdf": request.data.get("pdf"),
            }

            # 필수 항목 누락 검증
            for key in dataDict.keys():
                if not dataDict[key]:
                    return Response({'error_message': "%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH[key]}, status=HTTP_406_NOT_ACCEPTABLE)
            
            # 파일 포맷 검증
            if dataDict["pdf"].content_type != "application/pdf":
                return Response({'error_message': "파일 확장자가 올바르지 않습니다."}, status=HTTP_406_NOT_ACCEPTABLE)
            
            # 이메일 검증
            user = User.objects.filter(email=dataDict["email"])
            if not user:
                return Response({'error_message': "존재하지 않는 사용자 입니다."}, status=HTTP_406_NOT_ACCEPTABLE)
                
            uploader = User.objects.get(email=dataDict["email"])
                
            # 크레딧 검증
            if uploader.credit < POLICY.UPLOAD_CREDIT:
                return Response({'error_message': "사용자의 크레딧이 부족합니다."}, status=HTTP_406_NOT_ACCEPTABLE)
                
            # PDF 저장
            pdf = PDFModel(user=uploader,
                            pdf=dataDict["pdf"],
                            name=normalize("NFC", dataDict["pdf"].name),
                            deadline=dataDict["deadline"],
                            views=0,
                            job_field=dataDict["job_field"],
                            )
            pdf.save()
            
            # 크레딧 차감
            uploader.credit -= POLICY.UPLOAD_CREDIT
            uploader.save()
            
            serializer = PDFSerializer(pdf, many=False)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
        
    @swagger_auto_schema(
        operation_summary="/pdf/", 
        operation_description="파일을 수정하는 API입니다.", 
        request_body=openapi.Schema(
            '파일 수정',
            type=openapi.TYPE_OBJECT,
            properties={
                "pdf_id": openapi.Schema('파일 고유번호', type=openapi.TYPE_INTEGER),
                "deadline": openapi.Schema('보관기간(0000-00-00)', type=openapi.TYPE_STRING),
            }
        ),
        responses={
            200: PDFSerializer,
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
                "pdf_id": request.data.get("pdf_id"),
                "deadline": request.data.get("deadline"),
            }

            # 필수 항목 누락 검증
            if not dataDict["pdf_id"]:
                return Response({'error_message': "%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH["pdf_id"]}, status=HTTP_406_NOT_ACCEPTABLE)
            
            # 데이터 유효성 검증
            pdf = PDFModel.objects.filter(pk=dataDict["pdf_id"])
            if not pdf:
                return Response({'error_message': "존재하지 않는 PDF 입니다."}, status=HTTP_406_NOT_ACCEPTABLE)
            
            # PDF 보관 기간 변경
            if dataDict["deadline"]:
                pdf.update(deadline=dataDict["deadline"])
            
            serializer = PDFSerializer(pdf, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
    
    @swagger_auto_schema(
        operation_summary="/pdf/", 
        operation_description="파일을 삭제하는 API입니다.", 
        request_body=openapi.Schema(
            '파일 삭제',
            type=openapi.TYPE_OBJECT,
            properties={
                "pdf_id": openapi.Schema('파일 고유번호', type=openapi.TYPE_INTEGER),
            }
        ),
        responses={
            200: PDFSerializer,
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
                "pdf_id": request.data.get("pdf_id"),
            }
            
            # 필수 항목 누락 검증
            if not dataDict["pdf_id"]:
                return Response({"error_message": "%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH["pdf_id"]}, status=HTTP_406_NOT_ACCEPTABLE)
            
            # 데이터 유효성 검증
            pdf = PDFModel.objects.filter(pk=dataDict["pdf_id"])
            if not pdf:
                return Response({"error_message": "존재하지 않는 PDF 입니다."}, status=HTTP_406_NOT_ACCEPTABLE)
            
            pdf.delete()
            
            serializer = PDFSerializer(pdf, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
        

class PDFSearchAPI(APIView):
    @swagger_auto_schema(
        operation_summary = '/pdf/search/',
        operation_description="등록된 파일을 검색하는 API 입니다.",
        manual_parameters=[
            openapi.Parameter('pdf_id', openapi.IN_QUERY, description="파일 고유번호", type=openapi.TYPE_INTEGER),
            openapi.Parameter('name', openapi.IN_QUERY, description="파일명", type=openapi.TYPE_STRING),
            openapi.Parameter('username', openapi.IN_QUERY, description="사용자 이름", type=openapi.TYPE_STRING),
            openapi.Parameter('email', openapi.IN_QUERY, description="사용자 이메일", type=openapi.TYPE_STRING),
            openapi.Parameter('view', openapi.IN_QUERY, description="조회수 증가 옵션", type=openapi.TYPE_BOOLEAN),
        ],
        responses={
            200: PDFSerializer,
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
    def get(self, request):
        try:
            queryDict = {
                "pdf_id": request.GET.get("pdf_id"),
                "name": request.GET.get("name"),
                "username": request.GET.get("username"),
                "email": request.GET.get("email"),
                "view": request.GET.get("view"),
            }
                        
            # 요청 쿼리 처리
            query = Q() 
            if queryDict["pdf_id"]:
                query &= Q(pk=queryDict["pdf_id"])
            if queryDict["name"]:
                query &= Q(name__contains=queryDict["name"])
            if queryDict["username"]:
                query &= Q(user=User.objects.get(username=queryDict["username"]))
            if queryDict["email"]:
                query &= Q(user=User.objects.get(email=queryDict["email"]))
                 
            pdf = POLICY.ORDER_BY_RECENT(PDFModel.objects.filter(query))
            
            # Track을 위한 요청시 조회수 증가 처리
            if queryDict["view"]:
                # 반복문은 데이터가 많을 경우 비효율적 (update 함수를 통해 일괄 실행)
                pdf.update(views=F("views")+1)
                
                # 보관 기간 정책 처리
                if not POLICY.OVERDUE_ACCESS:
                    if pdf.filter(deadline__lt=datetime.now().date()):
                        return Response({"error_message": "보관 기간이 끝난 데이터에 접근했습니다."}, status=HTTP_406_NOT_ACCEPTABLE)
                    
            # 일치하는 데이터가 없는 경우
            if not pdf:
                return Response({"error_message": "일치하는 데이터가 없습니다."}, status=HTTP_406_NOT_ACCEPTABLE)
            
            serializer = PDFSerializer(pdf, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)