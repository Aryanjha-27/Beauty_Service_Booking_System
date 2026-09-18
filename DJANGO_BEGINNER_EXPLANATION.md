# GlowNext Django Code Explanation

This file explains the Django code you need to understand in this project. It does not explain generated migrations or Django startup boilerplate.

## 1. The Big Picture

The project works like this:

```text
React frontend
    -> sends an HTTP request
Django URL file
    -> chooses a view
API view
    -> reads or changes database data
Model
    -> represents database tables
Serializer
    -> converts Python/model data into JSON
Response
    -> sends JSON back to React
```

Example:

```text
GET /api/services/
    -> glownext/urls.py
    -> api/urls.py
    -> ServicesAPI.get()
    -> Service.objects.filter(...)
    -> ServiceSerializer(...)
    -> Response(serializer.data)
```

## 2. Files You Can Skip

These are mainly created by Django or contain no important custom behavior:

- `*/migrations/*.py`: Django creates these files to record database structure changes.
- `*/__init__.py`: tells Python that a folder is a package.
- `manage.py`: Django's standard command launcher.
- `glownext/asgi.py`: deployment entry point for ASGI servers.
- `glownext/wsgi.py`: deployment entry point for WSGI servers.
- Empty `tests.py` or placeholder `admin.py` files: they do not currently contain project logic.

You should still keep these files. You do not need to study them first.

## 3. `glownext/settings.py`

This file is the main configuration for Django.

### Imports and environment

```python
from pathlib import Path
```

Imports `Path`, a Python helper for creating file-system paths safely.

```python
import os
```

Imports Python's operating-system helpers. This project uses it to build the template directory path.

```python
from environs import Env
```

Imports `Env`, which reads values from the `.env` file.

```python
env = Env()
env.read_env()
```

Creates an environment reader and loads values such as the database password from `.env`.

```python
BASE_DIR = Path(__file__).resolve().parent.parent
```

Finds the project root directory. `__file__` is the current file, `resolve()` gives its full path, and two `parent` operations move from `glownext/settings.py` to the project root.

### Security and development settings

```python
SECRET_KEY = '...'
```

A secret used by Django for cryptographic signing. It must be private in a real deployment.

```python
DEBUG = True
```

Enables detailed development errors. It should be `False` in production.

```python
ALLOWED_HOSTS = []
```

Lists the host names that may serve the Django project. An empty list is acceptable for local development but normally needs real domains in production.

### Installed applications

```python
INSTALLED_APPS = [...]
```

Tells Django which built-in, third-party, and project applications are active.

Important project entries:

- `userauth`: custom users and profiles.
- `customer`: customer addresses, wishlists, and notifications.
- `vendor`: vendor profiles, verification, payouts, and notifications.
- `store`: services, bookings, reviews, and store wishlists.
- `api`: REST API views, serializers, and routes.

Important third-party entries:

- `rest_framework`: Django REST Framework.
- `corsheaders`: permits the React development server to call Django.
- `jazzmin`: changes the appearance of the admin site.
- `django_ckeditor_5`: rich text editor support.
- `import_export`: admin import/export support.

### Admin configuration

```python
JAZZMIN_SETTINGS = {...}
```

Customizes the Django admin title, sidebar, application order, and icons. The dictionary keys are settings understood by Jazzmin.

For example:

```python
"site_title": "GlowNext Admin"
```

Sets the browser title for the admin site.

```python
"order_with_respect_to": ["userauth", "vendor", "store", "customer"]
```

Controls the order of applications in the admin sidebar.

```python
"icons": {...}
```

Maps model names to Font Awesome icons.

### Middleware and CORS

```python
MIDDLEWARE = [...]
```

Middleware runs around requests and responses. It provides security, sessions, authentication, messages, CSRF protection, and static behavior.

```python
"corsheaders.middleware.CorsMiddleware"
```

Allows the CORS package to add the headers required by the frontend.

```python
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]
```

Allows the Vite React development server to call Django from the browser.

### URLs and templates

