const crypto = require('crypto');
const Document = require('../models/Document');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { uploadDocument, deleteFile } = require('../services/cloudinaryService');
const { sendSuccess, sendCreated, sendPaginated, ApiError } = require('../utils/apiResponse');
const { addDays } = require('date-fns');

const getDocuments = async (req, res, next) => {
  try {
    const { category, search, sort = 'newest', familyMemberId, page = 1, limit = 100 } = req.query;

    const query = { userId: req.user._id };

    if (familyMemberId) {
      query.familyMemberId = familyMemberId;
    } else if (!req.query.includeFamily) {
      query.familyMemberId = null;
    }

    if (category && category !== 'all') query.category = category;

    if (search) {
      query.$text = { $search: search };
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      'name-asc': { name: 1 },
      'name-desc': { name: -1 },
      'size-asc': { size: 1 },
      'size-desc': { size: -1 },
    };

    const documents = await Document.find(query)
      .sort(sortMap[sort] || { createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    sendSuccess(res, documents);
  } catch (error) {
    next(error);
  }
};

const getDocument = async (req, res, next) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, userId: req.user._id });
    if (!doc) throw new ApiError(404, 'Document not found');

    await ActivityLog.log(req.user._id, 'view', 'document', doc._id, doc.name);
    sendSuccess(res, doc);
  } catch (error) {
    next(error);
  }
};

const uploadDocumentHandler = async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, 'No file provided');

    const { name, category, expiryDate, familyMemberId, notes, tags } = req.body;

    const uploaded = await uploadDocument(
      req.file.buffer,
      req.file.mimetype,
      req.user._id.toString()
    );

    const document = await Document.create({
      userId: req.user._id,
      familyMemberId: familyMemberId || null,
      name: name || req.file.originalname.replace(/\.[^/.]+$/, ''),
      category: category || 'others',
      fileUrl: uploaded.fileUrl,
      thumbnailUrl: uploaded.thumbnailUrl,
      publicId: uploaded.publicId,
      mimeType: req.file.mimetype,
      size: uploaded.size || req.file.size,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      notes,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : [],
    });

    // Update user storage
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { storageUsed: document.size || 0 },
    });

    await ActivityLog.log(req.user._id, 'upload', 'document', document._id, document.name, `Uploaded to ${category}`);

    sendCreated(res, document, 'Document uploaded successfully');
  } catch (error) {
    next(error);
  }
};

const updateDocument = async (req, res, next) => {
  try {
    const { name, category, expiryDate, notes, tags, pinLocked } = req.body;

    const doc = await Document.findOne({ _id: req.params.id, userId: req.user._id });
    if (!doc) throw new ApiError(404, 'Document not found');

    if (name !== undefined) doc.name = name;
    if (category !== undefined) doc.category = category;
    if (expiryDate !== undefined) doc.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (notes !== undefined) doc.notes = notes;
    if (tags !== undefined) doc.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
    if (pinLocked !== undefined) doc.pinLocked = pinLocked;

    await doc.save();

    await ActivityLog.log(req.user._id, 'update', 'document', doc._id, doc.name);
    sendSuccess(res, doc, 'Document updated');
  } catch (error) {
    next(error);
  }
};

const renameDocument = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) throw new ApiError(400, 'Name is required');

    const doc = await Document.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { name: name.trim() } },
      { new: true }
    );
    if (!doc) throw new ApiError(404, 'Document not found');

    await ActivityLog.log(req.user._id, 'rename', 'document', doc._id, doc.name, `Renamed to "${name}"`);
    sendSuccess(res, doc, 'Document renamed');
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, userId: req.user._id });
    if (!doc) throw new ApiError(404, 'Document not found');

    const docName = doc.name;
    const docSize = doc.size || 0;
    const publicId = doc.publicId;

    doc.isDeleted = true;
    await doc.save();

    // Delete from Cloudinary async (non-blocking)
    setImmediate(() => deleteFile(publicId, doc.mimeType === 'application/pdf' ? 'raw' : 'image'));

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { storageUsed: -docSize },
    });

    await ActivityLog.log(req.user._id, 'delete', 'document', doc._id, docName);
    sendSuccess(res, null, 'Document deleted');
  } catch (error) {
    next(error);
  }
};

const generateShareLink = async (req, res, next) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, userId: req.user._id });
    if (!doc) throw new ApiError(404, 'Document not found');

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = addDays(new Date(), 7);

    doc.shareToken = token;
    doc.shareTokenExpiry = expiry;
    await doc.save();

    const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/share/${token}`;

    await ActivityLog.log(req.user._id, 'share', 'document', doc._id, doc.name);
    sendSuccess(res, { shareUrl, expiresAt: expiry });
  } catch (error) {
    next(error);
  }
};

const getSharedDocument = async (req, res, next) => {
  try {
    const doc = await Document.findOne({
      shareToken: req.params.token,
      shareTokenExpiry: { $gt: new Date() },
    }).select('name fileUrl thumbnailUrl category mimeType size createdAt');

    if (!doc) throw new ApiError(404, 'Share link expired or invalid');
    sendSuccess(res, doc);
  } catch (error) {
    next(error);
  }
};

const searchDocuments = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q?.trim()) return sendSuccess(res, []);

    const documents = await Document.find({
      userId: req.user._id,
      $text: { $search: q },
    })
      .sort({ score: { $meta: 'textScore' } })
      .limit(50)
      .lean();

    sendSuccess(res, documents);
  } catch (error) {
    next(error);
  }
};

const getExpiringDocuments = async (req, res, next) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const documents = await Document.find({
      userId: req.user._id,
      expiryDate: { $lte: thirtyDaysFromNow, $gt: new Date(0) },
    })
      .sort({ expiryDate: 1 })
      .limit(20)
      .lean();

    sendSuccess(res, documents);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDocuments, getDocument, uploadDocumentHandler, updateDocument,
  renameDocument, deleteDocument, generateShareLink, getSharedDocument,
  searchDocuments, getExpiringDocuments,
};
