const mongoose = require('mongoose');

const CATEGORIES = ['id-proof', 'banking', 'medical', 'education', 'insurance', 'property', 'vehicle', 'others'];

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    familyMemberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FamilyMember',
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: 'others',
      index: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: String,
    publicId: {
      type: String,
      required: true,
    },
    mimeType: String,
    size: Number,
    expiryDate: {
      type: Date,
      index: true,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    tags: [{ type: String, lowercase: true, trim: true }],
    extractedText: String,
    shareToken: String,
    shareTokenExpiry: Date,
    pinLocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

documentSchema.index({ userId: 1, category: 1 });
documentSchema.index({ userId: 1, createdAt: -1 });
documentSchema.index({ userId: 1, name: 'text', tags: 'text', extractedText: 'text' });
documentSchema.index({ shareToken: 1, shareTokenExpiry: 1 });
documentSchema.index({ expiryDate: 1 }, { sparse: true });

documentSchema.pre('find', function () {
  if (!this.getQuery().isDeleted) {
    this.where({ isDeleted: false });
  }
});

documentSchema.pre('findOne', function () {
  if (this.getQuery().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
});

module.exports = mongoose.model('Document', documentSchema);
