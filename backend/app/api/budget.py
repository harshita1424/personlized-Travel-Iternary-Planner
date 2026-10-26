from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from app.models.schemas import BudgetDetailsResponse, BudgetDetailsUpdate
from app.db.database import db
from app.core.security import get_current_user

router = APIRouter(prefix="/budget", tags=["Budget Management"])

@router.get("/{trip_id}", response_model=BudgetDetailsResponse)
def get_trip_budget(trip_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    trip = db.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    budget = db.get_budget_details(trip_id)
    if not budget:
        # Generate default initial breakdown if none exists
        from app.services.trip_service import trip_service
        trip_service.recalculate_trip_budget_from_activities(trip_id)
        budget = db.get_budget_details(trip_id)
        
    return budget

@router.put("/{trip_id}", response_model=BudgetDetailsResponse)
def update_trip_budget(
    trip_id: str,
    budget_in: BudgetDetailsUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    trip = db.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    current = db.get_budget_details(trip_id) or {}
    updated_dict = current.copy()
    for key, val in budget_in.model_dump(exclude_unset=True).items():
        if val is not None:
            updated_dict[key] = val
            
    saved = db.save_or_update_budget(trip_id, updated_dict)
    return saved
