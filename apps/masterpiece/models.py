from distutils.command.upload import upload
from django.db import models
from user.models import User
from exhibition.models import Exhibition

# Warning : Do not migrate
class Masterpiece(models.Model):
    # Primary Key
    masterpiece_id = models.BigAutoField(primary_key=True)
    
    # Foreign Key
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user", db_column="user_id")
    exhibition_id = models.ForeignKey(Exhibition, on_delete=models.CASCADE, db_column="exhibition_id")
    
    # Contents
    name = models.CharField(max_length=50, default="Annoymous")
    image = models.ImageField(upload_to="masterpieces/")
    comment = models.TextField()
    price = models.IntegerField()
    trade_status = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name