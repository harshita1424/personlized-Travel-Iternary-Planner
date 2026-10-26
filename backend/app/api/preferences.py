from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from app.models.schemas import TripPreferencesCreate, TripPreferencesResponse
from app.db.database import db
from app.core.security import get_current_user

router = APIRouter(prefix="/preferences", tags=["Preferences"])

@router.get("/{trip_id}", response_model=TripPreferencesResponse)
def get_preferences(trip_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    prefs = db.get_trip_preferences(trip_id)
    if not prefs:
        raise HTTPException(status_code=404, detail="Preferences not found for this trip")
    return prefs

@router.post("/{trip_id}", response_model=TripPreferencesResponse)
def save_preferences(
    trip_id: str,
    pref_in: TripPreferencesCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    trip = db.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    saved = db.save_trip_preferences(trip_id, pref_in.model_dump())
    return saved
