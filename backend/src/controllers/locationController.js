const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.updateLocation = catchAsync(async (req, res, next) => {
  const { lat, lng, accuracy } = req.body;

  // 1) Validate coordinates
  if (
    typeof lat !== 'number' || 
    typeof lng !== 'number' ||
    lat < -90 || lat > 90 ||
    lng < -180 || lng > 180
  ) {
    return next(new AppError('Invalid coordinates provided', 400));
  }

  // 2) Validate accuracy (optional but recommended)
  // if (accuracy && (accuracy < 0 || accuracy > 10000)) {
  //   return next(new AppError('Invalid accuracy value', 400));
  // }

  // 3) Update user location
  const updateData = {
    'location.coordinates': [lng, lat],
    'location.lastUpdated': new Date(),
    'location.accuracy': accuracy || undefined, // Store if provided
    online: true
  };

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { 
      new: true,
      runValidators: true 
    }
  ).select('-password -__v');

  // 4) Broadcast real-time update (optimized payload)
  req.io.emit('location-update', {
    userId: user._id,
    coordinates: user.location.coordinates,
    accuracy: user.location.accuracy,
    lastUpdated: user.location.lastUpdated
  });

  // 5) Respond to client
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.getNearbyDevelopers = catchAsync(async (req, res, next) => {
  const { lat, lng, radius = 10, minAccuracy = 100 } = req.query;
  
  // 1) Validate inputs
  if (!lat || !lng) {
    return next(new AppError('Please provide latitude and longitude', 400));
  }

  // 2) Convert to numbers
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const radiusInMeters = parseFloat(radius) * 1000;
  const maxAccuracy = parseFloat(minAccuracy);

  // 3) Geo query with accuracy filtering
  const developers = await User.find({
    'location.coordinates': {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: radiusInMeters
      }
    },
    $or: [
      { 'location.accuracy': { $lte: maxAccuracy } },
      { 'location.accuracy': { $exists: false } }
    ],
    _id: { $ne: req.user.id }
  }).select('-password -__v -email');

  // 4) Respond with optimized data
  res.status(200).json({
    status: 'success',
    results: developers.length,
    data: {
      developers: developers.map(dev => ({
        _id: dev._id,
        name: dev.name,
        skills: dev.skills,
        location: dev.location,
        online: dev.online
      }))
    }
  });
});