from fastapi import APIRouter, Query
from typing import List, Optional
from app.models.schemas import RecommendationsResponse
from app.services.recommendation_service import recommendation_service

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("/", response_model=RecommendationsResponse)
def get_recommendations(
    destination: str = Query("Tokyo, Japan", description="Target destination"),
    travel_type: str = Query("Solo travel", description="Traveler persona / style"),
    interests: Optional[str] = Query(None, description="Comma-separated interests"),
    budget_level: str = Query("Moderate", description="Budget tier")
):
    interest_list = [i.strip() for i in interests.split(",")] if interests else ["Sightseeing", "Food", "Culture"]
    items = recommendation_service.get_recommendations(
        destination=destination,
        travel_type=travel_type,
        interests=interest_list,
        budget_level=budget_level
    )
    return {
        "destination": destination,
        "travel_type": travel_type,
        "recommendations": items
    }
