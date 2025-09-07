// backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: "Too many requests from this IP, please try again later."
});

// Disable rate limiting during test environment
if (process.env.NODE_ENV === 'test') {
  module.exports = (req, res, next) => next();
} else {
  module.exports = authLimiter;
}
