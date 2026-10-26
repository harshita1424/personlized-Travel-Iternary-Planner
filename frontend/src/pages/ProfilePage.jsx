import React, { useState } from 'react';
import { User, Mail, Shield, Compass, Calendar, DollarSign, LogOut, CheckCircle, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [defaultPersona, setDefaultPersona] = useState('Solo travel');
  const [defaultDiet, setDefaultDiet] = useState('No restrictions');
  const [preferredPace, setPreferredPace] = useState('Moderate');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveDefaults = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Traveler Profile</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Manage your traveler identity and default AI planning preferences.
        </p>

        {savedSuccess && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            <CheckCircle size={18} />
            <span>Profile defaults updated successfully!</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Left Avatar & Identity Card */}
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
              color: '#ffffff',
              fontSize: '2rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              {user?.full_name ? user.full_name.charAt(0) : 'T'}
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
              {user?.full_name || 'Traveler'}
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '1.5rem' }}>
              {user?.email || 'traveler@example.com'}
            </span>

            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', fontWeight: 600, marginBottom: '0.5rem' }}>
                <Award size={16} /> Verified Traveler Tier
              </div>
              <p style={{ color: '#64748b', fontSize: '0.8rem' }}>
                Full access to AI Generative itinerary builder, real-time budget forecasting, and Supabase cloud sync.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-outline btn-sm"
              style={{ width: '100%', color: '#ef4444', borderColor: '#ef4444' }}
            >
              <LogOut size={15} /> Log Out
            </button>
          </div>

          {/* Right Default Preferences Card */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
              Default Travel Persona & Preferences
            </h3>

            <form onSubmit={handleSaveDefaults}>
              <div className="form-group">
                <label className="form-label">Default Traveler Style</label>
                <select
                  className="form-control"
                  value={defaultPersona}
                  onChange={(e) => setDefaultPersona(e.target.value)}
                >
                  <option value="Solo travel">Solo Traveler</option>
                  <option value="Couple">Couple / Romantic</option>
                  <option value="Family vacation">Family Vacation</option>
                  <option value="Group travel">Group with Friends</option>
                  <option value="Adventure">Adventure Seeker</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Dietary Preferences</label>
                <select
                  className="form-control"
                  value={defaultDiet}
                  onChange={(e) => setDefaultDiet(e.target.value)}
                >
                  <option value="No restrictions">No restrictions (Local cuisine)</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Halal">Halal</option>
                  <option value="Gluten-free">Gluten-free</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Trip Pacing</label>
                <select
                  className="form-control"
                  value={preferredPace}
                  onChange={(e) => setPreferredPace(e.target.value)}
                >
                  <option value="Relaxed">Relaxed (1-2 main activities/day)</option>
                  <option value="Moderate">Moderate (Balanced schedules)</option>
                  <option value="Fast-paced">Fast-paced (Action packed)</option>
                </select>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Save Profile Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
