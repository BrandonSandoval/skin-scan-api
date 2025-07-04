const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
    try {
        const { historyId, comment, isAccurate } = req.body;
        const userId = req.user.userId;

        const newFeedback = new Feedback({
            userId,
            historyId,
            comment,
            isAccurate
        });

        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Feedback error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
