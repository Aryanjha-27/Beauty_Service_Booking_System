from rest_framework.views import APIView
from rest_framework.response import Response

from store.models import Service
from .serializers import ServiceSerializer


class TestAPI(APIView):
    # Tests whether React can communicate with Django
    def get(self, request):
        return Response({
            "message": "Django is connected!"
        })


class ServicesAPI(APIView):
    # Sends published services to React
    def get(self, request):

        # Get only published services from the database
        services = Service.objects.filter(
            status="Published"
        ).select_related(
            "vendor",
            "category"
        )

        # Convert Django objects into JSON
        serializer = ServiceSerializer(
            services,
            many=True
        )

        # Send JSON response to React
        return Response(serializer.data)