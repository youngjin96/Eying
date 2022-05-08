from django.db import models
from user.models import User

from apps.settings import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_CUSTOME_DOMAIN, AWS_STORAGE_BUCKET_NAME, DEBUG
import boto3

from pdf2image import convert_from_bytes
from io import BytesIO

# S3 Access
s3r = boto3.resource('s3', aws_access_key_id = AWS_ACCESS_KEY_ID, aws_secret_access_key= AWS_SECRET_ACCESS_KEY)

# Storage OPTION
STORAGE_TYPE = "media"
STORAGE_ACCESS = "public"
CONTENT_TYPE = "image/jpeg"

# Buffer Image
BUFFER_IMAGE_TYPE = "JPEG"

# PDF Convertion OPTION
DPI = 100
FMT = "jpeg"


# PDF File Path Customizing
def pdf_path(instance, filename):
    return "user_%d/pdf/%d/%s" % (instance.user.id, instance.id, filename)


# PDF2Image Converting
def pdf_to_image(instance):
    # In-Memory에서 PDF 파일 불러오기
    pdf_bytes = instance.pdf.open('rb').read()
    
    try:    # Linux Ubuntu / Mac
        images = convert_from_bytes(pdf_bytes, fmt=FMT, dpi=DPI)
    except: # MS Windows
        images = convert_from_bytes(pdf_bytes, fmt=FMT, poppler_path="pdf/poppler/Library/bin/", dpi=DPI)
        
    if DEBUG:
        print("파일을 이미지로 변환 중 입니다.")
        
    # 페이지 단위로 이미지 저장
    for i, image in enumerate(images):
        # 버퍼에 이미지 저장
        buffer = BytesIO()
        image.save(buffer, format=BUFFER_IMAGE_TYPE)
        buffer.seek(0)
        
        # 버퍼에 담긴 이미지를 S3로 업로드
        s3r.Bucket(AWS_STORAGE_BUCKET_NAME).put_object(
            Key="%s/%s/user_%d/pdf/%d/images/%d.jpg" % (STORAGE_TYPE, STORAGE_ACCESS, instance.user.id, instance.id, i), 
            Body=buffer, 
            ContentType=CONTENT_TYPE)
        
    if DEBUG:
        print("총 이미지 %d개의 변환이 완료됐습니다." % (len(images)))
        
    return len(images)


# PDF 파일 모델
class PDFModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="user", db_column="user", null=True)
    pdf = models.FileField(upload_to=pdf_path)
    name = models.CharField(default="unknown", max_length=255)
    img_length = models.IntegerField(default=0, editable=False)
    img_path = models.URLField(default=None, null=True, blank=True, max_length=255)
    upload_at = models.DateField(auto_now_add=True)
    deadline = models.DateField(default=None)
    views = models.IntegerField(default=0)
    job_field = models.CharField(default=None, null=True, blank=True, max_length=50)
    
    def save(self, *args, **kwargs):
        if self.id is None:
            temp_pdf = self.pdf
            self.pdf = None
            super().save(*args, **kwargs)
            self.pdf = temp_pdf
            self.img_length = pdf_to_image(self)
            self.img_path = "https://%s/%s/%s/user_%d/pdf/%d/images/" % (AWS_S3_CUSTOME_DOMAIN, STORAGE_TYPE, STORAGE_ACCESS, self.user.id, self.id)
            super().save(*args, **kwargs)

    def __str__(self):
        return "%s (%s)" % (self.name, self.user.email)