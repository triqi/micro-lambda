/* istanbul ignore file */
import { STATUS_CODES } from 'http';

export function jsonError(res, error = {}) {
  const { name, message = STATUS_CODES[500] } = error;
  let status = 500;
  let errors = [];

  switch (name) {
    case 'RequestError':
      errors.push({
        status,
        title: message,
        meta: error.error,
      });
      break;
    case 'StatusCodeError':
      status = error.statusCode;
      if (error.error && Array.isArray(error.error.errors)) {
        errors = error.error.errors;
      } else {
        errors.push({
          status,
          title: message,
          meta: error.error,
        });
      }
      break;
    case 'HttpError':
      status = error.status;
      errors.push({ status, title: message, meta: error.details });
      break;
    case 'HttpValidationError':
      status = error.status;
      if (Array.isArray(error.details)) {
        errors = error.details.map(detail => ({
          status,
          title: detail.message || detail.title,
          meta: detail.context || detail.meta,
        }));
      } else {
        errors.push({ status, title: message, meta: error.details });
      }
      break;
    default:
      errors.push({ status, title: message });
  }

  res.status(status || 500).json({ errors });
}

export default class HttpError extends Error {
  constructor(message = STATUS_CODES[500], status = 500, details) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }

  static middleware() {
    return (req, res, next) => {
      if (!res.jsonError) {
        res.jsonError = error => jsonError(res, error);
      }

      next();
    };
  }
}

export class HttpValidationError extends HttpError {
  constructor(details) {
    super('Validation error', 400, details);
    this.name = 'HttpValidationError';
  }
}
