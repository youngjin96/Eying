from django.shortcuts import render
from django.http import JsonResponse

from masterpiece.models import Masterpiece

# RETURN ALL TRADE DATA
def get_all(request):
    masterpieces = Masterpiece.objects.all()
    results = {
        "masterpieces": masterpieces
    }
    return JsonResponse(results)


# RETURN DATA SEARCHED BY USER_ID
def get_by_user(request, user_id):
    masterpieces = Masterpiece.objects.filter(user_id=user_id).select_related()
    results = {
        "masterpieces": masterpieces
    }
    return JsonResponse(results)


# RETURN DATA SEARCHED BY EXHIBITION_ID
def get_by_exhibition(request, exhibition_id):
    masterpieces = Masterpiece.objects.filter(exhibition_id=exhibition_id).select_related()
    results = {
        "masterpieces": masterpieces
    }
    return JsonResponse(results)