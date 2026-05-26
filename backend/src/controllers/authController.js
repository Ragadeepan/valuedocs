const admin = require('../config/firebase');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { sendSuccess, ApiError } = require('../utils/apiResponse');

const verifyAndCreateUser = async (req, res, next) => {
  try {
    const { token, displayName } = req.body;
    if (!token) throw new ApiError(400, 'Firebase token required');

    const decoded = await admin.auth().verifyIdToken(token);

    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email,
        displayName: displayName || decoded.name || decoded.email?.split('@')[0],
        photoURL: decoded.picture,
        provider: decoded.firebase?.sign_in_provider || 'password',
        lastLogin: new Date(),
      });
      await ActivityLog.log(user._id, 'login', 'user', user._id, 'Account Created', 'New account created');
    } else {
      user.lastLogin = new Date();
      if (decoded.picture && !user.photoURL) user.photoURL = decoded.picture;
      if (displayName && !user.displayName) user.displayName = displayName;
      await user.save();
    }

    sendSuccess(res, user.toSafeJSON(), 'Authentication successful');
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    sendSuccess(res, user.toSafeJSON());
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { displayName } = req.body;
    const update = {};
    if (displayName) update.displayName = displayName;

    const user = await User.findByIdAndUpdate(req.user._id, { $set: update }, { new: true, runValidators: true });
    sendSuccess(res, user.toSafeJSON(), 'Profile updated');
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyAndCreateUser, getProfile, updateProfile };
