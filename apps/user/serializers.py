from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer) :
    class Meta:
        model = User
        # fields = '__all__'    # 전체 필드 직렬화
        exclude = (             # 특정 필드 제외 직렬화
            'password',
            'is_superuser',
            'is_staff',
            'is_active',
            'groups',
            'user_permissions',
            )