import email
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    birth_year = models.IntegerField(default=0)
    gender = models.CharField(default="None", max_length=10)
    job_field = models.CharField(default="None", max_length=50) # 분야
    job = models.CharField(default="None", max_length=50)       # 직종
    position = models.CharField(default="None", max_length=50)  # 직책
    
    def __str__(self):
        return self.username