from distutils.command.upload import upload
from django.db import models
from pdf2image import convert_from_path
import os

def pdf_path(instance, filename):
    return "pdfs/{0}/{1}".format(instance.id, filename)


def pdf_to_image(pdf_path, img_path):
    images = convert_from_path(pdf_path, poppler_path="pdf/poppler/Library/bin/")
    for i, image in enumerate(images):
        image.save(img_path + str(i) +".jpg", "JPEG")
    return len(images)


# Create your models here.
class PDFModel(models.Model):
    name = models.CharField(default="unknown", max_length=50)
    pdf = models.FileField(upload_to=pdf_path)
    img_length = models.IntegerField(default=0, editable=False)
    
    def save(self, *args, **kwargs):
          if self.id is None:
            temp_pdf = self.pdf
            self.pdf = None
            super().save(*args, **kwargs)
            self.pdf = temp_pdf
            super().save(*args, **kwargs)
            pdf_path = "media/{0}".format(self.pdf)
            img_path = "media/pdfs/{0}/images/".format(self.id)
            os.makedirs(img_path)
            self.img_length = pdf_to_image(pdf_path, img_path)
            super().save(*args, **kwargs)