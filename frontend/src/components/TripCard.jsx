import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, DollarSign, ArrowRight, Trash2, Edit3, Sparkles } from 'lucide-react';

const TripCard = ({ trip, onDelete }) => {
  const {
    id,
    title,
    destination,
    start_date,
    end_date,
    number_of_travelers,
    total_budget,
    travel_type,
    status
  } = trip;

  const getStatusBadge = (st) => {
    switch (st?.toLowerCase()) {
      case 'confirmed':
        return <span className="badge badge-green">Confirmed</span>;
      case 'completed':
        return <span className="badge badge-blue">Completed</span>;
      default:
        return <span className="badge badge-amber">Planning</span>;
    }
  };

  // Curated gradient placeholder based on destination
  const getDestinationBanner = (dest) => {
    return 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Top Banner */}
      <div style={{
        background: getDestinationBanner(destination),
        padding: '1.25rem',
        color: '#ffffff',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 600
          }}>
            {travel_type || 'Travel'}
          </span>
          {getStatusBadge(status)}
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.25rem 0' }}>{title || destination}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', opacity: 0.9 }}>
          <MapPin size={15} /> {destination}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.85rem' }}>
          <Calendar size={16} color="#0284c7" />
          <span>{start_date} → {end_date}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.85rem' }}>
            <Users size={16} />
            <span>{number_of_travelers} {number_of_travelers === 1 ? 'Traveler' : 'Travelers'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem' }}>
            <DollarSign size={16} color="#10b981" />
            <span>${Number(total_budget || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem' }}>
          <Link
            to={`/trips/${id}/itinerary`}
            className="btn btn-primary btn-sm"
            style={{ flex: 1, textDecoration: 'none' }}
          >
            <Sparkles size={14} /> Itinerary
          </Link>

          <Link
            to={`/trips/${id}/budget`}
            className="btn btn-secondary btn-sm"
            title="View Budget"
            style={{ padding: '0.4rem 0.6rem' }}
          >
            <DollarSign size={15} />
          </Link>

          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="btn btn-secondary btn-sm"
              title="Delete Trip"
              style={{ padding: '0.4rem 0.6rem', color: '#ef4444' }}
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;
