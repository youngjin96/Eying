from rest_framework import serializers
from .models import Masterpiece

class MasterpieceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Masterpiece
        fields = "__all__"