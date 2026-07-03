from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Emergent Email integration (constant base URL — do not read from env)
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
CONTACT_RECIPIENT_EMAIL = os.environ["CONTACT_RECIPIENT_EMAIL"]

app = FastAPI(title="Panda Farm House API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class ContactSubmissionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    phone: str = Field(..., min_length=5, max_length=30)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=4000)
    inquiry_type: Optional[str] = Field(default="general")  # general | visit | produce


class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: EmailStr
    message: str
    inquiry_type: str = "general"
    email_sent: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BookingCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=5, max_length=30)
    event_date: str = Field(..., min_length=1, max_length=40)     # YYYY-MM-DD
    start_time: str = Field(..., min_length=1, max_length=20)     # HH:MM
    duration_hours: Optional[str] = Field(default="", max_length=10)
    members: int = Field(..., ge=1, le=1000)
    occasion: Optional[str] = Field(default="")
    decoration_note: Optional[str] = Field(default="", max_length=2000)
    add_ons: List[str] = Field(default_factory=list)
    notes: Optional[str] = Field(default="", max_length=2000)


class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    event_date: str
    start_time: str
    duration_hours: str = ""
    members: int
    occasion: str = ""
    decoration_note: str = ""
    add_ons: List[str] = Field(default_factory=list)
    notes: str = ""
    email_sent: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Helpers ----------
