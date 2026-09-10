import json
from urllib import request

from django.conf import settings
from django.db.models import Count, Sum
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView

from customer.models import Address as CustomerAddress, Wishlist as CustomerWishlist, Notifications as CustomerNotification
from store.models import (
    Category,
    Service,
    ServiceReview,
    Wishlist,
    Notification,
    Booking,
)
from vendor.models import vendor as VendorModel
from .serializers import (
    CategorySerializer,
    CustomerAddressSerializer,
    CustomerNotificationSerializer,
    CustomerWishlistSerializer,
    NotificationSerializer,
    BookingSerializer,
    ServiceReviewSerializer,
    ServiceSerializer,
    StoreWishlistSerializer,
    PublicVendorSerializer,
    VendorSerializer,
)


class TestAPI(APIView):
    def get(self, request):
        return Response({"message": "Django is connected!"})


class CategoriesAPI(APIView):
    def get(self, request):
        categories = Category.objects.all().order_by("title")
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class ServicesAPI(APIView):
    def get(self, request):
        services = Service.objects.filter(status="Published", vendor__is_verified=True).select_related("vendor", "category").prefetch_related("tags", "gallery", "availability")
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)


class ServiceDetailAPI(APIView):
    def get(self, request, slug):
        service = get_object_or_404(Service, slug=slug, status="Published", vendor__is_verified=True)
        serializer = ServiceSerializer(service)
        return Response(serializer.data)


class VendorsAPI(APIView):
    def get(self, request):
        vendors = VendorModel.objects.filter(is_verified=True).order_by("store_name")
        serializer = PublicVendorSerializer(vendors, many=True)
        return Response(serializer.data)


