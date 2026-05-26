const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const uploadBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'valuedocs',
        resource_type: 'auto',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadDocument = async (buffer, mimetype, userId, options = {}) => {
  const isPDF = mimetype === 'application/pdf';
  const isImage = mimetype.startsWith('image/');

  const uploadOptions = {
    folder: `valuedocs/${userId}`,
    resource_type: isPDF ? 'raw' : 'image',
    allowed_formats: isPDF ? ['pdf'] : ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic'],
    ...options,
  };

  if (isImage) {
    uploadOptions.transformation = [
      { quality: 'auto:good', fetch_format: 'auto' },
    ];
  }

  const result = await uploadBuffer(buffer, uploadOptions);

  let thumbnailUrl = null;
  if (isPDF) {
    thumbnailUrl = cloudinary.url(result.public_id, {
      resource_type: 'image',
      format: 'jpg',
      page: 1,
      transformation: [{ width: 400, height: 300, crop: 'fill', quality: 'auto' }],
    });
  } else if (isImage) {
    thumbnailUrl = cloudinary.url(result.public_id, {
      width: 400,
      height: 300,
      crop: 'fill',
      quality: 'auto:eco',
      fetch_format: 'auto',
    });
  }

  return {
    fileUrl: result.secure_url,
    publicId: result.public_id,
    thumbnailUrl,
    size: result.bytes,
    format: result.format,
  };
};

const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    // Non-critical, log but don't throw
    console.error('Cloudinary delete error:', error.message);
  }
};

const generateSignedUrl = (publicId, expiresAt) => {
  return cloudinary.url(publicId, {
    secure: true,
    sign_url: true,
    expire_at: Math.floor(expiresAt.getTime() / 1000),
  });
};

module.exports = { uploadDocument, deleteFile, generateSignedUrl };
