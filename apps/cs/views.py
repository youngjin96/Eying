from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import CS
from django.db.models import Q
from .serializers import CSSerializer

from apps.decorator import TIME_MEASURE
import config.policy as POLICY


class CSAPI(APIView):
    @TIME_MEASURE
    def get(self, request):
        try:
            queryset = POLICY.ORDER_BY_RECENT(CS.objects.all())
            serializer = CSSerializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            Response({"error_message": str(e)})
    
    @TIME_MEASURE
    def post(self, request):
        try:
            formData = {
                "email": request.POST.get("email"),
                "phoneNumber": request.POST.get("phoneNumber"),
                "name": request.POST.get("name"),
                "content": request.POST.get("content"),
            }
            
            # 필수 항목 누락 검증
            for key in formData.keys():
                if not formData[key]:
                    raise Exception("%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH[key])
            
            cs = CS(
                name=formData["name"],
                email=formData["email"],
                phoneNumber=formData["phoneNumber"],
                content=formData["content"],
            )
            cs.save()
            serializer = CSSerializer(cs, many=False)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)})