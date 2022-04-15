from django.db import models

class CS(models.Model):
    name = models.TextField(null=False)
    email = models.EmailField(null=False, max_length=50)
    phoneNumber = models.CharField(null=False, max_length=50)
    content = models.TextField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name