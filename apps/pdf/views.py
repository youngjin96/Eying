from rest_framework.response import Response
from rest_framework import status
from .models import PDFModel
from user.models import User
from rest_framework.views import APIView
from .serializers import PDFSerializer

from django.views.decorators.csrf import csrf_exempt


class PDFAPI(APIView):
    def get(self, request):
        # Get Option에 따라서 전체 데이터, PDF_ID, USER_ID별 데이터 반환할 예정
        queryset = PDFModel.objects.all()
        serializer = PDFSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @csrf_exempt # CSRF 토큰 없이 POST Request 받도록 함
    def post(self, request):
        try:
            pdf = request.data['data']
            # print(pdf)
            
            # 파일 확장자 Validation
            if pdf.content_type == "application/pdf":
                pdf = PDFModel(user=User.objects.get(pk=1), name=request.data['data'].name, pdf=request.data['data'])
                pdf.save()
                
                queryset = PDFModel.objects.get(pk=pdf.id)
                serializer = PDFSerializer(queryset, many=False)
                return Response(serializer.data)
        except:
            return Response({'data': pdf}, status=status.HTTP_400_BAD_REQUEST)