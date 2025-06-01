const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// TODO: Implement route logic
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: `Hello user ${req.user.userId}, access granted!` });
});

module.exports = router;