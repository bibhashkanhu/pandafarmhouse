"""Backend API tests for Panda Farm House."""
import os
import pytest
import requests

BASE_URL = os.environ.get(
    "REACT_APP_BACKEND_URL",
    "https://panda-farm-house.preview.emergentagent.com",
).rstrip("/")

API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health & root ----------
class TestHealth:
    def test_health(self, api_client):
        r = api_client.get(f"{API}/health", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "healthy"

    def test_root(self, api_client):
        r = api_client.get(f"{API}/", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert "Panda Farm House" in data.get("message", "")
        assert data.get("status") == "ok"


# ---------- Contact submissions ----------
class TestContact:
    def _payload(self, inquiry_type="general", suffix=""):
        return {
            "name": f"TEST User{suffix}",
            "phone": "+919999999999",
            "email": f"test{suffix}@example.com",
            "message": "TEST submission from pytest",
            "inquiry_type": inquiry_type,
        }

    def test_create_general(self, api_client):
        payload = self._payload("general", "-general")
        r = api_client.post(f"{API}/contact", json=payload, timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert isinstance(data.get("email_sent"), bool)
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["inquiry_type"] == "general"

    def test_create_visit(self, api_client):
        payload = self._payload("visit", "-visit")
        r = api_client.post(f"{API}/contact", json=payload, timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["inquiry_type"] == "visit"
        assert "id" in data

    def test_create_produce(self, api_client):
        payload = self._payload("produce", "-produce")
        r = api_client.post(f"{API}/contact", json=payload, timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["inquiry_type"] == "produce"
        assert "id" in data

    def test_invalid_email(self, api_client):
        payload = self._payload("general", "-bademail")
        payload["email"] = "not-an-email"
        r = api_client.post(f"{API}/contact", json=payload, timeout=30)
        assert r.status_code == 422

    def test_missing_required_fields(self, api_client):
        payload = {"name": "TEST", "email": "test@example.com"}  # missing phone, message
        r = api_client.post(f"{API}/contact", json=payload, timeout=30)
        assert r.status_code == 422

    def test_list_sorted_newest_first(self, api_client):
        # Create a fresh submission and verify it appears in the list
        payload = self._payload("general", "-listcheck")
        create_r = api_client.post(f"{API}/contact", json=payload, timeout=60)
        assert create_r.status_code == 200
        created_id = create_r.json()["id"]

        r = api_client.get(f"{API}/contact", timeout=30)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 1
        ids = [it.get("id") for it in items]
        assert created_id in ids
        # Sorted newest first (created_at desc)
        if len(items) >= 2:
            first = items[0].get("created_at")
            second = items[1].get("created_at")
            assert first >= second

    def test_list_limit(self, api_client):
        r = api_client.get(f"{API}/contact?limit=2", timeout=30)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) <= 2


# ---------- Booking ----------
class TestBooking:
    def _payload(self, suffix=""):
        return {
            "name": f"TEST Booking{suffix}",
            "email": f"booking{suffix}@example.com",
            "phone": "+919999999999",
            "event_date": "2026-05-15",
            "start_time": "18:30",
            "duration_hours": "4",
            "members": 25,
            "occasion": "Birthday Celebration",
            "decoration_note": "Yellow & white theme, fairy lights.",
            "add_ons": ["Farm-fresh Meals", "Bonfire Setup", "Cake Arrangement"],
            "notes": "Vegetarian menu preferred.",
        }

    def test_create_booking_success(self, api_client):
        payload = self._payload("-success")
        r = api_client.post(f"{API}/booking", json=payload, timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert isinstance(data.get("email_sent"), bool)
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["members"] == 25
        assert data["occasion"] == "Birthday Celebration"
        assert isinstance(data["add_ons"], list)
        assert "Farm-fresh Meals" in data["add_ons"]
        assert len(data["add_ons"]) == 3

    def test_missing_required_fields(self, api_client):
        # Missing name/email/phone/event_date/start_time/members
        r = api_client.post(f"{API}/booking", json={"occasion": "Birthday"}, timeout=30)
        assert r.status_code == 422

    def test_invalid_email(self, api_client):
        payload = self._payload("-bademail")
        payload["email"] = "not-an-email"
        r = api_client.post(f"{API}/booking", json=payload, timeout=30)
        assert r.status_code == 422

    def test_members_below_one(self, api_client):
        payload = self._payload("-zero")
        payload["members"] = 0
        r = api_client.post(f"{API}/booking", json=payload, timeout=30)
        assert r.status_code == 422

    def test_list_persistence_and_newest_first(self, api_client):
        # Create a fresh booking, verify it appears at top of list
        payload = self._payload("-persist")
        create_r = api_client.post(f"{API}/booking", json=payload, timeout=60)
        assert create_r.status_code == 200, create_r.text
        created_id = create_r.json()["id"]

        r = api_client.get(f"{API}/booking", timeout=30)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list) and len(items) >= 1
        ids = [it.get("id") for it in items]
        assert created_id in ids
        # Newest is at the top
        top = items[0]
        assert top["id"] == created_id
        assert top["name"] == payload["name"]
        if len(items) >= 2:
            assert items[0]["created_at"] >= items[1]["created_at"]

    def test_list_limit(self, api_client):
        r = api_client.get(f"{API}/booking?limit=1", timeout=30)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list) and len(items) <= 1
