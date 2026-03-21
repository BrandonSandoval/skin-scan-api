const multer = require('multer');
const path = require('path');
const logger = require('../utils/logger');
const { MAX_FILE_SIZE, ALLOWED_MIME_TYPES } = require('../utils/validateImage');

// Store file in memory instead of disk for security
const storage = multer.memoryStorage();

/**
 * File filter for multer
 * Validates file extension and MIME type at upload stage
 */
const fileFilter = (req, file, cb) => {
    const allowedExt = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype.toLowerCase();

    // Check extension
    if (!allowedExt.includes(ext)) {
        logger.logUploadFailure('Invalid file extension', {
            filename: file.originalname,
            ext,
            ip: req.ip,
        });
        return cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        logger.logUploadFailure('Invalid MIME type', {
            filename: file.originalname,
            mimeType,
            ip: req.ip,
        });
        return cb(new Error('Invalid MIME type. Only JPEG and PNG are allowed.'));
    }

    cb(null, true);
};

/**
 * Multer configuration with security constraints
 */
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE, // 5MB limit
        files: 1, // Only one file per request
    },
});

module.exports = upload;
