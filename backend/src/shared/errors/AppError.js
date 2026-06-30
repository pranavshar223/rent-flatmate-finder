/**
 * Base custom error class.
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode = 'INTERNAL_ERROR', details = []) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true; // True for expected errors (e.g., Validation), false for programming bugs

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
