from re import I
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from rest_framework.response import Response
from .models import PDFModel
from rest_framework.views import APIView
from .serializers import PDFSerializer
from settings import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_STORAGE_BUCKET_NAME
import boto3
from django.views.decorators.csrf import csrf_exempt

class PDFListAPI(APIView):
    def get(self, request):
        queryset = PDFModel.objects.all()
        serializer = PDFSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @csrf_exempt # CSRF 토큰 없이 POST Request 받도록 함
    def post(self, request):
        pdf = request.data['data']
        print(request.data)
        s3r = boto3.resource('s3', aws_access_key_id = AWS_ACCESS_KEY_ID, aws_secret_access_key= AWS_SECRET_ACCESS_KEY)
        s3r.Bucket(AWS_STORAGE_BUCKET_NAME).put_object( Key='pdf/'+request.data['data'].name, Body=pdf, ContentType='pdf')
        return HttpResponse(200)
        
class PDFViewAPI(APIView):
    def get(self, request, pdf_id):
        queryset = PDFModel.objects.filter(id=pdf_id)
        serializer = PDFSerializer(queryset, many=True)
        return Response(serializer.data)