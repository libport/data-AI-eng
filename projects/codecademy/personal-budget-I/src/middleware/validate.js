const { ValidationError } = require('../utils/httpErrors');

/**
 * Validate part of the request using a Zod schema.
 * If validation passes, the parsed data replaces the original.
 */
function validate(schema, where = 'body') {
  return (req, _res, next) => {
    const target = req[where];
    const result = schema.safeParse(target);

    if (!result.success) {
      return next(new ValidationError('Invalid request', result.error.flatten()));
    }

    req[where] = result.data;
    return next();
  };
}

module.exports = { validate };
