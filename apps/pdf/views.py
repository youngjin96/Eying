from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import PDFModel
from user.models import User
from django.db.models import Q
from .serializers import PDFSerializer

import datetime


class PDFAPI(APIView):
    def get(self, request):
        try:
            queryset = PDFModel.objects.all().order_by('-pk') # 등록 최신순
            serializer = PDFSerializer(queryset, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            Response({}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        try:
            try:
                deadline = request.data['deadline']
            except:
                deadline = (datetime.datetime.now() + datetime.timedelta(days=7)).strftime("%Y-%m-%d")
               
            email = request.data['email']
            pdf = request.data['pdf']
                
            # 파일 확장자 Validation
            if pdf.content_type == "application/pdf":
                start = datetime.datetime.now()
                
                pdf = PDFModel(user=User.objects.get(email=email),
                               name=request.data['pdf'].name, 
                               pdf=request.data['pdf'],
                               deadline=deadline,
                               views=0,
                               )
                pdf.save()
                
                end = datetime.datetime.now()
                print("PDF 변환 및 저장 시간 : {0}".format(end-start))
                
                serializer = PDFSerializer(pdf, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                raise
        except Exception as e:
            print(e)
            return Response({'error_message': "이메일 또는 PDF 데이터에 문제가 있습니다."}, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request):
        try:
            print("DELETE 요청")
            return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
        

class PDFSearchAPI(APIView):
    def get(self, request):
        try:
            query_pdf_id = request.GET.get("pdf_id", None)
            query_pdf_name = request.GET.get("pdf_name", None)
            query_username = request.GET.get("username", None)
            query_email = request.GET.get("email", None)
                
            query = Q()
            if query_pdf_id:
                query = query & Q(pk=query_pdf_id)
            if query_pdf_name:
                query = query & Q(name__contains=query_pdf_name)
            if query_username:
                query = query & Q(user=User.objects.get(username=query_username))
            if query_email:
                query = query & Q(user=User.objects.get(email=query_email))
                 
            queryset = PDFModel.objects.filter(query).order_by('-pk')
            # for q in queryset:
            #     q.views += 1
            #     q.save()
                
            serializer = PDFSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({}, status=status.HTTP_400_BAD_REQUEST)