const History = require('../models/History')
const User = require('../models/User');
const Feedback = require('../models/Feedback')

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.userId

        const totalScans = await History.countDocuments({ userId })

        const feedbacks = await Feedback.find({ userId })

        const accurate = feedbacks.filter(fb => fb.accurate).length
        const inaccurate = feedbacks.filter(fb => !fb.accurate).length
        const pending = totalScans - (accurate + inaccurate)

        const latest = await History.findOne({ userId }).sort({ TimeRanges: -1 })

        res.json({
            totalScans,
            feedback: {
                accurate,
                inaccurate,
                pending
            },
            latest: latest ? {
                prediction: latest.prediction,
                confidence: latest.confidence,
                timestamp: latest.timestamp
            }
            : null
        })
    } catch (err) {
        console.error('Dashboard error:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
}