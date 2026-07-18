const aiService = require('./aiService');

/**
 * Chat Service to manage message formatting, logging, and AI routing.
 */
async function processChatMessage(message, preferences, history) {
  if (!message) {
    throw new Error('Message is required');
  }

  // Call the isolated AI Service
  const reply = await aiService.generateResponse(message, preferences, history);
  
  return {
    reply,
    timestamp: new Date().toISOString()
  };
}

async function generateProactiveAlerts(seat, gate, preferences, history) {
  return await aiService.generateProactiveResponse(seat, gate, preferences, history);
}

async function getMatchInsights() {
  return await aiService.generateMatchInsights();
}

module.exports = {
  processChatMessage,
  generateProactiveAlerts,
  getMatchInsights
};
