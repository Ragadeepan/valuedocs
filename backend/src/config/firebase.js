const admin = require('firebase-admin');
const logger = require('../utils/logger');

let app;

const initializeFirebase = () => {
  if (admin.apps.length > 0) return admin.apps[0];

  if (!process.env.FIREBASE_PROJECT_ID) {
    logger.warn('Firebase credentials not configured — auth will not work until .env is set');
    return null;
  }

  try {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
      }),
    });
    logger.info('Firebase Admin initialized');
    return app;
  } catch (error) {
    logger.error('Firebase Admin initialization failed:', error.message);
    return null;
  }
};

initializeFirebase();

module.exports = admin;
