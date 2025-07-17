const express = require('express')
const router = express.Router()
const feedbackController = require('../controllers/feedbackController')
const authMiddleware = require('../middleware/authMiddleware')
const requireRole = require('../middleware/roleMiddleware')

// Protect the feedback submission route
router.post('/', authMiddleware, feedbackController.submitFeedback)

router.get(
  '/all-feedbacks',
  authMiddleware,
  requireRole('doctor', 'admin'), // ✅ this now returns a function
  feedbackController.getAllFeedbacks
);


module.exports = router;