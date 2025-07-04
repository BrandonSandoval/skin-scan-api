const express = require('express');
const router = express.Router();
const authLimiter = require('../middleware/rateLimiter');
const { registerUser, loginUser } = require('../controllers/authController');

// Apply rate limiting to both endpoints
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);

module.exports = router;
