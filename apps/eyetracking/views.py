from django.shortcuts import render
from rest_framework.views import APIView
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from rest_framework import status
from user.models import User
from pdf.models import PDFModel
from .models import Eyetracking
from .serializers import EyetrackingSerializer,EyetrackingUserList,Userlist
from user.serializers import UserSerializer
from django.db.models import Count,Min
from .heatmap import Heatmapper
from PIL import Image
from PIL import ImageDraw
import matplotlib.pyplot as plt

from apps.settings import AWS_S3_CUSTOME_DOMAIN
import boto3
from apps.settings import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_STORAGE_BUCKET_NAME


from pdf.serializers import PDFSerializer

heatmapper = Heatmapper(
    point_diameter=100,  # the size of each point to be drawn
    point_strength=1,  # the strength, between 0 and 1, of each point to be drawn
    opacity=0.5,  # the opacity of the heatmap layer
    colours='default',  # 'default' or 'reveal'
                        # OR a matplotlib LinearSegmentedColorMap object 
                        # OR the path to a horizontal scale image
    grey_heatmapper='PIL'  # The object responsible for drawing the points
                           # Pillow used by default, 'PySide' option available if installed
)


class EyetrackList(APIView):
    def post(self,request):
        print(request.data)
        # try :
        coordinate = request.data['coordinate']
        page_num = request.data['page_number']
        pdf_id = request.data['pdf_id']

        eyetrackdatas = Eyetracking(user_id = User.objects.get(email=request.data['user_email']), owner_id = User.objects.get(email=request.data['owner_email']), page_num = page_num, 
                                    pdf_fk = PDFModel.objects.get(pk=pdf_id), rating_time= request.data['rating_time'],coordinate= coordinate)
        eyetrackdatas.save()


        serializer = EyetrackingSerializer(eyetrackdatas, many=False)
        return Response(serializer.data, status = status.HTTP_200_OK)
        # except:
        #     return Response({'error_message': "post 오류"}, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request):
        pass


class EyetrackPdf(APIView):
    # 해당 유저가 올린 pdf 리스트
    def get(self,request):
        print(User.objects.get(email=request.data['user_email']).pk)
        queryset = PDFModel.objects.filter(user = User.objects.get(email=request.data['user_email']).pk).order_by('-pk')
        # query 
        serializer = PDFSerializer(queryset,many =True)
        return Response(serializer.data,status=status.HTTP_200_OK)
        
class EyetrackUser(APIView):
    def get(self,request):
        pdf_id = request.data['pdf_id']
        page_num = request.data['page_number']
        queryset = Eyetracking.objects.filter(pdf_fk = pdf_id).values_list('user_id','create_date').annotate(first=Min('create_date'))
        print("queryset",queryset)
        # a_post = Eyetracking.objects.get()
        # print(queryset.rater_set.all())
        # rows = Eyetracking.objects.prefetch_related('user.rater').filter(pdf_fk = pdf_id)
        # print("rows",rows)
        # user = User.objects.get(pk=queryset.user_id)
        # user = User.objects.filter(id__in=queryset)
        # print(user)
        # serializer = Userlist(user,many = True)
        # print("user_serail",serializer.data)
        # serializer = EyetrackingUserList(queryset,many = True)
        # serializerr = EyetrackingUserList(serializer.data,many = True)
        # print(serializer)
        # return Response(serializer.data,status=status.HTTP_200_OK)
        
# class EyetrackVisualization(APIView):
#     global heatmapper
#     def get(self,request): 

#         # 해당 유저들에 대한 좌표 선택
#         queryset : {
#             'owner_email' : User.objects.get(email=request.data['owner_email']),
#             'pdf_id' : PDFModel.objects.get(pk=request.data['pdf_id']),
#             'page_num' : request.data['page_number'],
#             'visual_type' : request.data['visual_type'],
#             'visual_img' : 'img'
#         }

#         # 이미지 url
#         img_path = "media/public/pdf/{0}/{1}/images/{2}.jpg".format(queryset.owner_email,queryset.pdf_id, queryset.page_num)
#         _img = Image.open(img_path)

#         # Mysql 쿼리 - eyetracking data 가져오기
#         coordinate = []

#         if queryset.visual_type == 'flow':
#         # 이미지 위에 히트맵 그리기
#             heatmap = heatmapper.heatmap_on_img(coordinate,_img)
#             heatmap.save('image/ex1heatmap.png')
#             queryset['visual_img'] = heatmap
#             serializer = EyetrakcingSerializer(queryset, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)

#         elif queryset.visual_type == 'distribution':
#         # 시각흐름
#             draw = ImageDraw.Draw(_img)
#             color = ["#FF0000", "#FF5E00", "#FFBB00", "#FFE400", "#ABF200", "#1DDB16", "#00D8FF", "#0054FF", "#0100FF", "#5F00FF"]
#             for i in range(len(coordinate)-1):
#                 x,y = coordinate[i]
#                 x2,y2 = coordinate[i+1]
#                 draw.line((x,y,x2,y2),fill = color[i//10%10] ,width = 5)
#             _img.save("image/ex1heatmap"+'flow.png')
#             queryset['visual_img'] = _img
            
#             serializer = PDFSerializer(queryset, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)

#         else:
#             return Response({'error_message': "visual type error"}, status=status.HTTP_400_BAD_REQUEST)

