from django.contrib import admin
from vendor import models as vendor_models


#@admin.register(vendor_models.vendor)
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
    prepopulated_fields = {"slug": ("store_name",)}
    list_filter = ("country", "city", "date")


#@admin.register(vendor_models.Payout)
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


#@admin.register(vendor_models.BankAccount)
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


#@admin.register(vendor_models.Notifications)
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

admin.site.register(vendor_models.vendor, VendorAdmin)
admin.site.register(vendor_models.Payout, PayoutAdmin)
admin.site.register(vendor_models.BankAccount, BankAccountAdmin)
admin.site.register(vendor_models.Notifications, NotificationsAdmin)