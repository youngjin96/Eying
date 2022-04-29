from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import PDFModel
from user.models import User
from django.db.models import Q
from .serializers import PDFSerializer

from apps.decorator import TIME_MEASURE
from config.policy import deadline

from unicodedata import normalize

class PDFAPI(APIView):
    @TIME_MEASURE
    def get(self, request):
        return PDFSearchAPI.get(self, request)
    
    @TIME_MEASURE
    def post(self, request):
        try:
            formData = {
                "deadline": request.POST.get("deadline", deadline()),
                "email": request.POST.get("email"),
                "job_field": request.POST.get("job_field"),
                "pdf": request.FILES.get("pdf"),
            }
            
            # Email & File Validation
            if not formData["email"] or not formData["pdf"] or formData["pdf"].content_type != "application/pdf":
                raise Exception("이메일 또는 PDF 데이터에 문제가 있습니다.")
                
            pdf = PDFModel(user=User.objects.get(email=formData["email"]),
                            pdf=formData["pdf"],
                            name=normalize("NFC", formData["pdf"].name),
                            deadline=formData["deadline"],
                            views=0,
                            job_field=formData["job_field"],
                            )
            pdf.save()
            
            serializer = PDFSerializer(pdf, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    @TIME_MEASURE
    def put(self, request):
        try:
            formData = {
                "deadline": request.POST.get("deadline"),
            }
            
            print("PUT 요청")
            return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
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
            return Response({'error_message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

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
                        
            # 요청 쿼리 처리
            query = Q() 
            if quertDict["pdf_id"]:
                query &= Q(pk=quertDict["pdf_id"])
            if quertDict["pdf_name"]:
                query &= Q(name__contains=quertDict["pdf_name"])
            if quertDict["username"]:
                query &= Q(user=User.objects.get(username=quertDict["username"]))
            if quertDict["email"]:
                query &= Q(user=User.objects.get(email=quertDict["email"]))
                 
            pdf = PDFModel.objects.filter(query).order_by('-pk')
            
            # 조회수 증가
            # for q in pdf:
            #     q.views += 1
            #     q.save(update_fields=['views'])
                
            serializer = PDFSerializer(pdf, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)}, status=status.HTTP_400_BAD_REQUEST)