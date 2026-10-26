import pytest
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_auth_and_trip_flow():
    # 1. Register a test user
    email = "traveler_test@example.com"
    reg_res = client.post("/api/auth/register", json={
        "email": email,
        "password": "Password123!",
        "full_name": "Test Explorer"
    })
    if reg_res.status_code == 400: # Already registered
        login_res = client.post("/api/auth/login", json={
            "email": email,
            "password": "Password123!"
        })
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]
    else:
        assert reg_res.status_code == 200
        token = reg_res.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create Trip (Scenario 2: Romantic Paris Vacation)
    trip_res = client.post("/api/trips/", json={
        "title": "Romantic Getaway in Paris",
        "destination": "Paris, France",
        "starting_location": "New York, USA",
        "start_date": "2026-12-10",
        "end_date": "2026-12-14",
        "number_of_travelers": 2,
        "total_budget": 3000.0,
        "travel_type": "Romantic",
        "status": "Planning",
        "preferences": {
            "preferred_activities": ["Sightseeing", "Food", "Photography"],
            "accommodation_type": "Boutique Hotel",
            "transportation_type": "Walking",
            "food_preferences": ["Fine Dining", "Local pastries"],
            "pace_preference": "Relaxed"
        }
    }, headers=headers)
    assert trip_res.status_code == 200
    trip = trip_res.json()
    trip_id = trip["id"]
    assert trip["destination"] == "Paris, France"

    # 3. Generate AI Itinerary
    gen_res = client.post(f"/api/itineraries/{trip_id}/generate", json={}, headers=headers)
    assert gen_res.status_code == 200
    itinerary = gen_res.json()
    assert len(itinerary["activities"]) >= 3
    assert itinerary["destination_overview"] is not None

    # 4. Check Budget Details
    budget_res = client.get(f"/api/budget/{trip_id}", headers=headers)
    assert budget_res.status_code == 200
    budget = budget_res.json()
    assert budget["total_estimated"] > 0

    # 5. Add custom activity
    activity_res = client.post(f"/api/itineraries/{itinerary['id']}/activities", json={
        "day_number": 1,
        "time_slot": "Evening",
        "title": "Seine River Sunset Champagne Cruise",
        "description": "Intimate river cruise past the glittering Eiffel Tower.",
        "location": "Pont Neuf, Paris",
        "activity_type": "Entertainment",
        "estimated_cost": 85.0,
        "booking_tip": "Book the 6:00 PM sunset departure slot."
    }, headers=headers)
    assert activity_res.status_code == 200
    act = activity_res.json()
    assert act["title"] == "Seine River Sunset Champagne Cruise"

    # 6. Delete custom activity
    del_act = client.delete(f"/api/itineraries/activities/{act['id']}", headers=headers)
    assert del_act.status_code == 200

    # 7. Recommendations
    rec_res = client.get("/api/recommendations/?destination=Paris,%20France&travel_type=Couple")
    assert rec_res.status_code == 200
    assert len(rec_res.json()["recommendations"]) > 0

    # 8. Clean up trip
    del_res = client.delete(f"/api/trips/{trip_id}", headers=headers)
    assert del_res.status_code == 200
