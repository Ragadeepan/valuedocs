const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/documents', require('./documentRoutes'));
router.use('/family', require('./familyRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/activity', require('./activityRoutes'));

module.exports = router;
