const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMetrics } = require('../controllers/metricsController');

router.get('/', authMiddleware, getMetrics);

module.exports = router;