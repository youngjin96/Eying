from rest_framework import serializers
from .models import Eyetracking
# get 요청이 왔을 때 응답할 data 가공
class EyetrackingSerializer(serializers.ModelSerializer) :
    class Meta :
        model = Eyetracking     # product 모델 사용
        fields = '__all__'    