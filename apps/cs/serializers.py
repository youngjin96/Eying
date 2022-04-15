from rest_framework import serializers
from .models import CS

class CSSerializer(serializers.ModelSerializer):
    class Meta:
        model = CS
        fields = '__all__'    