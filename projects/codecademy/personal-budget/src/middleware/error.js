const { HttpError } = require('../utils/httpErrors');

function notFound(_req, _res, next) {
  next(new HttpError(404, 'Route not found'));
}

// Central error handler.
function errorHandler(err, _req, res, _next) {
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  const payload = {
    error: {
      message: status === 500 ? 'Internal Server Error' : (err.message || 'Error'),
      status,
    },
  };
  if (err.details) payload.error.details = err.details;

  // Avoid leaking stack traces in production.
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.error.stack = err.stack;
  }

  res.status(status).json(payload);
}

module.exports = { notFound, errorHandler };
