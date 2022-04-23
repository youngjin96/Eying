from rest_framework import serializers
from .models import PDFModel

from apps.settings import AWS_S3_CUSTOME_DOMAIN

class PDFSerializer(serializers.ModelSerializer):
    pdf_name = serializers.SerializerMethodField()
    def get_pdf_name(self, obj):
        return obj.name
    
    user_id = serializers.SerializerMethodField()
    def get_user_id(self, obj):
        return obj.user.id
    
    user_name = serializers.SerializerMethodField()
    def get_user_name(self, obj):
        return obj.user.username
    
    user_email = serializers.SerializerMethodField()
    def get_user_email(self, obj):
        return obj.user.email
    
    imgs_url = serializers.SerializerMethodField()
    def get_imgs_url(self, obj):
        return ["https://{0}/pdf/{1}/{2}/{3}.jpg".format(AWS_S3_CUSTOME_DOMAIN, str(obj.user.id), str(obj.id), str(i)) for i in range(obj.img_length)]
    
    class Meta:
        model = PDFModel
        fields = (
            'id',
            'pdf_name',
            'pdf',
            'user_id',
            'user_name',
            'user_email',
            'upload_at',
            'deadline',
            'views',
            'img_length',
            'imgs_url',
        )