```python
ROOT_URLCONF = 'glownext.urls'
```

Tells Django that the main URL router is `glownext/urls.py`.

```python
TEMPLATES = [{...}]
```

Configures Django's template engine.

```python
'DIRS': [os.path.join(BASE_DIR, 'templates')]
```

Adds the project's `templates` folder as a place where Django searches for HTML files.

```python
'APP_DIRS': True
```

Also allows templates inside installed applications.

### Database

```python
DATABASES = {
    "default": {
        "ENGINE": env.str("DB_ENGINE", "django.db.backends.mysql"),
        "NAME": env.str("DB_NAME", "glownext"),
        "USER": env.str("DB_USER", "root"),
        "PASSWORD": env.str("DB_PASSWORD", ""),
        "HOST": env.str("DB_HOST", "127.0.0.1"),
        "PORT": env.int("DB_PORT", 3306),
    }
}
```

Defines the default database connection. Each `env` call reads a value from `.env` and uses the second argument if the value is missing.

- `ENGINE`: database driver.
- `NAME`: database name.
- `USER`: database username.
- `PASSWORD`: database password.
- `HOST`: database server address.
- `PORT`: database server port.

### Authentication, files, and localization

```python
AUTH_USER_MODEL = "userauth.user"
```

Tells Django to use the custom `user` model instead of Django's default user model.

```python
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]
```

Configure CSS, JavaScript, and other static files.

```python
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media/"
```

Configure uploaded files such as vendor documents and service images.

```python
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_TZ = True
```

Set the language and timezone behavior used by Django.

### Editor configuration

```python
CKEDITOR_5_CONFIGS = {...}
```

Defines which buttons and features appear in the rich text editor. The long toolbar lists are configuration data, not application logic.

## 4. URL Routing

### `glownext/urls.py`

```python
from django.contrib import admin
```

Imports Django's built-in admin site.

```python
from django.urls import path, include
```

Imports `path` for URL entries and `include` for handing a group of URLs to another file.

```python
from django.conf import settings
from django.conf.urls.static import static
```

Imports project settings and Django's helper for serving local media/static files during development.

```python
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path("ckeditor5/", include('django_ckeditor_5.urls')),
]
```

Creates the top-level URL list.

- `/admin/` opens Django admin.
- `/api/` forwards the rest of the path to `api/urls.py`.
- `/ckeditor5/` forwards requests to the editor package.

```python
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
```

Adds local development routes for uploaded media and static files.

### `api/urls.py`

```python
from django.urls import path
```

Imports Django's URL path function.

```python
from .views import (...)
```

Imports the API view classes from the same app's `views.py` file.

```python
urlpatterns = [
    path("services/", ServicesAPI.as_view()),
]
```

Maps a URL to a view. `as_view()` turns the class into a callable Django can use.

Because this file is included under `/api/`, this entry becomes `/api/services/`.

The important routes are:

| URL | View | Purpose |
|---|---|---|
| `/api/test/` | `TestAPI` | Checks the API connection |
| `/api/categories/` | `CategoriesAPI` | Lists categories |
| `/api/services/` | `ServicesAPI` | Lists public services |
| `/api/services/<slug>/` | `ServiceDetailAPI` | Shows one service |
| `/api/vendors/` | `VendorsAPI` | Lists verified vendors |
| `/api/vendors/pending/` | `PendingVendorsAPI` | Shows pending vendors to admins |
| `/api/vendors/<id>/verify/` | `VendorVerificationAPI` | Approves or rejects a vendor |
| `/api/bookings/` | `BookingsAPI` | Lists or creates bookings |
| `/api/payments/khalti/initiate/` | `KhaltiInitiateAPI` | Starts payment |
| `/api/payments/khalti/callback/` | `KhaltiCallbackAPI` | Confirms payment |

## 5. User Models: `userauth/models.py`

```python
from django.db import models
from django.contrib.auth.models import AbstractUser
```

Imports Django model fields and the standard user behavior that the custom user extends.

```python
USER_TYPE = (("Vendor", "Vendor"), ("Customer", "Customer"))
```

