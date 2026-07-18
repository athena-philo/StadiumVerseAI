const { GoogleGenAI } = require('@google/genai');
const crowdService = require('./crowdService');

// Initialize Gemini client matching aiService.js
const apiKey = process.env.GEMINI_API_KEY;
let aiClient = null;

if (apiKey && apiKey.trim() !== '') {
  aiClient = new GoogleGenAI({ apiKey });
}

async function generateMatchPlan(userInput) {
  const crowdStatus = crowdService.getCurrentCrowdStatus();

  // If Gemini client is loaded, request dynamic itinerary FIRST
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-flash-latest',
        contents: `You are the StadiumVerseAI Match Planner. Generate a detailed, personalized match-day itinerary based on the user's travel plans and live stadium statuses.
User Inputs:
- Planned Arrival Time: ${userInput.arrivalTime}
- Selected Entrance Gate: ${userInput.gate}
- Seat Coordinates: ${userInput.seatNumber}
- Group Size: ${userInput.numPeople} people
- Dietary Choice: ${userInput.dietaryPreference}
- Accessibility Need: ${userInput.accessibility}

Live Stadium Context:
- Gates Queue Wait Times: ${crowdStatus.gates.map(g => `${g.name}: ${g.waitTime}m wait (Status: ${g.status})`).join(', ')}
- Concessions: ${crowdStatus.foodStalls.map(f => `${f.name}: ${f.waitTime}m wait (Dietary tags: ${f.tags.join('/')})`).join(', ')}
- Restrooms: ${crowdStatus.restrooms.map(r => `${r.name}: ${r.waitTime}m wait (Status: ${r.status})`).join(', ')}
- Emergency points: Medical center on Level 2 Concourse near Gate 4.

Please generate a structured match-day plan covering:
1. **Best entrance gate & recommended arrival time adjustment** (recommend avoiding crowded gates based on live times).
2. **Personalized food/drink stall recommendation** (matching dietary preferences and shortest queue).
3. **Restroom planning** (suggesting the lowest delay toilets near Section 102 / seats).
4. **Merchandise shopping suggestion** (suggesting South Fan Store Café or similar).
5. **Exact walking navigation route to seat** (check if user has accessibility needs like wheelchair lifts).
6. **Exit strategy** (recommending the least crowded gate to head towards post-game).

Make the formatting neat, using clear headings, bullet points, and positive emojis. Max 250 words.`,
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.error("Gemini API error in Match Planner, using fallback rules:", err);
    }
  }

  // FALLBACK: Rule-based custom itinerary generator
  const shortestGate = [...crowdStatus.gates].sort((a, b) => a.waitTime - b.waitTime)[0];
  
  // Concession match
  let recommendedConcession = crowdStatus.foodStalls[0];
  const diet = userInput.dietaryPreference.toLowerCase();
  if (diet.includes('vegetarian') || diet.includes('vegan')) {
    recommendedConcession = crowdStatus.foodStalls.find(s => s.id === 'east-grill') || crowdStatus.foodStalls[0];
  } else if (diet.includes('halal')) {
    recommendedConcession = crowdStatus.foodStalls.find(s => s.id === 'south-cafe') || crowdStatus.foodStalls[0];
  }

  const bestRestroom = [...crowdStatus.restrooms].sort((a, b) => a.waitTime - b.waitTime)[0];

  const plan = `📅 **YOUR STADIUMVERSE MATCH-DAY ITINERARY (Local Fallback)**

👋 Welcome to StadiumVerse Arena! Based on your group of **${userInput.numPeople}** heading to seat **${userInput.seatNumber}**, here is your optimized plan:

1. **Entrance Strategy:** 
   - You planned to arrive at **${userInput.arrivalTime}** via **${userInput.gate}**. 
   - *AI Optimization:* We recommend entering via **${shortestGate.name}** instead, which currently has the shortest queue (**${shortestGate.waitTime} minutes** wait). 

2. **Food & Drink Stop:**
   - Based on your **${userInput.dietaryPreference}** dietary preference, we recommend visiting **${recommendedConcession.name}**. It matches your dietary settings and currently has a **${recommendedConcession.waitTime}-minute** line.

3. **Restroom Planning:**
   - The restroom with the shortest queue is **${bestRestroom.name}** (**${bestRestroom.waitTime} minutes** wait). Visit them 15 minutes before kick-off or 10 minutes into the second half to beat the queues.

4. **Merchandise Shopping:**
   - Stop by the **South Fan Store** near Concourse B for exclusive souvenirs before finding your seat.

5. **Navigation to Seat ${userInput.seatNumber}:**
   - Head past the main concourse kiosks to Section 102. Take the escalators to Level 2.
   ${userInput.accessibility.toLowerCase() !== 'none' && userInput.accessibility.toLowerCase() !== 'no' && userInput.accessibility.trim() !== '' ? `\n- ♿ *Accessibility Note:* Since you noted accessibility requirements (${userInput.accessibility}), bypass the escalators and take the North Elevator located next to the guest lounge.` : ''}

6. **Post-Game Exit Strategy:**
   - Avoid exiting through the heavily congested main exit gates. Head towards Gate A for a smoother path to parking lots and public transit.

Enjoy the match! ⚽🏆`;

  return plan;
}

module.exports = {
  generateMatchPlan
};
