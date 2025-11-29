import anthropic
import json
import base64
from typing import Optional
from ..config import get_settings
from ..schemas import GloveAnalysisResponse, GloveSize, GloveSide

settings = get_settings()


class ClaudeService:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        self.model = "claude-sonnet-4-20250514"
    
    async def analyze_glove_image(self, image_base64: str, media_type: str = "image/jpeg") -> GloveAnalysisResponse:
        """
        Analyze a glove image using Claude Vision.
        Returns brand, color, size, side, material, and suggested price.
        Also performs content moderation.
        """
        
        prompt = """You are analyzing an image that should contain a single glove (the kind worn on hands).

Please analyze this image and provide a JSON response with the following fields:

{
    "is_valid_glove": true/false,  // Is this actually a glove image?
    "brand": "string or null",      // Brand name if visible (e.g., "Nike", "North Face", "Unknown")
    "color": "string",              // Primary color(s) of the glove
    "size": "xs|s|m|l|xl|unknown",  // Estimated size based on proportions
    "side": "left|right|unknown",   // Which hand is this glove for?
    "material": "string or null",   // Material if identifiable (leather, wool, synthetic, etc.)
    "suggested_price_eur": number or null,  // Estimated value in EUR based on brand/condition
    "description": "string",        // Brief description of the glove (2-3 sentences)
    "moderation_passed": true/false,  // Does this image pass content moderation?
    "moderation_notes": "string or null"  // If moderation failed, explain why
}

Moderation rules - FAIL if any of these:
- Image contains inappropriate/adult content
- Image contains hate symbols or offensive material
- Image is clearly spam/advertising
- Image is not actually a glove (could be other clothing, random objects, etc.)
- Image quality is too poor to identify anything

Be helpful and try to identify as much as possible. If you can see a brand logo, identify it.
If you can estimate the size based on the glove's proportions, do so.

Respond ONLY with valid JSON, no other text."""

        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": media_type,
                                    "data": image_base64,
                                },
                            },
                            {
                                "type": "text",
                                "text": prompt
                            }
                        ],
                    }
                ],
            )
            
            # Parse the JSON response
            response_text = message.content[0].text
            
            # Try to extract JSON from the response
            try:
                # Handle case where Claude might wrap in markdown code blocks
                if "```json" in response_text:
                    response_text = response_text.split("```json")[1].split("```")[0]
                elif "```" in response_text:
                    response_text = response_text.split("```")[1].split("```")[0]
                
                data = json.loads(response_text.strip())
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                return GloveAnalysisResponse(
                    is_valid_glove=False,
                    color="unknown",
                    description="Failed to analyze image",
                    moderation_passed=False,
                    moderation_notes="Image analysis failed - please try again"
                )
            
            # Map size string to enum
            size_map = {
                "xs": GloveSize.XS,
                "s": GloveSize.S,
                "m": GloveSize.M,
                "l": GloveSize.L,
                "xl": GloveSize.XL,
            }
            size = size_map.get(data.get("size", "").lower(), GloveSize.UNKNOWN)
            
            # Map side string to enum
            side_map = {
                "left": GloveSide.LEFT,
                "right": GloveSide.RIGHT,
            }
            side = side_map.get(data.get("side", "").lower(), GloveSide.UNKNOWN)
            
            return GloveAnalysisResponse(
                brand=data.get("brand"),
                color=data.get("color", "unknown"),
                size=size,
                side=side,
                material=data.get("material"),
                suggested_price_eur=data.get("suggested_price_eur"),
                description=data.get("description", ""),
                is_valid_glove=data.get("is_valid_glove", False),
                moderation_passed=data.get("moderation_passed", False),
                moderation_notes=data.get("moderation_notes")
            )
            
        except anthropic.APIError as e:
            return GloveAnalysisResponse(
                is_valid_glove=False,
                color="unknown",
                description=f"API error: {str(e)}",
                moderation_passed=False,
                moderation_notes=f"API error occurred: {str(e)}"
            )
    
    async def moderate_content(self, text: str) -> tuple[bool, Optional[str]]:
        """
        Moderate text content for spam, hate speech, etc.
        Returns (passed, notes)
        """
        prompt = f"""Analyze the following text for content moderation.
        
Text to analyze:
"{text}"

Check for:
1. Spam or advertising
2. Hate speech or offensive content
3. Personal attacks or harassment
4. Inappropriate language

Respond with JSON:
{{
    "passed": true/false,
    "reason": "explanation if failed, null if passed"
}}

Respond ONLY with valid JSON."""

        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=256,
                messages=[
                    {"role": "user", "content": prompt}
                ],
            )
            
            response_text = message.content[0].text
            
            # Handle markdown code blocks
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]
            
            data = json.loads(response_text.strip())
            return data.get("passed", True), data.get("reason")
            
        except Exception:
            # Default to passing if moderation fails
            return True, None


# Singleton instance
claude_service = ClaudeService()



