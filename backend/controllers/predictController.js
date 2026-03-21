const path = require('path');
const { spawn } = require('child_process');
const History = require('../models/History');
const fs = require('fs');
const os = require('os');
const { validateImageUpload } = require('../utils/validateImage');
const logger = require('../utils/logger');

/**
 * Handle skin scan prediction
 * Validates image, runs ML model, stores result in history
 */
exports.handlePrediction = async (req, res) => {
    let tempFilePath = null;

    try {
        // Check if file was uploaded
        if (!req.file) {
            logger.logValidationFailure('/api/predict', 'No file uploaded', { ip: req.ip });
            return res.status(400).json({ error: 'No image uploaded' });
        }

        // Comprehensive image validation
        const validation = validateImageUpload(req.file, req.file.originalname);
        if (!validation.valid) {
            logger.logUploadFailure(validation.error, {
                filename: req.file.originalname,
                ip: req.ip,
                userId: req.user?.userId,
            });
            return res.status(400).json({ error: validation.error });
        }

        // Create temporary file with sanitized filename
        const safeFilename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${validation.detectedFormat.toLowerCase()}`;
        tempFilePath = path.join(os.tmpdir(), safeFilename);
        fs.writeFileSync(tempFilePath, validation.file.buffer);

        const isDocker = fs.existsSync('/.dockerenv');
        const isWindows = os.platform() === 'win32';

        // Try multiple possible locations for predict.py
        let pythonScriptPath = isDocker
            ? path.join(process.cwd(), 'model', 'predict.py')
            : path.join(__dirname, '..', '..', 'model', 'predict.py');

        logger.debug('Looking for Python script', { path: pythonScriptPath });

        if (!fs.existsSync(pythonScriptPath)) {
            const fallbackPath = '/app/model/predict.py';
            if (fs.existsSync(fallbackPath)) {
                pythonScriptPath = fallbackPath;
            } else {
                logger.error('Python prediction script not found', { path: pythonScriptPath });
                return res.status(500).json({ error: 'Prediction service unavailable' });
            }
        }

        const pythonCommand = isDocker ? 'python3' : 'python';
        const command = isWindows && !isDocker ? 'py' : pythonCommand;

        logger.debug('Spawning Python process', { command, script: pythonScriptPath });

        let result = '';
        let errorOutput = '';

        const python = spawn(command, [pythonScriptPath, tempFilePath]);

        python.stdout.on('data', (data) => {
            result += data.toString();
        });

        python.stderr.on('data', (err) => {
            const errStr = err.toString();
            errorOutput += errStr;
            logger.debug('Python stderr', { error: errStr });
        });

        python.on('close', async (code) => {
            try {
                // Clean up temporary file
                if (tempFilePath && fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }
            } catch (err) {
                logger.warn('Failed to remove temp file', {
                    path: tempFilePath,
                    error: err.message,
                });
            }

            if (code !== 0) {
                logger.error('Python process failed', {
                    code,
                    error: errorOutput.substring(0, 200),
                });
                return res.status(500).json({ error: 'Prediction failed' });
            }

            try {
                const { label, confidence } = JSON.parse(result);

                // Validate prediction output
                if (!label || typeof label !== 'string') {
                    throw new Error('Invalid label in prediction result');
                }
                if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
                    throw new Error('Invalid confidence in prediction result');
                }

                // Store prediction in history
                const historyRecord = await History.create({
                    userId: req.user.userId,
                    imagePath: req.file.originalname,
                    prediction: label,
                    confidence: parseFloat(confidence),
                });

                logger.info('Prediction successful', {
                    userId: req.user.userId,
                    label,
                    confidence,
                    recordId: historyRecord._id,
                });

                return res.json({ label, confidence });
            } catch (err) {
                logger.error('Failed to parse prediction result', {
                    error: err.message,
                    result: result.substring(0, 200),
                });
                return res.status(500).json({ error: 'Failed to process prediction result' });
            }
        });
    } catch (err) {
        // Clean up temp file on error
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            try {
                fs.unlinkSync(tempFilePath);
            } catch (cleanupErr) {
                logger.warn('Failed to cleanup temp file', { error: cleanupErr.message });
            }
        }

        logger.error('Prediction error', {
            error: err.message,
            ip: req.ip,
            userId: req.user?.userId,
        });
        return res.status(500).json({ error: 'Prediction failed' });
    }
};
