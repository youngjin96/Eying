from django.shortcuts import render
from rest_framework.views import APIView
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from rest_framework import status
from user.models import User
from pdf.models import PDFModel
from .models import Eyetracking
from .serializers import EyetrackingSerializer

def index(request):
    return HttpResponse("hello")

class EyetrackList(APIView):
    def post(self,request):
        print(request.data)
        # try :

        eyetrackdatas = Eyetracking(user_id = User.objects.get(email=email), owner_id = User.objects.get(email=email), page_num = request.data['page_number'], 
                                    pdf_fk = PDFModel.objects.get(pk=request.data['pdf_id']), rating_time= request.data['rating_time'],coordinate= request.data['coordinate'])
        eyetrackdatas.save()

        serializer = EyetrackingSerializer(eyetrackdatas, many=False)
        return Response(serializer.data, status = status.HTTP_200_OK)
    
    def put(self,request):
        pass
        