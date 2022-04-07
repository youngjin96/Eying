import email
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    birth_year = models.IntegerField(default=0)
    gender = models.CharField(default="unknown", max_length=10)
    job = models.CharField(default="unknown", max_length=50)
    
    def __str__(self):
        return self.username

