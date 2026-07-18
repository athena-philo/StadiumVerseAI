const crowdService = require('../services/crowdService');

/**
 * Handles incoming crowd status requests.
 */
function handleGetCrowdStatus(req, res) {
  try {
    const data = crowdService.getCurrentCrowdStatus();
    return res.json(data);
  } catch (error) {
    console.error('Error fetching crowd status:', error);
    return res.status(500).json({ error: 'An error occurred while fetching crowd stats.' });
  }
}

module.exports = {
  handleGetCrowdStatus
};
