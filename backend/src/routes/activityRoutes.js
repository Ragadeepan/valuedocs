const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getActivityLogs);

module.exports = router;