def _build_email_html(sub: ContactSubmission) -> str:
    label = {
        "visit": "Farm Visit Request",
        "produce": "Fresh Produce Request",
        "general": "General Inquiry",
    }.get(sub.inquiry_type, "General Inquiry")

    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; background:#FDFBF7; padding:24px;">
      <tr><td>
        <table width="100%" style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #E5E0D8; border-radius:12px; overflow:hidden;">
          <tr>
            <td style="background:#2E7D32; padding:24px; color:#fff;">
              <div style="font-size:12px; letter-spacing:3px; opacity:0.85;">PANDA FARM HOUSE</div>
              <div style="font-size:22px; margin-top:6px;">New {label}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px; color:#1A2E1A;">
              <p style="margin:0 0 12px 0;"><strong>Name:</strong> {sub.name}</p>
              <p style="margin:0 0 12px 0;"><strong>Email:</strong> {sub.email}</p>
              <p style="margin:0 0 12px 0;"><strong>Phone:</strong> {sub.phone}</p>
              <p style="margin:0 0 6px 0;"><strong>Message:</strong></p>
              <p style="margin:0; padding:16px; background:#F4F1EA; border-left:4px solid #FBC02D; border-radius:6px; white-space:pre-wrap;">{sub.message}</p>
              <p style="margin:20px 0 0 0; font-size:12px; color:#6D4C41;">Received on {sub.created_at.strftime('%d %b %Y, %I:%M %p UTC')}</p>
            </td>
          </tr>
          <tr>
            <td style="background:#F4F1EA; padding:16px; text-align:center; font-size:12px; color:#6D4C41;">
              Panda Farm House &middot; Banaparia, Balasore, Odisha 756056
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
    """


async def _send_email(to: str, subject: str, html: str, reply_to: Optional[str] = None) -> bool:
    payload = {
        "to": [to],
        "subject": subject,
        "html": html,
        "from_name": EMAIL_FROM_NAME,
    }
    if reply_to:
        payload["contact_email"] = reply_to
    try:
        async with httpx.AsyncClient(timeout=30) as http:
            resp = await http.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return True
    except httpx.HTTPStatusError as e:
        logging.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        return False
    except Exception as e:
        logging.error(f"Email send error: {e}")
        return False


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Panda Farm House API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {"status": "healthy", "service": "panda-farm-house"}


@api_router.post("/contact", response_model=ContactSubmission)
async def create_contact_submission(payload: ContactSubmissionCreate):
    submission = ContactSubmission(**payload.model_dump())

    subject_label = {
        "visit": "Farm Visit Request",
        "produce": "Fresh Produce Request",
        "general": "New Inquiry",
    }.get(submission.inquiry_type, "New Inquiry")
    subject = f"[Panda Farm House] {subject_label} from {submission.name}"

    email_ok = await _send_email(
        to=CONTACT_RECIPIENT_EMAIL,
        subject=subject,
        html=_build_email_html(submission),
        reply_to=submission.email,
    )
    submission.email_sent = email_ok

    # Persist (serialize datetime to ISO for MongoDB)
    doc = submission.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.contact_submissions.insert_one(doc)

    return submission


@api_router.get("/contact", response_model=List[ContactSubmission])
async def list_contact_submissions(limit: int = 100):
    items = await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for it in items:
        if isinstance(it.get("created_at"), str):
            try:
                it["created_at"] = datetime.fromisoformat(it["created_at"])
            except Exception:
                pass
    return items


def _build_booking_html(b: Booking) -> str:
    addons = "".join(
        f"<li style='margin:4px 0;'>&#10003; {a}</li>" for a in b.add_ons
    ) or "<li style='margin:4px 0; color:#6D4C41;'>None selected</li>"
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; background:#FDFBF7; padding:24px;">
      <tr><td>
        <table width="100%" style="max-width:680px; margin:0 auto; background:#ffffff; border:1px solid #E5E0D8; border-radius:12px; overflow:hidden;">
          <tr>
            <td style="background:#1A2E1A; padding:24px; color:#fff;">
              <div style="font-size:12px; letter-spacing:3px; color:#FBC02D;">PANDA FARM HOUSE</div>
              <div style="font-size:22px; margin-top:6px;">New Farm Booking Request</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px; color:#1A2E1A;">
              <h3 style="margin:0 0 12px 0; color:#2E7D32; font-size:14px; letter-spacing:2px; text-transform:uppercase;">Guest</h3>
              <p style="margin:0 0 6px 0;"><strong>Name:</strong> {b.name}</p>
              <p style="margin:0 0 6px 0;"><strong>Email:</strong> {b.email}</p>
              <p style="margin:0 0 6px 0;"><strong>Phone:</strong> {b.phone}</p>

              <h3 style="margin:20px 0 12px 0; color:#2E7D32; font-size:14px; letter-spacing:2px; text-transform:uppercase;">Event</h3>
              <p style="margin:0 0 6px 0;"><strong>Occasion:</strong> {b.occasion or 'Not specified'}</p>
              <p style="margin:0 0 6px 0;"><strong>Date:</strong> {b.event_date}</p>
              <p style="margin:0 0 6px 0;"><strong>Start Time:</strong> {b.start_time}</p>
              <p style="margin:0 0 6px 0;"><strong>Estimated Duration:</strong> {b.duration_hours or 'To be confirmed'} hrs</p>
              <p style="margin:0 0 6px 0;"><strong>Total Members:</strong> {b.members}</p>

              <h3 style="margin:20px 0 12px 0; color:#2E7D32; font-size:14px; letter-spacing:2px; text-transform:uppercase;">Add-ons Requested</h3>
              <ul style="margin:0; padding-left:18px;">{addons}</ul>

              <h3 style="margin:20px 0 12px 0; color:#2E7D32; font-size:14px; letter-spacing:2px; text-transform:uppercase;">Decoration Notes</h3>
              <p style="margin:0; padding:12px; background:#F4F1EA; border-left:4px solid #FBC02D; border-radius:6px; white-space:pre-wrap;">
                {b.decoration_note or 'No specific decoration request.'}
              </p>

              <h3 style="margin:20px 0 12px 0; color:#2E7D32; font-size:14px; letter-spacing:2px; text-transform:uppercase;">Additional Notes</h3>
              <p style="margin:0; padding:12px; background:#F4F1EA; border-left:4px solid #2E7D32; border-radius:6px; white-space:pre-wrap;">
                {b.notes or '—'}
              </p>

              <p style="margin:24px 0 0 0; font-size:12px; color:#6D4C41;">
                Received on {b.created_at.strftime('%d %b %Y, %I:%M %p UTC')} · Booking ID: {b.id}
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#F4F1EA; padding:16px; text-align:center; font-size:12px; color:#6D4C41;">
              Panda Farm House &middot; Banaparia, Balasore, Odisha 756056 &middot; +91 98614 48443
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
    """


