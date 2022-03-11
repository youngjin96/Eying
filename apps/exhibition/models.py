from django.db import models
# from user. import 
# Create your models here.

class Exhibition(models.Model):
    exhibition_id = models.AutoField(primary_key=True)
    # user_id = models.ForeignKey(User)
    thumbnail = models.ImageField(upload_to="thumnail/")
    exhibition_comment = models.TextField() # 길이 제한이 없는 문자열
    exhibition_start = models.DateTimeField()
    exhibition_end = models.DateTimeField()
    likes = models.IntegerField(default=0)
    fee = models.IntegerField(default=0)
    link = models.CharField(max_length=100)
