from rest_framework import serializers
from .models import PDFModel

from apps.settings import AWS_S3_CUSTOME_DOMAIN

class PDFSerializer(serializers.ModelSerializer) :
    img_path = serializers.SerializerMethodField()
    def get_img_path(self, obj):
        return AWS_S3_CUSTOME_DOMAIN+"/pdf/{0}/{1}/images/".format(str(obj.user.id), str(obj.id))
    
    imgs_url = serializers.SerializerMethodField()
    def get_imgs_url(self, obj):
        return [AWS_S3_CUSTOME_DOMAIN+"/pdf/{0}/{1}/images/{2}.jpg".format(str(obj.user.id), str(obj.id), str(i)) for i in range(obj.img_length)]
    
    class Meta :
        model = PDFModel
        fields = (
            'id',
            'user',
            'name',
            'img_length',
            'img_path',
            'imgs_url',
        )