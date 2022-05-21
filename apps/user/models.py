from django.db import models
from django.contrib.auth.models import AbstractUser


# Card Image Path Customizing
def card_path(instance, filename):
    return "user_%d/card/%s" % (instance.id, filename)


# 사용자 모델
class User(AbstractUser):
    age = models.IntegerField(default=0)                                    # 나이
    gender = models.CharField(default=None, null=True, max_length=10)       # 성별
    job_field = models.CharField(default=None, null=True, max_length=50)    # 분야
    job = models.CharField(default=None, null=True, max_length=50)          # 직종
    position = models.CharField(default=None, null=True, max_length=50)     # 직책
    credit = models.IntegerField(default=0, blank=True)                     # 크레딧 (포인트)
    card = models.ImageField(upload_to=card_path)                           # 명함 이미지
    
    def save(self, *args, **kwargs):
        if self.id is None:
            temp_card = self.card
            self.card = None
            super().save(*args, **kwargs)
            self.card = temp_card
            super().save(*args, **kwargs)
        else:
            super().save(*args, **kwargs)
            
    def __str__(self):
        return "%s (%s)" % (self.username, self.email)