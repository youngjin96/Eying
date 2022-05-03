from django.db import models
from user.models import User
from pdf.models import PDFModel
from django.utils import timezone
import datetime
# Create your models here.
class Eyetracking(models.Model):
    user_id = models.ForeignKey(User, on_delete= models.SET_NULL, related_name="rater", db_column="rater",null= True) # 평가하는 user_id
    owner_id = models.ForeignKey(User, on_delete= models.SET_NULL, related_name="owner", db_column="owner",null=True) # 주최 user_id
    page_num = models.IntegerField()
    pdf_fk = models.ForeignKey(PDFModel, on_delete= models.SET_NULL, related_name='pdf_fk',db_column="pdf_fk",null=True )
    rating_time = models.TimeField()
    coordinate = models.TextField() # x,y 좌표 리스트
    create_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.pk)