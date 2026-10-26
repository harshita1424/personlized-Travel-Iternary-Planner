import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, DollarSign, MapPin, Tag } from 'lucide-react';

const ActivityModal = ({ isOpen, onClose, onSave, activity = null, currentDay = 1 }) => {
  const [formData, setFormData] = useState({
    day_number: currentDay,
    time_slot: 'Morning',
    title: '',
    description: '',
    location: '',
    activity_type: 'Sightseeing',
    estimated_cost: 0,
    booking_tip: ''
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        day_number: activity.day_number || currentDay,
        time_slot: activity.time_slot || 'Morning',
        title: activity.title || '',
        description: activity.description || '',
        location: activity.location || '',
        activity_type: activity.activity_type || 'Sightseeing',
        estimated_cost: activity.estimated_cost || 0,
        booking_tip: activity.booking_tip || ''
      });
    } else {
      setFormData({
        day_number: currentDay,
        time_slot: 'Morning',
        title: '',
        description: '',
        location: '',
        activity_type: 'Sightseeing',
        estimated_cost: 0,
        booking_tip: ''
      });
    }
  }, [activity, currentDay, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      day_number: parseInt(formData.day_number, 10),
      estimated_cost: parseFloat(formData.estimated_cost) || 0
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
            {activity ? 'Edit Daily Activity' : 'Add Custom Activity'}
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Day Number</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={formData.day_number}
                onChange={(e) => setFormData({ ...formData, day_number: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time Slot</label>
              <select
                className="form-control"
                value={formData.time_slot}
                onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Activity Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Visit the Historic Louvre Museum"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Provide engaging details or highlights..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Location / Neighborhood</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 1st Arrondissement, Paris"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={formData.activity_type}
                onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
              >
                <option value="Sightseeing">Sightseeing</option>
                <option value="Dining">Dining</option>
                <option value="Attraction">Attraction</option>
                <option value="Nature">Nature</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Leisure">Leisure</option>
                <option value="Transport">Transport</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Estimated Cost ($ USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                value={formData.estimated_cost}
                onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Booking / Local Tip</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Book morning entry ticket"
                value={formData.booking_tip}
                onChange={(e) => setFormData({ ...formData, booking_tip: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {activity ? 'Save Changes' : 'Add Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityModal;
