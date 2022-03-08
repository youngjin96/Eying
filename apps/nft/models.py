from django.db import models

# Warning : Do not migrate
class NFT(models.Model):
    # Primary Key will be allocated (Automatic)
    
    # userId = models.ForeignKey()
    # exhibitionId = models.ForeignKey()
    
    image = models.ImageField()
    nftComment = models.TextField(max_length=255)
    price = models.IntegerField()
    tradeStatus = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)