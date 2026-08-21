from django.shortcuts import render

from django.http import HttpResponse
from store import models as store_models
def index(request):
    service = store_models.Service.objects.filter(status="Published")
    print(service)
    return render(request, "store/index.html")
