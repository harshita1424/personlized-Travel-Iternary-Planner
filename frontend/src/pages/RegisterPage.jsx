import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, fullName);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 140px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      background: 'linear-gradient(180deg, #f0f9ff 0%, #f8fafc 100%)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '460px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
            color: '#fff',
            borderRadius: '12px',
            width: '48px',
            height: '48px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <Compass size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Create Traveler Account</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
            Start crafting AI-powered personalized travel itineraries
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Jordan Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={16} />
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748b', marginTop: '1.75rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#0284c7', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
