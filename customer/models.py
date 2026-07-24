from django.db import models

from store.models import Service
from userauth.models import user

TYPE=(
    ("New Order","New Order"),
    ("Beautician Assigned","Beautician Assigned"),
    ("Service Completed","Service Completed"),
)

class Wishlist(models.Model):
    user = models.ForeignKey(user, on_delete=models.CASCADE,related_name="customer_wishlists", null=True,blank=True)
    service = models.ForeignKey(Service, on_delete=models.CASCADE , related_name="wishlist")

    class Meta:
        verbose_name_plural= "Wishlist"

        def __str__(self):
            if self.service.name:
                return self.service.name
            else:
                return "Wishlist"

class Address(models.Model):
    user =models.ForeignKey(user, on_delete=models.CASCADE, null=True)
    full_name = models.CharField(max_length=200 , null=True, blank=True, default=None)
    mobile = models.CharField(max_length=14 , null=True, blank=True, default=None)
    email = models.CharField(max_length=100 , null=True, blank=True, default=None)
    country = models.CharField(max_length=100 , null=True, blank=True, default=None)
    city = models.CharField(max_length=100 , null=True, blank=True, default=None)
    address = models.CharField(max_length=100 , null=True, blank=True, default=None)

    class Meta:
        verbose_name_plural = "Customer Address"

    def __str__(self):
        return self.full_name

class Notifications(models.Model):
        user =models.ForeignKey(user, on_delete=models.CASCADE,related_name="customer_norifications", null=True)
        type = models.CharField(max_length=100 , choices=TYPE, default=None)
        seen = models.BooleanField(default=False)
        date= models.DateField(auto_now_add=True)

        class Meta:
            verbose_name_plural = "Notifications"

        def __str__(self):
            return self.type

        