Defines allowed choices for a profile's user type. The first value is stored in the database and the second is displayed to users.

```python
class user(AbstractUser):
```

Creates a custom user model while keeping Django's login, password, permissions, and staff fields.

```python
username = models.CharField(max_length=255, null=True)
```

Stores an optional username. The project primarily logs in with email.

```python
email = models.EmailField(unique=True)
```

Stores an email address and prevents two users from using the same email.

```python
USERNAME_FIELD = "email"
REQUIRED_FIELDS = ["username"]
```

Tells Django to use email as the login field and to request username when creating a superuser.

```python
def __str__(self):
    return self.email
```

Controls how a user appears when printed or displayed in admin.

```python
def save(self, *args, **kwargs):
```

Overrides Django's normal save operation while preserving any arguments Django passes in.

```python
if self.email and not self.username:
    self.username = self.email.split("@")[0]
```

If no username exists, uses the part of the email before `@`.

```python
super().save(*args, **kwargs)
```

Calls Django's original save method so the record is written to the database.

```python
class profile(models.Model):
```

Creates a separate profile table connected to a user.

```python
user = models.OneToOneField(user, on_delete=models.CASCADE, related_name="profile")
```

Gives each user one profile. Deleting the user also deletes the profile. `user.profile` accesses the profile.

The `image`, `full_name`, `address`, `mobile`, and `user_type` fields store profile information. `null=True` allows a database NULL and `blank=True` allows an empty admin/form value.

The profile `__str__` method shows the full name, falling back to the username. Its `save()` method fills in `full_name` when it is missing.

## 6. Vendor Models: `vendor/models.py`

```python
from django.db import models
from userauth.models import user
from django.utils.text import slugify
from django.utils import timezone
```

Imports database fields, the custom user model, slug creation, and timezone-aware dates.

The `NOTIFICATION_TYPE`, `PAYOUT_METHOD`, `TYPE`, and `VENDOR_STATUS` tuples define valid choices for vendor-related fields.

```python
class vendor(models.Model):
```

Represents a beauty business/vendor.

```python
user = models.OneToOneField(user, ...)
```

Connects one vendor profile to one account.

```python
image = models.ImageField(...)
document = models.ImageField(...)
```

Store the vendor image and verification document. The path in `upload_to` controls the media subfolder.

```python
verification_status = models.CharField(..., choices=VENDOR_STATUS, default="Pending")
is_verified = models.BooleanField(default=False)
verified_at = models.DateTimeField(null=True, blank=True)
```

Store the vendor's approval state and the time approval happened.

```python
def save(self, *args, **kwargs):
```

Keeps vendor status fields consistent every time a vendor is saved.

```python
if self.slug == "" or self.slug is None:
    self.slug = slugify(self.store_name)
```

Creates a URL-friendly slug from the store name if no slug exists.

```python
if self.is_verified:
    self.verification_status = "Verified"
```

Ensures the text status agrees with the boolean approval flag.

```python
if self.is_verified and self.verified_at is None:
    self.verified_at = timezone.now()
```

Records the current time when a vendor becomes verified.

```python
if not self.is_verified:
    self.verified_at = None
```

Removes the verification time when the vendor is not verified.

```python
super(vendor, self).save(*args, **kwargs)
```

Runs Django's actual database save operation.

`Payout` connects a vendor to a booking. `BankAccount` stores payout account details. `Notifications` stores messages for vendors. Their `ForeignKey` and `OneToOneField` lines define those relationships.

## 7. Store Models: `store/models.py`

### Choice lists

`STATUS`, `PAYMENT_STATUS`, `PAYMENT_METHOD`, `ORDER_STATUS`, `RATING`, `SERVICE_TYPE`, and `DAY_CHOICES` are tuples of allowed database/display values. Django uses them to render dropdowns and validate selected values.

### `Category`

```python
class Category(models.Model):
```

Creates a service category table.

```python
title = models.CharField(max_length=255)
image = models.FileField(upload_to="category", null=True, blank=True)
slug = models.SlugField(unique=True)
```

