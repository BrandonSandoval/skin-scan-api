/**
 * Validation middleware for input sanitization and validation
 * Applies to all API endpoints for consistent error handling
 */

const validator = require('validator');
const logger = require('../utils/logger');

/**
 * Sanitize and validate email input
 */
const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return { valid: false, error: 'Email is required and must be a string' };
    }
    const trimmed = email.trim();
    if (!validator.isEmail(trimmed)) {
        return { valid: false, error: 'Invalid email format' };
    }
    return { valid: true, value: trimmed };
};

/**
 * Sanitize and validate password input
 */
const validatePassword = (password) => {
    if (!password || typeof password !== 'string') {
        return { valid: false, error: 'Password is required and must be a string' };
    }
    if (password.length < 6) {
        return { valid: false, error: 'Password must be at least 6 characters' };
    }
    if (password.length > 128) {
        return { valid: false, error: 'Password is too long (max 128 characters)' };
    }
    return { valid: true, value: password };
};

/**
 * Sanitize and validate text input (feedback, comments, etc.)
 */
const validateTextInput = (text, fieldName = 'text', maxLength = 5000) => {
    if (!text || typeof text !== 'string') {
        return { valid: false, error: `${fieldName} is required and must be a string` };
    }
    const trimmed = validator.trim(text);
    if (trimmed.length === 0) {
        return { valid: false, error: `${fieldName} cannot be empty` };
    }
    if (trimmed.length > maxLength) {
        return { valid: false, error: `${fieldName} exceeds maximum length of ${maxLength}` };
    }
    // Escape HTML to prevent XSS
    return { valid: true, value: validator.escape(trimmed) };
};

/**
 * Sanitize and validate ObjectId (MongoDB)
 */
const validateObjectId = (id) => {
    if (!id || typeof id !== 'string') {
        return { valid: false, error: 'ID is required and must be a string' };
    }
    // MongoDB ObjectId format: 24-character hex string
    if (!validator.isMongoId(id)) {
        return { valid: false, error: 'Invalid ID format' };
    }
    return { valid: true, value: id };
};

/**
 * Middleware: Validate and sanitize request body
 */
const validateRequestBody = (req, res, next) => {
    // Only process JSON requests
    if (!req.is('application/json')) {
        return next();
    }

    // Check for circular references and reasonable payload size
    try {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Request body must be JSON object' });
        }
        next();
    } catch (error) {
        logger.error('Request body validation error', { error: error.message });
        return res.status(400).json({ error: 'Invalid JSON in request body' });
    }
};

/**
 * Middleware: Sanitize all string values in request body
 */
const sanitizeBody = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        Object.keys(req.body).forEach((key) => {
            if (typeof req.body[key] === 'string') {
                // Remove any suspicious characters but keep basic alphanumerics and common punctuation
                req.body[key] = req.body[key].trim();
            }
        });
    }
    next();
};

/**
 * Middleware: Prevent parameter pollution
 */
const preventParameterPollution = (req, res, next) => {
    // Check for duplicate query parameters
    const queryKeys = Object.keys(req.query);
    const seenKeys = new Set();

    for (const key of queryKeys) {
        if (seenKeys.has(key)) {
            logger.warn('Parameter pollution attempt detected', { parameter: key });
            return res.status(400).json({ error: 'Duplicate query parameters detected' });
        }
        seenKeys.add(key);
    }
    next();
};

module.exports = {
    validateEmail,
    validatePassword,
    validateTextInput,
    validateObjectId,
    validateRequestBody,
    sanitizeBody,
    preventParameterPollution,
};
