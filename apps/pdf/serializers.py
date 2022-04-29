from rest_framework import serializers
from .models import PDFModel

     
class PDFSerializerLambdaField(serializers.SerializerMethodField):
    def bind(self, field_name, parent):
        super(serializers.SerializerMethodField, self).bind(field_name, parent)
        
    def to_representation(self, value):
        return self.method_name(value)
    
    
class PDFSerializer(serializers.ModelSerializer):
    pdf_name = PDFSerializerLambdaField(lambda obj: obj.name)
    user_name = PDFSerializerLambdaField(lambda obj: obj.user.username)
    user_email = PDFSerializerLambdaField(lambda obj: obj.user.email)
    imgs_url = PDFSerializerLambdaField(lambda obj: ["%s%d.jpg" % (obj.img_path, i) for i in range(obj.img_length)])
    
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
   