Stores the category name, optional image, and unique URL identifier.

```python
def save(self, *args, **kwargs):
    if not self.slug:
        self.slug = slugify(self.title)
    super().save(*args, **kwargs)
```

Creates a slug automatically and then saves the category.

### `Tag`

Stores reusable labels. `unique=True` prevents duplicate tag names.

### `Service`

```python
class Service(models.Model):
```

Represents a beauty service offered by a vendor.

```python
sid = ShortUUIDField(...)
```

Creates a short unique public identifier.

```python
vendor = models.ForeignKey(vendor_models.vendor, on_delete=models.CASCADE, related_name="services")
```

A service belongs to one vendor. Deleting the vendor deletes its services. `vendor.services` accesses the vendor's services.

```python
category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="services")
```

A service may have a category. If the category is deleted, the service remains but its category becomes empty.

```python
tags = models.ManyToManyField(Tag, blank=True)
```

Allows many tags on one service and many services on one tag.

`title`, `description`, `price`, `discount_price`, `service_type`, `thumbnail`, `status`, and `featured` store the service's content, price, booking type, image, publication state, and homepage flag.

```python
def clean(self):
    if self._state.adding and self.vendor_id and not self.vendor.is_verified:
        raise ValidationError(...)
```

Validates new services and rejects them when their vendor is not verified.

```python
def save(self, *args, **kwargs):
```

Adds a second protection when code saves a service directly instead of using a form.

```python
if self._state.adding and self.vendor_id:
```

Runs the vendor check only for a new service that has a vendor.

```python
if not vendor.is_verified:
    raise ValidationError(...)
```

Stops unverified vendors from creating services.

```python
if not self.slug:
    self.slug = slugify(self.title) + "-" + shortuuid.uuid()[:4]
```

Creates a readable but more unique URL slug.

```python
@property
def effective_price(self):
```

Creates a calculated value accessed like `service.effective_price`.

```python
if self.discount_price and self.discount_price < self.price:
    return self.discount_price
return self.price
```

Returns the discount only when it exists and is lower than the normal price.

`has_discount` returns a Boolean. `average_rating` calculates the average active review rating. `review_count` counts active reviews. `offers_home` and `offers_store` check the selected service type.

### Supporting store models

- `ServiceGallery` stores extra images connected to a service.
- `ServiceAvailability` stores a service's day, start time, end time, and active flag.
- `Booking` stores customer, service, appointment, status, total, and Khalti payment values.
- `ServiceReview` stores a rating, review text, customer, service, and active flag.
- `Wishlist` connects a user to a saved service. `unique_together` prevents duplicate saves.
- `Notification` stores booking, payment, review, or general messages for a user.

For each model, `ForeignKey` means many records can point to one related record, `OneToOneField` means exactly one related record, and `on_delete` controls what happens when the related record is deleted.

## 8. Customer Models: `customer/models.py`

`Wishlist` stores a customer and the service they saved.

`Address` stores the customer's name, phone, email, country, city, and address.

`Notifications` stores a customer, notification type, seen flag, and creation date.

The `__str__` methods return readable names for Django admin.

## 9. Serializers: `api/serializers.py`

```python
from rest_framework import serializers
```

Imports Django REST Framework serializer classes.

```python
class CategorySerializer(serializers.ModelSerializer):
```

Creates a serializer whose fields come from the `Category` model.

```python
class Meta:
    model = Category
    fields = ["id", "title", "slug", "image"]
```

Tells the serializer which model and which fields to expose as JSON.

The same pattern is used by `TagSerializer`, `ServiceGallerySerializer`, `ServiceAvailabilitySerializer`, `ProfileSerializer`, and the customer serializers.

```python
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
```

Returns a user and nests its profile. `read_only=True` means clients can read this value through the serializer but cannot write the nested profile here.

```python
class VendorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
```

Returns vendor data with nested user data. This serializer includes the verification document for staff review.

```python
class PublicVendorSerializer(VendorSerializer):
```

