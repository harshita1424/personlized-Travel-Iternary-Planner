import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass, MapPin, Calendar, Users, DollarSign, ArrowRight, ArrowLeft,
  Sparkles, Check, Heart, Camera, Coffee, Mountain, ShoppingBag, Eye, Landmark
} from 'lucide-react';
import { tripsApi, itineraryApi } from '../services/api';

const travelTypes = [
  { id: 'Solo travel', label: 'Solo Travel', desc: 'Independent exploration & discovery' },
  { id: 'Romantic', label: 'Romantic / Couple', desc: 'Scenic escapes & intimate dining' },
  { id: 'Family vacation', label: 'Family Vacation', desc: 'Kid-friendly sights & relaxed pacing' },
  { id: 'Group travel', label: 'Group of Friends', desc: 'Coordinated activities & shared fun' },
  { id: 'Adventure', label: 'Adventure', desc: 'Active hiking, trails & outdoor thrills' },
  { id: 'Cultural', label: 'Cultural & Heritage', desc: 'Museums, ancient sites & art history' },
  { id: 'Relaxation', label: 'Relaxation & Wellness', desc: 'Spas, coastal leisure & quiet cafes' }
];

const activityOptions = [
  { id: 'Sightseeing', label: 'Sightseeing', icon: Eye },
  { id: 'Food', label: 'Food & Dining', icon: Coffee },
  { id: 'Historical places', label: 'Historical Places', icon: Landmark },
  { id: 'Nature', label: 'Nature & Parks', icon: Mountain },
  { id: 'Photography', label: 'Photography', icon: Camera },
  { id: 'Shopping', label: 'Shopping & Markets', icon: ShoppingBag },
  { id: 'Adventure', label: 'Adventure Activities', icon: Compass }
];

const accommodationOptions = [
  'Mid-range Hotel',
  'Boutique Hotel',
  'Luxury Resort',
  'Budget Hostel',
  'Vacation Apartment (Airbnb)'
];

const transportationOptions = [
  'Public Transit (Metro/Bus)',
  'Walking & Biking',
  'Rental Car',
  'High-Speed Train',
  'Flight & Taxis'
];

const foodOptions = [
  'Local regional cuisine',
  'Street food & night markets',
  'Fine dining & wine',
  'Vegetarian',
  'Vegan',
  'Halal friendly'
];

const CreateTripPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Basic Trip Details
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startingLocation, setStartingLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [totalBudget, setTotalBudget] = useState(1500);
  const [travelType, setTravelType] = useState('Solo travel');

  // Step 2: Preferences
  const [preferredActivities, setPreferredActivities] = useState(['Sightseeing', 'Food', 'Photography']);
  const [accommodationType, setAccommodationType] = useState('Mid-range Hotel');
  const [transportationType, setTransportationType] = useState('Public Transit (Metro/Bus)');
  const [foodPreferences, setFoodPreferences] = useState(['Local regional cuisine']);
  const [pacePreference, setPacePreference] = useState('Moderate');
  const [specialRequirements, setSpecialRequirements] = useState('');

  const toggleActivity = (actId) => {
    if (preferredActivities.includes(actId)) {
      setPreferredActivities(preferredActivities.filter(a => a !== actId));
    } else {
      setPreferredActivities([...preferredActivities, actId]);
    }
  };

  const toggleFood = (foodId) => {
    if (foodPreferences.includes(foodId)) {
      setFoodPreferences(foodPreferences.filter(f => f !== foodId));
    } else {
      setFoodPreferences([...foodPreferences, foodId]);
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!destination || !startDate || !endDate) {
      setError('Please fill out all required trip fields');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const tripData = {
        title: title || `Trip to ${destination}`,
        destination,
        starting_location: startingLocation,
        start_date: startDate,
        end_date: endDate,
        number_of_travelers: parseInt(travelers, 10),
        total_budget: parseFloat(totalBudget),
        travel_type: travelType,
        status: 'Planning',
        preferences: {
          preferred_activities: preferredActivities,
          accommodation_type: accommodationType,
          transportation_type: transportationType,
          food_preferences: foodPreferences,
          pace_preference: pacePreference,
          special_requirements: specialRequirements
        }
      };

      // 1. Create Trip & save preferences in DB
      const res = await tripsApi.createTrip(tripData);
      const createdTrip = res.data;

      // 2. Generate AI Itinerary immediately for instant gratification
      await itineraryApi.generateItinerary(createdTrip.id, {});

      // 3. Navigate directly to the interactive Itinerary view
      navigate(`/trips/${createdTrip.id}/itinerary`);
    } catch (err) {
      console.error("Trip creation failed:", err);
      setError(err.response?.data?.detail || "Failed to create trip. Please verify details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '85vh', background: 'linear-gradient(180deg, #f0f9ff 0%, #f8fafc 100%)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: step >= 1 ? '#0284c7' : '#e2e8f0',
              color: step >= 1 ? '#fff' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}>
              1
            </div>
            <span style={{ fontWeight: 600, color: step === 1 ? '#0284c7' : '#64748b' }}>Trip Basics</span>
          </div>

          <div style={{ width: '40px', height: '2px', background: step === 2 ? '#0284c7' : '#e2e8f0' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: step === 2 ? '#0284c7' : '#e2e8f0',
              color: step === 2 ? '#fff' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}>
              2
            </div>
            <span style={{ fontWeight: 600, color: step === 2 ? '#0284c7' : '#64748b' }}>Travel Preferences & AI</span>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {/* STEP 1: Basic Trip Details */}
        {step === 1 && (
          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Where are you heading?</h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Enter your destination, dates, and budget to begin your personalized plan.
              </p>
            </div>

            <form onSubmit={handleNextStep}>
              <div className="form-group">
                <label className="form-label">Trip Title (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Summer Vacation in Rome"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Destination City & Country *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Kyoto, Japan or Paris, France"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Starting Location / Origin</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. London, UK or New York, USA"
                    value={startingLocation}
                    onChange={(e) => setStartingLocation(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Number of Travelers</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="form-control"
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Travel Budget ($ USD)</label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    className="form-control"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Travel Type Select */}
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label">Travel Style / Persona</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  {travelTypes.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setTravelType(type.id)}
                      style={{
                        border: travelType === type.id ? '2px solid #0284c7' : '1px solid #e2e8f0',
                        backgroundColor: travelType === type.id ? '#e0f2fe' : '#ffffff',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: travelType === type.id ? '#0369a1' : '#1e293b' }}>
                        {type.label}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{type.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary btn-lg">
                  Continue to Preferences <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Preferences Collection */}
        {step === 2 && (
          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Tailor Your Experience</h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Select your preferred activities, food, transit, and accommodation style for {destination}.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Activities Multi-select */}
              <div className="form-group">
                <label className="form-label">Preferred Activities & Interests (Select multiple)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                  {activityOptions.map((act) => {
                    const isSelected = preferredActivities.includes(act.id);
                    const Icon = act.icon;
                    return (
                      <button
                        type="button"
                        key={act.id}
                        onClick={() => toggleActivity(act.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.55rem 0.9rem',
                          borderRadius: '9999px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          border: isSelected ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                          backgroundColor: isSelected ? '#e0f2fe' : '#ffffff',
                          color: isSelected ? '#0369a1' : '#334155',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        <Icon size={14} />
                        {act.label}
                        {isSelected && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Accommodation Style</label>
                  <select
                    className="form-control"
                    value={accommodationType}
                    onChange={(e) => setAccommodationType(e.target.value)}
                  >
                    {accommodationOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Transportation Preference</label>
                  <select
                    className="form-control"
                    value={transportationType}
                    onChange={(e) => setTransportationType(e.target.value)}
                  >
                    {transportationOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Food Preferences */}
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label">Food & Dining Preferences</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {foodOptions.map((f, i) => {
                    const isSelected = foodPreferences.includes(f);
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
                          border: isSelected ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                          backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                          color: isSelected ? '#0284c7' : '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pacing */}
              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label className="form-label">Travel Pace</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {['Relaxed', 'Moderate', 'Fast-paced'].map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPacePreference(p)}
                      style={{
                        padding: '0.6rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: pacePreference === p ? '2px solid #0284c7' : '1px solid #e2e8f0',
                        backgroundColor: pacePreference === p ? '#e0f2fe' : '#fff',
                        color: pacePreference === p ? '#0369a1' : '#475569'
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label className="form-label">Special Requests / Notes (Optional)</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="e.g. Traveling with baby stroller, need elevator access, prefer outdoor cafes..."
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  <ArrowLeft size={16} /> Back to Trip Details
                </button>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin" style={{ display: 'inline-block' }}>
                        <Compass size={18} />
                      </div>
                      Generating AI Itinerary...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} /> Generate AI Itinerary
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTripPage;
