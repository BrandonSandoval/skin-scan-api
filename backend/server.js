const express = require('express');
const app = express();

const authRoutes = require('./api/auth');
const predictionRoutes = require('./api/predict');
const historyRoutes = require('./api/history');
const feedbackRoutes = require('./api/feedback');

// Middleware
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/predict', predictionRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/', (req, res) => res.send('SkinScan API is running!'));

module.exports = app;
