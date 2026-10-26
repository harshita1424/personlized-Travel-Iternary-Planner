import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DollarSign, ArrowLeft, Save, AlertTriangle, TrendingUp, Compass, Edit3 } from 'lucide-react';
import { tripsApi, budgetApi } from '../services/api';
import BudgetChart from '../components/BudgetChart';

const BudgetPage = () => {
  const { id } = useParams();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(id || '');
  const [trip, setTrip] = useState(null);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    transportation_cost: 0,
    accommodation_cost: 0,
    food_cost: 0,
    activities_cost: 0,
    miscellaneous_cost: 0
  });

  // Load all user trips to allow trip switching
  useEffect(() => {
    const loadTrips = async () => {
      try {
        const res = await tripsApi.getTrips();
        setTrips(res.data);
        if (!selectedTripId && res.data.length > 0) {
          setSelectedTripId(res.data[0].id);
        }
      } catch (err) {
        console.error("Failed to load trips for budget page:", err);
      }
    };
    loadTrips();
  }, []);

  // Load budget for selected trip
  useEffect(() => {
    if (!selectedTripId) return;

    const loadBudget = async () => {
      setLoading(true);
      try {
        const [tripRes, budgetRes] = await Promise.all([
          tripsApi.getTrip(selectedTripId),
          budgetApi.getBudget(selectedTripId)
        ]);
        setTrip(tripRes.data);
        setBudget(budgetRes.data);
        setFormValues({
          transportation_cost: budgetRes.data.transportation_cost || 0,
          accommodation_cost: budgetRes.data.accommodation_cost || 0,
          food_cost: budgetRes.data.food_cost || 0,
          activities_cost: budgetRes.data.activities_cost || 0,
          miscellaneous_cost: budgetRes.data.miscellaneous_cost || 0
        });
      } catch (err) {
        console.error("Failed to fetch budget:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBudget();
  }, [selectedTripId]);

  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    try {
      const res = await budgetApi.updateBudget(selectedTripId, {
        transportation_cost: parseFloat(formValues.transportation_cost) || 0,
        accommodation_cost: parseFloat(formValues.accommodation_cost) || 0,
        food_cost: parseFloat(formValues.food_cost) || 0,
        activities_cost: parseFloat(formValues.activities_cost) || 0,
        miscellaneous_cost: parseFloat(formValues.miscellaneous_cost) || 0
      });
      setBudget(res.data);
      setEditing(false);
    } catch (err) {
      alert("Failed to update budget");
    }
  };

  return (
    <div style={{ padding: '2.5rem 0', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Budget Management</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Track categorized expenditures, identify savings, and prevent overspending.
            </p>
          </div>

          {/* Trip Selector */}
          {trips.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Select Trip:</span>
              <select
                className="form-control"
                style={{ width: 'auto' }}
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
              >
                {trips.map(t => (
                  <option key={t.id} value={t.id}>{t.title || t.destination}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
            <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '1rem' }}>
              <Compass size={36} color="#0284c7" />
            </div>
            <p>Loading budget breakdown...</p>
          </div>
        ) : !budget ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>No trip selected or budget details not available.</p>
            <Link to="/trips/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create a Trip</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2rem' }}>
            {/* Left: Charts and Summary */}
            <div>
              <BudgetChart budget={budget} totalTripBudget={trip?.total_budget} />
            </div>

            {/* Right: Category Adjuster */}
            <div>
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>Expense Allocations</h3>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="btn btn-outline btn-sm"
                  >
                    <Edit3 size={15} /> {editing ? 'Cancel' : 'Edit Allocations'}
                  </button>
                </div>

                <form onSubmit={handleUpdateBudget}>
                  <div className="form-group">
                    <label className="form-label">Accommodation ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      disabled={!editing}
                      value={formValues.accommodation_cost}
                      onChange={(e) => setFormValues({ ...formValues, accommodation_cost: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Transportation ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      disabled={!editing}
                      value={formValues.transportation_cost}
                      onChange={(e) => setFormValues({ ...formValues, transportation_cost: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Food & Dining ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      disabled={!editing}
                      value={formValues.food_cost}
                      onChange={(e) => setFormValues({ ...formValues, food_cost: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Activities & Experiences ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      disabled={!editing}
                      value={formValues.activities_cost}
                      onChange={(e) => setFormValues({ ...formValues, activities_cost: e.target.value })}
                    />
                    <small style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      Automatically recalculated when daily itinerary activities are adjusted.
                    </small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Miscellaneous ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      disabled={!editing}
                      value={formValues.miscellaneous_cost}
                      onChange={(e) => setFormValues({ ...formValues, miscellaneous_cost: e.target.value })}
                    />
                  </div>

                  {editing && (
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem' }}>
                      <Save size={16} /> Save Budget Changes
                    </button>
                  )}
                </form>

                {/* Traveler Cost Sharing breakdown */}
                {trip && trip.number_of_travelers > 1 && (
                  <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                      Group Expense Breakdown ({trip.number_of_travelers} Travelers)
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569' }}>
                      <span>Estimated Cost Per Person:</span>
                      <strong style={{ color: '#0284c7' }}>
                        ${(budget.total_estimated / trip.number_of_travelers).toFixed(2)} USD
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetPage;
