const ApiResponse = require('../shared/utils/ApiResponse');

const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let errorCode = err.errorCode || 'INTERNAL_ERROR';
  let message = err.message || 'Something went wrong on the server.';
  let details = err.details || [];

  // Handle Prisma specific errors
  if (err.code === 'P2002') {
    statusCode = 409;
    errorCode = 'CONFLICT';
    message = 'A record with that unique field already exists.';
  }

  // Logging for server errors
  if (statusCode === 500 && process.env.NODE_ENV !== 'production') {
    console.error('[Error]:', err);
  } else if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal Server Error';
  }

  return ApiResponse.error(res, statusCode, errorCode, message, details);
};

module.exports = globalErrorHandler;
