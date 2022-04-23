from rest_framework.response import Response
from rest_framework import status
from .models import CS
from django.db.models import Q
from rest_framework.views import APIView
from .serializers import CSSerializer
from django.views.decorators.csrf import csrf_exempt
import json

class CSAPI(APIView):
    def get(self, request):
        try:
            queryset = CS.objects.all().order_by('-pk')
            serializer = CSSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            Response({}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @csrf_exempt
    def post(self, request):
        error_message = "알 수 없는 오류가 발생했습니다."
        try:
            data = json.loads(request.body.decode('utf-8'))
            
            cs = CS(
                name=data["name"],
                email=data["email"],
                phoneNumber=data["phoneNumber"],
                content=data["content"],
            )
            cs.save()
            serializer = CSSerializer(cs, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error_message': error_message}, status=status.HTTP_400_BAD_REQUEST)