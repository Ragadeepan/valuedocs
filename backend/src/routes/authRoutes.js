const express = require('express');
const router = express.Router();
const { verifyAndCreateUser, getProfile, updateProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/verify', verifyAndCreateUser);
router.get('/me', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

module.exports = router;
