from rest_framework import serializers
from .models import CS

from drf_yasg.utils import swagger_serializer_method


class CSSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()
    @swagger_serializer_method(serializer_or_field=serializers.DateField)
    def get_created_at(self, obj):
        return obj.created_at.date()
    
    class Meta:
        model = CS
        fields = '__all__'    