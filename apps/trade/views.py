from django.shortcuts import render
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import TradeSerializer

from trade.models import Trade

class TradeListAPI(APIView):
    def get(self, request):
        queryset = Trade.objects.all()
        serializer = TradeSerializer(queryset, many=True)
        return Response(serializer.data)
    

class TradeListFindByUserAPI(APIView):
    def get(self, request, user_id):
        queryset = Trade.objects.filter(Q(seller_id=user_id) | Q(buyer_id=user_id)).select_related()
        serializer = TradeSerializer(queryset, many=True)
        return Response(serializer.data)