from django.contrib import admin
from vendor import models as vendor_models


# Vendor Admin
class VendorAdmin(admin.ModelAdmin):

    list_display = (
        "store_name",
        "user",
        "email",
        "country",
        "city",
        "vendor_id",
        "date",
    )

    search_fields = (
        "store_name",
        "user__username",
        "user__email",
        "vendor_id",
    )

    prepopulated_fields = {
        "slug": ("store_name",)
    }

    list_filter = (
        "country",
        "city",
        "date",
    )

    ordering = (
        "-date",
    )

    actions = (
        "delete_selected",
    )


# Payout Admin
class PayoutAdmin(admin.ModelAdmin):

    list_display = (
        "vendor",
        "item",
    )

    search_fields = (
        "vendor__store_name",
    )

    list_filter = (
        "vendor",
    )

    ordering = (
        "-id",
    )

    actions = (
        "delete_selected",
    )


# Bank Account Admin
class BankAccountAdmin(admin.ModelAdmin):

    list_display = (
        "vendor",
        "account_type",
        "bank_name",
        "account_number",
        "account_name",
    )

    search_fields = (
        "vendor__store_name",
        "bank_name",
        "account_number",
        "account_name",
    )

    list_filter = (
        "account_type",
    )

    actions = (
        "delete_selected",
    )


# Notifications Admin
class NotificationsAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "type",
        "booking",
        "seen",
        "date",
    )

    list_filter = (
        "type",
        "seen",
        "date",
    )

    search_fields = (
        "user__username",
        "user__email",
    )

    ordering = (
        "-date",
    )

    actions = (
        "delete_selected",
    )


admin.site.register(vendor_models.vendor, VendorAdmin)
admin.site.register(vendor_models.Payout, PayoutAdmin)
admin.site.register(vendor_models.BankAccount, BankAccountAdmin)
admin.site.register(vendor_models.Notifications, NotificationsAdmin)