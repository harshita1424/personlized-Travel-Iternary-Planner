-- ========================================================
-- Personalized Travel Itinerary Planner - Supabase Schema
-- ========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    starting_location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    number_of_travelers INT DEFAULT 1,
    total_budget NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    travel_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Planning',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Trip Preferences Table
CREATE TABLE IF NOT EXISTS public.trip_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID UNIQUE REFERENCES public.trips(id) ON DELETE CASCADE,
    preferred_activities JSONB DEFAULT '[]'::jsonb,
    accommodation_type VARCHAR(100) DEFAULT 'Mid-range Hotel',
    transportation_type VARCHAR(100) DEFAULT 'Public Transit',
    food_preferences JSONB DEFAULT '[]'::jsonb,
    pace_preference VARCHAR(50) DEFAULT 'Moderate',
    special_requirements TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Itineraries Table
CREATE TABLE IF NOT EXISTS public.itineraries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID UNIQUE REFERENCES public.trips(id) ON DELETE CASCADE,
    destination_overview TEXT,
    summary TEXT,
    travel_tips JSONB DEFAULT '[]'::jsonb,
    total_estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    daily_budget NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Daily Activities Table
CREATE TABLE IF NOT EXISTS public.daily_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    itinerary_id UUID REFERENCES public.itineraries(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    date DATE,
    time_slot VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    activity_type VARCHAR(50) DEFAULT 'Sightseeing',
    estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    booking_tip TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Budget Details Table
CREATE TABLE IF NOT EXISTS public.budget_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID UNIQUE REFERENCES public.trips(id) ON DELETE CASCADE,
    transportation_cost NUMERIC(10, 2) DEFAULT 0.00,
    accommodation_cost NUMERIC(10, 2) DEFAULT 0.00,
    food_cost NUMERIC(10, 2) DEFAULT 0.00,
    activities_cost NUMERIC(10, 2) DEFAULT 0.00,
    miscellaneous_cost NUMERIC(10, 2) DEFAULT 0.00,
    total_estimated NUMERIC(10, 2) DEFAULT 0.00,
    remaining_budget NUMERIC(10, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_itinerary ON public.daily_activities(itinerary_id, day_number);
CREATE INDEX IF NOT EXISTS idx_trip_preferences_trip ON public.trip_preferences(trip_id);
CREATE INDEX IF NOT EXISTS idx_budget_details_trip ON public.budget_details(trip_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_details ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own profile"
    ON public.users FOR ALL
    USING (auth.uid() = id);

CREATE POLICY "Users can manage their own trips"
    ON public.trips FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their trip preferences"
    ON public.trip_preferences FOR ALL
    USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_preferences.trip_id AND trips.user_id = auth.uid()));

CREATE POLICY "Users can manage their itineraries"
    ON public.itineraries FOR ALL
    USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = itineraries.trip_id AND trips.user_id = auth.uid()));

CREATE POLICY "Users can manage their daily activities"
    ON public.daily_activities FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.itineraries 
        JOIN public.trips ON trips.id = itineraries.trip_id 
        WHERE itineraries.id = daily_activities.itinerary_id AND trips.user_id = auth.uid()
    ));

CREATE POLICY "Users can manage their budget details"
    ON public.budget_details FOR ALL
    USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = budget_details.trip_id AND trips.user_id = auth.uid()));
