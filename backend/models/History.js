const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imagePath: { type: String, required: true },
    prediction: { type: String, enum: ['Benign', 'Malignant'], required: true },
    confidence: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);