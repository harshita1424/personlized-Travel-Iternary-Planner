import uuid
from typing import List, Dict, Any

class RecommendationService:
    def get_recommendations(
        self,
        destination: str,
        travel_type: str = "Solo travel",
        interests: List[str] = None,
        budget_level: str = "Moderate"
    ) -> List[Dict[str, Any]]:
        """Generate tailored tourist attractions, activities, and restaurants."""
        interests = interests or ["Sightseeing", "Food", "Culture"]
        
        # Base recommendations tailored by destination and persona
        items = []

        # 1. Iconic Attraction
        items.append({
            "id": str(uuid.uuid4()),
            "name": f"Historic Citadel & Landmark of {destination}",
            "category": "Attraction",
            "description": f"The quintessential symbol of {destination}, offering breathtaking architecture, historic halls, and panoramic lookouts.",
            "estimated_cost": 25.0,
            "recommended_for": ["Solo travel", "Couple", "Family vacation", "Group travel"],
            "rating": 4.9,
            "location": f"Historic Center, {destination}"
        })

        # 2. Culinary Recommendation tailored to persona
        if "Couple" in travel_type or "Romantic" in travel_type:
            items.append({
                "id": str(uuid.uuid4()),
                "name": f"Candlelit Rooftop Bistro overlooking {destination}",
                "category": "Restaurant",
                "description": "Intimate dining experience featuring fine local wines, artisanal tasting menus, and dramatic skyline views.",
                "estimated_cost": 65.0,
                "recommended_for": ["Couple", "Romantic"],
                "rating": 4.8,
                "location": f"Old Quarter, {destination}"
            })
        elif "Solo" in travel_type:
            items.append({
                "id": str(uuid.uuid4()),
                "name": f"Artisanal Coffee & Local Tasting Bar",
                "category": "Restaurant",
                "description": "Welcoming, cozy spot known for single-origin brews, house pastries, and a friendly atmosphere to meet fellow travelers.",
                "estimated_cost": 15.0,
                "recommended_for": ["Solo travel"],
                "rating": 4.7,
                "location": f"Bohemian District, {destination}"
            })
        elif "Family" in travel_type:
            items.append({
                "id": str(uuid.uuid4()),
                "name": f"Family Garden Trattoria & Gelato Pavilion",
                "category": "Restaurant",
                "description": "Spacious outdoor courtyard with interactive menus, wood-fired specialties, and handmade gelato desserts for all ages.",
                "estimated_cost": 30.0,
                "recommended_for": ["Family vacation", "Group travel"],
                "rating": 4.8,
                "location": f"Parkside, {destination}"
            })
        else:
            items.append({
                "id": str(uuid.uuid4()),
                "name": f"Vibrant Street Food & Craft Brewery Courtyard",
                "category": "Restaurant",
                "description": "High-energy communal dining market with rotating food trucks, live acoustic music, and shared craft beer flights.",
                "estimated_cost": 28.0,
                "recommended_for": ["Group travel", "Adventure"],
                "rating": 4.7,
                "location": f"Warehouse Arts District, {destination}"
            })

        # 3. Nature / Active Experience
        items.append({
            "id": str(uuid.uuid4()),
            "name": f"{destination} Scenic Overlook & Botanical Walkway",
            "category": "Experience",
            "description": "A lush sanctuary featuring indigenous flora, manicured stone pathways, and sweeping natural vistas.",
            "estimated_cost": 10.0,
            "recommended_for": ["Sightseeing", "Nature", "Photography"],
            "rating": 4.8,
            "location": f"Upper Terraces, {destination}"
        })

        # 4. Hidden Gem / Cultural immersion
        items.append({
            "id": str(uuid.uuid4()),
            "name": f"Secret Artisan Workshop & Antique Alley",
            "category": "Hidden Gem",
            "description": "A secluded alleyway tucked away from tourist crowds, where master craftspeople showcase ceramics, textiles, and leather goods.",
            "estimated_cost": 0.0,
            "recommended_for": ["Shopping", "Cultural", "Photography"],
            "rating": 4.9,
            "location": f"Crafts Quarter, {destination}"
        })

        # 5. Evening experience
        items.append({
            "id": str(uuid.uuid4()),
            "name": f"Golden Hour Canal or Harbor Cruise",
            "category": "Experience",
            "description": "Glide through tranquil waterways with audio commentary and refreshments as the city lights turn on.",
            "estimated_cost": 35.0,
            "recommended_for": ["Solo travel", "Couple", "Family vacation", "Group travel"],
            "rating": 4.9,
            "location": f"Waterfront Pier, {destination}"
        })

        return items

recommendation_service = RecommendationService()
