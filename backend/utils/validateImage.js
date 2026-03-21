/**
 * Image validation utilities
 * Validates file size, MIME type, and file headers (magic bytes)
 */

const logger = require('./logger');

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

// Magic bytes (file signatures) for validation
const MAGIC_BYTES = {
    jpeg: { bytes: [0xff, 0xd8, 0xff], description: 'JPEG' },
    png: { bytes: [0x89, 0x50, 0x4e, 0x47], description: 'PNG' },
};

/**
 * Check if buffer starts with expected magic bytes
 */
const matchesMagicBytes = (buffer, magicBytes) => {
    if (!buffer || buffer.length < magicBytes.length) {
        return false;
    }
    for (let i = 0; i < magicBytes.length; i++) {
        if (buffer[i] !== magicBytes[i]) {
            return false;
        }
    }
    return true;
};

/**
 * Validate file size
 */
const validateFileSize = (file) => {
    if (!file || !file.buffer) {
        return { valid: false, error: 'No file data provided' };
    }

    const fileSize = file.buffer.length;
    if (fileSize === 0) {
        return { valid: false, error: 'File is empty' };
    }

    if (fileSize > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size (${(fileSize / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${MAX_FILE_SIZE / 1024 / 1024}MB)`,
        };
    }

    return { valid: true };
};

/**
 * Validate MIME type from file extension
 */
const validateMimeType = (file) => {
    if (!file || !file.mimetype) {
        return { valid: false, error: 'File MIME type could not be determined' };
    }

    const mimeType = file.mimetype.toLowerCase();
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        return {
            valid: false,
            error: `File type ${mimeType} is not allowed. Only JPEG and PNG are accepted.`,
        };
    }

    return { valid: true };
};

/**
 * Validate file header (magic bytes) to prevent spoofed files
 */
const validateFileHeader = (file) => {
    if (!file || !file.buffer) {
        return { valid: false, error: 'No file data for header validation' };
    }

    const buffer = file.buffer;
    const mimeType = file.mimetype.toLowerCase();

    // Check JPEG magic bytes
    if (mimeType === 'image/jpeg') {
        if (matchesMagicBytes(buffer, MAGIC_BYTES.jpeg.bytes)) {
            return { valid: true, detectedFormat: 'JPEG' };
        }
        return { valid: false, error: 'File header does not match JPEG format' };
    }

    // Check PNG magic bytes
    if (mimeType === 'image/png') {
        if (matchesMagicBytes(buffer, MAGIC_BYTES.png.bytes)) {
            return { valid: true, detectedFormat: 'PNG' };
        }
        return { valid: false, error: 'File header does not match PNG format' };
    }

    return { valid: false, error: 'Unable to validate file header for this format' };
};

/**
 * Prevent directory traversal in filename
 */
const validateFilename = (filename) => {
    if (!filename || typeof filename !== 'string') {
        return { valid: false, error: 'Invalid filename' };
    }

    // Check for directory traversal attempts
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        logger.warn('Directory traversal attempt detected', { filename });
        return { valid: false, error: 'Invalid filename format' };
    }

    // Whitelist allowed characters in filename
    const allowedPattern = /^[a-zA-Z0-9._-]+\.(jpg|jpeg|png)$/i;
    if (!allowedPattern.test(filename)) {
        return { valid: false, error: 'Filename contains invalid characters' };
    }

    return { valid: true };
};

/**
 * Complete validation for image upload
 * Performs all checks: size, MIME type, file header, filename
 */
const validateImageUpload = (file, filename = null) => {
    // Validate file size
    const sizeCheck = validateFileSize(file);
    if (!sizeCheck.valid) {
        return sizeCheck;
    }

    // Validate MIME type
    const mimeCheck = validateMimeType(file);
    if (!mimeCheck.valid) {
        return mimeCheck;
    }

    // Validate file header (magic bytes)
    const headerCheck = validateFileHeader(file);
    if (!headerCheck.valid) {
        return headerCheck;
    }

    // Validate filename if provided
    if (filename) {
        const filenameCheck = validateFilename(filename);
        if (!filenameCheck.valid) {
            return filenameCheck;
        }
    }

    logger.info('Image validation passed', {
        size: file.buffer.length,
        format: headerCheck.detectedFormat,
    });

    return {
        valid: true,
        file,
        detectedFormat: headerCheck.detectedFormat,
    };
};

module.exports = {
    validateImageUpload,
    validateFileSize,
    validateMimeType,
    validateFileHeader,
    validateFilename,
    MAX_FILE_SIZE,
    ALLOWED_MIME_TYPES,
};
