from django.db import models
from django.contrib.auth.models import AbstractUser

USER_TYPE = (
    ("Vendor", "Vendor"),
    ("Customer", "Customer"),
)


# Defines the project's custom email-based user account.
class user(AbstractUser):
    username = models.CharField(
        max_length=255,
        null=True,
        
    )

    email = models.EmailField(
        unique=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        # Use the email prefix as a username when one was not provided.
        if self.email and not self.username:
            self.username = self.email.split("@")[0]

        super().save(*args, **kwargs)


# Stores profile information associated with one user account.
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
        
    )
    address= models.CharField(
            max_length=255,
            null=True,
        )

    mobile = models.CharField(
        max_length=255,
        null=True,
        
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
        # Use the account username as a fallback display name.
        if not self.full_name:
            self.full_name = self.user.username

        super().save(*args, **kwargs)