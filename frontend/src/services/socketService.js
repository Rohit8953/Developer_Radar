import { io } from 'socket.io-client';

let socket;

export const initializeSocket = (token, userId) => {
  socket = io(process.env.REACT_APP_BASE_URL, {
    query: { token, userId }
  });
  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error('Socket not initialized');
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};