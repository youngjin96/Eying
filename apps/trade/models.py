from django.db import models
from user.models import User

# Warning : Do not migrate
class Trade(models.Model):
    # Primary Key
    trade_id = models.BigAutoField(primary_key=True)
    
    # Foreign Key
    seller_id = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="seller_id", db_column="seller_id")
    buyer_id = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="buyer_id", db_column="buyer_id")
    
    # Contents
    created_at = models.DateTimeField(auto_now_add=True)