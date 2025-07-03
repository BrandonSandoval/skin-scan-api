const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getHistory } = require('../controllers/historyController');

// TODO: Implement route logic
router.get('/', authMiddleware, getHistory);
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: `Hello user ${req.user.userId}, access granted!` });
});

module.exports = router;