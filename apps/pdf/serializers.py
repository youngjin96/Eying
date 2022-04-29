from rest_framework import serializers
from .models import PDFModel

from apps.settings import AWS_S3_CUSTOME_DOMAIN

class PDFSerializer(serializers.ModelSerializer):
    pdf_name = serializers.SerializerMethodField()
    def get_pdf_name(self, obj):
        return obj.name
    
    user_name = serializers.SerializerMethodField()
    def get_user_name(self, obj):
        return obj.user.username
    
    user_email = serializers.SerializerMethodField()
    def get_user_email(self, obj):
        return obj.user.email
    
    imgs_url = serializers.SerializerMethodField()
    def get_imgs_url(self, obj):
        return ["%s%d.jpg" % (obj.img_path, i) for i in range(obj.img_length)]
    
    class Meta:
        model = PDFModel
        fields = (
            'id',
            'pdf_name',
            'pdf',
            'upload_at',
            'deadline',
            'user_name',
            'user_email',
            'views',
            'img_length',
            'imgs_url',
        )