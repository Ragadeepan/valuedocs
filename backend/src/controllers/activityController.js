const ActivityLog = require('../models/ActivityLog');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');

const getActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      ActivityLog.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(skip)
        .lean(),
      ActivityLog.countDocuments({ userId: req.user._id }),
    ]);

    sendPaginated(res, logs, {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getActivityLogs };
