import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (token, userId, handlers) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(process.env.REACT_APP_BASE_URL, {
      query: { token, userId }
    });

    // Setup event handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      socketRef.current.on(event, handler);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token, userId]);

  const sendLocationUpdate = (lat, lng) => {
    if (socketRef.current) {
      socketRef.current.emit('update-location', { userId, lat, lng });
    }
  };

  return { sendLocationUpdate };
};