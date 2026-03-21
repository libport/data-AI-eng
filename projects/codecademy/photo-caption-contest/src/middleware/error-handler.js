function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Validation failed',
      details: err.errors.map((e) => e.message)
    });
  }

  console.error(err);
  return res.status(err.status || 500).json({
    message: err.publicMessage || 'Internal server error'
  });
}

module.exports = errorHandler;
