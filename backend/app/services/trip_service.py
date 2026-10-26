from typing import Dict, Any, List, Optional
from datetime import datetime
from app.db.database import db

class TripService:
    def create_trip_with_defaults(self, user_id: str, trip_data: Dict[str, Any]) -> Dict[str, Any]:
        trip_data["user_id"] = user_id
        trip = db.create_trip(trip_data)
        
        # Calculate initial budget breakdown (proportional estimates)
        total_budget = float(trip.get("total_budget", 0.0))
        # Default distribution: 30% trans, 35% accom, 20% food, 10% activities, 5% misc
        init_budget = {
            "transportation_cost": round(total_budget * 0.30, 2),
            "accommodation_cost": round(total_budget * 0.35, 2),
            "food_cost": round(total_budget * 0.20, 2),
            "activities_cost": round(total_budget * 0.10, 2),
            "miscellaneous_cost": round(total_budget * 0.05, 2),
            "currency": "USD"
        }
        db.save_or_update_budget(trip["id"], init_budget)
        return trip

    def recalculate_trip_budget_from_activities(self, trip_id: str):
        """Update activities cost in budget details when activities change."""
        itinerary = db.get_itinerary(trip_id)
        if not itinerary:
            return
            
        activities = itinerary.get("activities", [])
        total_act_cost = sum(float(a.get("estimated_cost", 0.0)) for a in activities)
        
        current_budget = db.get_budget_details(trip_id) or {}
        current_budget["activities_cost"] = round(total_act_cost, 2)
        db.save_or_update_budget(trip_id, current_budget)

trip_service = TripService()
