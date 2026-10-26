import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// 10 Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateTripPage from './pages/CreateTripPage';
import PreferencesPage from './pages/PreferencesPage';
import ItineraryPage from './pages/ItineraryPage';
import BudgetPage from './pages/BudgetPage';
import SavedTripsPage from './pages/SavedTripsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/trips/new" element={<CreateTripPage />} />
              <Route path="/trips/:id/preferences" element={<PreferencesPage />} />
              <Route path="/trips/:id/itinerary" element={<ItineraryPage />} />
              <Route path="/trips/:id/budget" element={<BudgetPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/trips" element={<SavedTripsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
