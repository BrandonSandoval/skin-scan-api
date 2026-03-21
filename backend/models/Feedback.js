// models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    historyId: { type: mongoose.Schema.Types.ObjectId, ref: 'History', required: true },
    comment: { type: String },
    isAccurate: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now },
});

// Safe export to avoid OverwriteModelError
module.exports = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
