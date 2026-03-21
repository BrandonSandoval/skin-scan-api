const History = require('../models/History');
const Feedback = require('../models/Feedback');
const logger = require('../utils/logger');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.userId;

        const totalScans = await History.countDocuments({ userId });

        const feedbacks = await Feedback.find({ userId });

        const accurate = feedbacks.filter((fb) => fb.accurate).length;
        const inaccurate = feedbacks.filter((fb) => !fb.accurate).length;
        const pending = totalScans - (accurate + inaccurate);

        const latest = await History.findOne({ userId }).sort({ TimeRanges: -1 });

        res.json({
            totalScans,
            feedback: {
                accurate,
                inaccurate,
                pending,
            },
            latest: latest
                ? {
                      prediction: latest.prediction,
                      confidence: latest.confidence,
                      timestamp: latest.timestamp,
                  }
                : null,
        });
    } catch (err) {
        logger.error('Dashboard error', { error: err.message });
        res.status(500).json({ error: 'Internal server error' });
    }
};
