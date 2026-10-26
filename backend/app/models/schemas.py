from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import date, datetime
from uuid import UUID

# ----------------- User Schemas -----------------
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: str
    created_at: Optional[datetime] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ----------------- Trip Preferences -----------------
class TripPreferencesBase(BaseModel):
    preferred_activities: List[str] = Field(default_factory=list)
    accommodation_type: str = "Mid-range Hotel"
    transportation_type: str = "Public Transit"
    food_preferences: List[str] = Field(default_factory=list)
    pace_preference: str = "Moderate"
    special_requirements: Optional[str] = None

class TripPreferencesCreate(TripPreferencesBase):
    pass

class TripPreferencesResponse(TripPreferencesBase):
    id: str
    trip_id: str

# ----------------- Daily Activity -----------------
class DailyActivityBase(BaseModel):
    day_number: int
    date: Optional[str] = None
    time_slot: str  # Morning, Afternoon, Evening
    title: str
    description: str
    location: Optional[str] = None
    activity_type: str = "Sightseeing"
    estimated_cost: float = 0.0
    booking_tip: Optional[str] = None

class DailyActivityCreate(DailyActivityBase):
    pass

class DailyActivityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    time_slot: Optional[str] = None
    activity_type: Optional[str] = None
    estimated_cost: Optional[float] = None
    booking_tip: Optional[str] = None

class DailyActivityResponse(DailyActivityBase):
    id: str
    itinerary_id: str

# ----------------- Itinerary -----------------
class ItineraryBase(BaseModel):
    destination_overview: str
    summary: str
    travel_tips: List[str] = Field(default_factory=list)
    total_estimated_cost: float = 0.0
    daily_budget: float = 0.0

class ItineraryResponse(ItineraryBase):
    id: str
    trip_id: str
    activities: List[DailyActivityResponse] = Field(default_factory=list)
    created_at: Optional[datetime] = None

# ----------------- Budget -----------------
class BudgetDetailsBase(BaseModel):
    transportation_cost: float = 0.0
    accommodation_cost: float = 0.0
    food_cost: float = 0.0
    activities_cost: float = 0.0
    miscellaneous_cost: float = 0.0
    total_estimated: float = 0.0
    remaining_budget: float = 0.0
    currency: str = "USD"

class BudgetDetailsUpdate(BaseModel):
    transportation_cost: Optional[float] = None
    accommodation_cost: Optional[float] = None
    food_cost: Optional[float] = None
    activities_cost: Optional[float] = None
    miscellaneous_cost: Optional[float] = None

class BudgetDetailsResponse(BudgetDetailsBase):
    id: str
    trip_id: str
    is_over_budget: bool = False
    budget_usage_percent: float = 0.0

# ----------------- Trip -----------------
class TripBase(BaseModel):
    title: str
    destination: str
    starting_location: Optional[str] = None
    start_date: str
    end_date: str
    number_of_travelers: int = 1
    total_budget: float = 0.0
    travel_type: str  # Solo, Couple, Family vacation, Adventure, Relaxation, Cultural, Group travel
    status: str = "Planning"

class TripCreate(TripBase):
    preferences: Optional[TripPreferencesBase] = None

class TripUpdate(BaseModel):
    title: Optional[str] = None
    destination: Optional[str] = None
    starting_location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    number_of_travelers: Optional[int] = None
    total_budget: Optional[float] = None
    travel_type: Optional[str] = None
    status: Optional[str] = None

class TripResponse(TripBase):
    id: str
    user_id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class TripWithDetailsResponse(TripResponse):
    preferences: Optional[TripPreferencesResponse] = None
    itinerary: Optional[ItineraryResponse] = None
    budget: Optional[BudgetDetailsResponse] = None

# ----------------- AI & Recommendations -----------------
class GenerateItineraryRequest(BaseModel):
    regenerate: bool = False
    custom_prompt: Optional[str] = None

class RecommendationItem(BaseModel):
    id: str
    name: str
    category: str  # Attraction, Restaurant, Experience, Hidden Gem
    description: str
    estimated_cost: float
    recommended_for: List[str]
    rating: float = 4.8
    location: str

class RecommendationsResponse(BaseModel):
    destination: str
    travel_type: str
    recommendations: List[RecommendationItem]

class DashboardStats(BaseModel):
    total_trips: int
    upcoming_trips: int
    completed_trips: int
    total_budget_planned: float
    total_estimated_spent: float
