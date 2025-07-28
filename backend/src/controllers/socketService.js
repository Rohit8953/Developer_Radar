const User = require('../models/User');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    console.log('New client connected:', socket.id);
    
    // Associate socket ID with user
    if (socket.handshake.query.token) {
      try {
        const user = await User.findById(socket.handshake.query.userId);
        if (user) {
          user.socketId = socket.id;
          user.online = true;
          await user.save();
          
          // Notify others this user is online
          socket.broadcast.emit('userOnline', { userId: user._id });
        }
      } catch (err) {
        console.error('Socket connection error:', err);
      }
    }

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log('Client disconnected:', socket.id);
      const user = await User.findOne({ socketId: socket.id });
      if (user) {
        user.online = false;
        user.socketId = null;
        await user.save();
        
        // Notify others this user is offline
        socket.broadcast.emit('userOffline', { userId: user._id });
      }
    });

    // Handle location updates in real-time
    socket.on('location-update', async (data) => {
      try {
        const { userId, lat, lng } = data;
        console.log("real time tracking location📍", userId, lat, lng)
        const user = await User.findByIdAndUpdate(
          userId,
          {
            'location.coordinates': [lng, lat],
            'location.lastUpdated': new Date(),
            online: true
          },
          { new: true }
        );

        // Broadcast to all clients except sender
        socket.broadcast.emit('location-update', {
          userId: user._id,
          location: user.location,
          online: user.online
        });
      } catch (err) {
        console.error('Location update error:', err);
      }
    });
  });
};