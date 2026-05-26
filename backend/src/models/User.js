const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    photoURL: String,
    provider: {
      type: String,
      enum: ['google.com', 'password'],
      default: 'password',
    },
    storageUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    preferences: {
      theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
      notifications: { type: Boolean, default: true },
      pinLockEnabled: { type: Boolean, default: false },
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('documentCount', {
  ref: 'Document',
  localField: '_id',
  foreignField: 'userId',
  count: true,
});

userSchema.methods.toSafeJSON = function () {
  const obj = this.toJSON();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
