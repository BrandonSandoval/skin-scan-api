const Feedback = require('../models/Feedback');
const logger = require('../utils/logger');

exports.submitFeedback = async (req, res) => {
    try {
        const { historyId, comment, isAccurate } = req.body;
        const userId = req.user.userId;

        // Validate required fields
        if (!historyId || isAccurate === undefined) {
            logger.logValidationFailure('/api/feedback', 'Missing required fields', {
                ip: req.ip,
                userId,
                fields: { historyId: !!historyId, isAccurate: isAccurate !== undefined },
            });
            return res.status(400).json({ message: 'Missing required fields: historyId and isAccurate' });
        }

        const newFeedback = new Feedback({
            userId,
            historyId,
            comment,
            isAccurate,
        });

        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Feedback error:', error);
        
        // Handle validation errors from mongoose
        if (error.name === 'ValidationError') {
            logger.logValidationFailure('/api/feedback', 'Validation error', {
                ip: req.ip,
                error: error.message,
            });
            return res.status(400).json({ message: 'Validation error: ' + error.message });
        }
        
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllFeedbacks = async (req, res) => {
    try {
        const Feedback = require('../models/Feedback');
        const allFeedbacks = await Feedback.find()
            .populate('userId', 'email')
            .populate('historyId', 'prediction confidence timestamp');

        res.json({ feedbacks: allFeedbacks });
    } catch (error) {
        console.error('getAllFeedbacks error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