Reuses the vendor serializer instead of duplicating it.

```python
fields = [field for field in VendorSerializer.Meta.fields if field != "document"]
```

Creates a public field list that removes the private verification document.

### `ServiceSerializer`

The nested fields expose the vendor, category, tags, gallery, and availability in one service response.

```python
vendor_name = serializers.SerializerMethodField()
category_name = serializers.SerializerMethodField()
```

Adds values calculated by Python methods instead of direct model fields.

```python
effective_price = serializers.ReadOnlyField()
average_rating = serializers.ReadOnlyField()
review_count = serializers.ReadOnlyField()
```

Reads the matching properties from the `Service` model.

```python
def get_vendor_name(self, obj):
    return obj.vendor.store_name if obj.vendor else None
```

Returns the vendor's store name or `None` if no vendor exists.

```python
def get_category_name(self, obj):
    return obj.category.title if obj.category else None
```

Returns the category title or `None` if no category exists.

### Write-only ID fields

```python
customer_id = serializers.PrimaryKeyRelatedField(
    source="customer",
    queryset=UserModel.objects.all(),
    write_only=True,
    required=False,
)
```

Accepts a user ID in incoming JSON, validates that the user exists, and stores it in the model's `customer` relationship. It does not repeat the full nested user object when writing.

`service_id` works the same way for services. The wishlist serializer uses the same approach for `user_id` and `service_id`.

## 10. API Views: `api/views.py`

### Imports

```python
import json
from urllib import request
```

`json` converts Python dictionaries to JSON and JSON back to Python dictionaries. `urllib.request` sends the Khalti HTTP request.

```python
from django.shortcuts import get_object_or_404
```

Looks up a database object and automatically returns HTTP 404 when it does not exist.

```python
from django.db.models import Count, Sum
```

Provides database aggregation functions for dashboard totals.

```python
from rest_framework.views import APIView
from rest_framework.response import Response
```

`APIView` creates class-based API endpoints. `Response` sends JSON-style data back to the client.

### Basic list endpoint pattern

```python
class CategoriesAPI(APIView):
```

Defines an API endpoint class.

```python
def get(self, request):
```

Runs when the client sends a GET request. `request` contains the HTTP request information.

```python
categories = Category.objects.all().order_by("title")
```

Queries all categories and sorts them by title.

```python
serializer = CategorySerializer(categories, many=True)
```

Converts many model objects into serializable data. `many=True` is required for a list.

```python
return Response(serializer.data)
```

Sends the converted data to the frontend.

### Public services

```python
services = Service.objects.filter(status="Published", vendor__is_verified=True)
```

Returns only published services belonging to verified vendors. The double underscore follows a relationship from `Service` to `vendor`.

```python
.select_related("vendor", "category")
```

Loads one-to-one/foreign-key data efficiently in the same database query.

```python
.prefetch_related("tags", "gallery", "availability")
```

Loads many-to-many and reverse-related data efficiently with additional queries.

### Detail endpoints

```python
service = get_object_or_404(Service, slug=slug, status="Published", vendor__is_verified=True)
```

Finds one public service by its URL slug. If it is missing, unpublished, or owned by an unverified vendor, Django returns 404.

The vendor detail endpoint applies the same idea with a verified vendor slug.

### Permissions

```python
permission_classes = [IsAdminUser]
```

Requires the request user to be an authenticated staff/admin user before the endpoint runs.

This protects pending vendor data and vendor verification actions.

### Vendor verification

```python
action = (request.data.get("action") or "verify").lower()
```

Reads the submitted action, defaults to verification, and normalizes it to lowercase.

```python
if action in ["verify", "approved", "accept"]:
```

Accepts several words as approval.

```python
vendor.is_verified = True
vendor.verification_status = "Verified"
vendor.verified_at = timezone.now()
```

Updates all three approval fields.

The rejection branch sets `is_verified` to false, stores `Rejected`, and clears the timestamp.

```python
vendor.save(update_fields=[...])
```

Saves only the changed fields.

### Bookings and wishlists

