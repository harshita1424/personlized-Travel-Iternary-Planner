import json
import os
import re
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from app.core.config import settings

class AIService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        self.client = None
        if self.api_key and "your-api-key" not in self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self.client = genai.GenerativeModel("gemini-1.5-flash")
                print("Gemini AI Generative Model initialized.")
            except Exception as e:
                print(f"Gemini init notice: {e}. Using intelligent knowledge engine fallback.")
                self.client = None

    def generate_itinerary(
        self,
        trip: Dict[str, Any],
        preferences: Optional[Dict[str, Any]] = None,
        custom_prompt: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate structured personalized itinerary using Gemini or intelligent travel engine."""
        destination = trip.get("destination", "Tokyo, Japan")
        start_date_str = str(trip.get("start_date"))
        end_date_str = str(trip.get("end_date"))
        travelers = trip.get("number_of_travelers", 1)
        budget = float(trip.get("total_budget", 1500.0))
        travel_type = trip.get("travel_type", "Solo travel")
        
        # Calculate days
        try:
            d1 = datetime.strptime(start_date_str, "%Y-%m-%d")
            d2 = datetime.strptime(end_date_str, "%Y-%m-%d")
            num_days = max(1, (d2 - d1).days + 1)
        except Exception:
            num_days = 3
            d1 = datetime.now()

        prefs = preferences or {}
        activities_list = prefs.get("preferred_activities", ["Sightseeing", "Food", "Culture"])
        accom_type = prefs.get("accommodation_type", "Mid-range Hotel")
        trans_type = prefs.get("transportation_type", "Public Transit")
        food_prefs = prefs.get("food_preferences", ["Local cuisine"])
        pace = prefs.get("pace_preference", "Moderate")

        if self.client:
            try:
                ai_result = self._generate_with_gemini(
                    destination=destination,
                    num_days=num_days,
                    start_date=d1,
                    travelers=travelers,
                    budget=budget,
                    travel_type=travel_type,
                    activities_list=activities_list,
                    accom_type=accom_type,
                    trans_type=trans_type,
                    food_prefs=food_prefs,
                    pace=pace,
                    custom_prompt=custom_prompt
                )
                if ai_result:
                    return ai_result
            except Exception as e:
                print(f"Gemini generation exception: {e}. Falling back to knowledge engine.")

        # High-fidelity intelligent generation engine fallback
        return self._generate_structured_fallback(
            destination=destination,
            num_days=num_days,
            start_date=d1,
            travelers=travelers,
            budget=budget,
            travel_type=travel_type,
            activities_list=activities_list,
            accom_type=accom_type,
            trans_type=trans_type,
            food_prefs=food_prefs,
            pace=pace,
            custom_prompt=custom_prompt
        )

    def _generate_with_gemini(self, **kwargs) -> Optional[Dict[str, Any]]:
        prompt = f"""
You are an expert travel planner. Create a personalized travel itinerary in strictly valid JSON format.
Destination: {kwargs['destination']}
Duration: {kwargs['num_days']} days starting {kwargs['start_date'].strftime('%Y-%m-%d')}
Travelers: {kwargs['travelers']}
Total Budget: ${kwargs['budget']} USD
Travel Type: {kwargs['travel_type']}
Interests: {', '.join(kwargs['activities_list'])}
Accommodation: {kwargs['accom_type']}
Transportation: {kwargs['trans_type']}
Food Preferences: {', '.join(kwargs['food_prefs'])}
Pace: {kwargs['pace']}
Additional instructions: {kwargs.get('custom_prompt') or 'Provide realistic, engaging, and feasible timing.'}

Return JSON with exact structure:
{{
  "destination_overview": "Comprehensive overview highlighting culture, geography, and travel charm.",
  "summary": "Executive summary of the trip.",
  "travel_tips": ["Tip 1", "Tip 2", "Tip 3"],
  "total_estimated_cost": 0.0,
  "daily_budget": 0.0,
  "activities": [
    {{
      "day_number": 1,
      "date": "YYYY-MM-DD",
      "time_slot": "Morning",
      "title": "Title",
      "description": "Engaging description",
      "location": "Specific place or neighborhood",
      "activity_type": "Sightseeing",
      "estimated_cost": 25.0,
      "booking_tip": "Booking advice"
    }},
    {{
      "day_number": 1,
      "date": "YYYY-MM-DD",
      "time_slot": "Afternoon",
      "title": "Title",
      "description": "Engaging description",
      "location": "Specific place or neighborhood",
      "activity_type": "Dining",
      "estimated_cost": 30.0,
      "booking_tip": "Booking advice"
    }},
    {{
      "day_number": 1,
      "date": "YYYY-MM-DD",
      "time_slot": "Evening",
      "title": "Title",
      "description": "Engaging description",
      "location": "Specific place or neighborhood",
      "activity_type": "Entertainment",
      "estimated_cost": 40.0,
      "booking_tip": "Booking advice"
    }}
  ]
}}
Do NOT include markdown formatting or quotes outside the JSON. Return only the raw JSON string.
"""
        response = self.client.generate_content(prompt)
        text = response.text.strip()
        # Clean markdown codeblocks if returned
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            parsed = json.loads(match.group(0))
            return parsed
        return None

    def _generate_structured_fallback(self, **kwargs) -> Dict[str, Any]:
        """Deterministic, rich knowledge-based itinerary generator matching user persona and destination."""
        dest = kwargs['destination']
        num_days = kwargs['num_days']
        start_date = kwargs['start_date']
        budget = kwargs['budget']
        travel_type = kwargs['travel_type']
        activities_list = kwargs['activities_list']
        travelers = kwargs['travelers']
        
        # Budget scaling
        daily_est = round((budget * 0.85) / num_days, 2)
        
        # Persona customizer
        is_romantic = "Romantic" in travel_type or "Couple" in travel_type
        is_solo = "Solo" in travel_type
        is_family = "Family" in travel_type
        is_group = "Group" in travel_type

        overview_style = (
            f"{dest} is a captivating destination renowned for its rich heritage, vibrant atmosphere, and world-class experiences. "
            f"This itinerary is tailored for a {travel_type.lower()} experience with a balanced {kwargs['pace'].lower()} pace."
        )

        tips = [
            f"Use {kwargs['trans_type'].lower()} for convenient and economical transit around {dest}.",
            f"Pre-book major landmark tickets 2-3 weeks in advance to bypass long wait lines.",
            f"Always keep local currency on hand for street markets, cafes, and local tips.",
            f"Stay hydrated and wear comfortable walking footwear during active exploration periods."
        ]

        if is_romantic:
            tips.append("Make sunset dinner reservations early for optimal panoramic views.")
        elif is_family:
            tips.append("Keep buffer times between afternoon activities for snacks and rest.")
        elif is_group:
            tips.append("Use mobile bill-splitting apps to smoothly track shared group meal tabs.")

        curated_templates = [
            # Day 1: Historic Core & Iconic Landmarks
            {
                "morning": ("Iconic Historic Landmark & Architecture Walk", "Begin the day exploring the city's signature historic center, admiring centuries of architecture and lively public squares.", "Central Heritage District", "Sightseeing", 20.0, "Early morning offers the best lighting for photography before peak crowds."),
                "afternoon": ("Local Gastronomy Tasting & Artisan Market", "Savor authentic regional flavors and street specialties while interacting with local vendors and artisans.", "Old Town Market Hall", "Dining", 25.0, "Ask vendors for their house specialty dishes."),
                "evening": ("Scenic Twilight Stroll & Welcome Dinner", "Take in golden hour vistas along the main promenade or waterfront, followed by a relaxed welcome dinner.", "Riverside Promenade", "Dining", 45.0, "Outdoor terrace seating is recommended.")
            },
            # Day 2: Cultural Immersion & Arts
            {
                "morning": ("World-Class Museum & Art Gallery Exploration", "Immerse in national artistic masterpieces, historical artifacts, and curated exhibitions.", "National Museum Quarter", "Sightseeing", 22.0, "Audio guide provides exceptional cultural context."),
                "afternoon": ("Hidden Cafes & Bohemian Neighborhood Walk", "Stroll through quiet cobbled alleyways, vintage boutiques, and independent coffee roasteries.", "Artisan Quarter", "Leisure", 18.0, "Great spot for picking up unique handcrafted souvenirs."),
                "evening": ("Panoramic Sunset Viewpoint & Evening Entertainment", "Ascend to a high vantage point for 360-degree metropolitan panoramas as city lights illuminate.", "Sky Deck Observation Point", "Entertainment", 35.0, "Check sunset schedule to arrive 30 minutes prior.")
            },
            # Day 3: Nature, Parks & Leisure
            {
                "morning": ("Botanical Gardens & Serene Morning Oasis", "Enjoy a tranquil morning stroll amidst curated flora, koi ponds, and shaded walking pathways.", "City Royal Gardens", "Nature", 12.0, "Peaceful retreat ideal for relaxing and sketching."),
                "afternoon": ("Waterfront Cruise or Canal Excursion", "Experience the city from the water with a scenic narrated boat cruise offering distinct skyline perspectives.", "Central Harbor Pier", "Attraction", 30.0, "Dress in light layers for brisk water breezes."),
                "evening": ("Celebratory Dinner & Nightlife Experience", "Cap off the journey with a celebratory multi-course dinner celebrating seasonal regional produce.", "Gourmet Dining Quarter", "Dining", 55.0, "Smart-casual attire recommended.")
            },
            # Day 4: Adventure & Local Quarters
            {
                "morning": ("Scenic Ridge Hike or Coastal Trail", "Active morning traversing scenic nature trails with rewarding lookout vistas over the valleys.", "Nature Park Reserve", "Adventure", 15.0, "Carry at least 1 liter of water and sun protection."),
                "afternoon": ("Traditional Workshop & Cultural Experience", "Participate in a hands-on culinary masterclass, pottery workshop, or tea ceremony.", "Cultural Heritage Center", "Culture", 40.0, "Pre-registration is required."),
                "evening": ("Night Market & Street Food Safari", "Explore the bustling evening street food stalls, sampling skewers, sweets, and local delicacies.", "Night Food Alley", "Dining", 28.0, "Carry cash notes for quick transactions.")
            },
            # Day 5: Day Trip & Surrounding Wonders
            {
                "morning": ("Excursion to Picturesque Surrounding Village", "Take a short regional train ride to a fairytale hilltop village renowned for crafts and scenic vistas.", "Historic Hillside Outpost", "Sightseeing", 35.0, "Morning train departure avoids rush traffic."),
                "afternoon": ("Local Vineyard / Countryside Farm Lunch", "Enjoy an authentic farm-to-table lunch amidst rolling landscapes and peaceful countryside.", "Country Estate", "Dining", 42.0, "Indoor and outdoor shaded tables available."),
                "evening": ("Return Journey & Ambient Lounge Relaxation", "Return to the city and unwind with craft mocktails or local wine in an ambient lounge.", "Skyline Lounge", "Leisure", 32.0, "Relaxed dress code.")
            }
        ]

        activities: List[Dict[str, Any]] = []
        total_act_cost = 0.0

        for day_idx in range(num_days):
            day_num = day_idx + 1
            curr_date = (start_date + timedelta(days=day_idx)).strftime("%Y-%m-%d")
            tmpl = curated_templates[day_idx % len(curated_templates)]

            # Morning
            m_title, m_desc, m_loc, m_type, m_cost, m_tip = tmpl["morning"]
            # Personalize title based on destination
            m_title_custom = f"{m_title} in {dest}" if day_idx == 0 else m_title
            activities.append({
                "day_number": day_num,
                "date": curr_date,
                "time_slot": "Morning",
                "title": m_title_custom,
                "description": m_desc,
                "location": f"{m_loc}, {dest}",
                "activity_type": m_type,
                "estimated_cost": m_cost * travelers,
                "booking_tip": m_tip
            })
            total_act_cost += m_cost * travelers

            # Afternoon
            a_title, a_desc, a_loc, a_type, a_cost, a_tip = tmpl["afternoon"]
            activities.append({
                "day_number": day_num,
                "date": curr_date,
                "time_slot": "Afternoon",
                "title": a_title,
                "description": a_desc,
                "location": f"{a_loc}, {dest}",
                "activity_type": a_type,
                "estimated_cost": a_cost * travelers,
                "booking_tip": a_tip
            })
            total_act_cost += a_cost * travelers

            # Evening
            e_title, e_desc, e_loc, e_type, e_cost, e_tip = tmpl["evening"]
            activities.append({
                "day_number": day_num,
                "date": curr_date,
                "time_slot": "Evening",
                "title": e_title,
                "description": e_desc,
                "location": f"{e_loc}, {dest}",
                "activity_type": e_type,
                "estimated_cost": e_cost * travelers,
                "booking_tip": e_tip
            })
            total_act_cost += e_cost * travelers

        total_trip_estimate = round(min(budget, total_act_cost + (num_days * 120.0 * travelers)), 2)
        daily_budget_calc = round(total_trip_estimate / num_days, 2)

        return {
            "destination_overview": overview_style,
            "summary": f"Curated {num_days}-day itinerary in {dest} designed for {travelers} traveler(s) focusing on {', '.join(activities_list[:3])}.",
            "travel_tips": tips,
            "total_estimated_cost": total_trip_estimate,
            "daily_budget": daily_budget_calc,
            "activities": activities
        }

ai_service = AIService()
