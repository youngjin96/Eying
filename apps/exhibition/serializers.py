from rest_framework import serializers
from .models import Exhibition

class ExhibitionSerializer(serializers.ModelSerializer) :
    class Meta :
        model = Exhibition       # product 모델 사용
        fields = '__all__'    