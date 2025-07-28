const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // ✅ fix here
  name: { type: String, required: true },
  profilePicture: {
    type: String,
    default: 'https://randomuser.me/api/portraits/women/33.jpg'
  },
  jobtitle: {
    type: String,
    default: 'Fullstack'
  },
  experience: {
    type: String,
    default: '2'
  },
  address: {
    type: String,
    default: 'Bihar'
  },
  skills: {
    type: [String],
    default: ["Reactjs", "Mongodb", "Nextjs"]
  },
  location: {
    type: { 
      type: String, 
      default: 'Point',
      enum: ['Point'] // Only allow Point type
    },
    coordinates: {
      type: [Number],
      default: [0, 0],  // Default coordinates [lng, lat]
      validate: {
        validator: function(v) {
          return Array.isArray(v) && 
                 v.length === 2 &&
                 v[0] >= -180 && v[0] <= 180 && // Longitude
                 v[1] >= -90 && v[1] <= 90;     // Latitude
        },
        message: props => `Invalid coordinates: ${props.value}`
      }
    },
    lastUpdated: { 
      type: Date, 
      default: Date.now 
    },
    accuracy: Number // Store accuracy in meters
  },
  online: { 
    type: Boolean, 
    default: false 
  },
  socketId: String,
}, { timestamps: true });

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ 'location.coordinates': '2dsphere' });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);