from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q

from trade.models import Trade

# RETURN ALL TRADE DATA
def get_all(request):
    trades = Trade.objects.all()
    results = {
        "trades": trades
    }
    return JsonResponse(results)


# RETURN DATA SEARCHED BY USER_ID
def get_by_id(request, user_id):
    trades = Trade.objects.filter(Q(seller_id=user_id) | Q(buyer_id=user_id)).select_related()
    results = {
        "trades": trades
    }
    return JsonResponse(results)