const History = require('../models/History')
const Feedback = require('../models/Feedback')

exports.getMetrics = async (req, res) => {
    try {
        const userId = req.user.userId;

        const userScans = await History.find({ userId })
        const totalScans = userScans.length;

        const feedbacks = await Feedback.find({ userId })
        const totalFeedback = feedbacks.length;

        const accurateFeedback = feedbacks.filter(f => f.isaccurate === true).length

        const accuracyRate = totalFeedback > 0 ? parseFloat((accurateFeedback / totalFeedback).toFixed(4)) : null;

        const labelCounts = userScans.reduce((acc, scan) => {
            acc[scan.prediction] = (acc[scan.prediction] || 0) + 1
            return acc
        }, {});

        const avgConfidence = totalScans > 0 ? parseFloat((userScans.reduce((sum, scan) => sum + scan.confidence, 0)
                                                            / totalScans).toFixed(4)) : null;
        
        res.json({
        totalScans,
        totalFeedback,
        accuracyRate,
        labelCounts,
        avgConfidence
        }) 
    } catch (err) {
        console.error('Metrics error:', err)
        res.status(500).json({ message: 'Metrics server error' })
    }
}