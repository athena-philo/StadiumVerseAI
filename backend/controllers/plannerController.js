const plannerService = require('../services/plannerService');

async function handleGeneratePlan(req, res) {
  try {
    const { arrivalTime, gate, seatNumber, numPeople, dietaryPreference, accessibility } = req.body;
    
    // Validate inputs
    if (!arrivalTime || !gate || !seatNumber || !numPeople) {
      return res.status(400).json({ error: 'Arrival time, entrance gate, seat number, and group size are required parameters.' });
    }

    const plan = await plannerService.generateMatchPlan({
      arrivalTime,
      gate,
      seatNumber,
      numPeople: parseInt(numPeople, 10) || 1,
      dietaryPreference: dietaryPreference || 'None',
      accessibility: accessibility || 'None'
    });

    return res.json({ plan });
  } catch (error) {
    console.error('Error generating match plan:', error);
    return res.status(500).json({ error: 'An error occurred while generating your match plan.' });
  }
}

module.exports = {
  handleGeneratePlan
};
