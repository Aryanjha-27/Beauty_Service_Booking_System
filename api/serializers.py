from rest_framework import serializers
from store.models import Service


class ServiceSerializer(serializers.ModelSerializer):
    # Gets the vendor's store name instead of sending the entire vendor object
    vendor_name = serializers.CharField(
        source="vendor.store_name",
        read_only=True
    )

    # Gets the category name
    category_name = serializers.CharField(
        source="category.title",
        read_only=True
    )

    # Gets the final price after discount
    effective_price = serializers.ReadOnlyField()

    # Gets the average service rating
    average_rating = serializers.ReadOnlyField()

    # Gets the number of reviews
    review_count = serializers.ReadOnlyField()

    class Meta:
        model = Service

        # These fields will be sent to React
        fields = [
            "sid",
            "title",
            "description",
            "price",
            "discount_price",
            "effective_price",
            "service_type",
            "thumbnail",
            "vendor_name",
            "category_name",
            "average_rating",
            "review_count",
            "featured",
            "status",

        ]