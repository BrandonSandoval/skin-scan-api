const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { handlePrediction } = require('../controllers/predictController');

router.post('/', authMiddleware, upload.single('image'), handlePrediction);

module.exports = router;