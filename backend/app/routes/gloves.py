from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import Optional, List
import os
import uuid
import base64
import json
from datetime import datetime

from ..database import get_db
from ..config import get_settings
from ..models import GloveListing, GloveReport, ContactRequest, ListingStatus, FeeCurrency as DBFeeCurrency
from ..schemas import (
    GloveListingCreate,
    GloveListingResponse,
    GloveListingDetail,
    GloveSearchParams,
    GloveSearchResponse,
    GloveReportCreate,
    GloveReportResponse,
    ContactRequestCreate,
    ContactRequestResponse,
    PaymentInfo,
    GloveAnalysisResponse,
    FeeCurrency,
    GloveSide,
    GloveSize,
    PostalCodeStats,
)
from ..services.claude_service import claude_service
from ..services.email_service import email_service

router = APIRouter(prefix="/api/gloves", tags=["gloves"])
settings = get_settings()


def get_photo_url(filename: str) -> str:
    """Generate the URL for a photo"""
    return f"/uploads/{filename}"


@router.post("/analyze", response_model=GloveAnalysisResponse)
async def analyze_glove_image(file: UploadFile = File(...)):
    """
    Upload a glove image and get AI analysis.
    Returns brand, color, size, side, material, and suggested price.
    """
    # Validate file size
    contents = await file.read()
    if len(contents) > settings.max_upload_size:
        raise HTTPException(status_code=400, detail=f"File too large. Max size: {settings.max_upload_size // (1024*1024)}MB")
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: {allowed_types}")
    
    # Convert to base64 for Claude
    image_base64 = base64.b64encode(contents).decode("utf-8")
    
    # Analyze with Claude
    analysis = await claude_service.analyze_glove_image(image_base64, file.content_type)
    
    return analysis