```python
serializer = BookingSerializer(data=request.data)
```

Creates a serializer for incoming JSON rather than an existing database object.

```python
if serializer.is_valid():
```

Checks required fields and related IDs.

```python
serializer.save()
```

Creates the database record after validation succeeds.

```python
return Response(serializer.data, status=status.HTTP_201_CREATED)
```

Returns the saved object and the standard HTTP 201 Created status.

```python
return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

Returns validation errors when the submitted data is invalid.

The booking and wishlist POST methods use this same pattern.

### Dashboard

```python
total_services = Service.objects.count()
```

Counts all service records.

```python
total_revenue = Booking.objects.filter(payment_status="Paid").aggregate(total=Sum("total"))["total"] or 0
```

Filters paid bookings, adds their totals, and uses zero when there are no paid bookings.

```python
Booking.objects.values("booking_status").annotate(total=Count("id"))
```

Groups bookings by status and counts each group.

```python
"percent": round((item["total"] / max_value) * 100)
```

Converts each status count into a percentage based on the largest count.

The final `Response` returns counts, revenue, chart data, and the five newest pending vendors.

### Khalti payment initiation

```python
booking_id = request.data.get("booking_id")
amount = request.data.get("amount")
```

Reads the booking ID and payment amount from incoming JSON.

```python
if not booking_id or amount is None:
```

Rejects requests missing either required value.

```python
amount_value = float(amount)
```

Converts the submitted amount to a number.

```python
"amount": int(amount_value * 100)
```

Khalti expects the amount in the smallest currency unit, so the project converts the amount to paisa.

```python
req = request.Request(..., method="POST")
```

Builds an outgoing HTTP POST request with JSON and the Khalti authorization key.

```python
with request.urlopen(req) as res:
```

Sends the request and reads Khalti's response.

After a successful response, the booking is marked `Processing` and the Khalti IDs are stored.

### Khalti callback

```python
pidx = request.GET.get("pidx")
```

Reads the payment identifier from the callback URL.

The view sends that identifier to Khalti's lookup endpoint. If Khalti returns `Completed`, the matching booking becomes `Paid`.

## 11. Admin Files

Admin files do not create new database logic. They control how staff manage existing models.

```python
class ServiceAdmin(admin.ModelAdmin):
```

Configures the `Service` model in the admin site.

```python
list_display = (...)
```

Chooses columns visible in the model list.

```python
list_filter = (...)
```

Adds sidebar filters.

```python
search_fields = (...)
```

Defines fields used by admin search.

```python
readonly_fields = (...)
```

Prevents staff from editing generated IDs or timestamps.

```python
admin.site.register(store_models.Service, ServiceAdmin)
```

Makes the model appear in Django admin with the custom configuration.

```python
class ServiceGalleryInline(admin.TabularInline):
```

Allows gallery records to be edited inside the service form.

```python
def formfield_for_foreignkey(self, db_field, request, **kwargs):
```

Customizes a foreign-key dropdown before Django creates the form field.

```python
kwargs["queryset"] = vendor_models.vendor.objects.filter(is_verified=True)
```

Shows only verified vendors in the service's vendor dropdown.

The vendor admin action `verify_selected_vendors` loops over selected vendors, sets their verification fields, saves them, and displays a success message.

## 12. Learn This Project in Order

1. Read the models first. They define the data.
2. Read the serializers next. They define the JSON shape.
3. Read `api/views.py`. It combines requests, models, and serializers.
4. Read `api/urls.py`. It connects URLs to views.
5. Read `glownext/urls.py`. It connects the API to the whole project.
6. Read admin files last. They only control the staff interface.

The most important reusable API pattern is:

```python
class ExampleAPI(APIView):
    def get(self, request):
        objects = Model.objects.filter(...)
        serializer = ModelSerializer(objects, many=True)
        return Response(serializer.data)
```

Read it as:

1. Define an endpoint.
2. Receive a GET request.
3. Query the database.
4. Convert the result to JSON.
5. Return the JSON to the frontend.
