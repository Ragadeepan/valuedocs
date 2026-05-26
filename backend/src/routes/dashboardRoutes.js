const express = require('express');
const router = express.Router();
const { getDashboardStats, getStorageStats, getCategoryStats, getUploadTrend } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

router.get('/stats', authenticate, getDashboardStats);
router.get('/storage', authenticate, getStorageStats);
router.get('/categories', authenticate, getCategoryStats);
router.get('/uploads', authenticate, getUploadTrend);

module.exports = router;
