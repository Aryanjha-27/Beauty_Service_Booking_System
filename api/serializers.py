from rest_framework import serializers

from store.models import (
    Category,
    Tag,
    Service,
    ServiceGallery,
    ServiceAvailability,
    Booking,
    ServiceReview,
    Wishlist,
    Notification,
)
from userauth.models import user as UserModel, profile as ProfileModel
from vendor.models import vendor as VendorModel
from customer.models import Address as CustomerAddress, Wishlist as CustomerWishlist, Notifications as CustomerNotification


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "title", "slug", "image"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "title"]


class ServiceGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceGallery
        fields = ["id", "image", "caption", "date"]


class ServiceAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceAvailability
        fields = ["id", "day", "start_time", "end_time", "is_active"]


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileModel
        fields = ["id", "full_name", "image", "address", "mobile", "user_type"]


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = UserModel
        fields = ["id", "email", "username", "profile"]


class VendorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = VendorModel
        fields = [
            "id",
            "store_name",
            "slug",
            "description",
            "email",
            "country",
            "city",
            "image",
            "document",
            "vendor_id",
            "verification_status",
            "is_verified",
            "user",
        ]


class PublicVendorSerializer(VendorSerializer):
    class Meta(VendorSerializer.Meta):
        fields = [
            field for field in VendorSerializer.Meta.fields
            if field != "document"
        ]


class ServiceSerializer(serializers.ModelSerializer):
    vendor = VendorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    gallery = ServiceGallerySerializer(many=True, read_only=True)
    availability = ServiceAvailabilitySerializer(many=True, read_only=True)
    vendor_name = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    effective_price = serializers.ReadOnlyField()
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()

    class Meta:
        model = Service
        fields = [
            "id",
            "sid",
            "title",
            "slug",
            "description",
            "price",
            "discount_price",
            "effective_price",
            "service_type",
            "thumbnail",
            "status",
            "featured",
            "date",
            "updated",
            "vendor",
            "vendor_name",
            "category",
            "category_name",
            "tags",
            "gallery",
            "availability",
            "average_rating",
            "review_count",
        ]

    def get_vendor_name(self, obj):
        return obj.vendor.store_name if obj.vendor else None

    def get_category_name(self, obj):
        return obj.category.title if obj.category else None


class BookingSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        source="customer",
        queryset=UserModel.objects.all(),
        write_only=True,
        required=False,
    )
    service_id = serializers.PrimaryKeyRelatedField(
        source="service",
        queryset=Service.objects.all(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = Booking
        fields = [
            "id",
            "bid",
            "customer",
            "customer_id",
            "service",
            "service_id",
            "service_type",
            "address",
            "scheduled_date",
            "scheduled_time",
            "note",
            "booking_status",
            "decline_reason",
            "payment_method",
            "payment_status",
            "total",
            "date",
        ]


class ServiceReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)

    class Meta:
        model = ServiceReview
        fields = [
            "id",
            "rid",
            "service",
            "user",
            "rating",
            "review",
            "is_verified",
            "active",
            "date",
        ]


class StoreWishlistSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        source="user",
        queryset=UserModel.objects.all(),
        write_only=True,
        required=False,
    )
    service_id = serializers.PrimaryKeyRelatedField(
        source="service",
        queryset=Service.objects.all(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = Wishlist
        fields = ["id", "user", "user_id", "service", "service_id", "date"]


class CustomerWishlistSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)

    class Meta:
        model = CustomerWishlist
        fields = ["id", "user", "service"]


class NotificationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    booking = BookingSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "nid", "user", "booking", "type", "message", "seen", "date"]


class CustomerNotificationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    booking = BookingSerializer(read_only=True)

    class Meta:
        model = CustomerNotification
        fields = ["id", "user", "type", "seen", "date", "booking"]


class CustomerAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerAddress
        fields = [
            "id",
            "full_name",
            "mobile",
            "email",
            "country",
            "city",
            "address",
        ]