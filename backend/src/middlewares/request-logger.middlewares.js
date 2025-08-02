import logger from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log incoming request
  logger.http(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    user: req.user?.email
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`, {
      user: req.user?.email
    });
    originalEnd.call(this, chunk, encoding);
  };

  next();
};
