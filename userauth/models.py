from django.db import models
from django.contrib.auth.models import AbstractUser

USER_TYPE = (
    ("Vendor", "Vendor"),
    ("Customer", "Customer"),
)


class user(AbstractUser):
    username = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    email = models.EmailField(
        unique=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        if self.email and not self.username:
            self.username = self.email.split("@")[0]

        super().save(*args, **kwargs)


class profile(models.Model):
    user = models.OneToOneField(
        user,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    image = models.ImageField(
        upload_to="images",
        default="default-user.jpeg",
        null=True,
        blank=True
    )

    full_name = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    mobile = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    user_type = models.CharField(
        max_length=255,
        choices=USER_TYPE,
        null=True,
        blank=True
    )

    def __str__(self):
        return self.full_name or self.user.username

    def save(self, *args, **kwargs):
        if not self.full_name:
            self.full_name = self.user.username

        super().save(*args, **kwargs)