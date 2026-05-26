const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const testConnection = async () => {
  try {
    await cloudinary.api.ping();
    logger.info('Cloudinary connected');
  } catch (error) {
    logger.error('Cloudinary connection failed:', error.message);
  }
};

if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

module.exports = cloudinary;
