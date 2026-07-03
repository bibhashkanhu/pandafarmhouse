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
