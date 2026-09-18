from rest_framework.test import APITestCase
from base64 import b64decode

from django.core.files.uploadedfile import SimpleUploadedFile

from store.models import Category, Service
from userauth.models import profile, user
from vendor.models import BankAccount, vendor


class VendorAPIContractTests(APITestCase):
	def create_vendor(self, email, verified=False):
		account = user.objects.create_user(email=email, username=email.split("@")[0], password="test-password-123")
		profile.objects.create(user=account, full_name=account.username, user_type="Vendor")
		store = vendor.objects.create(user=account, store_name=account.username, is_verified=verified)
		return account, store

	def test_vendor_services_are_scoped_and_unverified_vendor_can_save_draft(self):
		vendor_a, store_a = self.create_vendor("a@example.com")
		vendor_b, store_b = self.create_vendor("b@example.com", verified=True)
		category = Category.objects.create(title="Hair", slug="hair")
		Service.objects.create(vendor=store_b, category=category, title="B Service", status="Published")

		self.client.force_authenticate(vendor_a)
		response = self.client.get("/api/vendor/services/")
		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data, [])

		draft = self.client.post(
			"/api/vendor/services/",
			{"title": "A Draft", "description": "Draft", "price": "100", "status": "Draft"},
			format="json",
		)
		self.assertEqual(draft.status_code, 201)
		self.assertEqual(draft.data["status"], "Draft")

		published = self.client.post(
			"/api/vendor/services/",
			{"title": "Blocked", "description": "No", "price": "100", "status": "Published"},
			format="json",
		)
		self.assertEqual(published.status_code, 403)
		self.assertIn("not verified", published.data["detail"])

	def test_public_services_require_verified_vendor_and_published_status(self):
		_, unverified_store = self.create_vendor("draft@example.com")
		_, verified_store = self.create_vendor("published@example.com", verified=True)
		Service.objects.create(vendor=unverified_store, title="Hidden", status="Draft")
		visible = Service.objects.create(vendor=verified_store, title="Visible", status="Published")

		response = self.client.get("/api/services/")
		self.assertEqual(response.status_code, 200)
		self.assertEqual([item["id"] for item in response.data], [visible.id])

	def test_public_services_can_filter_by_vendor_location(self):
		_, kathmandu_vendor = self.create_vendor("kathmandu@example.com", verified=True)
		_, lalitpur_vendor = self.create_vendor("lalitpur@example.com", verified=True)
		kathmandu_vendor.city = "Kathmandu"
		kathmandu_vendor.save(update_fields=["city"])
		lalitpur_vendor.city = "Lalitpur"
		lalitpur_vendor.save(update_fields=["city"])
		kathmandu_service = Service.objects.create(vendor=kathmandu_vendor, title="Kathmandu Service", status="Published")
		Service.objects.create(vendor=lalitpur_vendor, title="Lalitpur Service", status="Published")

		response = self.client.get("/api/services/?location=kathmandu")

		self.assertEqual(response.status_code, 200)
		self.assertEqual([item["id"] for item in response.data], [kathmandu_service.id])

	def test_vendor_dashboard_only_uses_own_services(self):
		vendor_a, _ = self.create_vendor("dashboard-a@example.com", verified=True)
		_, vendor_b = self.create_vendor("dashboard-b@example.com", verified=True)
		Service.objects.create(vendor=vendor_b, title="Other Service", status="Published")

		self.client.force_authenticate(vendor_a)
		response = self.client.get("/api/vendor/dashboard/")
		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data["total_services"], 0)
		self.assertEqual(response.data["total_bookings"], 0)

	def test_authenticated_vendor_can_create_category(self):
		vendor_account, _ = self.create_vendor("category@example.com")
		self.client.force_authenticate(vendor_account)

		response = self.client.post("/api/categories/", {"title": "Nail Care"}, format="json")

		self.assertEqual(response.status_code, 201)
		self.assertEqual(response.data["title"], "Nail Care")
		self.assertEqual(response.data["slug"], "nail-care")

	def test_vendor_verification_profile_updates_existing_fields(self):
		vendor_account, vendor_store = self.create_vendor("verification@example.com")
		self.client.force_authenticate(vendor_account)
		certificate = SimpleUploadedFile(
			"company-register.png",
			b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="),
			content_type="image/png",
		)

		response = self.client.patch(
			"/api/vendor/profile/",
			{
				"address": "42 Main Street, Kathmandu",
				"document": certificate,
				"bank_name": "Glow Bank",
				"account_number": "123456789",
				"account_name": "Verification Vendor",
				"account_type": "Khalti",
			},
			format="multipart",
		)

		self.assertEqual(response.status_code, 200)
		vendor_store.refresh_from_db()
		vendor_account.profile.refresh_from_db()
		self.assertEqual(vendor_account.profile.address, "42 Main Street, Kathmandu")
		self.assertTrue(vendor_store.document.name.startswith("images/company-register_"))
		self.assertTrue(vendor_store.document.name.endswith(".png"))
		account = BankAccount.objects.get(vendor=vendor_store)
		self.assertEqual(account.account_number, "123456789")
