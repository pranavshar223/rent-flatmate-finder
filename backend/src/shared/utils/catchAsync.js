/**
 * Wrapper for async controllers to eliminate repetitive try-catch blocks.
 * Forwards unhandled promises directly to the global error middleware.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;
