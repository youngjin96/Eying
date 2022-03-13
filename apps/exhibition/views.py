from django.shortcuts import render
from django.http import HttpResponse

from rest_framework.response import Response
from .models import Exhibition
from rest_framework.views import APIView
from .serializers import ExhibitionSerializer

# Create your views here.
class ExhibitionListAPI(APIView):
    def get(self, request):
        queryset = Exhibition.objects.all()
        print(queryset)
        serializer = ExhibitionSerializer(queryset, many=True)
        return Response(serializer.data)

def index(request):
    return HttpResponse("index")