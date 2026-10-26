import os
from pathlib import Path
from typing import List

try:
    from pydantic_settings import BaseSettings
    class Settings(BaseSettings):
        PROJECT_NAME: str = "Personalized Travel Itinerary Planner"
        API_V1_STR: str = "/api"
        SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-travel-planner-key-change-in-prod-2026")
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
        
        SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
        SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
        GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
        
        CORS_ORIGINS: List[str] = [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
            "*"
        ]
        class Config:
            extra = "allow"
except Exception:
    from pydantic import BaseModel
    class Settings(BaseModel):
        PROJECT_NAME: str = "Personalized Travel Itinerary Planner"
        API_V1_STR: str = "/api"
        SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-travel-planner-key-change-in-prod-2026")
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
        SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
        SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
        GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
        CORS_ORIGINS: List[str] = [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
            "*"
        ]

settings = Settings()
