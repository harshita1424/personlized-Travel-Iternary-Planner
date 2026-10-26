from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os

from app.core.config import settings
from app.api import auth, trips, preferences, itinerary, budget, recommendations

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Full-stack AI-Powered Travel Itinerary Planner with Supabase and Generative AI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(trips.router, prefix=settings.API_V1_STR)
app.include_router(preferences.router, prefix=settings.API_V1_STR)
app.include_router(itinerary.router, prefix=settings.API_V1_STR)
app.include_router(budget.router, prefix=settings.API_V1_STR)
app.include_router(recommendations.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to Personalized Travel Itinerary Planner API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "online"
    }

@app.get("/api/health")
def health_check():
    from app.db.database import db
    return {
        "status": "healthy",
        "supabase_connected": db.supabase_client is not None,
        "mode": "Supabase" if db.supabase_client is not None else "Resilient Relational SQLite"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
