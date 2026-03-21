class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

class NotFoundError extends HttpError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

class ValidationError extends HttpError {
  constructor(message = 'Validation failed', details) {
    super(422, message, details);
  }
}

class ConflictError extends HttpError {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}

module.exports = {
  HttpError,
  NotFoundError,
  ValidationError,
  ConflictError,
};
