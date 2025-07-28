const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes');
const setupSocket = require('./services/socketService');
const AppError = require('./utils/appError');
// const connectionRoutes = require('./routes/connectionRoutes')
require('dotenv').config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// ✅ Use CORS middleware properly
app.use(cors({
  origin: 'http://localhost:3000', // your frontend origin
  credentials: true, // allow credentials like cookies or Authorization headers
}));

// Initialize Socket.IO
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST'],
    credentials: true
  }
});
console.log('Socket.IO initialized');
// Connect to database
connectDB();

// // Middlewares
// app.use(cors({
//   origin: process.env.CLIENT_URL
// }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Socket.IO middleware to attach io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/userLocation', locationRoutes);
// app.use('/api/v1/connections', connectionRoutes);
// Error handling middleware
// app.use(errorHandler);

// Setup Socket.IO
setupSocket(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🤘 Server running on port ${PORT}`);
});

// // ❌ Invalid routes fallback
// app.all('*', (req, res, next) => {
//   console.log(`Can't find ${req.originalUrl} on this server`, 404);
// });


// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection: ❌', err);
  server.close(() => process.exit(1));
});


// ✅ Global error handler — very last middleware
app.use((err, req, res, next) => {
  console.error('ERROR 💥', err);

  res.status(err.statusCode || 500).json({
    statusCode : err.statusCode || 500,
    status: err.status || 'error',
    message: err.message || 'Internal Server Error',
  });
});