from django.db import models

# Create your models here.
class User(models.Model):
    user_id = models.AutoField(primary_key=True) # 장고에서 모델에 primar key를 지정해 주지 않았을 때 자동생성
    auth = models.CharField(max_length=10)
    email = models.CharField(max_length=100)

    def __str__(self):
        return self.email

