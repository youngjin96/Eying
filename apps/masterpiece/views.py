from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import MasterpieceSerializer

from masterpiece.models import Masterpiece

class MasterpieceListAPI(APIView):
    def get(self, request):
        queryset = Masterpiece.objects.all()
        serializer = MasterpieceSerializer(queryset, many=True)
        return Response(serializer.data)
    

class MasterpieceListFindByUserAPI(APIView):
    def get(self, request, user_id):
        queryset = Masterpiece.objects.filter(user_id=user_id).select_related()
        serializer = MasterpieceSerializer(queryset, many=True)
        return Response(serializer.data)


class MasterpieceListFindByExhibitionAPI(APIView):
    def get(self, request, exhibition_id):
        queryset = Masterpiece.objects.filter(exhibition_id=exhibition_id).select_related()
        serializer = MasterpieceSerializer(queryset, many=True)
        return Response(serializer.data)