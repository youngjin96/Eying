from django.db import models
from user.models import User


# Create your models here.
class Eyetracking(models.Model):
    user_id = models.ForeignKey(User, on_delete= models.CASCADE, related_name="rater", db_column="rater",null= True) # 평가하는 user_id
    # owner_id = models.ForeignKey(User, on_delete= models.CASCADE, related_name="owner", db_column="owner",null=True) # 주최 user_id
    looking = models.CharField(max_length=100)
    rating_time = models.TimeField()
    coordinate = models.TextField() # x,y 좌표 리스트