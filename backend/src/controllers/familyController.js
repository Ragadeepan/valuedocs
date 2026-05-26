const FamilyMember = require('../models/FamilyMember');
const Document = require('../models/Document');
const ActivityLog = require('../models/ActivityLog');
const { sendSuccess, sendCreated, ApiError } = require('../utils/apiResponse');

const getFamilyMembers = async (req, res, next) => {
  try {
    const members = await FamilyMember.find({ userId: req.user._id })
      .populate('documentCount')
      .sort({ createdAt: 1 })
      .lean({ virtuals: true });

    sendSuccess(res, members);
  } catch (error) {
    next(error);
  }
};

const getFamilyMember = async (req, res, next) => {
  try {
    const member = await FamilyMember.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('documentCount')
      .lean({ virtuals: true });

    if (!member) throw new ApiError(404, 'Family member not found');
    sendSuccess(res, member);
  } catch (error) {
    next(error);
  }
};

const addFamilyMember = async (req, res, next) => {
  try {
    const { name, relation, dob, notes } = req.body;
    if (!name?.trim()) throw new ApiError(400, 'Name is required');
    if (!relation) throw new ApiError(400, 'Relation is required');

    const member = await FamilyMember.create({
      userId: req.user._id,
      name: name.trim(),
      relation,
      dob: dob ? new Date(dob) : undefined,
      notes,
    });

    await ActivityLog.log(req.user._id, 'update', 'family_member', member._id, member.name, 'Family member added');
    sendCreated(res, member, 'Family member added');
  } catch (error) {
    next(error);
  }
};

const updateFamilyMember = async (req, res, next) => {
  try {
    const { name, relation, dob, notes } = req.body;

    const member = await FamilyMember.findOne({ _id: req.params.id, userId: req.user._id });
    if (!member) throw new ApiError(404, 'Family member not found');

    if (name) member.name = name.trim();
    if (relation) member.relation = relation;
    if (dob !== undefined) member.dob = dob ? new Date(dob) : null;
    if (notes !== undefined) member.notes = notes;

    await member.save();

    await ActivityLog.log(req.user._id, 'update', 'family_member', member._id, member.name);
    sendSuccess(res, member, 'Family member updated');
  } catch (error) {
    next(error);
  }
};

const deleteFamilyMember = async (req, res, next) => {
  try {
    const member = await FamilyMember.findOne({ _id: req.params.id, userId: req.user._id });
    if (!member) throw new ApiError(404, 'Family member not found');

    const memberName = member.name;

    await Document.updateMany({ familyMemberId: member._id, userId: req.user._id }, { $set: { isDeleted: true } });
    await member.deleteOne();

    await ActivityLog.log(req.user._id, 'delete', 'family_member', member._id, memberName, 'Family member and documents removed');
    sendSuccess(res, null, 'Family member deleted');
  } catch (error) {
    next(error);
  }
};

const getFamilyMemberDocuments = async (req, res, next) => {
  try {
    const member = await FamilyMember.findOne({ _id: req.params.id, userId: req.user._id });
    if (!member) throw new ApiError(404, 'Family member not found');

    const { category, search, sort = 'newest' } = req.query;
    const query = { userId: req.user._id, familyMemberId: req.params.id };
    if (category && category !== 'all') query.category = category;
    if (search) query.$text = { $search: search };

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      'name-asc': { name: 1 },
      'name-desc': { name: -1 },
    };

    const documents = await Document.find(query).sort(sortMap[sort] || { createdAt: -1 }).lean();
    sendSuccess(res, documents);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFamilyMembers, getFamilyMember, addFamilyMember,
  updateFamilyMember, deleteFamilyMember, getFamilyMemberDocuments,
};
