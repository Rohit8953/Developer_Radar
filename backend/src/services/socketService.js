const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = (io) => {
  io.use(async (socket, next) => {
    try {
      // 1. Authenticate via JWT
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 2. Verify user exists
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error('User not found'));

      // 3. Attach user to socket
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(` User connected: ${socket.user.name} (${socket.id})`);

    try {
      // 1. Update user's connection status
      await User.findByIdAndUpdate(socket.user._id, {
        socketId: socket.id,
        online: true,
        lastActive: new Date()
      });

      // 2. Broadcast online status
      socket.broadcast.emit('user-online', { 
        userId: socket.user._id 
      });

      // 3. Location updates handler
      socket.on('update-location', async ({ lat, lng, accuracy }) => {
        try {
          const updatedUser = await User.findByIdAndUpdate(
            socket.user._id,
            {
              'location.coordinates': [lng, lat],
              'location.lastUpdated': new Date(),
              'location.accuracy': accuracy,
              online: true
            },
            { new: true }
          );

          // Broadcast to all except sender
          socket.broadcast.emit('location-updated', {
            userId: updatedUser._id,
            coordinates: updatedUser.location.coordinates,
            accuracy: updatedUser.location.accuracy,
            lastUpdated: updatedUser.location.lastUpdated
          });
        } catch (err) {
          console.error('Location update failed:', err);
        }
      });

      // 4. Disconnection handler
      socket.on('disconnect', async () => {
        console.log(`User disconnected: ${socket.user.name}`);
        await User.findByIdAndUpdate(socket.user._id, {
          online: false,
          socketId: null,
          lastActive: new Date()
        });
        io.emit('user-offline', { 
          userId: socket.user._id 
        });
      });

      // 5. Error handler
      socket.on('error', (err) => {
        console.error(`Socket error (${socket.user.name}):`, err);
      });

    } catch (err) {
      console.error('Connection setup failed:', err);
      socket.disconnect();
    }
  });
};