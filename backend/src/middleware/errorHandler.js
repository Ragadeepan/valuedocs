const logger = require('../utils/logger');
const { ApiError, sendError } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  if (err instanceof ApiError) {
    return sendError(res, err.message, err.statusCode, err.errors);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return sendError(res, 'Validation failed', 422, errors);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return sendError(res, `${field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Value'} already exists`, 409);
  }

  // Mongoose CastError (bad ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, 'Invalid ID format', 400);
  }

  // Default server error
  sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    err.statusCode || 500
  );
};

module.exports = errorHandler;
