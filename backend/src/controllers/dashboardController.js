const Document = require('../models/Document');
const FamilyMember = require('../models/FamilyMember');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const { sendSuccess } = require('../utils/apiResponse');
const { subDays, format, eachDayOfInterval } = require('date-fns');

const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalDocuments, familyMembers, user, expiringCount] = await Promise.all([
      Document.countDocuments({ userId, familyMemberId: null }),
      FamilyMember.countDocuments({ userId }),
      User.findById(userId).select('storageUsed').lean(),
      Document.countDocuments({
        userId,
        expiryDate: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), $gt: new Date() },
      }),
    ]);

    sendSuccess(res, {
      totalDocuments,
      familyMembers,
      storageUsed: user?.storageUsed || 0,
      expiringSoon: expiringCount,
    });
  } catch (error) {
    next(error);
  }
};

const getStorageStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('storageUsed').lean();
    sendSuccess(res, {
      used: user?.storageUsed || 0,
      limit: 1024 * 1024 * 1024,
      percentage: ((user?.storageUsed || 0) / (1024 * 1024 * 1024)) * 100,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryStats = async (req, res, next) => {
  try {
    const stats = await Document.aggregate([
      { $match: { userId: req.user._id, isDeleted: false } },
      { $group: { _id: '$category', value: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', value: 1 } },
      { $sort: { value: -1 } },
    ]);

    sendSuccess(res, stats);
  } catch (error) {
    next(error);
  }
};

const getUploadTrend = async (req, res, next) => {
  try {
    const { period = '7d' } = req.query;
    const days = period === '90d' ? 90 : period === '30d' ? 30 : 7;

    const startDate = subDays(new Date(), days - 1);
    const dateRange = eachDayOfInterval({ start: startDate, end: new Date() });

    const uploads = await Document.aggregate([
      {
        $match: {
          userId: req.user._id,
          isDeleted: false,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          uploads: { $sum: 1 },
        },
      },
    ]);

    const uploadMap = Object.fromEntries(uploads.map((u) => [u._id, u.uploads]));

    const trend = dateRange.map((date) => ({
      date: format(date, 'MMM dd'),
      uploads: uploadMap[format(date, 'yyyy-MM-dd')] || 0,
    }));

    sendSuccess(res, trend);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getStorageStats, getCategoryStats, getUploadTrend };
