import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, PlusCircle, Bookmark, DollarSign, User, LogOut, Menu, X, Plane } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
            color: '#fff',
            borderRadius: '10px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Compass size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Travel<span style={{ color: '#0284c7' }}>AI</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Personalized Planner
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="nav-desktop">
          {user ? (
            <>
              <Link to="/dashboard" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive('/dashboard') ? '#0284c7' : '#475569',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                background: isActive('/dashboard') ? '#e0f2fe' : 'transparent',
                transition: 'all 0.2s'
              }}>
                <Compass size={17} /> Dashboard
              </Link>

              <Link to="/trips/new" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive('/trips/new') ? '#0284c7' : '#475569',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                background: isActive('/trips/new') ? '#e0f2fe' : 'transparent',
                transition: 'all 0.2s'
              }}>
                <PlusCircle size={17} /> Plan Trip
              </Link>

              <Link to="/trips" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive('/trips') ? '#0284c7' : '#475569',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                background: isActive('/trips') ? '#e0f2fe' : 'transparent',
                transition: 'all 0.2s'
              }}>
                <Bookmark size={17} /> My Trips
              </Link>

              <Link to="/budget" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive('/budget') ? '#0284c7' : '#475569',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                background: isActive('/budget') ? '#e0f2fe' : 'transparent',
                transition: 'all 0.2s'
              }}>
                <DollarSign size={17} /> Budget
              </Link>

              {/* Profile / User */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem' }}>
                <Link to="/profile" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#334155'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}>
                    {user.full_name ? user.full_name.charAt(0) : 'U'}
                  </div>
                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.full_name || 'Traveler'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  style={{
                    background: 'transparent',
                    color: '#94a3b8',
                    padding: '6px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
                >
                  <LogOut size={17} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'transparent', border: 'none', display: 'none' }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          padding: '1rem 1.5rem',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/trips/new" onClick={() => setMobileMenuOpen(false)}>Create New Trip</Link>
              <Link to="/trips" onClick={() => setMobileMenuOpen(false)}>Saved Trips</Link>
              <Link to="/budget" onClick={() => setMobileMenuOpen(false)}>Budget Overview</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>User Profile</Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn btn-danger btn-sm" style={{ width: '100%', marginTop: '0.5rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary">Log In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
