import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, PlusCircle, Bookmark, DollarSign, Calendar, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tripsApi } from '../services/api';
import TripCard from '../components/TripCard';

const DashboardPage = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({
    total_trips: 0,
    upcoming_trips: 0,
    completed_trips: 0,
    total_budget_planned: 0,
    total_estimated_spent: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tripsRes, statsRes] = await Promise.all([
        tripsApi.getTrips(),
        tripsApi.getDashboardStats()
      ]);
      setTrips(tripsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Dashboard data error:", err);
      setError("Unable to load latest dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip and its itinerary?")) return;
    try {
      await tripsApi.deleteTrip(tripId);
      fetchDashboardData();
    } catch (err) {
      alert("Failed to delete trip");
    }
  };

  return (
    <div style={{ padding: '2.5rem 0', minHeight: '80vh' }}>
      <div className="container">
        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          borderRadius: '16px',
          padding: '2.5rem',
          color: '#ffffff',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 10px 15px -3px rgba(2, 132, 199, 0.2)'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.2)', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              <Sparkles size={14} /> AI Travel Workspace
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              Welcome back, {user?.full_name?.split(' ')[0] || 'Traveler'}!
            </h1>
            <p style={{ fontSize: '1.05rem', opacity: 0.9, maxWidth: '600px' }}>
              Manage your upcoming adventures, review personalized itineraries, and track your total travel investments.
            </p>
          </div>

          <Link to="/trips/new" className="btn btn-primary" style={{
            background: '#ffffff',
            color: '#0284c7',
            padding: '0.85rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 700,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <PlusCircle size={20} /> Create New Trip
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '12px', borderRadius: '12px' }}>
              <Compass size={28} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total Trips</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{stats.total_trips}</h3>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#fef3c7', color: '#d97706', padding: '12px', borderRadius: '12px' }}>
              <Calendar size={28} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Upcoming Trips</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{stats.upcoming_trips}</h3>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#d1fae5', color: '#059669', padding: '12px', borderRadius: '12px' }}>
              <DollarSign size={28} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Budget Planned</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
                ${stats.total_budget_planned?.toLocaleString() || 0}
              </h3>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#f3e8ff', color: '#7e22ce', padding: '12px', borderRadius: '12px' }}>
              <TrendingUp size={28} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Estimated Spent</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
                ${stats.total_estimated_spent?.toLocaleString() || 0}
              </h3>
            </div>
          </div>
        </div>

        {/* Trips Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Your Travel Itineraries</h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Curated plans and saved destination guides</p>
          </div>
          <Link to="/trips" className="btn btn-outline btn-sm">
            View All ({trips.length})
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
            <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '1rem' }}>
              <Compass size={36} color="#0284c7" />
            </div>
            <p>Loading your saved travel plans...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Compass size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>No trips planned yet</h3>
            <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
              Begin by creating your first trip and let our AI generate a customized daily schedule tailored to your budget.
            </p>
            <Link to="/trips/new" className="btn btn-primary">
              <PlusCircle size={18} /> Plan My First Trip
            </Link>
          </div>
        ) : (
          <div className="grid-cols-3">
            {trips.slice(0, 6).map((trip) => (
              <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
