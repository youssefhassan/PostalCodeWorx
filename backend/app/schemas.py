from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime
from enum import Enum
import re


class GloveSide(str, Enum):
    LEFT = "left"
    RIGHT = "right"
    UNKNOWN = "unknown"


class GloveSize(str, Enum):
    XS = "xs"
    S = "s"
    M = "m"
    L = "l"
    XL = "xl"
    UNKNOWN = "unknown"


class FeeCurrency(str, Enum):
    POSTAAL = "postaal"
    EUR = "eur"


class ListingStatus(str, Enum):
    ACTIVE = "active"
    CLAIMED = "claimed"
    REMOVED = "removed"
    PENDING_MODERATION = "pending_moderation"


# Berlin postal code validator
def validate_berlin_postal_code(v: str) -> str:
    if not v:
        raise ValueError("Postal code is required")
    v = v.strip()
    if not re.match(r"^1\d{4}$", v):
        raise ValueError("Must be a valid Berlin postal code (5 digits starting with 1)")
    return v


# ==================== Glove Analysis ====================

class GloveAnalysisRequest(BaseModel):
    """Request to analyze a glove image with Claude AI"""
    image_base64: str = Field(..., description="Base64 encoded image")


class GloveAnalysisResponse(BaseModel):
    """Claude AI's analysis of a glove image"""
    brand: Optional[str] = None
    color: str
    size: GloveSize = GloveSize.UNKNOWN
    side: GloveSide = GloveSide.UNKNOWN
    material: Optional[str] = None
    suggested_price_eur: Optional[float] = None
    description: str
    is_valid_glove: bool
    moderation_passed: bool
    moderation_notes: Optional[str] = None


# ==================== Glove Listing ====================

class GloveListingCreate(BaseModel):
    """Create a new glove listing"""
    # These come from the uploaded image
    photo_filename: str
    
    # These come from AI analysis (user can override)
    brand: Optional[str] = None
    color: str
    size: GloveSize = GloveSize.UNKNOWN
    side: GloveSide = GloveSide.UNKNOWN
    material: Optional[str] = None
    description: Optional[str] = None
    
    # User provides these
    postal_code: str
    found_date: datetime
    found_location_description: Optional[str] = None
    finder_email: EmailStr
    finder_display_name: Optional[str] = None
    fee_amount: float = Field(default=0.0, ge=0)
    fee_currency: FeeCurrency = FeeCurrency.POSTAAL
    
    # AI analysis data
    ai_analysis: Optional[str] = None
    ai_moderation_passed: bool = True
    ai_moderation_notes: Optional[str] = None
    
    @field_validator("postal_code")
    @classmethod
    def validate_postal(cls, v):
        return validate_berlin_postal_code(v)


class GloveListingResponse(BaseModel):
    id: int
    photo_url: str
    brand: Optional[str]
    color: str
    size: GloveSize
    side: GloveSide
    material: Optional[str]
    description: Optional[str]
    postal_code: str
    found_date: datetime
    found_location_description: Optional[str]
    finder_display_name: Optional[str]
    fee_amount: float
    fee_currency: FeeCurrency
    status: ListingStatus
    confidence_score: float
    created_at: datetime
    
    class Config:
        from_attributes = True


class GloveListingDetail(GloveListingResponse):
    """Detailed view with contact info (only after payment)"""
    finder_email: Optional[str] = None  # Only shown after payment
    contact_unlocked: bool = False


# ==================== Search ====================

class GloveSearchParams(BaseModel):
    postal_codes: Optional[List[str]] = None
    brand: Optional[str] = None
    color: Optional[str] = None
    size: Optional[GloveSize] = None
    side: Optional[GloveSide] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=20, ge=1, le=100)


class GloveSearchResponse(BaseModel):
    items: List[GloveListingResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


# ==================== Contact Request ====================

class ContactRequestCreate(BaseModel):
    requester_email: EmailStr
    requester_name: Optional[str] = None
    message: str = Field(..., min_length=10, max_length=1000)


class ContactRequestResponse(BaseModel):
    id: int
    listing_id: int
    fee_paid: float
    fee_currency: FeeCurrency
    platform_fee: float
    is_paid: bool
    message_sent: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class PaymentInfo(BaseModel):
    """Info needed to process payment for contacting finder"""
    listing_id: int
    fee_amount: float
    fee_currency: FeeCurrency
    platform_fee: float  # Our 20% cut
    total_amount: float  # What user pays


# ==================== Report ====================

class ReportReason(str, Enum):
    SPAM = "spam"
    INAPPROPRIATE = "inappropriate"
    WRONG_LOCATION = "wrong_location"
    FAKE = "fake"
    OTHER = "other"


class GloveReportCreate(BaseModel):
    reason: ReportReason
    description: Optional[str] = None
    reporter_email: Optional[EmailStr] = None


class GloveReportResponse(BaseModel):
    id: int
    listing_id: int
    reason: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Stats ====================

class PostalCodeStats(BaseModel):
    postal_code: str
    gloves_found: int
    gloves_claimed: int
    total_listings: int



