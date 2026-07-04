"""Iteration 4 — Verify auto-reply email + 422 detail + customer HTML template."""
import os
import sys
import pytest
import requests

# Allow importing server module for HTML template inspection
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

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


def _valid_payload(suffix=""):
    return {
        "name": f"TEST AutoReply{suffix}",
        "email": f"autoreply{suffix}@example.com",
        "phone": "+919999999999",
        "event_date": "2026-06-20",
        "start_time": "19:00",
        "duration_hours": "5",
        "members": 30,
        "occasion": "Anniversary",
        "decoration_note": "Marigold & fairy lights.",
        "add_ons": ["Farm-fresh Meals", "Bonfire Setup"],
        "notes": "Auto-reply verification.",
    }


# ---------- Dual email (owner + customer) success signal ----------
class TestDualEmail:
    def test_valid_booking_sends_both_emails(self, api_client):
        """When both owner and customer emails succeed, email_sent must be True.

        email_sent is only True when BOTH emails succeed (see server.create_booking:
        booking.email_sent = bool(owner_ok and customer_ok)).
        """
        payload = _valid_payload("-both")
        r = api_client.post(f"{API}/booking", json=payload, timeout=90)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("email_sent") is True, (
            f"Expected email_sent=True (owner+customer). Got {data.get('email_sent')}. "
            f"This means either the owner or customer auto-reply email failed. Response: {data}"
        )
        assert data["email"] == payload["email"]


# ---------- 422 detail surfacing ----------
class TestErrorDetail:
    def test_invalid_email_returns_422_with_field_detail(self, api_client):
        payload = _valid_payload("-bademail2")
        payload["email"] = "notanemail"
        r = api_client.post(f"{API}/booking", json=payload, timeout=30)
        assert r.status_code == 422
        body = r.json()
        assert "detail" in body
        assert isinstance(body["detail"], list) and len(body["detail"]) >= 1
        first = body["detail"][0]
        # Loc should reference email field so frontend can surface it.
        loc = first.get("loc", [])
        assert "email" in loc, f"Expected 'email' in loc, got {loc}"
        assert first.get("msg"), "Expected human-readable msg"

    def test_short_phone_returns_422_with_field_detail(self, api_client):
        payload = _valid_payload("-shortphone")
        payload["phone"] = "12"  # < 5 chars → Pydantic min_length violation
        r = api_client.post(f"{API}/booking", json=payload, timeout=30)
        assert r.status_code == 422
        body = r.json()
        assert isinstance(body.get("detail"), list) and len(body["detail"]) >= 1
        first = body["detail"][0]
        loc = first.get("loc", [])
        assert "phone" in loc, f"Expected 'phone' in loc, got {loc}"


# ---------- Customer HTML template content ----------
class TestCustomerHtmlTemplate:
    def test_customer_html_contains_required_strings(self):
        """Verify _build_booking_customer_html includes all required labels."""
        from server import _build_booking_customer_html, Booking

        b = Booking(
            name="Ravi Kumar",
            email="ravi@example.com",
            phone="+919999999999",
            event_date="2026-06-20",
            start_time="19:00",
            duration_hours="5",
            members=30,
            occasion="Anniversary",
            decoration_note="Marigold theme.",
            add_ons=["Farm-fresh Meals", "Bonfire Setup"],
            notes="test",
        )
        html = _build_booking_customer_html(b)
        # Brand
        assert "Panda Farm House" in html
        # Personalized first-name greeting
        assert "Thanks, Ravi" in html
        # Callback promise
        assert "call you within" in html and "24 hours" in html
        # Pricing note
        assert "Booking starts from" in html
        # Reference ID label + actual id
        assert "Reference" in html
        assert b.id in html
        # Summary rows
        assert "Anniversary" in html
        assert "2026-06-20" in html
        assert "19:00" in html
        assert "Farm-fresh Meals" in html


# ---------- Regression: existing endpoints still work ----------
class TestRegression:
    def test_contact_general_still_works(self, api_client):
        r = api_client.post(
            f"{API}/contact",
            json={
                "name": "TEST Regression4",
                "phone": "+919999999999",
                "email": "reg4@example.com",
                "message": "Regression check iteration 4",
                "inquiry_type": "general",
            },
            timeout=60,
        )
        assert r.status_code == 200
        assert r.json().get("email_sent") in (True, False)

    def test_booking_list_still_works(self, api_client):
        r = api_client.get(f"{API}/booking?limit=5", timeout=30)
        assert r.status_code == 200
        assert isinstance(r.json(), list)
