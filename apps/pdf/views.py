from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PDFModel
from user.models import User
from django.db.models import Q, F
from .serializers import PDFSerializer

from apps.decorator import TIME_MEASURE
import config.policy as POLICY

from unicodedata import normalize
from datetime import datetime

class PDFAPI(APIView):
    @TIME_MEASURE
    def get(self, request):
        return PDFSearchAPI.get(self, request)
    
    @TIME_MEASURE
    def post(self, request):
        try:
            formData = {
                "deadline": request.POST.get("deadline", POLICY.DEADLINE()),
                "email": request.POST.get("email"),
                "job_field": request.POST.get("job_field"),
                "pdf": request.FILES.get("pdf"),
            }
            
            # 필수 항목 누락 검증
            for key in ['email', 'job_field', 'pdf']:
                if not formData[key]:
                    raise Exception("%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH[key])
            
            # 파일 포맷 검증
            if formData["pdf"].content_type != "application/pdf":
                raise Exception("파일 확장자가 올바르지 않습니다.")
            
            # 이메일 검증
            if not User.objects.get(email=formData["email"]):
                raise Exception("존재하지 않는 이메일 입니다.")
                
            pdf = PDFModel(user=User.objects.get(email=formData["email"]),
                            pdf=formData["pdf"],
                            name=normalize("NFC", formData["pdf"].name),
                            deadline=formData["deadline"],
                            views=0,
                            job_field=formData["job_field"],
                            )
            pdf.save()
            
            serializer = PDFSerializer(pdf, many=False)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)})
        
    @TIME_MEASURE
    def put(self, request):
        try:
            formData = {
                "pdf_id": request.POST.get("pdf_id"),
                "deadline": request.POST.get("deadline"),
            }

            # 필수 항목 누락 검증
            if not formData["pdf_id"]:
                raise Exception("%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH["pdf_id"])
            
            # 데이터 유효성 검증
            pdf = PDFModel.objects.get(pk=formData["pdf_id"])
            if not pdf:
                raise Exception("존재하지 않는 PDF 입니다.")
            
            # PDF 보관 기간 변경
            if formData["deadline"]:
                pdf.deadline = formData["deadline"]
                
            pdf.save()
            
            serializer = PDFSerializer(pdf, many=False)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)})
        
    @TIME_MEASURE
    def delete(self, request):
        try:
            formData = {
                "pdf_id": request.POST.get("pdf_id"),
            }
            
            # 필수 항목 누락 검증
            if not formData["pdf_id"]:
                raise Exception("%s 데이터가 없습니다." % POLICY.QUERY_NAME_MATCH["pdf_id"])
            
            # 데이터 유효성 검증
            pdf = PDFModel.objects.get(pk=formData["pdf_id"])
            if not pdf:
                raise Exception("존재하지 않는 PDF 입니다.")
            
            pdf.delete()
            
            return Response()
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)})
        

class PDFSearchAPI(APIView):
    @TIME_MEASURE
    def get(self, request):
        try:
            quertDict = {
                "pdf_id": request.GET.get("pdf_id"),
                "name": request.GET.get("name"),
                "username": request.GET.get("username"),
                "email": request.GET.get("email"),
                "view": request.GET.get("view"),
            }
                        
            # 요청 쿼리 처리
            query = Q() 
            if quertDict["pdf_id"]:
                query &= Q(pk=quertDict["pdf_id"])
            if quertDict["name"]:
                query &= Q(name__contains=quertDict["name"])
            if quertDict["username"]:
                query &= Q(user=User.objects.get(username=quertDict["username"]))
            if quertDict["email"]:
                query &= Q(user=User.objects.get(email=quertDict["email"]))
                 
            pdf = POLICY.ORDER_BY_RECENT(PDFModel.objects.filter(query))
            
            # Track을 위한 요청시 조회수 증가 처리
            if quertDict["view"]:
                # 반복문은 데이터가 많을 경우 비효율적 (update 함수를 통해 일괄 실행)
                pdf.update(views=F("views")+1)
                
                # 보관 기간 정책 처리
                if not POLICY.OVERDUE_ACCESS:
                    if pdf.filter(deadline__lt=datetime.now().date()):
                        raise Exception("보관 기간이 끝난 데이터에 접근했습니다.")
                    
            # 일치하는 데이터가 없는 경우
            if not pdf:
                raise Exception("일치하는 데이터가 없습니다.")
            
            serializer = PDFSerializer(pdf, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({'error_message': str(e)})