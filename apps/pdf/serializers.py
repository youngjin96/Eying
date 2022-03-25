from rest_framework import serializers
from .models import PDFModel

class PDFSerializer(serializers.ModelSerializer) :
    img_path = serializers.SerializerMethodField()
    def get_img_path(self, obj):
        return "/media/pdfs/" + str(obj.id) + "/images/"
    
    imgs_url = serializers.SerializerMethodField()
    def get_imgs_url(self, obj):
        return ["/media/pdfs/"+str(obj.id)+"/images/"+str(i)+".jpg" for i in range(obj.img_length)]
    
    class Meta :
        model = PDFModel
        fields = (
            'id',
            'name',
            'pdf',
            'img_length',
            'img_path',
            'imgs_url',
        )