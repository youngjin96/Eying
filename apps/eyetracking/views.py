from django.shortcuts import render
from rest_framework.views import APIView
from django.http import HttpResponse, JsonResponse
# Create your views here.
from user.models import User
from pdf.models import PDFModel
from .models import Eyetracking

def index(request):
    return HttpResponse("hello")

class EyetrackList(APIView):
    def post(self,request):
        print(request.data)
        # try :
        eyetrackdatas = Eyetracking(user_id = User.objects.get(pk=1), owner_id = User.objects.get(pk=1), page_num = request.data['page_num'], 
                                    pdf_fk = PDFModel.objects.get(pk=1), rating_time= request.data['rating_time'],coordinate= request.data['coordinate'])
        eyetrackdatas.save()
        return HttpResponse(200)
    
    def put(self,request):
        pass
        