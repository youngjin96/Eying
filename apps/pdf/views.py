from rest_framework.response import Response
from rest_framework import status
from .models import PDFModel
from user.models import User
from django.db.models import Q
from rest_framework.views import APIView
from .serializers import PDFSerializer

import json
from django.views.decorators.csrf import csrf_exempt

class PDFAPI(APIView):
    def get(self, request):
        try:
            queryset = PDFModel.objects.all().order_by('-pk') # 등록 최신순
            serializer = PDFSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            Response({}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
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
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                Response({}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error_message': pdf}, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request):
        try:
            print("DELETE 요청")
            return Response({}, status=status.HTTP_200_OK)
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
        
        
class PDFSearchAPI(APIView):
    def get(self, request):
        try:
            query_pdf_id = request.GET.get("pdf_id", None)
            query_pdf_name = request.GET.get("pdf_name", None)
            query_user_id = request.GET.get("user_id", None)
            query_user_name = request.GET.get("user_name", None)
                
            if len(request.GET) == 0:   # 조건 미입력
                queryset = PDFModel.objects.all()
                serializer = PDFSerializer(queryset, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:                       # 조건 입력
                query = Q()
                if query_pdf_id:
                    query = query & Q(pk=query_pdf_id)
                if query_pdf_name:
                    query = query & Q(name__contains=query_pdf_name)
                if query_user_id:
                    query = query & Q(user=query_user_id)
                if query_user_name:
                    query = query & Q(user=User.objects.get(username=query_user_name))
                
                if query == Q():
                    raise
                
                queryset = PDFModel.objects.filter(query)
                serializer = PDFSerializer(queryset, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)