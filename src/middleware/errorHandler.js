const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { 
    error: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      stack: err.stack
    });
  }

  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong. Please try again later.'
  });
};

module.exports = errorHandler;
