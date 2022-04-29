from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import CS
from django.db.models import Q
from .serializers import CSSerializer

import json

from apps.decorator import TIME_MEASURE

class CSAPI(APIView):
    @TIME_MEASURE
    def get(self, request):
        try:
            queryset = CS.objects.all().order_by('-pk')
            serializer = CSSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            Response({"error_message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @TIME_MEASURE
    def post(self, request):
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
            return Response({'error_message': str(e)}, status=status.HTTP_400_BAD_REQUEST)