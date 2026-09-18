from django.shortcuts import render

from django.http import HttpResponse
from store import models as store_models


# Renders the legacy store page with published services available to the template.
def index(request):
    # Query only services that are visible to customers.
    service = store_models.Service.objects.filter(status="Published")
    # Keep the query available for debugging and render the store template.
    print(service)
    return render(request, "store/index.html")
