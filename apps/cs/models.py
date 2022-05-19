from django.db import models

class CS(models.Model):
    category = models.CharField(default="General", max_length=30)   # 카테고리
    name = models.TextField(null=False)                             # 이름
    email = models.EmailField(null=False, max_length=50)            # 이메일
    phoneNumber = models.CharField(null=False, max_length=50)       # 연락처
    title = models.TextField(null=False, default="None")            # 제목
    content = models.TextField(null=False)                          # 내용
    isFAQ = models.BooleanField(default=None)                       # FAQ 여부
    created_at = models.DateTimeField(auto_now_add=True)            # 등록 시간
    
    def __str__(self):
        return self.name