def _build_booking_customer_html(b: Booking) -> str:
    addons = "".join(
        f"<li style='margin:4px 0;'>&#10003; {a}</li>" for a in b.add_ons
    ) or "<li style='margin:4px 0; color:#6D4C41;'>None selected</li>"
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; background:#FDFBF7; padding:24px;">
      <tr><td>
        <table width="100%" style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #E5E0D8; border-radius:12px; overflow:hidden;">
          <tr>
            <td style="background:#2E7D32; padding:28px 28px 22px 28px; color:#fff;">
              <div style="font-size:11px; letter-spacing:3px; color:#FBC02D;">PANDA FARM HOUSE</div>
              <div style="font-size:26px; margin-top:8px; font-family: Georgia, 'Times New Roman', serif;">Thanks, {b.name.split(' ')[0]}! 🌿</div>
              <div style="font-size:14px; margin-top:6px; opacity:0.85;">We&rsquo;ve received your booking enquiry.</div>
            </td>
          </tr>
          <tr>
            <td style="padding:26px 28px; color:#1A2E1A; line-height:1.6;">
              <p style="margin:0 0 14px 0;">
                Our team will personally call you within <strong>24 hours</strong> on
                <strong>{b.phone}</strong> to confirm availability, walk through your
                add-ons and finalise the pricing for your event.
              </p>
              <p style="margin:0 0 20px 0; color:#6D4C41;">
                Meanwhile, here&rsquo;s a copy of what you shared with us:
              </p>

              <table width="100%" style="border:1px solid #E5E0D8; border-radius:8px; border-collapse:separate; border-spacing:0;">
                <tr><td style="padding:12px 16px; border-bottom:1px solid #E5E0D8;"><strong>Occasion:</strong> {b.occasion or 'Not specified'}</td></tr>
                <tr><td style="padding:12px 16px; border-bottom:1px solid #E5E0D8;"><strong>Date:</strong> {b.event_date}</td></tr>
                <tr><td style="padding:12px 16px; border-bottom:1px solid #E5E0D8;"><strong>Start Time:</strong> {b.start_time}</td></tr>
                <tr><td style="padding:12px 16px; border-bottom:1px solid #E5E0D8;"><strong>Estimated Duration:</strong> {b.duration_hours or 'To be confirmed'} hrs</td></tr>
                <tr><td style="padding:12px 16px;"><strong>Total Members:</strong> {b.members}</td></tr>
              </table>

              <h4 style="margin:22px 0 8px 0; color:#2E7D32; font-size:13px; letter-spacing:2px; text-transform:uppercase;">Add-ons Requested</h4>
              <ul style="margin:0; padding-left:18px; color:#1A2E1A;">{addons}</ul>

              <div style="margin-top:24px; padding:14px 16px; background:#F4F1EA; border-left:4px solid #FBC02D; border-radius:6px;">
                <strong style="color:#1A2E1A;">Price:</strong>
                <span style="color:#6D4C41;">
                  Booking starts from <strong>&#8377;1,499/hr</strong>. Final price
                  depends on your date, guest count and add-ons &mdash; our team
                  will share it during the call. Terms &amp; conditions apply.
                </span>
              </div>

              <div style="margin-top:22px; padding:16px; background:#1A2E1A; border-radius:10px; color:#fff; text-align:center;">
                <div style="font-size:11px; letter-spacing:2px; color:#FBC02D;">NEED SOMETHING URGENT?</div>
                <div style="margin-top:6px; font-size:15px;">
                  Call us on <a href="tel:+919861448443" style="color:#FBC02D; text-decoration:none;">+91 98614 48443</a>
                  &nbsp;·&nbsp; WhatsApp <a href="https://wa.me/918328830796" style="color:#FBC02D; text-decoration:none;">+91 83288 30796</a>
                </div>
              </div>

              <p style="margin:24px 0 0 0; font-size:12px; color:#6D4C41;">
                Reference&nbsp;ID: <code>{b.id}</code>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#F4F1EA; padding:16px 28px; text-align:center; font-size:12px; color:#6D4C41;">
              Panda Farm House &middot; Banaparia, Balasore, Odisha 756056
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
    """


@api_router.post("/booking", response_model=Booking)
async def create_booking(payload: BookingCreate):
    booking = Booking(**payload.model_dump())

    # 1) Notify the farm team
    owner_subject = f"[Panda Farm House] Booking Request — {booking.name} on {booking.event_date}"
    owner_ok = await _send_email(
        to=CONTACT_RECIPIENT_EMAIL,
        subject=owner_subject,
        html=_build_booking_html(booking),
        reply_to=booking.email,
    )

    # 2) Auto-confirmation to the customer
    customer_subject = "We've received your booking enquiry — Panda Farm House"
    customer_ok = await _send_email(
        to=booking.email,
        subject=customer_subject,
        html=_build_booking_customer_html(booking),
        reply_to=CONTACT_RECIPIENT_EMAIL,
    )

    booking.email_sent = bool(owner_ok and customer_ok)

    doc = booking.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.bookings.insert_one(doc)

    return booking


@api_router.get("/booking", response_model=List[Booking])
async def list_bookings(limit: int = 100):
    items = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for it in items:
        if isinstance(it.get("created_at"), str):
            try:
                it["created_at"] = datetime.fromisoformat(it["created_at"])
            except Exception:
                pass
    return items


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
