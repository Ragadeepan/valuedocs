const express = require('express');
const router = express.Router();
const {
  getDocuments, getDocument, uploadDocumentHandler, updateDocument,
  renameDocument, deleteDocument, generateShareLink, getSharedDocument,
  searchDocuments, getExpiringDocuments,
} = require('../controllers/documentController');
const { authenticate } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');
const rateLimiter = require('../middleware/rateLimiter');

router.get('/search', authenticate, searchDocuments);
router.get('/expiring', authenticate, getExpiringDocuments);
router.get('/share/:token', getSharedDocument);

router.get('/', authenticate, getDocuments);
router.get('/:id', authenticate, getDocument);
router.post('/upload', authenticate, rateLimiter.upload, upload.single('file'), handleMulterError, uploadDocumentHandler);
router.put('/:id', authenticate, updateDocument);
router.patch('/:id/rename', authenticate, renameDocument);
router.delete('/:id', authenticate, deleteDocument);
router.post('/:id/share', authenticate, generateShareLink);

module.exports = router;
