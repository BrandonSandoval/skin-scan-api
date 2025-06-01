const express = require('express');
const router = express.Router();
const authMiddleware = requre('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { handlePrediction } = require('../controllers/predictController');

router.post('/predict', authMiddleware, upload.single('image'), handlePrediction);

module.exports = router;