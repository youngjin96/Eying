from rest_framework.response import Response
from rest_framework import status
from .models import PDFModel
from user.models import User
from rest_framework.views import APIView
from .serializers import PDFSerializer

import json
from django.views.decorators.csrf import csrf_exempt

class PDFAPI(APIView):
    def get(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))

            if "pdf_id" in data:
                queryset = PDFModel.objects.filter(pk=data["pdf_id"])
            elif "user_id" in data:
                queryset = PDFModel.objects.filter(user=data["user_id"])
            else:
                raise
        except:
            queryset = PDFModel.objects.all()
        finally:
            serializer = PDFSerializer(queryset, many=True)
            return Response(serializer.data)
            
    
    @csrf_exempt # CSRF 토큰 없이 POST Request 받도록 함
    def post(self, request):
        try:
            pdf = request.data['data']
            
            # 파일 확장자 Validation
            if pdf.content_type == "application/pdf":
                pdf = PDFModel(user=User.objects.get(pk=1), 
                               name=request.data['data'].name, 
                               pdf=request.data['data'])
                pdf.save()
                
                serializer = PDFSerializer(pdf, many=False)
                return Response(serializer.data)
            else:
                Response({'data': ""}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'data': pdf}, status=status.HTTP_400_BAD_REQUEST)