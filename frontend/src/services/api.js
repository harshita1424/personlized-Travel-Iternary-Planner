import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('travel_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Trips API
export const tripsApi = {
  getTrips: () => api.get('/trips/'),
  getTrip: (id) => api.get(`/trips/${id}`),
  createTrip: (data) => api.post('/trips/', data),
  updateTrip: (id, data) => api.put(`/trips/${id}`, data),
  deleteTrip: (id) => api.delete(`/trips/${id}`),
  getDashboardStats: () => api.get('/trips/stats/dashboard'),
};

// Preferences API
export const preferencesApi = {
  getPreferences: (tripId) => api.get(`/preferences/${tripId}`),
  savePreferences: (tripId, data) => api.post(`/preferences/${tripId}`, data),
};

// Itinerary API
export const itineraryApi = {
  getItinerary: (tripId) => api.get(`/itineraries/${tripId}`),
  generateItinerary: (tripId, data = {}) => api.post(`/itineraries/${tripId}/generate`, data),
  addActivity: (itineraryId, activityData) => api.post(`/itineraries/${itineraryId}/activities`, activityData),
  updateActivity: (activityId, activityData) => api.put(`/itineraries/activities/${activityId}`, activityData),
  deleteActivity: (activityId) => api.delete(`/itineraries/activities/${activityId}`),
};

// Budget API
export const budgetApi = {
  getBudget: (tripId) => api.get(`/budget/${tripId}`),
  updateBudget: (tripId, data) => api.put(`/budget/${tripId}`, data),
};

// Recommendations API
export const recommendationsApi = {
  getRecommendations: (params) => api.get('/recommendations/', { params }),
};

export default api;
