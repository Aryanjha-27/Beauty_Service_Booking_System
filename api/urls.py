from django.urls import path

from .views import TestAPI, ServicesAPI


urlpatterns = [

    # Test React → Django connection
    path("test/", TestAPI.as_view()),

    # Send services from Django → React
    path("services/", ServicesAPI.as_view()),
]   