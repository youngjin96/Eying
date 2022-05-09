from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CS
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
            dataDict = {
                "email": request.data.get("email"),
                "phoneNumber": request.data.get("phoneNumber"),
                "name": request.data.get("name"),
                "content": request.data.get("content"),
            }
            
            # 필수 항목 누락 검증
            for key in dataDict.keys():
                if not dataDict[key]:
                    raise Exception("%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH[key])
            
            cs = CS(
                name=dataDict["name"],
                email=dataDict["email"],
                phoneNumber=dataDict["phoneNumber"],
                content=dataDict["content"],
            )
            cs.save()
            
            serializer = CSSerializer(cs, many=False)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)})