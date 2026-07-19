from django.contrib import admin
from store import models as store_models


# ==========================
# Inline Models
# ==========================

class ServiceGalleryInline(admin.TabularInline):
    model = store_models.ServiceGallery
    extra = 1


class ServiceAvailabilityInline(admin.TabularInline):
    model = store_models.ServiceAvailability
    extra = 1


# ==========================
# Category
# ==========================

class CategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "slug")
    search_fields = ("title",)
    prepopulated_fields = {
        "slug": ("title",)
    }


# ==========================
# Tag
# ==========================

class TagAdmin(admin.ModelAdmin):
    list_display = ("title",)
    search_fields = ("title",)


# ==========================
# Service
# ==========================

class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "vendor",
        "category",
        "price",
        "discount_price",
        "service_type",
        "status",
        "featured",
        "date",
    )

    list_filter = (
        "status",
        "featured",
        "service_type",
        "category",
    )

    search_fields = (
        "title",
        "category__title",
    )

    prepopulated_fields = {
        "slug": ("title",)
    }

    filter_horizontal = (
        "tags",
    )

    readonly_fields = (
        "sid",
        "date",
        "updated",
    )

    inlines = [
        ServiceGalleryInline,
        ServiceAvailabilityInline,
    ]


# ==========================
# Service Gallery
# ==========================

class ServiceGalleryAdmin(admin.ModelAdmin):
    list_display = (
        "service",
        "caption",
        "date",
    )

    search_fields = (
        "service__title",
    )


# ==========================
# Service Availability
# ==========================

class ServiceAvailabilityAdmin(admin.ModelAdmin):
    list_display = (
        "service",
        "day",
        "start_time",
        "end_time",
        "is_active",
    )

    list_filter = (
        "day",
        "is_active",
    )

    search_fields = (
        "service__title",
    )


# ==========================
# Booking
# ==========================

class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "bid",
        "customer",
        "service",
        "booking_status",
        "payment_status",
        "payment_method",
        "total",
        "scheduled_date",
    )

    list_filter = (
        "booking_status",
        "payment_status",
        "payment_method",
    )

    search_fields = (
        "bid",
    )

    readonly_fields = (
        "bid",
        "date",
        "updated",
    )


# ==========================
# Service Review
# ==========================

class ServiceReviewAdmin(admin.ModelAdmin):
    list_display = (
        "service",
        "user",
        "rating",
        "is_verified",
        "active",
        "date",
    )

    list_filter = (
        "rating",
        "active",
        "is_verified",
    )


# ==========================
# Wishlist
# ==========================

class WishlistAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "service",
        "date",
    )


# ==========================
# Notification
# ==========================

class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "type",
        "seen",
        "date",
    )

    list_filter = (
        "type",
        "seen",
    )


# ==========================
# Register Models
# ==========================

admin.site.register(store_models.Category, CategoryAdmin)
admin.site.register(store_models.Tag, TagAdmin)
admin.site.register(store_models.Service, ServiceAdmin)
admin.site.register(store_models.ServiceGallery, ServiceGalleryAdmin)
admin.site.register(store_models.ServiceAvailability, ServiceAvailabilityAdmin)
admin.site.register(store_models.Booking, BookingAdmin)
admin.site.register(store_models.ServiceReview, ServiceReviewAdmin)
admin.site.register(store_models.Wishlist, WishlistAdmin)
admin.site.register(store_models.Notification, NotificationAdmin)