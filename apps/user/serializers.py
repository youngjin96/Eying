from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer) :
    class Meta :
        model = User        # product 모델 사용
        fields = '__all__'    