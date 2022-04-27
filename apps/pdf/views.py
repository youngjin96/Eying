import email
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import PDFModel
from user.models import User
from django.db.models import Q
from .serializers import PDFSerializer

import datetime

from apps.decorator import TIME_MEASURE

class PDFAPI(APIView):
    @TIME_MEASURE
    def get(self, request):
        try:
            pdf = PDFModel.objects.all().order_by('-pk') # 등록 최신순
            serializer = PDFSerializer(pdf, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            Response({'error_message': e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @TIME_MEASURE
    def post(self, request):
        try:
            formData = {
                "deadline": request.POST.get("deadline", (datetime.datetime.now()+datetime.timedelta(days=7)).strftime("%Y-%m-%d")),
                "email": request.POST.get("email"),
                "pdf": request.FILES.get("pdf"),
            }
            
            if not formData["email"] or not formData["pdf"]:
                raise Exception("이메일 또는 PDF 데이터에 문제가 있습니다.")
                
            # 파일 확장자 Validation
            if formData["pdf"].content_type == "application/pdf":
                pdf = PDFModel(user=User.objects.get(email=formData["email"]),
                               pdf=formData["pdf"],
                               name=formData["pdf"].name,
                               deadline=formData["deadline"],
                               views=0, 
                               )
                pdf.save()
                
                serializer = PDFSerializer(pdf, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                raise Exception("PDF 파일이 아닙니다.")
        except Exception as e:
            print(e)
            return Response({'error_message': e}, status=status.HTTP_400_BAD_REQUEST)
        
    @TIME_MEASURE
    def put(self, request):
        try:
            formData = {}
            
            print("PUT 요청")
            return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error_message': e}, status=status.HTTP_400_BAD_REQUEST)
        
    @TIME_MEASURE
    def delete(self, request):
        try:
            formData = {
                "pdf_id": request.POST.get("pdf_id"),
            }
            
            if not formData["pdf_id"]:
                raise Exception("PDF ID가 필요합니다.")
            
            pdf = PDFModel.objects.get(pk=formData["pdf_id"])
            pdf.delete()
            
            return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error_message': e}, status=status.HTTP_400_BAD_REQUEST)
        

class PDFSearchAPI(APIView):
    @TIME_MEASURE
    def get(self, request):
        try:
            quertDict = {
                "pdf_id": request.GET.get("pdf_id"),
                "pdf_name": request.GET.get("pdf_name"),
                "username": request.GET.get("username"),
                "email": request.GET.get("email"),
            }
            
            query = Q()
            if quertDict["pdf_id"]:
                query &= Q(pk=quertDict["pdf_id"])
            if quertDict["pdf_name"]:
                query &= Q(name__contains=quertDict["pdf_name"])
            if quertDict["username"]:
                query &= Q(user=User.objects.get(username=quertDict["username"]))
            if quertDict["email"]:
                query &= Q(user=User.objects.get(email=quertDict["email"]))
                 
            queryset = PDFModel.objects.filter(query).order_by('-pk')
            # for q in queryset:
            #     q.views += 1
            #     q.save()
                
            serializer = PDFSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error_message': e}, status=status.HTTP_400_BAD_REQUEST)