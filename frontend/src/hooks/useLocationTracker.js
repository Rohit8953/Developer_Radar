import { useEffect } from 'react';
import socket from '../services/socket';
import api from '../services/api';

const useLocationTracker = () => {
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Optimized - only send if moved > 50m
        api.patch('/api/userLocation/me/location', {
          lat: latitude,
          lng: longitude,
          accuracy
        });
        
        // Real-time via Socket.IO
        socket.emit('location-update', {
          lat: latitude,
          lng: longitude,
          accuracy
        });
      },
      (error) => {
        console.error("Location error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000, // 10s cache
        timeout: 15000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);
};

export default useLocationTracker;