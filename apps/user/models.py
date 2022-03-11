import email
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    is_staff = models.BooleanField("admin", default=False)
    is_activate = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    
    def __str__(self):
        return self.username

