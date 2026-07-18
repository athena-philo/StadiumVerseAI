const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// POST /api/chat
router.post('/', chatController.handleChat);

// POST /api/chat/proactive
router.post('/proactive', chatController.handleProactiveAlerts);

// GET /api/chat/match-insights
router.get('/match-insights', chatController.handleMatchInsights);

module.exports = router;
