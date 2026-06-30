exports.sendSuccess = (res, statusCode = 200, data = {}, message = 'Success') => {
  res.status(statusCode).json({ success: true, message, data });
};

exports.sendError = (res, statusCode = 500, message = 'Something went wrong') => {
  res.status(statusCode).json({ success: false, message });
};
