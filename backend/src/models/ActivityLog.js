const mongoose = require('mongoose');

const ACTIONS = ['upload', 'delete', 'update', 'share', 'view', 'rename', 'download', 'login', 'logout'];

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ACTIONS,
      required: true,
    },
    entityType: {
      type: String,
      enum: ['document', 'family_member', 'user'],
      required: true,
    },
    entityId: mongoose.Schema.Types.ObjectId,
    entityName: String,
    details: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ userId: 1, createdAt: -1 });

activityLogSchema.statics.log = async function (userId, action, entityType, entityId, entityName, details, metadata) {
  try {
    await this.create({ userId, action, entityType, entityId, entityName, details, metadata });
  } catch (err) {
    // Activity logging is non-critical; swallow errors
  }
};

module.exports = mongoose.model('ActivityLog', activityLogSchema);
