from django.shortcuts import render
from numpy import eye
from rest_framework.views import APIView
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from rest_framework import status
from user.models import User
from pdf.models import PDFModel
from .models import Eyetracking
from .serializers import EyetrackingSerializer,EyetrackingUserList,Userlist,CoordinateSerializer
from django.db.models import F
from apps.settings import STATIC_URL
from .heatmap import Heatmapper
from PIL import Image
from PIL import ImageDraw
import matplotlib.pyplot as plt
# import urllib.request # 웹 상의 이미지를 다운로드 없이 사용
from io import BytesIO
from urllib import request
import datetime
import urllib.request
import ast
from pdf.serializers import PDFSerializer

        # if queryDict['visual_type'] == 'flow':
        # # 이미지 위에 히트맵 그리기
        #     heatmap = heatmapper.heatmap_on_img(coordinate,_img)
        #     heatmap.save('image/'+img_path+'png')
        #     queryDict['visual_img'] = heatmap
        #     serializer = EyetrakcingSerializer(queryset, many=True)
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
        user_email = request.data['user_email']
        owner_email = request.data['owner_email']
        coordinate = request.data['coordinate']
        page_num = request.data['page_number']
        pdf_id = request.data['pdf_id']
        rating_time = request.data['rating_time']
        
        # 트래킹 데이터 이어쓰기
        if Eyetracking.objects.get(pdf_fk=PDFModel.objects.get(pk=pdf_id),
                                    user_id=User.objects.get(email=user_email),
                                    page_num=page_num):
            return self.put(request)

        eyetrackdatas = Eyetracking(user_id = User.objects.get(email=user_email),
                                    owner_id = User.objects.get(email=owner_email),
                                    page_num = page_num, 
                                    pdf_fk = PDFModel.objects.get(pk=pdf_id),
                                    rating_time= rating_time,
                                    coordinate= coordinate)
        eyetrackdatas.save()


        serializer = EyetrackingSerializer(eyetrackdatas, many=False)
        return Response(serializer.data, status = status.HTTP_200_OK)
        # except:
        #     return Response({'error_message': "post 오류"}, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        eyetrackdatas = Eyetracking.objects.get(pdf_fk=PDFModel.objects.get(pk=request.data['pdf_id']),
                                                user_id=User.objects.get(email=request.data['user_email']),
                                                page_num=request.data['page_number'])
        
        delta_time = datetime.time.fromisoformat(request.data['rating_time'])
        
        # 시, 분, 초 업데이트
        previous_time = datetime.datetime(year=1900, month=1, day=1,
                                          hour=eyetrackdatas.rating_time.hour,
                                          minute=eyetrackdatas.rating_time.minute,
                                          second=eyetrackdatas.rating_time.second)
        
        delta_time = datetime.timedelta(hours=delta_time.hour,
                                        minutes=delta_time.minute,
                                        seconds=delta_time.second)
        
        eyetrackdatas.rating_time = (previous_time + delta_time).time()

        # 시선 추적 데이터 이어쓰기
        eyetrackdatas.coordinate = eyetrackdatas.coordinate[:-1] + ", " + request.data['coordinate'][1:-1] + "]"
        
        eyetrackdatas.save()
        
        serializer = EyetrackingSerializer(eyetrackdatas, many=False)
        return Response(serializer.data)

class EyetrackPdf(APIView):
    # 해당 유저가 올린 pdf 리스트
    def get(self,request):
        quertDict = {
                "email": request.GET.get("user_email"),
            }
        query = User.objects.get(email=quertDict["email"])
        queryset = PDFModel.objects.filter(user = query)
        # query 
        serializer = PDFSerializer(queryset,many =True)
        return Response(serializer.data,status=status.HTTP_200_OK)
        
