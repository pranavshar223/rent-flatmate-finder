const { ValidationError } = require('../shared/errors');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    const errorDetails = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    next(new ValidationError('Invalid input data', errorDetails));
  }
};

module.exports = validate;
