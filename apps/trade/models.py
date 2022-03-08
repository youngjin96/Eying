from django.db import models

# Warning : Do not migrate
class Trade(models.Model):
    # Primary Key will be allocated (Automatic)
    
    # sellerId = models.ForeignKey()
    # buyerId = models.ForeignKey()
    # nftId = models.ForeignKey()
    
    created_at = models.DateTimeField(auto_now_add=True)