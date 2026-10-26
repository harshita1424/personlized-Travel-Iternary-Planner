import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, MapPin, DollarSign, Calendar, Users, Shield, ArrowRight, CheckCircle2, Heart, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Mentor Notice Banner (Matching User's Reference UI) */}
      <div style={{
        background: '#2563eb',
        color: '#ffffff',
        padding: '0.75rem 1.5rem',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles size={18} />
          <span><strong>AI Travel Planner Live Demo:</strong> Full-stack FastAPI + React + Supabase integration is active.</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ background: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>Transportation</span>
          <span style={{ background: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>Individual</span>
        </div>
      </div>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
        padding: '5rem 0 4rem 0',
        textAlign: 'center',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#e0f2fe', color: '#0369a1', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            <Sparkles size={16} /> Powered by Generative AI & Supabase PostgreSQL
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
            Personalized Travel <span style={{ color: '#0284c7' }}>Itinerary Planner</span>
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#475569', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Simplify travel planning with intelligent automation. Generate custom day-by-day itineraries, track your budget in real time, and discover curated local experiences tailored to your travel style.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to={user ? "/trips/new" : "/register"} className="btn btn-primary btn-lg">
              Start Planning Trip <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard" className="btn btn-secondary btn-lg">
              Explore Demo Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Real-World Project Scenarios (Explicitly Requested) */}
      <section style={{ padding: '4.5rem 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              Built for Every Traveler Scenario
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748b' }}>
              The recommendation and itinerary engines adjust schedules, pacing, dining, and budgets according to each unique traveler persona.
            </p>
          </div>

          <div className="grid-cols-3">
            {/* Scenario 1 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#e0f2fe', color: '#0284c7', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Compass size={26} />
              </div>
              <span className="badge badge-blue" style={{ alignSelf: 'flex-start', marginBottom: '0.75rem' }}>Scenario 1</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                Solo Traveler Planning a Weekend Vacation
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                A solo traveler wanting a short weekend trip with limited time and budget. The planner generates a balanced itinerary with sightseeing, solo-friendly food, public transit, and optimized travel times to avoid decision fatigue.
              </p>
              <div style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Explore Solo Tokyo Plan →
              </div>
            </div>

            {/* Scenario 2 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#fef3c7', color: '#d97706', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Heart size={26} />
              </div>
              <span className="badge badge-amber" style={{ alignSelf: 'flex-start', marginBottom: '0.75rem' }}>Scenario 2</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                Couple Planning a Romantic Vacation
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                A couple looking for customized experiences, scenic vistas, boutique stays, and romantic candlelit dinners. The platform structures relaxed pacing and coordinates estimated costs for both travelers.
              </p>
              <div style={{ fontSize: '0.85rem', color: '#d97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Explore Romantic Paris Plan →
              </div>
            </div>

            {/* Scenario 3 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#d1fae5', color: '#059669', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Users size={26} />
              </div>
              <span className="badge badge-green" style={{ alignSelf: 'flex-start', marginBottom: '0.75rem' }}>Scenario 3</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                Group of Friends Planning a Holiday
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                A group of friends facing challenges coordinating schedules, shared budgets, and diverse interests. The system harmonizes group activities, allocates shared expenses, and suggests smooth group logistics.
              </p>
              <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Explore Group Adventure Plan →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section style={{ padding: '4.5rem 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              Comprehensive Travel Management Suite
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748b' }}>
              Everything you need from initial destination inspiration to daily schedule execution and budget tracking.
            </p>
          </div>

          <div className="grid-cols-3">
            <div className="card">
              <Sparkles size={24} color="#0284c7" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI Itinerary Generation</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
                Automated morning, afternoon, and evening schedules with verified sights, authentic eateries, and transportation recommendations.
              </p>
            </div>

            <div className="card">
              <DollarSign size={24} color="#10b981" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Smart Budget Management</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
                Categorized expense breakdown (transportation, accommodation, food, activities, misc) with automated over-budget alerts.
              </p>
            </div>

            <div className="card">
              <Calendar size={24} color="#f59e0b" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Interactive Customization</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
                Add your own custom activities, edit timings, remove items, or prompt the AI to regenerate specific days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ padding: '4rem 0', textAlign: 'center', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Ready to plan your next journey?
          </h2>
          <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '2rem' }}>
            Join thousands of travelers who save hours of research and plan stress-free trips with Personalized Travel Itinerary Planner.
          </p>
          <Link to="/trips/new" className="btn btn-primary btn-lg">
            Create Your Itinerary Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
