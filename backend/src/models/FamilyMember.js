const mongoose = require('mongoose');

const RELATIONS = ['Self', 'Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Other'];

const familyMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    relation: {
      type: String,
      enum: RELATIONS,
      required: true,
    },
    dob: Date,
    photoURL: String,
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

familyMemberSchema.virtual('documentCount', {
  ref: 'Document',
  localField: '_id',
  foreignField: 'familyMemberId',
  count: true,
  match: { isDeleted: false },
});

familyMemberSchema.index({ userId: 1, name: 1 });

module.exports = mongoose.model('FamilyMember', familyMemberSchema);
