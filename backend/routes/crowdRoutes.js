const express = require('express');
const router = express.Router();
const crowdController = require('../controllers/crowdController');

// GET /api/crowd
router.get('/', crowdController.handleGetCrowdStatus);

module.exports = router;
