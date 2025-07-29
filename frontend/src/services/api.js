import axios from 'axios';
import { showErrorToast } from '../utils/toast';

// 1. Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:5000',
  timeout: 10000, // 10 second timeout
});

// 2. Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 3. Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      const message = error.response.data?.message || 'An error occurred';
      showErrorToast(message);
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Redirect to login if unauthorized
        window.location.href = '/Auth';
      }
    } else if (error.request) {
      // Request was made but no response received
      showErrorToast('Network error - please check your connection');
    } else {
      // Something happened in setting up the request
      showErrorToast('Request error - please try again');
    }
    
    return Promise.reject(error);
  }
);

// 4. API methods
export const getDevelopersNearby = async (lat, lng, radius = 10) => {
  try {
    const response = await api.get('/developers/nearby', {
      params: { lat, lng, radius }
    });
    return response.data;
  } catch (error) {
    throw error; // Error already handled by interceptor
  }
};

export const updateLocation = async (lat, lng, accuracy) => {
  try {
    const response = await api.patch('/api/userLocation/me/location', { 
      lat, 
      lng,
      accuracy 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 5. Default export
export default api;