class EyetrackUser(APIView):
    def get(self,request):
        try:
            queryDict = {
                "email" : request.GET.get("user_email"),
                'pdf_id' : request.GET.get('pdf_id'),
                'page_num' : request.GET.get('page_number')
            }
            
            queryset = Eyetracking.objects.filter(pdf_fk = queryDict['pdf_id'],page_num=queryDict['page_num']).annotate(
                pdf_id=F('pdf_fk__pk'),
                age=F('user_id__age'),
                job = F("user_id__job"),
                job_field=F('user_id__job_field'),
                position=F('user_id__position'),
                gender=F('user_id__gender'),
                email=F('user_id__email')
            ).values('id','user_id','create_date','age','job','job_field','position','gender','email','pdf_id')
     
            # print("query",queryset)
            serializer = EyetrackingUserList(queryset,many = True)
            print(serializer)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            return Response({'error_message': "user list 오류"})
    
        
class EyetrackVisualization(APIView):    
    global heatmapper
    def get(self,request): 
        try:
            # 해당 유저들에 대한 좌표 선택
            queryDict = {
                'user_id' : request.GET.get("user_email"), 
                'pdf_id' : request.GET.get("pdf_id"), 
                'page_num' : request.GET.get('page_number'),
                'visual_type' : request.GET.get('visual_type'),
                'owner_email' : request.GET.get('owner_email')
            }
            owner_pk = User.objects.get(email=queryDict['owner_email']).pk
            
            # 이미지 url
            img_path = STATIC_URL+"media/public/user_{0}/pdf/pdf_{1}/images/{2}.jpg".format(owner_pk, queryDict['pdf_id'], queryDict['page_num'])
            print("img_path",img_path)
            
            res = HttpResponse(content_type="image/png")
            
            
                # _img.save(res, "JPEG")
                # res['Content-Disposition'] = 'attachment; filename="visual.jpg"'
                
                # return res
            try:
                web_img = urllib.request.urlopen(img_path).read()
                # print("web_img",web_img)
                # _img = Image.open((img_path))
                _img = Image.open(BytesIO(web_img))
                print("이미지이이이", _img)
                _img = _img.convert("RGBA")
                print("이미지2", _img)
            except Exception as e:
                print("이미지 에러",e)
                return Response({'error_message': "이미지 에러"})
            
            # Mysql 쿼리 - eyetracking data 가져오기
            query = Eyetracking.objects.filter(owner_id=owner_pk,page_num=queryDict['page_num'],pdf_fk=queryDict['pdf_id'])[0]
            print(query)
            coordinate = ast.literal_eval(query.coordinate)
            try:
                if queryDict['visual_type'] == 'distribution':
                # 이미지 위에 히트맵 그리기
                    try:
                        heatmap = heatmapper.heatmap_on_img(coordinate, _img)
                        print(heatmap)     
                        heatmap.save(res, "PNG")
                        res['Content-Disposition'] = 'attachment; filename="visual.png"'
                        return res              
                    except Exception as e:
                        print("히트맵 오류",e)
                        return Response({'error_message': "히트맵 에러"})
                    # return Response({'hh':heatmap}, status=status.HTTP_200_OK)
            except Exception as e:
                print("에러명",e)
                return Response(e, status=status.HTTP_200_OK)
            # elif queryDict['visual_type'] == 'flow':
            # # 시각흐름
            #     draw = ImageDraw.Draw(_img)
            #     color = ["#FF0000", "#FF5E00", "#FFBB00", "#FFE400", "#ABF200", "#1DDB16", "#00D8FF", "#0054FF", "#0100FF", "#5F00FF"]
            #     for i in range(len(coordinate)-1):
            #         x,y = coordinate[i]
            #         x2,y2 = coordinate[i+1]
            #         draw.line((x,y,x2,y2),fill = color[i//10%10] ,width = 5)
            #     _img.save("image/ex1heatmap"+'flow.png')
            #     queryDict['visual_img'] = _img
                
            #     serializer = PDFSerializer(queryset, many=True)
            #     return Response(serializer.data, status=status.HTTP_200_OK)

            # else:
            #     return Response({'error_message': "visual type error"}, status=status.HTTP_400_BAD_REQUEST)
            # return Response({'query_corr':query.coordinate})
        except Exception as e: 
        #     # print("해당하는 eyetrakcing 객체가 없습니다.")
            print(e)
            return Response({'error_message': "해당하는 eyetracking 객체가 없습니다."})

            # coordinate = query.coordinate
            # return Response(serializer.data, status=status.HTTP_200_OK)
            

