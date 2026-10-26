from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict, Any, Optional
from app.models.schemas import TripCreate, TripUpdate, TripResponse, TripWithDetailsResponse, DashboardStats
from app.db.database import db
from app.core.security import get_current_user
from app.services.trip_service import trip_service

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.get("/stats/dashboard", response_model=DashboardStats)
def get_dashboard_stats(current_user: Dict[str, Any] = Depends(get_current_user)):
    return db.get_dashboard_stats(current_user["id"])

@router.get("/", response_model=List[TripResponse])
def get_user_trips(current_user: Dict[str, Any] = Depends(get_current_user)):
    return db.get_trips(current_user["id"])

@router.post("/", response_model=TripResponse)
def create_trip(trip_in: TripCreate, current_user: Dict[str, Any] = Depends(get_current_user)):
    trip_dict = trip_in.model_dump(exclude={"preferences"})
    created_trip = trip_service.create_trip_with_defaults(current_user["id"], trip_dict)
    
    # Save preferences if provided in trip creation form
    if trip_in.preferences:
        db.save_trip_preferences(created_trip["id"], trip_in.preferences.model_dump())
        
    return created_trip

@router.get("/{trip_id}", response_model=TripWithDetailsResponse)
def get_trip_details(trip_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    trip = db.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    preferences = db.get_trip_preferences(trip_id)
    itinerary = db.get_itinerary(trip_id)
    budget = db.get_budget_details(trip_id)
    
    return {
        **trip,
        "preferences": preferences,
        "itinerary": itinerary,
        "budget": budget
    }

@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(trip_id: str, update_in: TripUpdate, current_user: Dict[str, Any] = Depends(get_current_user)):
    trip = db.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    updated = db.update_trip(trip_id, update_in.model_dump(exclude_unset=True))
    return updated

@router.delete("/{trip_id}")
def delete_trip(trip_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    trip = db.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    success = db.delete_trip(trip_id)
    return {"message": "Trip deleted successfully", "success": success}
