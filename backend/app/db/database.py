import json
import sqlite3
import uuid
from datetime import datetime, date, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional
from app.core.config import settings

DB_FILE = Path(__file__).resolve().parent.parent.parent / "travel_planner.db"

class DatabaseRepository:
    def __init__(self):
        self.supabase_client = None
        self._init_supabase()
        self._init_sqlite()
        self._seed_demo_data()

    def _init_supabase(self):
        if settings.SUPABASE_URL and settings.SUPABASE_KEY and "your-supabase" not in settings.SUPABASE_URL:
            try:
                from supabase import create_client
                self.supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                print("Connected to Supabase PostgreSQL database.")
            except Exception as e:
                print(f"Supabase connection notice: {e}. Falling back to SQLite store.")
                self.supabase_client = None
        else:
            self.supabase_client = None

    def _get_connection(self):
        conn = sqlite3.connect(str(DB_FILE))
        conn.row_factory = sqlite3.Row
        return conn

    def _init_sqlite(self):
        """Create tables if using SQLite fallback."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                full_name TEXT,
                avatar_url TEXT,
                created_at TEXT
            );
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS trips (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                title TEXT NOT NULL,
                destination TEXT NOT NULL,
                starting_location TEXT,
                start_date TEXT NOT NULL,
                end_date TEXT NOT NULL,
                number_of_travelers INTEGER DEFAULT 1,
                total_budget REAL DEFAULT 0.0,
                travel_type TEXT NOT NULL,
                status TEXT DEFAULT 'Planning',
                created_at TEXT,
                updated_at TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS trip_preferences (
                id TEXT PRIMARY KEY,
                trip_id TEXT UNIQUE NOT NULL,
                preferred_activities TEXT,
                accommodation_type TEXT,
                transportation_type TEXT,
                food_preferences TEXT,
                pace_preference TEXT,
                special_requirements TEXT,
                created_at TEXT,
                FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
            );
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS itineraries (
                id TEXT PRIMARY KEY,
                trip_id TEXT UNIQUE NOT NULL,
                destination_overview TEXT,
                summary TEXT,
                travel_tips TEXT,
                total_estimated_cost REAL DEFAULT 0.0,
                daily_budget REAL DEFAULT 0.0,
                created_at TEXT,
                updated_at TEXT,
                FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
            );
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS daily_activities (
                id TEXT PRIMARY KEY,
                itinerary_id TEXT NOT NULL,
                day_number INTEGER NOT NULL,
                date TEXT,
                time_slot TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                location TEXT,
                activity_type TEXT,
                estimated_cost REAL DEFAULT 0.0,
                booking_tip TEXT,
                created_at TEXT,
                FOREIGN KEY (itinerary_id) REFERENCES itineraries (id) ON DELETE CASCADE
            );
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS budget_details (
                id TEXT PRIMARY KEY,
                trip_id TEXT UNIQUE NOT NULL,
                transportation_cost REAL DEFAULT 0.0,
                accommodation_cost REAL DEFAULT 0.0,
                food_cost REAL DEFAULT 0.0,
                activities_cost REAL DEFAULT 0.0,
                miscellaneous_cost REAL DEFAULT 0.0,
                total_estimated REAL DEFAULT 0.0,
                remaining_budget REAL DEFAULT 0.0,
                currency TEXT DEFAULT 'USD',
                updated_at TEXT,
                FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
            );
            """)
            conn.commit()

    def _seed_demo_data(self):
        """Seed demo user and sample scenario trips if empty."""
        demo_user_id = "00000000-0000-0000-0000-000000000001"
        from app.core.security import hash_password
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM users WHERE id = ?", (demo_user_id,))
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO users (id, email, password_hash, full_name, created_at)
                    VALUES (?, ?, ?, ?, ?)
                """, (
                    demo_user_id,
                    "demo@travelplanner.com",
                    hash_password("Demo@1234"),
                    "Alex Mercer",
                    datetime.now(timezone.utc).isoformat()
                ))
                
                # Seed Scenario 1: Solo Traveler Weekend in Tokyo
                trip_id_1 = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO trips (id, user_id, title, destination, starting_location, start_date, end_date, number_of_travelers, total_budget, travel_type, status, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    trip_id_1, demo_user_id, "Weekend in Tokyo", "Tokyo, Japan", "San Francisco, USA",
                    "2026-11-06", "2026-11-08", 1, 1500.0, "Solo travel", "Confirmed",
                    datetime.now(timezone.utc).isoformat(), datetime.now(timezone.utc).isoformat()
                ))
                cursor.execute("""
                    INSERT INTO trip_preferences (id, trip_id, preferred_activities, accommodation_type, transportation_type, food_preferences, pace_preference, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    str(uuid.uuid4()), trip_id_1,
                    json.dumps(["Sightseeing", "Food", "Photography"]),
                    "Boutique Hotel", "Public Transit", json.dumps(["Street food", "Local ramen"]),
                    "Moderate", datetime.now(timezone.utc).isoformat()
                ))
                itinerary_id_1 = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO itineraries (id, trip_id, destination_overview, summary, travel_tips, total_estimated_cost, daily_budget, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    itinerary_id_1, trip_id_1,
                    "Tokyo blends ultramodern neon skyscrapers with ancient temples and an incomparable culinary scene.",
                    "3-day solo immersion into Tokyo's distinct neighborhoods from Asakusa to Shibuya.",
                    json.dumps(["Get a Suica or Pasmo IC card for easy metro travel.", "Reserve teamLab Planets in advance."]),
                    1250.0, 416.0, datetime.now(timezone.utc).isoformat()
                ))
                # Add activities for day 1
                cursor.execute("""
                    INSERT INTO daily_activities (id, itinerary_id, day_number, date, time_slot, title, description, location, activity_type, estimated_cost, booking_tip)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    str(uuid.uuid4()), itinerary_id_1, 1, "2026-11-06", "Morning",
                    "Explore historic Senso-ji Temple & Nakamise Dori",
                    "Wander through Tokyo's oldest Buddhist temple and sample traditional treats along the street stalls.",
                    "Asakusa, Tokyo", "Sightseeing", 15.0, "Arrive early before 9 AM for peaceful photos."
                ))
                cursor.execute("""
                    INSERT INTO daily_activities (id, itinerary_id, day_number, date, time_slot, title, description, location, activity_type, estimated_cost, booking_tip)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    str(uuid.uuid4()), itinerary_id_1, 1, "2026-11-06", "Afternoon",
                    "Tokyo Skytree Panoramic Observation & Lunch",
                    "Enjoy sweeping views across the metropolis and Mount Fuji from 450 meters up, followed by soba lunch.",
                    "Sumida, Tokyo", "Attraction", 35.0, "Purchase timed ticket online to skip the main queue."
                ))
                cursor.execute("""
                    INSERT INTO daily_activities (id, itinerary_id, day_number, date, time_slot, title, description, location, activity_type, estimated_cost, booking_tip)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    str(uuid.uuid4()), itinerary_id_1, 1, "2026-11-06", "Evening",
                    "Shibuya Crossing & Izakaya Alley Tasting",
                    "Experience the world's busiest pedestrian crossing and dine on yakitori skewers in Omoide Yokocho.",
                    "Shibuya / Shinjuku", "Dining", 45.0, "Cash is preferred in small alleyway izakayas."
                ))
                # Budget for trip 1
                cursor.execute("""
                    INSERT INTO budget_details (id, trip_id, transportation_cost, accommodation_cost, food_cost, activities_cost, miscellaneous_cost, total_estimated, remaining_budget, currency)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    str(uuid.uuid4()), trip_id_1, 350.0, 450.0, 250.0, 150.0, 50.0, 1250.0, 250.0, "USD"
                ))

                conn.commit()

    # ---- Users ----
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE email = ?", (email.lower(),))
            row = cursor.fetchone()
            return dict(row) if row else None

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            return dict(row) if row else None

    def create_user(self, email: str, password_hash: str, full_name: Optional[str] = None) -> Dict[str, Any]:
        user_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc).isoformat()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO users (id, email, password_hash, full_name, created_at)
                VALUES (?, ?, ?, ?, ?)
            """, (user_id, email.lower(), password_hash, full_name or email.split("@")[0], created_at))
            conn.commit()
        return {"id": user_id, "email": email.lower(), "full_name": full_name, "created_at": created_at}

    # ---- Trips ----
    def get_trips(self, user_id: str) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
            rows = cursor.fetchall()
            return [dict(r) for r in rows]

    def get_trip_by_id(self, trip_id: str, user_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            if user_id:
                cursor.execute("SELECT * FROM trips WHERE id = ? AND user_id = ?", (trip_id, user_id))
            else:
                cursor.execute("SELECT * FROM trips WHERE id = ?", (trip_id,))
            row = cursor.fetchone()
            return dict(row) if row else None

    def create_trip(self, trip_data: Dict[str, Any]) -> Dict[str, Any]:
        trip_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO trips (id, user_id, title, destination, starting_location, start_date, end_date, number_of_travelers, total_budget, travel_type, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                trip_id,
                trip_data.get("user_id"),
                trip_data.get("title"),
                trip_data.get("destination"),
                trip_data.get("starting_location"),
                str(trip_data.get("start_date")),
                str(trip_data.get("end_date")),
                trip_data.get("number_of_travelers", 1),
                trip_data.get("total_budget", 0.0),
                trip_data.get("travel_type", "Solo travel"),
                trip_data.get("status", "Planning"),
                now, now
            ))
            conn.commit()
        return self.get_trip_by_id(trip_id)

    def update_trip(self, trip_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        fields = []
        values = []
        for key, val in update_data.items():
            if val is not None and key not in ["id", "user_id", "created_at"]:
                fields.append(f"{key} = ?")
                values.append(str(val) if isinstance(val, (date, datetime)) else val)
        if not fields:
            return self.get_trip_by_id(trip_id)
        fields.append("updated_at = ?")
        values.append(datetime.now(timezone.utc).isoformat())
        values.append(trip_id)
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"UPDATE trips SET {', '.join(fields)} WHERE id = ?", values)
            conn.commit()
        return self.get_trip_by_id(trip_id)

    def delete_trip(self, trip_id: str) -> bool:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            # Cascade deletes
            cursor.execute("SELECT id FROM itineraries WHERE trip_id = ?", (trip_id,))
            itineraries = cursor.fetchall()
            for it in itineraries:
                cursor.execute("DELETE FROM daily_activities WHERE itinerary_id = ?", (it["id"],))
            cursor.execute("DELETE FROM itineraries WHERE trip_id = ?", (trip_id,))
            cursor.execute("DELETE FROM trip_preferences WHERE trip_id = ?", (trip_id,))
            cursor.execute("DELETE FROM budget_details WHERE trip_id = ?", (trip_id,))
            cursor.execute("DELETE FROM trips WHERE id = ?", (trip_id,))
            conn.commit()
            return cursor.rowcount > 0

    # ---- Preferences ----
    def get_trip_preferences(self, trip_id: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM trip_preferences WHERE trip_id = ?", (trip_id,))
            row = cursor.fetchone()
            if not row:
                return None
            res = dict(row)
            res["preferred_activities"] = json.loads(res.get("preferred_activities") or "[]")
            res["food_preferences"] = json.loads(res.get("food_preferences") or "[]")
            return res

    def save_trip_preferences(self, trip_id: str, pref_data: Dict[str, Any]) -> Dict[str, Any]:
        existing = self.get_trip_preferences(trip_id)
        activities_json = json.dumps(pref_data.get("preferred_activities", []))
        food_json = json.dumps(pref_data.get("food_preferences", []))
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            if existing:
                cursor.execute("""
                    UPDATE trip_preferences 
                    SET preferred_activities = ?, accommodation_type = ?, transportation_type = ?, food_preferences = ?, pace_preference = ?, special_requirements = ?
                    WHERE trip_id = ?
                """, (
                    activities_json,
                    pref_data.get("accommodation_type", "Mid-range Hotel"),
                    pref_data.get("transportation_type", "Public Transit"),
                    food_json,
                    pref_data.get("pace_preference", "Moderate"),
                    pref_data.get("special_requirements"),
                    trip_id
                ))
            else:
                pref_id = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO trip_preferences (id, trip_id, preferred_activities, accommodation_type, transportation_type, food_preferences, pace_preference, special_requirements, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    pref_id, trip_id,
                    activities_json,
                    pref_data.get("accommodation_type", "Mid-range Hotel"),
                    pref_data.get("transportation_type", "Public Transit"),
                    food_json,
                    pref_data.get("pace_preference", "Moderate"),
                    pref_data.get("special_requirements"),
                    datetime.now(timezone.utc).isoformat()
                ))
            conn.commit()
        return self.get_trip_preferences(trip_id)

    # ---- Itinerary & Activities ----
    def get_itinerary(self, trip_id: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM itineraries WHERE trip_id = ?", (trip_id,))
            row = cursor.fetchone()
            if not row:
                return None
            itinerary = dict(row)
            itinerary["travel_tips"] = json.loads(itinerary.get("travel_tips") or "[]")
            
            cursor.execute("SELECT * FROM daily_activities WHERE itinerary_id = ? ORDER BY day_number ASC, CASE time_slot WHEN 'Morning' THEN 1 WHEN 'Afternoon' THEN 2 WHEN 'Evening' THEN 3 ELSE 4 END", (itinerary["id"],))
            activities = [dict(a) for a in cursor.fetchall()]
            itinerary["activities"] = activities
            return itinerary

    def save_itinerary(self, trip_id: str, itinerary_data: Dict[str, Any], activities_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM itineraries WHERE trip_id = ?", (trip_id,))
            existing = cursor.fetchone()
            
            travel_tips_json = json.dumps(itinerary_data.get("travel_tips", []))
            now = datetime.now(timezone.utc).isoformat()
            
            if existing:
                itinerary_id = existing["id"]
                cursor.execute("""
                    UPDATE itineraries 
                    SET destination_overview = ?, summary = ?, travel_tips = ?, total_estimated_cost = ?, daily_budget = ?, updated_at = ?
                    WHERE id = ?
                """, (
                    itinerary_data.get("destination_overview"),
                    itinerary_data.get("summary"),
                    travel_tips_json,
                    itinerary_data.get("total_estimated_cost", 0.0),
                    itinerary_data.get("daily_budget", 0.0),
                    now,
                    itinerary_id
                ))
                cursor.execute("DELETE FROM daily_activities WHERE itinerary_id = ?", (itinerary_id,))
            else:
                itinerary_id = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO itineraries (id, trip_id, destination_overview, summary, travel_tips, total_estimated_cost, daily_budget, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    itinerary_id, trip_id,
                    itinerary_data.get("destination_overview"),
                    itinerary_data.get("summary"),
                    travel_tips_json,
                    itinerary_data.get("total_estimated_cost", 0.0),
                    itinerary_data.get("daily_budget", 0.0),
                    now, now
                ))

            for act in activities_data:
                act_id = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO daily_activities (id, itinerary_id, day_number, date, time_slot, title, description, location, activity_type, estimated_cost, booking_tip, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    act_id, itinerary_id,
                    act.get("day_number", 1),
                    act.get("date"),
                    act.get("time_slot", "Morning"),
                    act.get("title", "Explore"),
                    act.get("description", ""),
                    act.get("location", ""),
                    act.get("activity_type", "Sightseeing"),
                    float(act.get("estimated_cost", 0.0)),
                    act.get("booking_tip", ""),
                    now
                ))
            conn.commit()
        return self.get_itinerary(trip_id)

    def add_activity(self, itinerary_id: str, activity_data: Dict[str, Any]) -> Dict[str, Any]:
        act_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO daily_activities (id, itinerary_id, day_number, date, time_slot, title, description, location, activity_type, estimated_cost, booking_tip, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                act_id, itinerary_id,
                activity_data.get("day_number", 1),
                activity_data.get("date"),
                activity_data.get("time_slot", "Morning"),
                activity_data.get("title", "New Activity"),
                activity_data.get("description", ""),
                activity_data.get("location", ""),
                activity_data.get("activity_type", "Sightseeing"),
                float(activity_data.get("estimated_cost", 0.0)),
                activity_data.get("booking_tip", ""),
                now
            ))
            cursor.execute("SELECT * FROM daily_activities WHERE id = ?", (act_id,))
            row = cursor.fetchone()
            conn.commit()
            return dict(row)

    def update_activity(self, activity_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        fields = []
        values = []
        for key, val in update_data.items():
            if val is not None and key not in ["id", "itinerary_id", "created_at"]:
                fields.append(f"{key} = ?")
                values.append(val)
        if not fields:
            return None
        values.append(activity_id)
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"UPDATE daily_activities SET {', '.join(fields)} WHERE id = ?", values)
            cursor.execute("SELECT * FROM daily_activities WHERE id = ?", (activity_id,))
            row = cursor.fetchone()
            conn.commit()
            return dict(row) if row else None

    def delete_activity(self, activity_id: str) -> bool:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM daily_activities WHERE id = ?", (activity_id,))
            conn.commit()
            return cursor.rowcount > 0

    # ---- Budget Details ----
    def get_budget_details(self, trip_id: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM budget_details WHERE trip_id = ?", (trip_id,))
            row = cursor.fetchone()
            if not row:
                return None
            res = dict(row)
            cursor.execute("SELECT total_budget FROM trips WHERE id = ?", (trip_id,))
            trip_row = cursor.fetchone()
            total_budget = trip_row["total_budget"] if trip_row else 0.0
            
            res["is_over_budget"] = res["total_estimated"] > total_budget
            res["budget_usage_percent"] = round((res["total_estimated"] / total_budget * 100), 1) if total_budget > 0 else 0.0
            return res

    def save_or_update_budget(self, trip_id: str, budget_data: Dict[str, Any]) -> Dict[str, Any]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM budget_details WHERE trip_id = ?", (trip_id,))
            existing = cursor.fetchone()
            
            cursor.execute("SELECT total_budget FROM trips WHERE id = ?", (trip_id,))
            trip_row = cursor.fetchone()
            total_trip_budget = trip_row["total_budget"] if trip_row else 0.0

            trans = budget_data.get("transportation_cost", 0.0)
            accom = budget_data.get("accommodation_cost", 0.0)
            food = budget_data.get("food_cost", 0.0)
            act = budget_data.get("activities_cost", 0.0)
            misc = budget_data.get("miscellaneous_cost", 0.0)
            
            total_est = trans + accom + food + act + misc
            remaining = total_trip_budget - total_est
            now = datetime.now(timezone.utc).isoformat()
            
            if existing:
                cursor.execute("""
                    UPDATE budget_details 
                    SET transportation_cost = ?, accommodation_cost = ?, food_cost = ?, activities_cost = ?, miscellaneous_cost = ?, total_estimated = ?, remaining_budget = ?, updated_at = ?
                    WHERE trip_id = ?
                """, (trans, accom, food, act, misc, total_est, remaining, now, trip_id))
            else:
                budget_id = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO budget_details (id, trip_id, transportation_cost, accommodation_cost, food_cost, activities_cost, miscellaneous_cost, total_estimated, remaining_budget, currency, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (budget_id, trip_id, trans, accom, food, act, misc, total_est, remaining, budget_data.get("currency", "USD"), now))
            conn.commit()
        return self.get_budget_details(trip_id)

    # ---- Dashboard Stats ----
    def get_dashboard_stats(self, user_id: str) -> Dict[str, Any]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) as count, SUM(total_budget) as total_budget FROM trips WHERE user_id = ?", (user_id,))
            trip_stats = cursor.fetchone()
            total_trips = trip_stats["count"] or 0
            total_budget = trip_stats["total_budget"] or 0.0
            
            cursor.execute("SELECT COUNT(*) as count FROM trips WHERE user_id = ? AND status != 'Completed'", (user_id,))
            upcoming_trips = cursor.fetchone()["count"] or 0
            
            cursor.execute("SELECT COUNT(*) as count FROM trips WHERE user_id = ? AND status = 'Completed'", (user_id,))
            completed_trips = cursor.fetchone()["count"] or 0
            
            cursor.execute("""
                SELECT SUM(total_estimated) as total_spent 
                FROM budget_details 
                WHERE trip_id IN (SELECT id FROM trips WHERE user_id = ?)
            """, (user_id,))
            spent_row = cursor.fetchone()
            total_spent = spent_row["total_spent"] or 0.0
            
            return {
                "total_trips": total_trips,
                "upcoming_trips": upcoming_trips,
                "completed_trips": completed_trips,
                "total_budget_planned": round(total_budget, 2),
                "total_estimated_spent": round(total_spent, 2)
            }

db = DatabaseRepository()
