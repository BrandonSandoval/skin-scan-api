const express = require('express');
const app = express();
const mongoose = require('mongoose');

const authRoutes = require('./api/auth');
const predictionRoutes = require('./api/predict');
const historyRoutes = require('./api/history');
const feedbackRoutes = require('./api/feedback');

require('dotenv').config();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to parse JSON bodies
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictionRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/feedback', feedbackRoutes); 
app.get('/', (req, res) => res.send('SkinScan API is running!'));

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));