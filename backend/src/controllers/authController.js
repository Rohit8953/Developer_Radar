const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, confirmPassword, name } = req.body;
    // Validate required fields
    if (!email || !password || !confirmPassword || !name) {
      return next(new AppError('Please provide all required fields', 400));
    }

    const isUserExists = await User.findOne({ email });

    if (isUserExists) {
      return next(new AppError('User already exists', 400));
    }

    if (password !== confirmPassword) {
      return next(new AppError('Passwords do not match', 400));
    }

    const newUser = await User.create({
      email,
      password,
      name
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      statusCode: 201,
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new AppError('Incorrect email or password', 401));
    }

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user._id);

    res.status(200).json({
      statusCode: 200,
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (err) {
    next(err); // This will send the error to your global error handler
  }
};
