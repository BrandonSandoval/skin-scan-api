const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Authentication middleware
 * Validates Bearer token and enforces expiration
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.logValidationFailure('/api/*', 'Missing or malformed Authorization header', {
            ip: req.ip,
            path: req.path,
        });
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Ensure JWT_SECRET is configured
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        logger.error('JWT_SECRET not configured', { context: 'authMiddleware' });
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        // jwt.verify automatically checks expiration (exp claim)
        const decoded = jwt.verify(token, jwtSecret, {
            algorithms: ['HS256'], // Restrict to expected algorithm
        });

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            logger.logAuthEvent('TOKEN_EXPIRED', error.decoded?.userId, 'EXPIRED', {
                expiredAt: error.expiredAt,
                ip: req.ip,
            });
            return res.status(401).json({ error: 'Token expired' });
        }

        if (error.name === 'JsonWebTokenError') {
            logger.logAuthEvent('INVALID_TOKEN', null, 'INVALID', {
                reason: error.message,
                ip: req.ip,
            });
            return res.status(401).json({ error: 'Invalid token' });
        }

        logger.error('Authentication error', {
            error: error.message,
            ip: req.ip,
            path: req.path,
        });
        return res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = authMiddleware;
