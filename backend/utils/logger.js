/**
 * Centralized logging utility for security events and general logging
 * Logs to console with structured format
 * In production, can be extended to send logs to external services
 */

const LOG_LEVELS = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG',
};

const getTimestamp = () => new Date().toISOString();

const logEntry = (level, message, metadata = {}) => {
    const entry = {
        timestamp: getTimestamp(),
        level,
        message,
        ...metadata,
    };

    const logOutput = `[${entry.timestamp}] [${level}] ${message}`;

    // eslint-disable-next-line no-console
    if (Object.keys(metadata).length > 0) {
        // eslint-disable-next-line no-console
        if (level === LOG_LEVELS.ERROR) {
            console.error(logOutput, metadata);
        } else if (level === LOG_LEVELS.WARN) {
            console.warn(logOutput, metadata);
        } else if (level === LOG_LEVELS.INFO) {
            console.info(logOutput, metadata);
        } else {
            console.log(logOutput, metadata);
        }
    } else {
        // eslint-disable-next-line no-console
        if (level === LOG_LEVELS.ERROR) {
            console.error(logOutput);
        } else if (level === LOG_LEVELS.WARN) {
            console.warn(logOutput);
        } else if (level === LOG_LEVELS.INFO) {
            console.info(logOutput);
        } else {
            console.log(logOutput);
        }
    }

    // TODO: In production, send to external logging service
    // Example: Sentry, DataDog, CloudWatch, etc.
    return entry;
};

/**
 * Log security-related events
 * Priority: Always logged regardless of environment
 */
const logSecurityEvent = (eventType, metadata = {}) => {
    const securityEntry = {
        eventType,
        timestamp: getTimestamp(),
        ...metadata,
    };

    // eslint-disable-next-line no-console
    console.warn(`[SECURITY] ${eventType}`, securityEntry); // eslint-disable-line no-console

    // TODO: Send to security monitoring service
    // This is critical for detecting attacks/suspicious activity
    return securityEntry;
};

/**
 * Log authentication events
 */
const logAuthEvent = (action, userId, status, details = {}) => {
    logSecurityEvent(`AUTH_${action.toUpperCase()}`, {
        userId,
        status,
        ...details,
    });
};

/**
 * Log failed validation attempts
 */
const logValidationFailure = (endpoint, reason, details = {}) => {
    logSecurityEvent('VALIDATION_FAILURE', {
        endpoint,
        reason,
        ...details,
    });
};

/**
 * Log suspicious file upload attempts
 */
const logUploadFailure = (reason, details = {}) => {
    logSecurityEvent('UPLOAD_FAILURE', {
        reason,
        ...details,
    });
};

module.exports = {
    error: (message, metadata = {}) => logEntry(LOG_LEVELS.ERROR, message, metadata),
    warn: (message, metadata = {}) => logEntry(LOG_LEVELS.WARN, message, metadata),
    info: (message, metadata = {}) => logEntry(LOG_LEVELS.INFO, message, metadata),
    debug: (message, metadata = {}) => logEntry(LOG_LEVELS.DEBUG, message, metadata),

    logSecurityEvent,
    logAuthEvent,
    logValidationFailure,
    logUploadFailure,
};
