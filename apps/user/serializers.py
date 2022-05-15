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
            'password',
            'first_name',
            'last_name',
            'is_superuser',
            'is_staff',
            'is_active',
            'groups',
            'user_permissions',
            )