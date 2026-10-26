import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Compass, MapPin, Calendar, Users, DollarSign, Sparkles, Plus, Edit2,
  Trash2, Lightbulb, Clock, ArrowLeft, RefreshCw, Printer, AlertTriangle, Check
} from 'lucide-react';
import { tripsApi, itineraryApi, budgetApi } from '../services/api';
import ActivityModal from '../components/ActivityModal';

const ItineraryPage = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  // Day filter
  const [activeDay, setActiveDay] = useState(1);

  // Activity modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const fetchTripAndItinerary = async () => {
    try {
      setLoading(true);
      const res = await tripsApi.getTrip(id);
      setTrip(res.data);
      setItinerary(res.data.itinerary);
      setBudget(res.data.budget);
    } catch (err) {
      console.error("Failed to fetch itinerary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripAndItinerary();
  }, [id]);

  const handleGenerateItinerary = async () => {
    try {
      setGenerating(true);
      const res = await itineraryApi.generateItinerary(id, {
        regenerate: true,
        custom_prompt: customPrompt || undefined
      });
      setItinerary(res.data);
      setShowRegenerateModal(false);
      setCustomPrompt('');
      // Refresh budget
      const bRes = await budgetApi.getBudget(id);
      setBudget(bRes.data);
    } catch (err) {
      alert("Failed to generate itinerary. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveActivity = async (activityData) => {
    try {
      if (selectedActivity) {
        // Edit existing
        await itineraryApi.updateActivity(selectedActivity.id, activityData);
      } else {
        // Add new
        await itineraryApi.addActivity(itinerary.id, activityData);
      }
      setModalOpen(false);
      setSelectedActivity(null);
      // Refresh
      fetchTripAndItinerary();
    } catch (err) {
      alert("Failed to save activity");
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm("Remove this activity from the itinerary?")) return;
    try {
      await itineraryApi.deleteActivity(activityId);
      fetchTripAndItinerary();
    } catch (err) {
      alert("Failed to delete activity");
    }
  };

  // Group activities by day
  const activitiesByDay = {};
  if (itinerary?.activities) {
    itinerary.activities.forEach(act => {
      if (!activitiesByDay[act.day_number]) {
        activitiesByDay[act.day_number] = [];
      }
      activitiesByDay[act.day_number].push(act);
    });
  }

  const daysList = Object.keys(activitiesByDay).map(d => parseInt(d, 10)).sort((a, b) => a - b);
  const currentDayActivities = activitiesByDay[activeDay] || [];

  const timeSlots = ['Morning', 'Afternoon', 'Evening'];

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center', color: '#64748b' }}>
        <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '1rem' }}>
          <Compass size={36} color="#0284c7" />
        </div>
        <p>Loading your personalized itinerary...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0', minHeight: '85vh' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/trips" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to My Trips
          </Link>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to={`/trips/${id}/preferences`} className="btn btn-secondary btn-sm">
              Trip Preferences
            </Link>
            <Link to={`/trips/${id}/budget`} className="btn btn-secondary btn-sm">
              <DollarSign size={15} /> Budget Details
            </Link>
            <button
              onClick={() => setShowRegenerateModal(true)}
              className="btn btn-primary btn-sm"
            >
              <Sparkles size={15} /> Regenerate with AI
            </button>
            <button
              onClick={() => window.print()}
              className="btn btn-secondary btn-sm"
              title="Print Itinerary"
            >
              <Printer size={15} />
            </button>
          </div>
        </div>

        {/* Hero Header Card */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          padding: '2.5rem',
          borderRadius: '16px',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#fff' }}>
                  {trip?.travel_type}
                </span>
                <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#fff' }}>
                  {trip?.status}
                </span>
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.25rem 0' }}>{trip?.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.75rem', fontSize: '0.95rem', opacity: 0.9, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} /> {trip?.destination}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={16} /> {trip?.start_date} → {trip?.end_date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={16} /> {trip?.number_of_travelers} Traveler(s)
                </span>
              </div>
            </div>

            {/* Quick Budget Badge */}
            <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '1rem 1.5rem', borderRadius: '12px', textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85 }}>Total Planned Budget</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                ${Number(trip?.total_budget || 0).toLocaleString()}
              </div>
              <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Est. Daily: ${Number(itinerary?.daily_budget || 0).toFixed(0)}/day
              </span>
            </div>
          </div>
        </div>

        {/* Overview & Tips */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
              Destination Overview & Summary
            </h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              {itinerary?.destination_overview || "Experience the perfect balance of iconic sights and hidden gems."}
            </p>
            <p style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic', borderLeft: '3px solid #0284c7', paddingLeft: '0.75rem' }}>
              {itinerary?.summary}
            </p>
          </div>

          <div className="card" style={{ background: '#f8fafc', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Lightbulb size={18} color="#d97706" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Essential Travel Tips</h4>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>
              {itinerary?.travel_tips?.map((tip, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <span style={{ color: '#0284c7', fontWeight: 700 }}>•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Day Selector Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {daysList.map((dayNum) => (
              <button
                key={dayNum}
                onClick={() => setActiveDay(dayNum)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  border: activeDay === dayNum ? '2px solid #0284c7' : '1px solid #e2e8f0',
                  backgroundColor: activeDay === dayNum ? '#0284c7' : '#ffffff',
                  color: activeDay === dayNum ? '#ffffff' : '#475569',
                  transition: 'all 0.2s'
                }}
              >
                Day {dayNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setSelectedActivity(null);
              setModalOpen(true);
            }}
            className="btn btn-outline btn-sm"
          >
            <Plus size={16} /> Add Activity to Day {activeDay}
          </button>
        </div>

        {/* Activities Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {timeSlots.map((slot) => {
            const slotActivities = currentDayActivities.filter(a => a.time_slot === slot);
            return (
              <div key={slot} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <Clock size={18} color="#0284c7" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{slot} Schedule</h3>
                </div>

                {slotActivities.length === 0 ? (
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem', padding: '1rem 0' }}>
                    No scheduled activities for {slot.toLowerCase()}. Click "Add Activity" above to customize.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {slotActivities.map((act) => (
                      <div
                        key={act.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          padding: '1rem',
                          borderRadius: '8px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          gap: '1rem'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>
                              {act.activity_type}
                            </span>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                              {act.title}
                            </h4>
                          </div>

                          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                            {act.description}
                          </p>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                            {act.location && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <MapPin size={13} color="#0284c7" /> {act.location}
                              </span>
                            )}
                            {act.booking_tip && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#d97706' }}>
                                <Lightbulb size={13} /> {act.booking_tip}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Cost & Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                            ${Number(act.estimated_cost || 0).toLocaleString()}
                          </div>

                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              onClick={() => {
                                setSelectedActivity(act);
                                setModalOpen(true);
                              }}
                              style={{ background: 'transparent', color: '#64748b', padding: '4px' }}
                              title="Edit Activity"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteActivity(act.id)}
                              style={{ background: 'transparent', color: '#ef4444', padding: '4px' }}
                              title="Delete Activity"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* AI Regeneration Modal */}
        {showRegenerateModal && (
          <div className="modal-overlay" onClick={() => setShowRegenerateModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                Regenerate Itinerary with AI
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Provide specific guidance or let the AI completely rethink your schedule based on your travel preferences.
              </p>

              <div className="form-group">
                <label className="form-label">Custom Prompt / Refinement Instructions</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="e.g. Focus more on outdoor cafes, add a day trip to surrounding hills, avoid crowded museums on Day 2..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowRegenerateModal(false)}
                  className="btn btn-secondary"
                  disabled={generating}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerateItinerary}
                  className="btn btn-primary"
                  disabled={generating}
                >
                  {generating ? 'Regenerating...' : 'Regenerate Now'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activity Add/Edit Modal */}
        <ActivityModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedActivity(null);
          }}
          onSave={handleSaveActivity}
          activity={selectedActivity}
          currentDay={activeDay}
        />
      </div>
    </div>
  );
};

export default ItineraryPage;
