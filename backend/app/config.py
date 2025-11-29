from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://postalcodeworx:postalcodeworx_dev@localhost:5432/postalcodeworx"
    
    # Anthropic Claude API
    anthropic_api_key: str = ""
    
    # CORS
    cors_origins: str = "http://localhost:3000"
    
    # Upload settings
    max_upload_size: int = 5 * 1024 * 1024  # 5MB
    upload_dir: str = "./uploads"
    
    # Business logic
    platform_fee_percentage: float = 0.20  # 20% fee on EUR transactions
    confidence_removal_threshold: float = 0.30  # Remove at 30%
    initial_confidence_score: float = 0.50  # Start at 50%
    initial_postaal_coins: int = 10  # New users get 10 coins
    
    # Berlin postal code validation
    berlin_postal_prefix: str = "1"  # Berlin codes start with 1
    postal_code_length: int = 5
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()



