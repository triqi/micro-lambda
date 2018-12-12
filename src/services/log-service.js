/* istanbul ignore file */
import uuidV4 from 'uuid/v4';

export default class LogService {
  constructor({ cid, logLevels, context, log } = {}) {
    this.cid = cid || uuidV4();
    this.logLevels =
      logLevels || process.env.LOG_LEVELS ? process.env.LOG_LEVELS.split(',').map(x => x.toUpperCase()) : [];
    this.context = {
      cid: this.cid,
      service: process.env.AWS_LAMBDA_FUNCTION_NAME,
      version: process.env.AWS_LAMBDA_FUNCTION_VERSION,
      ...context,
    };
    this.logger = log || console;
  }

  log(level, message, ...data) {
    const log = {
      ...this.context,
      level,
      message,
      data: data.map(entry =>
        entry instanceof Error
          ? {
              name: entry.name,
              message: entry.message,
              stack: entry.stack,
              ...entry,
            }
          : entry,
      ),
    };
    this.logger.log(JSON.stringify(log));
  }

  verbose(message, ...data) {
    if (this.logLevels.includes('VERBOSE')) {
      this.log('verbose', message, ...data);
    }
  }

  debug(message, ...data) {
    if (this.logLevels.includes('DEBUG')) {
      this.log('debug', message, ...data);
    }
  }

  info(message, ...data) {
    this.log('info', message, ...data);
  }

  warn(message, ...data) {
    this.log('warn', message, ...data);
  }

  error(message, ...data) {
    this.log('error', message, ...data);
  }

  fatal(message, ...data) {
    this.log('fatal', message, ...data);
  }

  static middleware({ header, query } = {}) {
    return (req, res, next) => {
      const headerKey = header || 'x-correlation-id';
      const queryKey = query || 'cid';

      let cid;

      if (req.get(headerKey)) {
        // Try to read the cid from the header
        cid = req.get(headerKey);
      } else if (req.query[queryKey]) {
        // Else try to read the cid from the query string
        cid = req.query[queryKey];
      }

      // No cid found, generate a new one
      if (!cid) cid = uuidV4();

      // Set the cid into the request context
      req.cid = cid;

      // Set the cid into the response header
      res.set(headerKey, cid);

      if (!req.log) {
        req.log = new LogService({ cid });
      }

      next();
    };
  }

  static errorMiddleware() {
    return (error, req, res, next) => {
      const { log = new LogService({ cid: req.cid }) } = req;

      log.error('Request processing error', error, {
        host: req.get('host'),
        path: req.path,
        query: req.query,
        headers: req.headers,
      });

      // Catch invalid JSON error thrown from body parser
      if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        res.status(400).json({
          errors: [
            {
              status: 400,
              title: `Invalid JSON - ${error.message}`,
            },
          ],
        });
      } else {
        res.status(500).json({
          errors: [
            {
              status: 500,
              title: 'Internal Server Error',
              meta: { cid: log.cid },
            },
          ],
        });
      }

      next();
    };
  }
}
