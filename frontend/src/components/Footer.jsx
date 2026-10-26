import React from 'react';
import { Compass, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      padding: '3rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ background: '#0284c7', color: '#fff', borderRadius: '8px', padding: '6px' }}>
                <Compass size={20} />
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                Travel<span style={{ color: '#0284c7' }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
              AI-powered personalized travel itinerary planner. Effortlessly create custom day-wise schedules, track budgets, and explore curated destination experiences.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Scenarios</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
              <li>Solo Weekend Getaways</li>
              <li>Romantic Couple Vacations</li>
              <li>Small Group Holidays</li>
              <li>Family Adventure Tours</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Explore App</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
              <li><Link to="/dashboard" style={{ color: '#0284c7' }}>Dashboard</Link></li>
              <li><Link to="/trips/new" style={{ color: '#0284c7' }}>New Itinerary Builder</Link></li>
              <li><Link to="/trips" style={{ color: '#0284c7' }}>Saved Travel Plans</Link></li>
              <li><Link to="/budget" style={{ color: '#0284c7' }}>Budget Analysis</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Tech Stack</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className="badge badge-blue">React.js</span>
              <span className="badge badge-blue">FastAPI</span>
              <span className="badge badge-blue">Supabase</span>
              <span className="badge badge-blue">Generative AI</span>
              <span className="badge badge-blue">PostgreSQL</span>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          color: '#94a3b8'
        }}>
          <p>© {new Date().getFullYear()} Personalized Travel Itinerary Planner. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for modern travelers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
