const express = require('express');
const router = express.Router();
const {
  getFamilyMembers, getFamilyMember, addFamilyMember,
  updateFamilyMember, deleteFamilyMember, getFamilyMemberDocuments,
} = require('../controllers/familyController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getFamilyMembers);
router.post('/', authenticate, addFamilyMember);
router.get('/:id', authenticate, getFamilyMember);
router.put('/:id', authenticate, updateFamilyMember);
router.delete('/:id', authenticate, deleteFamilyMember);
router.get('/:id/documents', authenticate, getFamilyMemberDocuments);

module.exports = router;
