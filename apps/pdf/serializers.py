from rest_framework import serializers
from yaml import serialize
from .models import PDFModel

from drf_yasg.utils import swagger_serializer_method

     
class PDFSerializerLambdaField(serializers.SerializerMethodField):
    def bind(self, field_name, parent):
        super(serializers.SerializerMethodField, self).bind(field_name, parent)
        
    def to_representation(self, value):
        return self.method_name(value)
    
    
class PDFSerializer(serializers.ModelSerializer):
    pdf_name = serializers.SerializerMethodField()
    @swagger_serializer_method(serializer_or_field=serializers.CharField)
    def get_pdf_name(self, obj):
        return obj.name.rstrip(".pdf")
    
    user_name = serializers.SerializerMethodField()
    @swagger_serializer_method(serializer_or_field=serializers.CharField)
    def get_user_name(self, obj):
        return obj.user.username
    
    user_email = serializers.SerializerMethodField()
    @swagger_serializer_method(serializer_or_field=serializers.CharField)
    def get_user_email(self, obj):
        return obj.user.email
    
    imgs_url = serializers.SerializerMethodField()
    @swagger_serializer_method(serializer_or_field=serializers.ListField)
    def get_imgs_url(self, obj):
        return ["%s%d.jpg" % (obj.img_path, i) for i in range(obj.img_length)]
    
    
    class Meta:
        model = PDFModel
        fields = (
            'id',
            'pdf_name',
            'pdf',
            'job_field',
            'upload_at',
            'deadline',
            'views',
            'user_name',
            'user_email',
            'img_length',
            'imgs_url',
        )
   