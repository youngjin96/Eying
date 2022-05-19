from rest_framework.response import Response
from rest_framework.status import *
from rest_framework.views import APIView

from .models import CS
from .serializers import CSSerializer

from apps.decorator import TIME_MEASURE
import config.policy as POLICY

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class CSAPI(APIView):
    @swagger_auto_schema(
        operation_summary="/cs/", 
        operation_description="고객문의 목록을 조회하는 API입니다.", 
        responses={
            200: CSSerializer(many=True),
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
            queryset = POLICY.ORDER_BY_RECENT(CS.objects.all())
            serializer = CSSerializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            Response({"error_message": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_summary="/cs/", 
        operation_description="고객문의를 등록하는 API입니다.", 
        request_body=CSSerializer,
        responses={
            200: CSSerializer,
            406: openapi.Response(
                description="",
                examples={
                    "application/json": {
                        "error_message": "포함되지 않은 데이터 정보"
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
                "category": request.data.get("category", "General"),
                "email": request.data.get("email"),
                "phoneNumber": request.data.get("phoneNumber"),
                "title": request.data.get("title", "None"),
                "name": request.data.get("name"),
                "content": request.data.get("content"),
                "isFAQ": request.data.get("isfaq", False),
            }
            
            # 필수 항목 누락 검증
            for key in dataDict.keys():
                if not dataDict[key]:
                    raise Exception("%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH[key])
            
            cs = CS(
                category=dataDict["category"],
                name=dataDict["name"],
                email=dataDict["email"],
                phoneNumber=dataDict["phoneNumber"],
                title=dataDict["title"],
                content=dataDict["content"],
                isFAQ=dataDict["isFAQ"],
            )
            cs.save()
            
            serializer = CSSerializer(cs, many=False)
            return Response(serializer.data, status=HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)