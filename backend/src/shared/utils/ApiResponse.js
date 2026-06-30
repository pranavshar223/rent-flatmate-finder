/**
 * Standard API Response utility to format all controller responses consistently.
 */
class ApiResponse {
  static success(res, statusCode, message, data = {}) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, statusCode, errorCode, message, details = []) {
    return res.status(statusCode).json({
      success: false,
      error: {
        code: errorCode,
        message,
        details,
      },
    });
  }
}

module.exports = ApiResponse;
