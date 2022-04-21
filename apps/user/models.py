from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    age = models.IntegerField(default=0)                        # 나이
    gender = models.CharField(default="None", max_length=10)    # 성별
    job_field = models.CharField(default="None", max_length=50) # 분야
    job = models.CharField(default="None", max_length=50)       # 직종
    position = models.CharField(default="None", max_length=50)  # 직책
    credit = models.IntegerField(default=0, blank=True)         # 크레딧 (포인트)
    card = models.ImageField(default=None)                      # 명함 이미지
    
    def __str__(self):
        return self.username