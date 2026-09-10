# GlowNext Code Guide

This guide explains what each important project file does and how the main request flows work. It is written for a beginner working on this repository.

## 1. Request flow

A normal public request follows this path:

```text
React component
    -> fetch("http://127.0.0.1:8000/api/...")
    -> glownext/urls.py
    -> api/urls.py
    -> APIView in api/views.py
    -> Django model query
    -> serializer in api/serializers.py
    -> JSON response
    -> React state and JSX
```

Django owns the API and database rules. React only requests JSON and displays it.

## 2. Project entry points

### `manage.py`

This is the Django command-line entry point. It sets `DJANGO_SETTINGS_MODULE` to `glownext.settings` and passes commands such as `runserver`, `migrate`, `check`, and `createsuperuser` to Django.

### `glownext/settings.py`

This file configures the Django project:

- Installed applications: admin, REST framework, CORS, userauth, customer, vendor, store, and API.
- Middleware: security, sessions, authentication, messages, and CORS.
- Templates, static files, and uploaded media.
- MySQL database values loaded from `.env`.
- `AUTH_USER_MODEL`, email/payment settings, and third-party editor settings.
- `CORS_ALLOWED_ORIGINS`, which allows the React development server to call Django.

The database configuration uses these environment variables:

- `DB_ENGINE`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`

### `glownext/urls.py`

This is the top-level URL router. It sends:

- `/admin/` to Django admin.
- `/api/` to `api.urls`.
- `/ckeditor5/` to the editor routes.
- `/media/` and `/static/` to local development file serving.

## 3. API application

### `api/urls.py`

This file maps URL paths to API view classes. It is included below `/api/` by the project router, so `path("services/")` becomes `/api/services/`.

### `api/views.py`

This file contains the API behavior. Each `APIView` normally does three things:

1. Read request data or query parameters.
2. Query a model.
3. Serialize the result and return a `Response`.

Important API classes:

- `TestAPI`: returns a small connection test message.
- `CategoriesAPI`: returns categories ordered by title.
- `ServicesAPI`: returns only published services belonging to verified vendors.
- `ServiceDetailAPI`: returns one published service belonging to a verified vendor.
- `VendorsAPI`: returns verified vendors for the public React page.
- `PendingVendorsAPI`: returns pending vendors and their documents for staff users.
- `VendorDetailAPI`: returns one verified vendor.
- `VendorVerificationAPI`: accepts `verify` or `reject` and updates vendor verification fields. It requires an admin user.
- `BookingsAPI`: lists bookings and creates bookings from request data.
- `ReviewsAPI`: returns active reviews for a service.
- `WishlistsAPI`: lists and creates store wishlists.
- `NotificationsAPI`, `CustomerNotificationsAPI`, `CustomerAddressAPI`, and `CustomerWishlistAPI`: return customer/store data.
- `AdminDashboardAPI`: calculates counts, revenue, booking status chart data, and recent pending vendors.
- `KhaltiInitiateAPI`: validates a booking and amount, calls Khalti, then stores the payment state on the booking.
- `KhaltiCallbackAPI`: checks the payment result and updates the booking.

### `api/serializers.py`

Serializers convert Django model objects into JSON and validate incoming JSON.

Important serializers:

- `CategorySerializer`: category data.
- `ProfileSerializer` and `UserSerializer`: user and profile data.
- `VendorSerializer`: complete vendor data, including the document for staff review.
- `PublicVendorSerializer`: public vendor data without the private verification document.
- `ServiceSerializer`: service data with nested vendor, category, tags, gallery, availability, price, and rating information.
- `BookingSerializer`: booking data plus write-only `customer_id` and `service_id` fields.
- Review, wishlist, notification, address, and customer serializers: model-specific JSON formats.

A `ModelSerializer` gets its basic fields from a Django model. `SerializerMethodField` is used when a response value is calculated, such as `vendor_name` or `effective_price`.

## 4. Vendor application

### `vendor/models.py`

The lowercase `vendor` model represents a beauty business or vendor profile. It contains:

- Owner user relationship.
- Store image, name, description, email, country, and city.
- Uploaded verification document.
- Short vendor ID and slug.
- `verification_status`, `is_verified`, and `verified_at`.

The `save()` method keeps the verification fields consistent. A verified vendor gets status `Verified` and a timestamp. An unverified vendor gets status `Pending` and no verification timestamp.

Other models:

- `Payout`: connects a vendor to a completed booking/payment item.
- `BankAccount`: stores a vendor payout account.
- `Notifications`: stores vendor-related notifications.

### `vendor/admin.py`

This file controls the Django admin interface for vendors and vendor-related models.

`VendorAdmin`:

- Displays store information, document, verification status, and date.
- Allows searching by store, user, email, vendor ID, and status.
- Shows the uploaded document as a read-only field.
- Provides the **Verify selected vendors** action.
- Normalizes status and timestamp when a vendor is saved.

`PayoutAdmin`, `BankAccountAdmin`, and `NotificationsAdmin` configure list columns, filters, and search fields for those models.

### Vendor verification rule

A vendor is publicly visible only when `is_verified=True`. This rule is applied in the public vendor API, service API, service detail API, and service admin form.

## 5. Store application

### `store/models.py`

This is the main marketplace data area.

Key models include:

- `Category`: groups services.
- `Tag`: labels services.
- `Service`: a vendor-created beauty service with price, description, thumbnail, status, and category.
- `ServiceGallery`: additional service images.
- `ServiceAvailability`: service days and hours.
- `Booking`: customer booking, schedule, payment, and status data.
- `ServiceReview`: customer review and rating.
- `Wishlist`: saved services.
- `Notification`: store notifications.

`Service.save()` creates a slug when one is missing. `Service.clean()` and `Service.save()` reject new services from unverified vendors. This protects both admin forms and programmatic creation.

### `store/admin.py`

This file configures service and store models in Django admin.

`ServiceAdmin`:

- Shows service name, vendor, category, price, status, and dates.
- Adds gallery and availability inline forms.
- Restricts the vendor dropdown to verified vendors.
- Makes generated IDs and timestamps read-only.

Other admin classes configure categories, tags, galleries, availability, bookings, reviews, wishlists, and notifications.

## 6. Customer application

### `customer/models.py`

Contains customer-specific data, including addresses, wishlists, and notifications. These models complement the marketplace models in `store`.

### `customer/views.py` and `customer/tests.py`

These files contain customer app behavior and tests. The main JSON API behavior is centralized in `api/views.py` for this project.

### `customer/admin.py`

Registers customer models and controls their admin display.

## 7. User authentication application

### `userauth/models.py`

Defines the project user model and profile model. The profile stores information such as full name, image, address, mobile number, and user type.

The project points Django authentication to this custom user model through `AUTH_USER_MODEL` in settings.

### `userauth/admin.py`

Controls user and profile management in Django admin.

### `userauth/views.py`

Contains user-related view logic. Authentication-related API work should be added here or through dedicated API views rather than duplicated in React.

## 8. Frontend application

### `frontend/src/main.jsx`

The React entry point. It imports global styles and renders the `App` component into the HTML root element.

### `frontend/src/App.jsx`

The main page composition. It renders:

- `Navbar`
- `Hero`
- `AboutUs`
- `Services`
- `Vender`
- `HowItWorks`
- `Footer`

### `frontend/src/components/Services.jsx`

Requests `/api/services/` from Django with `fetch()` and stores the JSON response in React state.

It has three states:

- Loading state while the request is running.
- Error state if Django cannot be reached.
- Service grid when data is returned.

It builds uploaded image URLs against the Django server and displays title, category, description, price, discount, and rating.

### `frontend/src/components/vender.jsx`

Requests `/api/vendors/` and displays verified vendors. It displays store name, location, description, status, and image.

If an uploaded image is missing, it tries the profile image and then an existing default image.

### Other React components

- `Navbar.jsx`: navigation and smooth scrolling.
- `Hero.jsx`: homepage introduction.
- `AboutUs.jsx`: project information and statistics.
- `HowItWorks.jsx`: customer workflow explanation.
- `Footer.jsx`: footer content.
- `Artists.jsx`: static artist presentation component.

Each component has a matching CSS file for its visual layout, colors, spacing, and responsive behavior.

### `frontend/src/data/appData.js`

Contains static content used by the frontend, such as navigation labels, fallback artist data, workflow steps, feature descriptions, and statistics. Live vendors and services come from Django instead.

### `frontend/index.html`

The Vite HTML shell. It contains the root element where React mounts the application.

### `frontend/vite.config.js`

Configures Vite, the React plugin, and the React compiler plugin.

### `frontend/package.json`

Defines frontend dependencies and commands:

- `npm run dev`: start Vite development server.
- `npm run lint`: run ESLint.
- `npm run build`: create a production build.
- `npm run preview`: preview the production build.

## 9. Migrations

Migrations are versioned database changes.

- `vendor/migrations/0001_initial.py`: creates the original vendor tables.
- `vendor/migrations/0002_alter_vendor_vendor_id.py`: changes the vendor ID field.
- `vendor/migrations/0003_vendor_is_verified_vendor_verification_status_and_more.py`: adds verification fields.
- Other app migration folders contain the schema history for their own models.

Run migrations with:

```powershell
python manage.py migrate
```

When a model changes, create migrations with:

```powershell
python manage.py makemigrations
python manage.py migrate
```

## 10. Media and static files

- `media/` stores uploaded user, vendor, category, gallery, and service files.
- `static/` stores collected CSS, JavaScript, images, and icon assets.
- `MEDIA_URL` and `STATIC_URL` are configured in Django settings.
- Local development serves these directories through `glownext/urls.py`.

A database image value such as `images/example.png` becomes this browser URL:

```text
http://127.0.0.1:8000/media/images/example.png
```

## 11. Common debugging checks

If the React page is empty:

1. Start Django with `python manage.py runserver`.
2. Open `/api/services/` or `/api/vendors/` directly.
3. Check whether the response is `[]` or an error.
4. Remember that only verified vendors are public.
5. Check that uploaded media files exist under `media/`.
6. Check the browser console for CORS or network errors.

If admin reports an unknown database column:

```powershell
python manage.py makemigrations
python manage.py migrate
```

If Django cannot connect to MySQL, check the six `DB_*` values in `.env`, confirm MySQL is running, and run:

```powershell
python manage.py check
```
