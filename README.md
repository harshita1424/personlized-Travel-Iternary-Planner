# Personalized Travel Itinerary Planner ✈️🗺️

Personalized Travel Itinerary Planner is an AI-powered, full-stack web application designed to eliminate travel planning fatigue. Built with **FastAPI**, **React.js**, **Supabase (PostgreSQL & Auth)**, and **Generative AI**, it generates personalized day-by-day itineraries, tracks detailed categorized budgets, and curates customized destination activities.

---

## 🌟 Key Features

1. **AI-Powered Itinerary Generation**:
   - Generates morning, afternoon, and evening schedules.
   - Recommends tourist attractions, dining spots, accommodation options, and transit recommendations.
   - Includes destination overviews, daily budgets, total estimated expenses, and localized travel tips.
   - Feasible schedules with estimated pricing and booking tips.

2. **Personalized Recommendation Engine**:
   - Adapts to 7 travel personas: Solo travel, Couple / Romantic, Family vacation, Group of friends, Adventure, Cultural & Heritage, Relaxation & Wellness.
   - Incorporates custom interests: Sightseeing, Food, Nature, Photography, Historical places, Shopping, and Adventure.

3. **Smart Budget Management**:
   - Categorized breakdown: Transportation, Accommodation, Food & Dining, Activities & Tours, Miscellaneous.
   - Visual progress bars, summary metric cards, and expense distribution.
   - **Over-Budget Warning System**: Highlights deficits when expenses exceed user budget.
   - Traveler expense splitting for couples and groups.

4. **Interactive Itinerary Customization**:
   - Day-by-day tabbed browsing (Day 1, Day 2, Day 3...).
   - Add custom activities, modify details, or remove activities with instant budget recalculation.
   - AI Regeneration with custom instructions/prompts.
   - Print and export-ready view.

5. **Supabase Database & Authentication**:
   - Relational schema with 6 tables (`users`, `trips`, `trip_preferences`, `itineraries`, `daily_activities`, `budget_details`).
   - Foreign key integrity, cascade deletions, and Row Level Security (RLS) policies.
   - Resilient Dual-Mode Database: Connects to live Supabase or automatically operates in offline mode for local testing.

---

## 🏗️ Technical Architecture

```mermaid
graph TD
    User([Traveler / User]) -->|Browser Interface| ReactApp[React.js Frontend (Vite)]
    ReactApp -->|REST API Requests / Bearer Token| FastAPI[FastAPI Backend Application]
    FastAPI -->|JWT & Row Level Security| SupabaseAuth[Supabase Auth]
    FastAPI -->|Relational Queries & CRUD| SupabaseDB[(Supabase PostgreSQL / Local DB)]
    FastAPI -->|Generative Prompts & Schedules| GenAI[Generative AI / Gemini API]
    FastAPI -->|Persona Filtering & Curated Sights| RecEngine[Recommendation Engine]
```

---

## 📱 10 Application Pages

| # | Page | Route | Description |
|---|------|-------|-------------|
| 1 | **Landing Page** | `/` | Hero presentation, feature highlights, and 3 project scenarios |
| 2 | **Login Page** | `/login` | Email/password login with 1-click Demo Account access |
| 3 | **Registration Page** | `/register` | New traveler onboarding |
| 4 | **User Dashboard** | `/dashboard` | Metrics overview (Total trips, budget, upcoming), trip cards |
| 5 | **Create Trip Page** | `/trips/new` | Multi-step interactive planner form |
| 6 | **Travel Preferences** | `/trips/:id/preferences` | Activity multi-select, accommodation, diet, pacing |
| 7 | **AI Itinerary Page** | `/trips/:id/itinerary` | Day tabs, morning/afternoon/evening schedule, activity editor |
| 8 | **Budget Management** | `/budget` & `/trips/:id/budget` | Categorized expense charts, over-budget alerts, group split |
| 9 | **Saved Trips Page** | `/trips` | Search, filter by status (Planning, Confirmed, Completed), delete |
| 10 | **User Profile Page** | `/profile` | Traveler identity, default persona, diet, pacing settings |

---

## 🗄️ Supabase PostgreSQL Database Schema

The database script is located at [`supabase/schema.sql`](supabase/schema.sql).

### Tables:
1. `users`: UUID primary key, email, full_name, avatar_url, timestamps.
2. `trips`: Destination, starting location, dates, traveler count, budget, travel style, status.
3. `trip_preferences`: Activities JSON, accommodation type, transport, food restrictions, pace.
4. `itineraries`: Destination overview, summary, travel tips JSON, total estimated cost, daily budget.
5. `daily_activities`: Day number, date, time slot (Morning, Afternoon, Evening), title, description, location, cost, tip.
6. `budget_details`: Transportation, accommodation, food, activities, misc, total estimated, remaining balance.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Python 3.10+ (Python 3.12 recommended)
- Node.js 18+ and npm

### 1. Clone Repository & Setup Environment
```bash
# Clone repository
git clone <repository-url>
cd "Personalized-Travel-Itinerary-Planner"

# Copy environment variables
cp .env.example .env
```

### 2. Backend Setup (FastAPI)
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run backend server
python backend/main.py
# Server runs at http://localhost:8000
# Interactive Swagger API Docs at http://localhost:8000/docs
```

### 3. Frontend Setup (React.js + Vite)
```bash
cd frontend

# Install frontend dependencies
npm install

# Run development server
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🧪 Testing

Run automated backend test suite:
```bash
.\venv\Scripts\python -m pytest backend/tests/test_api.py -v
```

Validate frontend production build:
```bash
cd frontend
npm run build
```

---

## 🌐 Production Deployment

### Backend Deployment (Render)
1. Push repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com).
3. Connect repository and select `render.yaml` or configure:
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables: `SUPABASE_URL`, `SUPABASE_KEY`, `GEMINI_API_KEY`.

### Frontend Deployment (Vercel)
1. Import repository on [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Build Command: `npm run build`, Output Directory: `dist`.
4. Set Environment Variable: `VITE_API_URL=https://your-render-service.onrender.com/api`.
5. Deploy. `vercel.json` will automatically handle SPA rewrites.

---

## 📄 License
MIT License. Built for modern travelers.