class PendingVendorsAPI(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        vendors = VendorModel.objects.filter(is_verified=False).order_by("-date")
        serializer = VendorSerializer(vendors, many=True)
        return Response(serializer.data)


class VendorDetailAPI(APIView):
    def get(self, request, slug):
        vendor = get_object_or_404(VendorModel, slug=slug, is_verified=True)
        serializer = PublicVendorSerializer(vendor)
        return Response(serializer.data)


class VendorVerificationAPI(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        vendor = get_object_or_404(VendorModel, id=pk)
        action = (request.data.get("action") or "verify").lower()

        if action in ["verify", "approved", "accept"]:
            vendor.is_verified = True
            vendor.verification_status = "Verified"
            vendor.verified_at = timezone.now()
        elif action in ["reject", "decline", "deny"]:
            vendor.is_verified = False
            vendor.verification_status = "Rejected"
            vendor.verified_at = None
        else:
            return Response({"error": "action must be verify or reject."}, status=status.HTTP_400_BAD_REQUEST)

        vendor.save(update_fields=["is_verified", "verification_status", "verified_at"])

        return Response({
            "id": vendor.id,
            "store_name": vendor.store_name,
            "is_verified": vendor.is_verified,
            "verification_status": vendor.verification_status,
            "verified_at": vendor.verified_at,
        })


class BookingsAPI(APIView):
    def get(self, request):
        bookings = Booking.objects.select_related("customer", "service", "service__vendor", "service__category").order_by("-date")
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewsAPI(APIView):
    def get(self, request, slug):
        service = get_object_or_404(Service, slug=slug)
        reviews = service.reviews.filter(active=True).select_related("user", "service")
        serializer = ServiceReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class WishlistsAPI(APIView):
    def get(self, request):
        wishlists = Wishlist.objects.select_related("user", "service").order_by("-date")
        serializer = StoreWishlistSerializer(wishlists, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = StoreWishlistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotificationsAPI(APIView):
    def get(self, request):
        notifications = Notification.objects.select_related("user", "booking").order_by("-date")
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)


class CustomerNotificationsAPI(APIView):
    def get(self, request):
        notifications = CustomerNotification.objects.select_related("user", "booking").order_by("-id")
        serializer = CustomerNotificationSerializer(notifications, many=True)
        return Response(serializer.data)


class CustomerAddressAPI(APIView):
    def get(self, request):
        addresses = CustomerAddress.objects.all().order_by("id")
        serializer = CustomerAddressSerializer(addresses, many=True)
        return Response(serializer.data)


class CustomerWishlistAPI(APIView):
    def get(self, request):
        items = CustomerWishlist.objects.select_related("user", "service").order_by("id")
        serializer = CustomerWishlistSerializer(items, many=True)
        return Response(serializer.data)


class AdminDashboardAPI(APIView):
    def get(self, request):
        total_services = Service.objects.count()
        total_vendors = VendorModel.objects.count()
        verified_vendors = VendorModel.objects.filter(is_verified=True).count()
        pending_vendors = VendorModel.objects.filter(is_verified=False).count()
        total_bookings = Booking.objects.count()
        total_revenue = Booking.objects.filter(payment_status="Paid").aggregate(total=Sum("total"))["total"] or 0

        booking_status_data = list(
            Booking.objects.values("booking_status").annotate(total=Count("id")).order_by("booking_status")
        )

        chart_data = []
        max_value = max((item["total"] for item in booking_status_data), default=1)
        for item in booking_status_data:
            chart_data.append({
                "label": item["booking_status"],
                "value": item["total"],
                "percent": 0 if max_value == 0 else round((item["total"] / max_value) * 100),
            })

        return Response({
            "total_services": total_services,
            "total_vendors": total_vendors,
            "verified_vendors": verified_vendors,
            "pending_vendors": pending_vendors,
            "total_bookings": total_bookings,
            "total_revenue": float(total_revenue),
            "booking_status": chart_data,
            "pending_vendor_list": [
                {
                    "id": vendor.id,
                    "store_name": vendor.store_name,
                    "email": vendor.email,
                    "verification_status": vendor.verification_status,
                }
                for vendor in VendorModel.objects.filter(is_verified=False).order_by("-date")[:5]
            ],
        })


class KhaltiInitiateAPI(APIView):
    def post(self, request):
        booking_id = request.data.get("booking_id")
        amount = request.data.get("amount")

        if not booking_id or amount is None:
            return Response({"error": "booking_id and amount are required."}, status=status.HTTP_400_BAD_REQUEST)

        booking = get_object_or_404(Booking, id=booking_id)
        try:
            amount_value = float(amount)
        except (TypeError, ValueError):
            return Response({"error": "amount must be a number."}, status=status.HTTP_400_BAD_REQUEST)

        if amount_value <= 0:
            return Response({"error": "amount must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)

        payload = {
            "return_url": getattr(settings, "KHALTI_RETURN_URL", "http://localhost:8000/api/payments/khalti/callback/"),
            "website_url": getattr(settings, "WEBSITE_URL", "http://localhost:8000"),
            "amount": int(amount_value * 100),
            "purchase_order_id": f"booking-{booking.id}",
            "purchase_order_name": booking.service.title if booking.service else "GlowNext Booking",
            "customer_info": {
                "name": booking.customer.username if booking.customer else "Customer",
                "email": booking.customer.email if booking.customer else "customer@example.com",
                "phone": "9800000000",
            },
        }

        secret_key = getattr(settings, "KHALTI_SECRET_KEY", "")
        url = getattr(settings, "KHALTI_BASE_URL", "https://dev.khalti.com/api/v2/") + "epayment/initiate/"

        req = request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Key {secret_key}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            method="POST",
        )

        try:
            with request.urlopen(req) as res:
                response_data = json.loads(res.read().decode("utf-8"))
        except Exception as exc:
            return Response({"error": f"Khalti request failed: {str(exc)}"}, status=status.HTTP_400_BAD_REQUEST)

        booking.payment_method = "Khalti"
        booking.payment_status = "Processing"
        booking.khalti_pidx = response_data.get("pidx")
        booking.khalti_txn_id = response_data.get("purchase_order_id")
        booking.total = amount_value
        booking.save(update_fields=["payment_method", "payment_status", "khalti_pidx", "khalti_txn_id", "total"])

        return Response({
            "message": "Payment started.",
            "payment_url": response_data.get("payment_url"),
            "pidx": response_data.get("pidx"),
            "amount": amount_value,
        })


class KhaltiCallbackAPI(APIView):
    def get(self, request):
        pidx = request.GET.get("pidx")
        if not pidx:
            return Response({"error": "Missing pidx."}, status=status.HTTP_400_BAD_REQUEST)

        secret_key = getattr(settings, "KHALTI_SECRET_KEY", "")
        url = getattr(settings, "KHALTI_BASE_URL", "https://dev.khalti.com/api/v2/") + "epayment/lookup/"

        payload = json.dumps({"pidx": pidx}).encode("utf-8")
        req = request.Request(
            url,
            data=payload,
            headers={
                "Authorization": f"Key {secret_key}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            method="POST",
        )

        try:
            with request.urlopen(req) as res:
                data = json.loads(res.read().decode("utf-8"))
        except Exception as exc:
            return Response({"error": f"Khalti verification failed: {str(exc)}"}, status=status.HTTP_400_BAD_REQUEST)

        status_name = data.get("status")
        if status_name == "Completed":
            booking = Booking.objects.filter(khalti_pidx=pidx).first()
            if booking:
                booking.payment_status = "Paid"
                booking.khalti_txn_id = data.get("transaction", {}).get("txnId") or booking.khalti_txn_id
                booking.save(update_fields=["payment_status", "khalti_txn_id"])
            return Response({"message": "Payment verified successfully.", "data": data})

        return Response({"message": "Payment is not complete yet.", "data": data})