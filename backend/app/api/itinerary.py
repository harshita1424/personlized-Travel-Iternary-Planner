from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, Optional
from app.models.schemas import (
    ItineraryResponse,
    GenerateItineraryRequest,
    DailyActivityCreate,
    DailyActivityUpdate,
    DailyActivityResponse
)
from app.db.database import db
from app.services.ai_service import ai_service
from app.services.trip_service import trip_service
from app.core.security import get_current_user

router = APIRouter(prefix="/itineraries", tags=["Itinerary"])

@router.get("/{trip_id}", response_model=ItineraryResponse)
def get_trip_itinerary(trip_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    itinerary = db.get_itinerary(trip_id)
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not generated yet")
    return itinerary

@router.post("/{trip_id}/generate", response_model=ItineraryResponse)
def generate_trip_itinerary(
    trip_id: str,
    gen_request: Optional[GenerateItineraryRequest] = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    trip = db.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    preferences = db.get_trip_preferences(trip_id)
    custom_prompt = gen_request.custom_prompt if gen_request else None
    
    # Generate itinerary via AI service
    ai_generated = ai_service.generate_itinerary(trip, preferences, custom_prompt)
    
    # Save generated itinerary & activities in database
    itinerary_data = {
        "destination_overview": ai_generated.get("destination_overview"),
        "summary": ai_generated.get("summary"),
        "travel_tips": ai_generated.get("travel_tips", []),
        "total_estimated_cost": ai_generated.get("total_estimated_cost", 0.0),
        "daily_budget": ai_generated.get("daily_budget", 0.0)
    }
    activities_data = ai_generated.get("activities", [])
    
    saved = db.save_itinerary(trip_id, itinerary_data, activities_data)
    
    # Recalculate trip budget automatically
    trip_service.recalculate_trip_budget_from_activities(trip_id)
    
    # Update trip status to 'Planning' or 'Confirmed'
    db.update_trip(trip_id, {"status": "Confirmed"})
    
    return saved

@router.post("/{itinerary_id}/activities", response_model=DailyActivityResponse)
def add_activity(
    itinerary_id: str,
    activity_in: DailyActivityCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    activity = db.add_activity(itinerary_id, activity_in.model_dump())
    
    # Recalculate budget
    with db._get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT trip_id FROM itineraries WHERE id = ?", (itinerary_id,))
        row = cursor.fetchone()
        if row:
            trip_service.recalculate_trip_budget_from_activities(row["trip_id"])
            
    return activity

@router.put("/activities/{activity_id}", response_model=DailyActivityResponse)
def update_activity(
    activity_id: str,
    activity_update: DailyActivityUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    updated = db.update_activity(activity_id, activity_update.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    with db._get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT trip_id FROM itineraries WHERE id = ?", (updated["itinerary_id"],))
        row = cursor.fetchone()
        if row:
            trip_service.recalculate_trip_budget_from_activities(row["trip_id"])
            
    return updated

@router.delete("/activities/{activity_id}")
def delete_activity(activity_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    with db._get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT itinerary_id FROM daily_activities WHERE id = ?", (activity_id,))
        row = cursor.fetchone()
        itinerary_id = row["itinerary_id"] if row else None
        
    success = db.delete_activity(activity_id)
    if not success:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    if itinerary_id:
        with db._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT trip_id FROM itineraries WHERE id = ?", (itinerary_id,))
            row = cursor.fetchone()
            if row:
                trip_service.recalculate_trip_budget_from_activities(row["trip_id"])
                
    return {"message": "Activity deleted successfully", "success": True}
