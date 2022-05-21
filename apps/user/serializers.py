from rest_framework import serializers
from .models import User
from pdf.models import PDFModel

from drf_yasg.utils import swagger_serializer_method


class UserSerializer(serializers.ModelSerializer):
    upload_count = serializers.SerializerMethodField()
    @swagger_serializer_method(serializer_or_field=serializers.IntegerField)
    def get_upload_count(self, obj):
        return len(PDFModel.objects.filter(user=obj))
    
    class Meta:
        model = User
        # fields = '__all__'    # 전체 필드 직렬화
        exclude = (             # 특정 필드 제외 직렬화
            'password',         # 비밀번호
            'last_login',       # 마지막 로그인
            'date_joined',      # 회원가입 일자
            'first_name',       # 이름 
            'last_name',        # 성
            'is_superuser',     # 최상위 관리자
            'is_staff',         # 관리자
            'is_active',        # 계정 활성화
            'groups',           # 그룹
            'user_permissions', # 권한 그룹
            )