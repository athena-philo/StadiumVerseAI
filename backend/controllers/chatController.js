const chatService = require('../services/chatService');

/**
 * Handles incoming chat messages.
 */
async function handleChat(req, res) {
  const startTime = Date.now();
  console.log(`\n⏱️ [AI Performance Log] 1. Receiving the request at ${new Date().toISOString()}`);

  try {
    const { message, preferences, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const result = await chatService.processChatMessage(message, preferences, history);

    const totalDuration = Date.now() - startTime;
    console.log(`⏱️ [AI Performance Log] 5. Sending the response to the frontend. Total duration: ${totalDuration}ms\n`);

    return res.json(result);
  } catch (error) {
    console.error('Error in chat controller:', error);
    return res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}

/**
 * Handles proactive suggestions.
 */
async function handleProactiveAlerts(req, res) {
  try {
    const { seat, gate, preferences, history } = req.body;
    const alerts = await chatService.generateProactiveAlerts(seat, gate, preferences, history);
    return res.json({ alerts });
  } catch (error) {
    console.error('Error in proactive controller:', error);
    return res.status(500).json({ error: 'An error occurred while generating proactive alerts.' });
  }
}

/**
 * Handles live match insights generation.
 */
async function handleMatchInsights(req, res) {
  try {
    const result = await chatService.getMatchInsights();
    return res.json(result);
  } catch (error) {
    console.error('Error in match insights controller:', error);
    return res.status(500).json({ error: 'An error occurred while generating match insights.' });
  }
}

module.exports = {
  handleChat,
  handleProactiveAlerts,
  handleMatchInsights
};
