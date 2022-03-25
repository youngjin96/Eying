from re import I
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from rest_framework.response import Response
from .models import PDFModel
from rest_framework.views import APIView
from .serializers import PDFSerializer

from django.views.decorators.csrf import csrf_exempt

class PDFListAPI(APIView):
    def get(self, request):
        queryset = PDFModel.objects.all()
        serializer = PDFSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @csrf_exempt # CSRF 토큰 없이 POST Request 받도록 함
    def post(self, request):
        PDFModel(pdf=request.data['data']).save()
        # print(request.data['data'])
        # print(request.data['data'].name)
        # fs = FileSystemStorage(location='media/', base_url='./')
        # filename = fs.save(request.data['data'].name, request.data['data'])
        # print(fs.url(filename))

        return HttpResponse(200)
        
class PDFViewAPI(APIView):
    def get(self, request, pdf_id):
        queryset = PDFModel.objects.filter(id=pdf_id)
        serializer = PDFSerializer(queryset, many=True)
        return Response(serializer.data)