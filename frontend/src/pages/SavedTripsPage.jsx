import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, PlusCircle, Search, Filter, Bookmark } from 'lucide-react';
import { tripsApi } from '../services/api';
import TripCard from '../components/TripCard';

const SavedTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await tripsApi.getTrips();
      setTrips(res.data);
    } catch (err) {
      console.error("Failed to load trips:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip and its itinerary?")) return;
    try {
      await tripsApi.deleteTrip(tripId);
      fetchTrips();
    } catch (err) {
      alert("Failed to delete trip");
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.destination.toLowerCase().includes(search.toLowerCase()) ||
                          trip.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || trip.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '2.5rem 0', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Saved Trips & Plans</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Explore, manage, and revisit your travel itineraries.
            </p>
          </div>

          <Link to="/trips/new" className="btn btn-primary">
            <PlusCircle size={18} /> Plan New Trip
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search by destination or title..."
              className="form-control"
              style={{ border: 'none', padding: '0.4rem', boxShadow: 'none' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="#64748b" />
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Status:</span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {['All', 'Planning', 'Confirmed', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: filterStatus === st ? '1.5px solid #0284c7' : '1px solid transparent',
                    background: filterStatus === st ? '#e0f2fe' : 'transparent',
                    color: filterStatus === st ? '#0284c7' : '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trips Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
            <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '1rem' }}>
              <Compass size={36} color="#0284c7" />
            </div>
            <p>Loading your trips...</p>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Bookmark size={40} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              No trips match your criteria
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {trips.length === 0 ? "You haven't created any trips yet." : "Try clearing your search query or status filter."}
            </p>
            <Link to="/trips/new" className="btn btn-primary">
              <PlusCircle size={18} /> Plan a Trip
            </Link>
          </div>
        ) : (
          <div className="grid-cols-3">
            {filteredTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTripsPage;
