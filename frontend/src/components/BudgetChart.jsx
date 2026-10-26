import React from 'react';
import { AlertTriangle, CheckCircle, DollarSign, PieChart, TrendingUp, Plane, Home, Utensils, Compass, MoreHorizontal } from 'lucide-react';

const BudgetChart = ({ budget, totalTripBudget = 0 }) => {
  if (!budget) {
    return <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No budget data available.</div>;
  }

  const {
    transportation_cost = 0,
    accommodation_cost = 0,
    food_cost = 0,
    activities_cost = 0,
    miscellaneous_cost = 0,
    total_estimated = 0,
    remaining_budget = 0,
    is_over_budget = false,
    currency = 'USD'
  } = budget;

  const effectiveTotalBudget = totalTripBudget > 0 ? totalTripBudget : (total_estimated + remaining_budget);
  const percentUsed = effectiveTotalBudget > 0 ? Math.min(100, (total_estimated / effectiveTotalBudget) * 100) : 0;

  const categories = [
    { name: 'Accommodation', amount: accommodation_cost, color: '#0284c7', icon: Home },
    { name: 'Transportation', amount: transportation_cost, color: '#0ea5e9', icon: Plane },
    { name: 'Food & Dining', amount: food_cost, color: '#f59e0b', icon: Utensils },
    { name: 'Activities & Tours', amount: activities_cost, color: '#10b981', icon: Compass },
    { name: 'Miscellaneous', amount: miscellaneous_cost, color: '#8b5cf6', icon: MoreHorizontal }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Over-Budget Warning Banner */}
      {is_over_budget && (
        <div className="alert alert-warning animate-fade-in" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <AlertTriangle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem' }}>Budget Alert: Estimated Expenses Exceed Planned Budget!</strong>
            <span style={{ fontSize: '0.85rem' }}>
              Your estimated trip expenditure (${total_estimated.toLocaleString()}) exceeds the set budget (${effectiveTotalBudget.toLocaleString()}) by ${(total_estimated - effectiveTotalBudget).toLocaleString()} {currency}. Consider adjusting accommodation or activities.
            </span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Budget</span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            ${effectiveTotalBudget.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>{currency}</span>
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Target Trip Allocation</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Estimated Spent</span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            ${total_estimated.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>{currency}</span>
          </h3>
          <span style={{ fontSize: '0.8rem', color: is_over_budget ? '#dc2626' : '#10b981', fontWeight: 600 }}>
            {percentUsed.toFixed(1)}% of planned budget
          </span>
        </div>

        <div className="card" style={{ borderLeft: is_over_budget ? '4px solid #ef4444' : '4px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Remaining Balance</span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: is_over_budget ? '#ef4444' : '#10b981', marginTop: '0.25rem' }}>
            {remaining_budget < 0 ? `-$${Math.abs(remaining_budget).toLocaleString()}` : `$${remaining_budget.toLocaleString()}`}
          </h3>
          <span style={{ fontSize: '0.8rem', color: is_over_budget ? '#ef4444' : '#64748b' }}>
            {is_over_budget ? 'Budget deficit' : 'Available cushion'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Expense Allocation Overview</h4>
          <span className={`badge ${is_over_budget ? 'badge-red' : 'badge-green'}`}>
            {is_over_budget ? 'Over Budget' : 'Within Budget'}
          </span>
        </div>

        {/* Stacked bar */}
        <div style={{
          height: '24px',
          width: '100%',
          backgroundColor: '#e2e8f0',
          borderRadius: '9999px',
          display: 'flex',
          overflow: 'hidden',
          marginBottom: '1.5rem'
        }}>
          {categories.map((cat, idx) => {
            const width = total_estimated > 0 ? (cat.amount / total_estimated) * 100 : 0;
            if (width <= 0) return null;
            return (
              <div
                key={idx}
                title={`${cat.name}: $${cat.amount} (${width.toFixed(1)}%)`}
                style={{
                  width: `${width}%`,
                  backgroundColor: cat.color,
                  transition: 'width 0.3s ease'
                }}
              />
            );
          })}
        </div>

        {/* Detailed Category Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const catPercent = total_estimated > 0 ? ((cat.amount / total_estimated) * 100).toFixed(1) : 0;
            return (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: idx < categories.length - 1 ? '1px solid #f1f5f9' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: `${cat.color}20`,
                    color: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>{cat.name}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>{catPercent}% of total</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                    ${cat.amount.toLocaleString()}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8' }}>{currency}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;
