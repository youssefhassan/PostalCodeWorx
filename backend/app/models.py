from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum


class GloveSide(str, enum.Enum):
    LEFT = "left"
    RIGHT = "right"
    UNKNOWN = "unknown"


class GloveSize(str, enum.Enum):
    XS = "xs"
    S = "s"
    M = "m"
    L = "l"
    XL = "xl"
    UNKNOWN = "unknown"


class FeeCurrency(str, enum.Enum):
    POSTAAL = "postaal"
    EUR = "eur"


class ListingStatus(str, enum.Enum):
    ACTIVE = "active"
    CLAIMED = "claimed"
    REMOVED = "removed"
    PENDING_MODERATION = "pending_moderation"


class GloveListing(Base):
    __tablename__ = "glove_listings"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Image
    photo_url = Column(String(500), nullable=False)
    photo_filename = Column(String(255), nullable=False)
    
    # Glove details (from Claude AI analysis + user confirmation)
    brand = Column(String(100), nullable=True)
    color = Column(String(50), nullable=False)
    size = Column(Enum(GloveSize), default=GloveSize.UNKNOWN)
    side = Column(Enum(GloveSide), default=GloveSide.UNKNOWN)
    material = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    
    # Location & time
    postal_code = Column(String(5), nullable=False, index=True)
    found_date = Column(DateTime, nullable=False)
    found_location_description = Column(String(255), nullable=True)  # e.g., "Near Alexanderplatz U-Bahn"
    
    # Finder info
    finder_email = Column(String(255), nullable=False)
    finder_display_name = Column(String(100), nullable=True)
    
    # Pricing
    fee_amount = Column(Float, default=0.0)
    fee_currency = Column(Enum(FeeCurrency), default=FeeCurrency.POSTAAL)
    
    # Moderation & scoring
    status = Column(Enum(ListingStatus), default=ListingStatus.ACTIVE)
    confidence_score = Column(Float, default=0.50)
    ai_moderation_passed = Column(Boolean, default=True)
    ai_moderation_notes = Column(Text, nullable=True)
    
    # AI analysis raw data
    ai_analysis = Column(Text, nullable=True)  # JSON string of Claude's analysis
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    reports = relationship("GloveReport", back_populates="listing")
    contact_requests = relationship("ContactRequest", back_populates="listing")


class GloveReport(Base):
    __tablename__ = "glove_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("glove_listings.id"), nullable=False)
    
    reason = Column(String(50), nullable=False)  # spam, inappropriate, wrong_location, other
    description = Column(Text, nullable=True)
    reporter_email = Column(String(255), nullable=True)
    reporter_ip = Column(String(45), nullable=True)
    
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    listing = relationship("GloveListing", back_populates="reports")


class ContactRequest(Base):
    __tablename__ = "contact_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("glove_listings.id"), nullable=False)
    
    # Requester info
    requester_email = Column(String(255), nullable=False)
    requester_name = Column(String(100), nullable=True)
    message = Column(Text, nullable=False)
    
    # Payment info
    fee_paid = Column(Float, nullable=False)
    fee_currency = Column(Enum(FeeCurrency), nullable=False)
    platform_fee = Column(Float, default=0.0)  # Our 20% cut (only for EUR)
    
    # Status
    is_paid = Column(Boolean, default=False)
    message_sent = Column(Boolean, default=False)
    
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    listing = relationship("GloveListing", back_populates="contact_requests")


# Future: User model for authentication
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    postal_code = Column(String(5), nullable=True)
    display_name = Column(String(100), nullable=True)
    
    # Postaal economy
    postaal_balance = Column(Integer, default=10)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())