@router.post("/upload", response_model=GloveListingResponse)
async def upload_glove(
    file: UploadFile = File(...),
    brand: Optional[str] = Form(None),
    color: str = Form(...),
    size: str = Form("unknown"),
    side: str = Form("unknown"),
    material: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    postal_code: str = Form(...),
    found_date: str = Form(...),
    found_location_description: Optional[str] = Form(None),
    finder_email: str = Form(...),
    finder_display_name: Optional[str] = Form(None),
    fee_amount: float = Form(0.0),
    fee_currency: str = Form("postaal"),
    ai_analysis: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Upload a found glove listing.
    The image is analyzed by Claude AI for moderation.
    """
    # Validate file size
    contents = await file.read()
    if len(contents) > settings.max_upload_size:
        raise HTTPException(status_code=400, detail=f"File too large. Max size: {settings.max_upload_size // (1024*1024)}MB")
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: {allowed_types}")
    
    # Validate Berlin postal code
    if not postal_code or len(postal_code) != 5 or not postal_code.startswith("1"):
        raise HTTPException(status_code=400, detail="Must be a valid Berlin postal code (5 digits starting with 1)")
    
    # Parse date
    try:
        parsed_date = datetime.fromisoformat(found_date.replace("Z", "+00:00"))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use ISO 8601.")
    
    # Generate unique filename and save
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{uuid.uuid4()}.{file_ext}"
    
    # Ensure upload directory exists
    os.makedirs(settings.upload_dir, exist_ok=True)
    file_path = os.path.join(settings.upload_dir, filename)
    
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Run moderation check with Claude
    image_base64 = base64.b64encode(contents).decode("utf-8")
    analysis = await claude_service.analyze_glove_image(image_base64, file.content_type)
    
    if not analysis.moderation_passed:
        # Delete the uploaded file
        os.remove(file_path)
        raise HTTPException(
            status_code=400, 
            detail=f"Image failed moderation: {analysis.moderation_notes}"
        )
    
    # Create listing
    listing = GloveListing(
        photo_url=get_photo_url(filename),
        photo_filename=filename,
        brand=brand,
        color=color,
        size=size,
        side=side,
        material=material,
        description=description,
        postal_code=postal_code,
        found_date=parsed_date,
        found_location_description=found_location_description,
        finder_email=finder_email,
        finder_display_name=finder_display_name,
        fee_amount=fee_amount,
        fee_currency=fee_currency,
        ai_analysis=ai_analysis or json.dumps(analysis.model_dump()),
        ai_moderation_passed=analysis.moderation_passed,
        ai_moderation_notes=analysis.moderation_notes,
        confidence_score=settings.initial_confidence_score,
        status=ListingStatus.ACTIVE,
    )
    
    db.add(listing)
    db.commit()
    db.refresh(listing)
    
    return listing


@router.get("/search", response_model=GloveSearchResponse)
async def search_gloves(
    postal_codes: Optional[str] = Query(None, description="Comma-separated postal codes"),
    brand: Optional[str] = None,
    color: Optional[str] = None,
    size: Optional[str] = None,
    side: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Search for glove listings with filters.
    """
    query = db.query(GloveListing).filter(
        GloveListing.status == ListingStatus.ACTIVE,
        GloveListing.confidence_score >= settings.confidence_removal_threshold
    )
    
    # Filter by postal codes
    if postal_codes:
        codes = [c.strip() for c in postal_codes.split(",")]
        query = query.filter(GloveListing.postal_code.in_(codes))
    
    # Filter by brand (case-insensitive partial match)
    if brand:
        query = query.filter(GloveListing.brand.ilike(f"%{brand}%"))
    
    # Filter by color (case-insensitive partial match)
    if color:
        query = query.filter(GloveListing.color.ilike(f"%{color}%"))
    
    # Filter by size
    if size and size != "unknown":
        query = query.filter(GloveListing.size == size)
    
    # Filter by side
    if side and side != "unknown":
        query = query.filter(GloveListing.side == side)
    
    # Filter by date range
    if date_from:
        try:
            from_date = datetime.fromisoformat(date_from.replace("Z", "+00:00"))
            query = query.filter(GloveListing.found_date >= from_date)
        except ValueError:
            pass
    
    if date_to:
        try:
            to_date = datetime.fromisoformat(date_to.replace("Z", "+00:00"))
            query = query.filter(GloveListing.found_date <= to_date)
        except ValueError:
            pass
    
    # Get total count
    total = query.count()
    
    # Paginate
    offset = (page - 1) * per_page
    items = query.order_by(GloveListing.found_date.desc()).offset(offset).limit(per_page).all()
    
    total_pages = (total + per_page - 1) // per_page
    
    return GloveSearchResponse(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages
    )


@router.get("/{listing_id}", response_model=GloveListingDetail)
async def get_glove_listing(
    listing_id: int,
    requester_email: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get a single glove listing by ID.
    Finder email is only shown if the requester has paid.
    """
    listing = db.query(GloveListing).filter(GloveListing.id == listing_id).first()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Check if requester has unlocked contact
    contact_unlocked = False
    finder_email = None
    
    if requester_email:
        contact_request = db.query(ContactRequest).filter(
            ContactRequest.listing_id == listing_id,
            ContactRequest.requester_email == requester_email,
            ContactRequest.is_paid == True
        ).first()
        
        if contact_request:
            contact_unlocked = True
            finder_email = listing.finder_email
    
    # Build response, excluding internal fields and overriding finder_email
    listing_dict = {k: v for k, v in listing.__dict__.items() if not k.startswith("_")}
    listing_dict["finder_email"] = finder_email  # Only show if contact unlocked
    listing_dict["contact_unlocked"] = contact_unlocked
    return GloveListingDetail(**listing_dict)


@router.get("/{listing_id}/payment-info", response_model=PaymentInfo)
async def get_payment_info(listing_id: int, db: Session = Depends(get_db)):
    """
    Get payment information for contacting a finder.
    """
    listing = db.query(GloveListing).filter(GloveListing.id == listing_id).first()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    platform_fee = 0.0
    total_amount = listing.fee_amount
    
    if listing.fee_currency == "eur" and listing.fee_amount > 0:
        platform_fee = listing.fee_amount * settings.platform_fee_percentage
        total_amount = listing.fee_amount + platform_fee
    
    return PaymentInfo(
        listing_id=listing.id,
        fee_amount=listing.fee_amount,
        fee_currency=listing.fee_currency,
        platform_fee=platform_fee,
        total_amount=total_amount
    )


@router.post("/{listing_id}/contact", response_model=ContactRequestResponse)
async def contact_finder(
    listing_id: int,
    request: ContactRequestCreate,
    db: Session = Depends(get_db)
):
    """
    Pay the finder's fee and send a contact message.
    The message is forwarded to the finder's email.
    """
    listing = db.query(GloveListing).filter(GloveListing.id == listing_id).first()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    if listing.status != ListingStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="This listing is no longer active")
    
    # Moderate the message
    passed, notes = await claude_service.moderate_content(request.message)
    if not passed:
        raise HTTPException(status_code=400, detail=f"Message failed moderation: {notes}")
    
    # Calculate fees
    platform_fee = 0.0
    if listing.fee_currency == "eur" and listing.fee_amount > 0:
        platform_fee = listing.fee_amount * settings.platform_fee_percentage
    
    # Create contact request (in production, verify payment first)
    contact_request = ContactRequest(
        listing_id=listing_id,
        requester_email=request.requester_email,
        requester_name=request.requester_name,
        message=request.message,
        fee_paid=listing.fee_amount,
        fee_currency=listing.fee_currency,
        platform_fee=platform_fee,
        is_paid=True,  # In MVP, assume payment is successful
        message_sent=False,
    )
    
    db.add(contact_request)
    db.commit()
    db.refresh(contact_request)
    
    # Send email to finder
    glove_desc = f"{listing.color} {listing.brand or ''} glove ({listing.side} hand, size {listing.size})"
    await email_service.send_contact_message(
        finder_email=listing.finder_email,
        finder_name=listing.finder_display_name,
        requester_email=request.requester_email,
        requester_name=request.requester_name,
        message=request.message,
        glove_description=glove_desc,
        listing_id=listing_id
    )
    
    # Send confirmation to requester
    await email_service.send_payment_confirmation(
        requester_email=request.requester_email,
        amount=listing.fee_amount,
        currency=listing.fee_currency,
        platform_fee=platform_fee,
        listing_id=listing_id
    )
    
    # Update contact request
    contact_request.message_sent = True
    db.commit()
    db.refresh(contact_request)
    
    return contact_request


@router.post("/{listing_id}/report", response_model=GloveReportResponse)
async def report_listing(
    listing_id: int,
    report: GloveReportCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Report a listing as spam, inappropriate, or wrong location.
    This affects the listing's confidence score.
    """
    listing = db.query(GloveListing).filter(GloveListing.id == listing_id).first()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Get reporter IP
    reporter_ip = request.client.host if request.client else None
    
    # Create report
    glove_report = GloveReport(
        listing_id=listing_id,
        reason=report.reason.value,
        description=report.description,
        reporter_email=report.reporter_email,
        reporter_ip=reporter_ip,
    )
    
    db.add(glove_report)
    
    # Decrease confidence score
    report_count = db.query(GloveReport).filter(GloveReport.listing_id == listing_id).count()
    # Each report reduces score by 10%
    listing.confidence_score = max(0, listing.confidence_score - 0.10)
    
    # Check if listing should be removed
    if listing.confidence_score < settings.confidence_removal_threshold:
        listing.status = ListingStatus.REMOVED
    
    db.commit()
    db.refresh(glove_report)
    
    return glove_report


@router.get("/stats/postal-codes", response_model=List[PostalCodeStats])
async def get_postal_code_stats(db: Session = Depends(get_db)):
    """
    Get statistics for each postal code (leaderboard).
    """
    stats = db.query(
        GloveListing.postal_code,
        func.count(GloveListing.id).label("total_listings"),
        func.sum(
            func.case(
                (GloveListing.status == ListingStatus.CLAIMED, 1),
                else_=0
            )
        ).label("gloves_claimed"),
    ).filter(
        GloveListing.status.in_([ListingStatus.ACTIVE, ListingStatus.CLAIMED])
    ).group_by(GloveListing.postal_code).all()
    
    return [
        PostalCodeStats(
            postal_code=row.postal_code,
            gloves_found=row.total_listings,
            gloves_claimed=row.gloves_claimed or 0,
            total_listings=row.total_listings,
        )
        for row in stats
    ]



