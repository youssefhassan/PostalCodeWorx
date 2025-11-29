"""
Email service for sending contact messages.
For MVP, we'll just log the emails. In production, integrate with SendGrid, SES, etc.
"""
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self):
        # In production, initialize email client (SendGrid, SES, etc.)
        pass
    
    async def send_contact_message(
        self,
        finder_email: str,
        finder_name: Optional[str],
        requester_email: str,
        requester_name: Optional[str],
        message: str,
        glove_description: str,
        listing_id: int
    ) -> bool:
        """
        Send a contact message from someone who found their glove to the finder.
        """
        subject = f"🧤 PostalCodeWorx: Someone is looking for their glove! (Listing #{listing_id})"
        
        body = f"""
Hello {finder_name or 'Glove Finder'},

Great news! Someone believes they found their matching glove on PostalCodeWorx!

Glove Details:
{glove_description}

Message from the owner:
---
{message}
---

Contact them at: {requester_email}
{f"Name: {requester_name}" if requester_name else ""}

Thank you for helping reunite gloves with their owners! 🧤

Best,
The PostalCodeWorx Team
        """.strip()
        
        # For MVP, just log the email
        logger.info(f"""
========== EMAIL ==========
TO: {finder_email}
SUBJECT: {subject}
BODY:
{body}
===========================
        """)
        
        # In production:
        # await self.client.send(to=finder_email, subject=subject, body=body)
        
        return True
    
    async def send_payment_confirmation(
        self,
        requester_email: str,
        amount: float,
        currency: str,
        platform_fee: float,
        listing_id: int
    ) -> bool:
        """
        Send payment confirmation to the person contacting the finder.
        """
        subject = f"🧤 PostalCodeWorx: Payment Confirmation (Listing #{listing_id})"
        
        if currency == "eur":
            fee_text = f"Platform fee (20%): €{platform_fee:.2f}"
            total_text = f"Total paid: €{amount:.2f}"
        else:
            fee_text = ""
            total_text = f"Postaal coins used: {int(amount)}"
        
        body = f"""
Thank you for using PostalCodeWorx!

Your payment has been processed and your message has been sent to the finder.

{total_text}
{fee_text}

Listing ID: #{listing_id}

The finder will receive your message and contact details. 
We hope you get your glove back soon! 🧤

Best,
The PostalCodeWorx Team
        """.strip()
        
        logger.info(f"""
========== EMAIL ==========
TO: {requester_email}
SUBJECT: {subject}
BODY:
{body}
===========================
        """)
        
        return True


# Singleton instance
email_service = EmailService()



