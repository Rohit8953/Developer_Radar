import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_BASE_URL, {
  auth: {
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId')?._id
  },
  reconnectionAttempts: 5,
  reconnectionDelay: 3000
});

export default socket;