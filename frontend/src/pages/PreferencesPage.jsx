import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Compass, Check, ArrowLeft, Save, Sparkles } from 'lucide-react';
import { preferencesApi, tripsApi, itineraryApi } from '../services/api';

const activityOptions = [
  'Sightseeing', 'Food', 'Historical places', 'Nature', 'Photography', 'Shopping', 'Adventure'
];

const accommodationOptions = [
  'Mid-range Hotel', 'Boutique Hotel', 'Luxury Resort', 'Budget Hostel', 'Vacation Apartment (Airbnb)'
];

const transportationOptions = [
  'Public Transit (Metro/Bus)', 'Walking & Biking', 'Rental Car', 'High-Speed Train', 'Flight & Taxis'
];

const foodOptions = [
  'Local regional cuisine', 'Street food & night markets', 'Fine dining & wine', 'Vegetarian', 'Vegan', 'Halal friendly'
];

const PreferencesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [preferences, setPreferences] = useState({
    preferred_activities: [],
    accommodation_type: 'Mid-range Hotel',
    transportation_type: 'Public Transit (Metro/Bus)',
    food_preferences: [],
    pace_preference: 'Moderate',
    special_requirements: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripRes, prefRes] = await Promise.allSettled([
          tripsApi.getTrip(id),
          preferencesApi.getPreferences(id)
        ]);

        if (tripRes.status === 'fulfilled') {
          setTrip(tripRes.value.data);
        }
        if (prefRes.status === 'fulfilled' && prefRes.value.data) {
          setPreferences({
            preferred_activities: prefRes.value.data.preferred_activities || [],
            accommodation_type: prefRes.value.data.accommodation_type || 'Mid-range Hotel',
            transportation_type: prefRes.value.data.transportation_type || 'Public Transit (Metro/Bus)',
            food_preferences: prefRes.value.data.food_preferences || [],
            pace_preference: prefRes.value.data.pace_preference || 'Moderate',
            special_requirements: prefRes.value.data.special_requirements || ''
          });
        }
      } catch (err) {
        console.error("Failed to load trip preferences:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleActivity = (act) => {
    const current = preferences.preferred_activities || [];
    if (current.includes(act)) {
      setPreferences({ ...preferences, preferred_activities: current.filter(a => a !== act) });
    } else {
      setPreferences({ ...preferences, preferred_activities: [...current, act] });
    }
  };

  const toggleFood = (f) => {
    const current = preferences.food_preferences || [];
    if (current.includes(f)) {
      setPreferences({ ...preferences, food_preferences: current.filter(item => item !== f) });
    } else {
      setPreferences({ ...preferences, food_preferences: [...current, f] });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await preferencesApi.savePreferences(id, preferences);
      setMessage('Preferences saved successfully! You can regenerate the itinerary to reflect these changes.');
    } catch (err) {
      alert("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!window.confirm("Regenerate itinerary using these preferences?")) return;
    setSaving(true);
    try {
      await preferencesApi.savePreferences(id, preferences);
      await itineraryApi.generateItinerary(id, { regenerate: true });
      navigate(`/trips/${id}/itinerary`);
    } catch (err) {
      alert("Failed to regenerate itinerary");
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading preferences...</div>;
  }

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '750px' }}>
        <Link to={`/trips/${id}/itinerary`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Itinerary
        </Link>

        {message && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            {message}
          </div>
        )}

        <div className="card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Trip Preferences: {trip?.title || trip?.destination}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Fine-tune activity categories, food restrictions, and accommodation style.
          </p>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Preferred Activities</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {activityOptions.map((act) => {
                  const isSel = preferences.preferred_activities?.includes(act);
                  return (
                    <button
                      type="button"
                      key={act}
                      onClick={() => toggleActivity(act)}
                      style={{
                        padding: '0.5rem 0.9rem',
                        borderRadius: '9999px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: isSel ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                        backgroundColor: isSel ? '#e0f2fe' : '#ffffff',
                        color: isSel ? '#0369a1' : '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      {act} {isSel && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Accommodation Type</label>
                <select
                  className="form-control"
                  value={preferences.accommodation_type}
                  onChange={(e) => setPreferences({ ...preferences, accommodation_type: e.target.value })}
                >
                  {accommodationOptions.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Transportation Type</label>
                <select
                  className="form-control"
                  value={preferences.transportation_type}
                  onChange={(e) => setPreferences({ ...preferences, transportation_type: e.target.value })}
                >
                  {transportationOptions.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '0.5rem' }}>
              <label className="form-label">Food & Cuisine</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {foodOptions.map((f, i) => {
                  const isSel = preferences.food_preferences?.includes(f);
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => toggleFood(f)}
                      style={{
                        padding: '0.45rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        border: isSel ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                        backgroundColor: isSel ? '#f0f9ff' : '#ffffff',
                        color: isSel ? '#0284c7' : '#475569',
                        cursor: 'pointer'
                      }}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label">Pace Preference</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {['Relaxed', 'Moderate', 'Fast-paced'].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPreferences({ ...preferences, pace_preference: p })}
                    style={{
                      padding: '0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: preferences.pace_preference === p ? '2px solid #0284c7' : '1px solid #e2e8f0',
                      backgroundColor: preferences.pace_preference === p ? '#e0f2fe' : '#fff',
                      color: preferences.pace_preference === p ? '#0369a1' : '#475569'
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label">Special Notes</label>
              <textarea
                className="form-control"
                rows="2"
                value={preferences.special_requirements}
                onChange={(e) => setPreferences({ ...preferences, special_requirements: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem' }}>
              <button
                type="submit"
                className="btn btn-secondary"
                disabled={saving}
              >
                <Save size={16} /> Save Preferences
              </button>

              <button
                type="button"
                onClick={handleRegenerate}
                className="btn btn-primary"
                disabled={saving}
              >
                <Sparkles size={16} /> Save & Regenerate Itinerary
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
