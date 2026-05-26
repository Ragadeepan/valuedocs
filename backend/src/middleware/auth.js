const admin = require('../config/firebase');
const User = require('../models/User');
const { ApiError } = require('../utils/apiResponse');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError(401, 'No authentication token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(token);

    const user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      throw new ApiError(401, 'User not found. Please login again.');
    }

    req.user = user;
    req.firebaseUser = decoded;
    next();
  } catch (error) {
    if (error instanceof ApiError) return next(error);

    if (error.code === 'auth/id-token-expired') {
      return next(new ApiError(401, 'Session expired. Please login again.'));
    }
    if (error.code?.startsWith('auth/')) {
      return next(new ApiError(401, 'Invalid authentication token'));
    }

    next(new ApiError(401, 'Authentication failed'));
  }
};

module.exports = { authenticate };
