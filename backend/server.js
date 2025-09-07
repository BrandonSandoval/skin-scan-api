const express = require('express');
const cors = require('cors');
const app = express();

const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://skin-scan-frontend.onrender.com" // Render frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


// Import route modules from ./api
const authRoutes = require('./api/auth');
const predictionRoutes = require('./api/predict');
const historyRoutes = require('./api/history');

// Middleware to parse JSON requests
app.use(express.json());

// Use API route handlers
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictionRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/feedback', require('./api/feedback'));
app.use('/api/dashboard', require('./api/dashboard'));
app.use('/api/metrics', require('./api/metrics'));


// Root test endpoint
app.get('/', (req, res) => res.send('SkinScan API is running!'));

// For testing purposes - create a server instance that can be closed
let server;
if (process.env.NODE_ENV === 'test') {
  server = app.listen(0); // Use any available port for tests
}

// Add a clean shutdown method for tests
const closeServer = () => {
  return new Promise((resolve) => {
    if (server) {
      server.close(resolve);
    } else {
      resolve();
    }
  });
};

module.exports = app;
module.exports.closeServer = closeServer;
