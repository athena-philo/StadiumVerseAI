const emergencyService = require('../services/emergencyService');

async function handleReportEmergency(req, res) {
  try {
    const { description, category } = req.body;
    
    if (!description || !category) {
      return res.status(400).json({ error: 'Emergency description and category parameters are required.' });
    }

    const responsePlan = await emergencyService.generateEmergencyResponse({
      description,
      category
    });

    return res.json(responsePlan);
  } catch (error) {
    console.error('Error reporting emergency:', error);
    return res.status(500).json({ error: 'An error occurred while reporting the emergency.' });
  }
}

module.exports = {
  handleReportEmergency
};
