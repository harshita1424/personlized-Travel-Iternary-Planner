import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginAsDemo();
      navigate('/dashboard');
    } catch (err) {
      setError('Demo login failed. Please try again.');
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
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
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
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Welcome Back</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
            Log in to manage and view your personalized travel plans
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
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>or test instantly</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        {/* 1-Click Demo Login */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="btn btn-outline"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          disabled={loading}
        >
          <Sparkles size={16} color="#0284c7" /> Instant Demo Explorer Login
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748b', marginTop: '1.75rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#0284c7', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
