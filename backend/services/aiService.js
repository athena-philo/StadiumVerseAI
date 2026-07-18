const { GoogleGenAI } = require('@google/genai');
const crowdService = require('./crowdService');

// Initialize the Google Gemini client
const apiKey = process.env.GEMINI_API_KEY;
console.log("API Key Loaded:", !!process.env.GEMINI_API_KEY);
let aiClient = null;

if (apiKey && apiKey.trim() !== '') {
  aiClient = new GoogleGenAI({ apiKey });
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY is not defined in backend/.env. AI calls will fall back to mock responses.");
}

// In-memory cache for fast response times
const responseCache = new Map();

// Helper to clear old cache entries periodically to avoid memory leaks
setInterval(() => {
  if (responseCache.size > 200) {
    responseCache.clear();
  }
}, 60000);

/**
 * AI Service for StadiumVerseAI.
 * Integrates Google Gemini API while maintaining high-fidelity prompt routing.
 */
async function generateResponse(message, preferences, history) {
  const startTime = Date.now();
  const msg = (message || '').toLowerCase().trim();
  const crowdStatus = crowdService.getCurrentCrowdStatus();
  const prefs = preferences || {};
  let apiAttemptFailed = false;

  // Extract contextual preferences and state parameters from conversation history
  let seatContext = 'Section 102, Row E, Seat B12'; // default seat
  let gateContext = 'Gate A'; // default gate

  if (Array.isArray(history) && history.length > 0) {
    for (const h of history) {
      if (h.sender === 'user') {
        const text = h.text.toLowerCase();
        
        // Match seat context: e.g. "Seat 24B", "Row F, Seat 12A", "Section 104"
        const seatMatch = h.text.match(/(?:seat|row|section)\s*([a-z0-9\-]+)/i);
        if (seatMatch) {
          const secMatch = h.text.match(/section\s*\d+/i);
          const rowMatch = h.text.match(/row\s*[a-z]/i);
          const stMatch = h.text.match(/seat\s*[a-z0-9\-]+/i);
          
          let parts = [];
          if (secMatch) parts.push(secMatch[0]);
          if (rowMatch) parts.push(rowMatch[0]);
          if (stMatch) parts.push(stMatch[0]);
          if (parts.length > 0) {
            seatContext = parts.join(', ');
          }
        }
        
        // Match gate context: e.g. "Gate B", "Gate 4"
        const gateMatch = h.text.match(/gate\s*([a-z0-9\-]+)/i);
        if (gateMatch) {
          gateContext = gateMatch[0];
        }
        
        // Match dietary preferences mentions
        if (text.includes('vegetarian') || text.includes('veg ')) prefs.vegetarian = true;
        if (text.includes('vegan')) prefs.vegan = true;
        if (text.includes('halal')) prefs.halal = true;
        if (text.includes('gluten-free') || text.includes('gluten free')) prefs.glutenFree = true;
        if (text.includes('wheelchair')) prefs.wheelchairAccessible = true;
      }
    }
  }

  // Convert history array to a formatted string for Gemini prompt context
  let historyPrompt = '';
  if (Array.isArray(history) && history.length > 0) {
    historyPrompt = history.map(h => `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n') + '\n';
  }

  // Build a query and crowd metrics fingerprint for cache lookup
  const crowdFingerprint = crowdStatus.foodStalls.map(f => `${f.id}:${f.waitTime}`).join('|') +
    crowdStatus.gates.map(g => `${g.id}:${g.waitTime}`).join('|') +
    crowdStatus.restrooms.map(r => `${r.id}:${r.waitTime}`).join('|');
  const prefsFingerprint = Object.keys(prefs).filter(k => prefs[k]).sort().join(',');
  const cacheKey = `${msg}:${crowdFingerprint}:${prefsFingerprint}`;

  // Check memory cache for instant resolution
  if (responseCache.has(cacheKey)) {
    console.log(`⏱️ [AI Performance Log] Cache hit! Response resolved in 0ms`);
    return responseCache.get(cacheKey);
  }

  // Define relevant subset of context based on user query to minimize prompt size
  let contextPrompt = '';
  const isFood = msg.includes('food') || msg.includes('eat') || msg.includes('hungry') || msg.includes('drink') || msg.includes('queue') || msg.includes('line') || msg.includes('stall') || msg.includes('shortest');
  const isRestroom = msg.includes('restroom') || msg.includes('toilet') || msg.includes('washroom') || msg.includes('bathroom');
  const isNav = msg.includes('guide') || msg.includes('gate') || msg.includes('seat') || msg.includes('how to get to') || msg.includes('route') || msg.includes('parking') || msg.includes('direction');
  const isEmergency = msg.includes('emergency') || msg.includes('sos') || msg.includes('police') || msg.includes('medical') || msg.includes('danger') || msg.includes('hurt') || msg.includes('safety') || msg.includes('first aid');

  if (isFood) {
    contextPrompt = `Food Concessions Wait Times: ${crowdStatus.foodStalls.map(f => `${f.name}: ${f.waitTime}m wait (Capacity: ${f.count}/${f.capacity}, Tags: ${f.tags.join('/')})`).join(', ')}`;
  } else if (isRestroom) {
    contextPrompt = `Restrooms Wait Times: ${crowdStatus.restrooms.map(r => `${r.name}: ${r.waitTime}m wait (Status: ${r.status})`).join(', ')}`;
  } else if (isNav) {
    contextPrompt = `Gates Wait Times: ${crowdStatus.gates.map(g => `${g.name}: ${g.waitTime}m wait`).join(', ')}. User Seat is ${seatContext}.`;
  } else if (isEmergency) {
    contextPrompt = `Emergency Points: Medical/First Aid Station is located on Concourse Level 2 next to Gate 4. A safety steward is stationed at ${seatContext}.`;
  } else {
    // Minimal general overview
    contextPrompt = `Gates: ${crowdStatus.gates.map(g => `${g.name}: ${g.waitTime}m`).join(', ')}. Concessions: ${crowdStatus.foodStalls.map(f => `${f.name}: ${f.waitTime}m`).join(', ')}. Restrooms: ${crowdStatus.restrooms.map(r => `${r.name}: ${r.waitTime}m`).join(', ')}.`;
  }

  const prepTime = Date.now() - startTime;
  console.log(`⏱️ [AI Performance Log] 2. Preparing the prompt took: ${prepTime}ms`);

  // If Gemini client is loaded, process the query dynamically FIRST
  if (aiClient) {
    try {
      const apiCallStart = Date.now();
      console.log(`⏱️ [AI Performance Log] 3. Initializing Gemini API call...`);

      const response = await aiClient.models.generateContent({
        model: 'gemini-flash-latest',
        contents: `You are the StadiumVerseAI Match-Day Companion. Keep responses conversational, match-day focused, and concise (under 120 words). Use emojis.
Live Context:
${contextPrompt}
User Preferences: Dietary: ${[prefs.vegetarian && 'Vegetarian', prefs.vegan && 'Vegan', prefs.halal && 'Halal', prefs.glutenFree && 'Gluten-Free'].filter(Boolean).join(', ') || 'None'}; Acc: ${[prefs.wheelchairAccessible && 'Wheelchair'].filter(Boolean).join(', ') || 'None'}
Conversation History:
${historyPrompt}
User query: "${message}"`,
      });

      const apiCallDuration = Date.now() - apiCallStart;
      console.log(`⏱️ [AI Performance Log] 4. Receiving the Gemini response (duration: ${apiCallDuration}ms)`);

      if (response && response.text) {
        const resultText = response.text.trim();
        // Save to cache
        responseCache.set(cacheKey, resultText);
        return resultText;
      }
    } catch (apiError) {
      console.error("===== GEMINI API ERROR =====");
      console.log("Status:", apiError.status);
      console.log("Message:", apiError.message);

      if (apiError.response) {
        console.log("Response:", apiError.response);
      }

      console.error("Falling back to rule-based logic.");
      apiAttemptFailed = true;
    }
  }

  console.log(`⏱️ [AI Performance Log] Gemini client unconfigured or failed. Falling back to local rules.`);

  // FALLBACK Logic: Rule-based responses when Gemini fails or is unconfigured
  const isFoodQuery = msg.includes('food') || msg.includes('eat') || msg.includes('hungry') || msg.includes('drink') || msg.includes('queue') || msg.includes('line') || msg.includes('stall') || msg.includes('shortest');

  // Filter food stalls matching selected dietary, family, accessibility, or budget preferences
  let matchedStalls = [...crowdStatus.foodStalls];
  let filtersApplied = [];

  if (prefs.vegetarian) {
    matchedStalls = matchedStalls.filter(s => s.tags.includes('vegetarian'));
    filtersApplied.push('Vegetarian');
  }
  if (prefs.vegan) {
    matchedStalls = matchedStalls.filter(s => s.tags.includes('vegan'));
    filtersApplied.push('Vegan');
  }
  if (prefs.halal) {
    matchedStalls = matchedStalls.filter(s => s.tags.includes('halal'));
    filtersApplied.push('Halal');
  }
  if (prefs.glutenFree) {
    matchedStalls = matchedStalls.filter(s => s.tags.includes('gluten-free'));
    filtersApplied.push('Gluten-Free');
  }
  if (prefs.familyFriendly) {
    matchedStalls = matchedStalls.filter(s => s.tags.includes('family-friendly'));
    filtersApplied.push('Family-Friendly');
  }
  if (prefs.kidFriendly || prefs.kids) {
    matchedStalls = matchedStalls.filter(s => s.tags.includes('kid-friendly'));
    filtersApplied.push('Kids-Friendly');
  }
  if (prefs.budgetFriendly) {
    matchedStalls = matchedStalls.filter(s => s.tags.includes('budget-friendly'));
    filtersApplied.push('Budget-Friendly');
  }

  // 1. Navigation / Seats guide
  if (msg.includes('guide') || msg.includes('gate') || msg.includes('seat') || msg.includes('how to get to') || msg.includes('route') || msg.includes('direction')) {
    let seatNum = seatContext.match(/(?:seat)\s*([a-z0-9\-]+)/i)?.[1] || 'B12';
    let reply = `🗺️ **Personalized Navigation Guide (${gateContext} ➜ Seat ${seatNum}):**\n\nHi there! Here is your custom route to **${seatContext}**:\n1. From **${gateContext}**, proceed straight past the ticketing kiosks.\n2. Take the nearest escalators to Concourse Level 2.\n3. Proceed along the concourse ring to Section ${seatContext.match(/section\s*([a-z0-9\-]+)/i)?.[1] || '102'}.\n4. Your seat is clearly signposted in ${seatContext}.\n\n*Estimated walk time: 3 minutes.*`;
    if (prefs.wheelchairAccessible) {
      reply += `\n\n♿ *Accessibility Note:* Since you prefer wheelchair access, please bypass the escalators and use the nearest elevator to reach Concourse Level 2 smoothly.`;
    }
    responseCache.set(cacheKey, reply);
    return reply;
  }

  // 2. Restroom guide
  if (msg.includes('restroom') || msg.includes('toilet') || msg.includes('washroom') || msg.includes('bathroom')) {
    const bestRestroom = [...crowdStatus.restrooms].sort((a, b) => a.waitTime - b.waitTime)[0];
    let reply = `🚻 **Restroom Wait Monitor:**\n\nBased on your registered location near **${seatContext}**, the restroom with the lowest queue time is **${bestRestroom.name}** (estimated wait: **${bestRestroom.waitTime} minutes**).\n- **Concourse Restrooms:** Located 30 meters from Section ${seatContext.match(/section\s*([a-z0-9\-]+)/i)?.[1] || '102'}.`;
    if (prefs.wheelchairAccessible) {
      reply += `\n\n♿ *Accessibility Note:* The primary accessible/all-gender restrooms are located opposite the North Escalators. They feature automated doors and step-free access.`;
    }
    responseCache.set(cacheKey, reply);
    return reply;
  }

  // 3. Concession recommendations based on preferences and wait times
  if (isFoodQuery) {
    let reply = '';
    if (filtersApplied.length > 0) {
      const sortedStalls = matchedStalls.sort((a, b) => a.waitTime - b.waitTime);
      if (sortedStalls.length > 0) {
        const best = sortedStalls[0];
        reply = `🍔 **Personalized Concession Finder:**\n\nBased on your active preferences (${filtersApplied.join(', ')}):\n- **Recommended vendor:** **${best.name}**\n- **Wait time:** **${best.waitTime} minutes** (${best.status.toUpperCase()} traffic)\n- **Location:** ${best.id === 'east-grill' ? 'East Concourse' : (best.id === 'stadium-bites' ? 'North Concourse' : 'South Concourse')}\n\n*This stall matches all your preferences and has the shortest active queue!*`;
      } else {
        const absoluteBest = [...crowdStatus.foodStalls].sort((a, b) => a.waitTime - b.waitTime)[0];
        reply = `🍔 **Personalized Concession Finder:**\n\nNo concessions match all your active preferences (${filtersApplied.join(', ')}) simultaneously.\n\nHowever, the absolute shortest line in the arena is at **${absoluteBest.name}** with a wait time of only **${absoluteBest.waitTime} minutes**.`;
      }
    } else {
      const absoluteBest = [...crowdStatus.foodStalls].sort((a, b) => a.waitTime - b.waitTime)[0];
      reply = `🍔 **Smart Queue Finder:**\n\nCurrently, the shortest line is at **${absoluteBest.name}** with an estimated wait time of **${absoluteBest.waitTime} minutes** (Status: ${absoluteBest.status.toUpperCase()}).\n- **Alternative options:** Stadium Bites (6m wait), South Fan Café (14m wait).`;
    }
    responseCache.set(cacheKey, reply);
    return reply;
  }

  // 4. Translate announcement
  if (msg.includes('translate') || msg.includes('announcement') || msg.includes('what did they say') || msg.includes('speaker') || msg.includes('broadcast')) {
    const reply = `🔊 **Announcement Translation Service:**\n\n*Captured Broadcast (16:45 PM):*\n> "Attention spectators, due to minor traffic at Gate C, please proceed to Gate A and B for expedited entry into the stadium."\n\nWould you like this announcement translated to Spanish, French, Japanese, or German? Just ask me!`;
    responseCache.set(cacheKey, reply);
    return reply;
  }

  // 5. Match day plan
  if (msg.includes('plan') || msg.includes('arrival') || msg.includes('schedule') || msg.includes('final whistle') || msg.includes('program')) {
    const reply = `📅 **Your Custom Match-Day Plan:**\n\n- **18:00 (Arrival):** Enter via Gate A (queues are currently empty).\n- **18:15 (Fan Zone):** Visit the stadium fan-shop for pre-game merchandise.\n- **18:30 (Warm-ups):** Find Seat B12. Team warm-ups start on the pitch.\n- **18:50 (Lightshow):** Opening ceremony and laser display.\n- **19:00 (Kick-off):** Match begins!\n- **19:45 (Half-time):** Grab snacks at East Concourse Grill (shortest queue).\n- **20:45 (Final Whistle):** Post-match celebration directions.\n\n*I will notify you 5 minutes before each event!*`;
    responseCache.set(cacheKey, reply);
    return reply;
  }

  // 6. Emergency assistance
  if (msg.includes('emergency') || msg.includes('sos') || msg.includes('police') || msg.includes('medical') || msg.includes('danger') || msg.includes('hurt') || msg.includes('safety')) {
    const reply = `⚠️ **EMERGENCY ASSISTANCE INITIATED:**\n\n1. **First Aid Route:** The nearest medical booth is located on Level 2 Concourse, next to **Gate 4** (2 minutes away).\n2. **Dispatch:** A stadium safety steward has been alerted to Seat B12.\n3. **Safety Advice:** Please remain at your location unless instructed by security. Exit routes are clear if evacuation is required.`;
    responseCache.set(cacheKey, reply);
    return reply;
  }

  // 7. Crowd inquiries
  if (msg.includes('least crowded') && msg.includes('gate')) {
    const leastCrowdedGate = [...crowdStatus.gates].sort((a, b) => a.waitTime - b.waitTime)[0];
    const reply = `🟢 **Crowd Intelligence:** The least crowded entrance is currently **${leastCrowdedGate.name}** with a wait time of **${leastCrowdedGate.waitTime} minutes** (Status: ${leastCrowdedGate.status.toUpperCase()}).`;
    responseCache.set(cacheKey, reply);
    return reply;
  }

  if (msg.includes('lowest') && (msg.includes('waiting time') || msg.includes('line'))) {
    const bestRestroom = [...crowdStatus.restrooms].sort((a, b) => a.waitTime - b.waitTime)[0];
    const reply = `🚻 **Restroom Wait Monitor:** The restroom with the lowest queue time is **${bestRestroom.name}** (estimated wait: **${bestRestroom.waitTime} minutes**).`;
    responseCache.set(cacheKey, reply);
    return reply;
  }

  if (msg.includes('avoiding crowds') || msg.includes('avoid crowds') || msg.includes('fastest route')) {
    const gate = [...crowdStatus.gates].sort((a, b) => a.waitTime - b.waitTime)[0];
    const food = [...crowdStatus.foodStalls].sort((a, b) => a.waitTime - b.waitTime)[0];
    const reply = `🗺️ **Smart Route Recommendation (Avoiding Crowds):**\n\nTo reach your seat with minimal delays:\n1. Enter via **${gate.name}** (Wait: ${gate.waitTime} mins) which is currently the least congested.\n2. Proceed along the concourse ring to Section 102.\n3. Grab snacks at **${food.name}** (Wait: ${food.waitTime} mins) to bypass the busy concession loops.`;
    responseCache.set(cacheKey, reply);
    return reply;
  }

  // Fallback when no match is found in mock rules
  const fallbackText = `🤖 AI Assistant is temporarily unavailable due to API usage limits. You can still use the built-in stadium features, including navigation, food recommendations, restroom guidance, crowd intelligence, match planner, and emergency assistance. Please try AI-powered features again in a few minutes.`;
  responseCache.set(cacheKey, fallbackText);
  return fallbackText;
}

/**
 * Generates proactive contextual notifications for the spectator.
 */
async function generateProactiveResponse(seat, gate, preferences, history) {
  const crowdStatus = crowdService.getCurrentCrowdStatus();
  const prefs = preferences || {};
  const userSeat = seat || 'Section 102, Row E, Seat B12';
  const userGate = gate || 'Gate A';

  // If Gemini client is configured, generate dynamic alerts
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-flash-latest',
        contents: `You are the StadiumVerseAI Proactive Assistant. Your job is to output 2-3 highly contextual, real-time alert suggestions for a spectator based on their location, preferences, match timeline, and stadium status.
Live Context:
- Seat: ${userSeat}
- Gate: ${userGate}
- Preferences: Vegetarian: ${prefs.vegetarian}, Accessible: ${prefs.wheelchairAccessible}
- Match Timeline: First Half (15:00 min elapsed)
- Concessions: ${crowdStatus.foodStalls.map(f => `${f.name}: ${f.waitTime}m wait (Capacity: ${f.count}/${f.capacity})`).join(', ')}
- Gates: ${crowdStatus.gates.map(g => `${g.name}: ${g.waitTime}m wait (Status: ${g.status})`).join(', ')}
- Restrooms: ${crowdStatus.restrooms.map(r => `${r.name}: ${r.waitTime}m wait (Status: ${r.status})`).join(', ')}

Output ONLY a JSON array of alerts. Each alert object must contain exactly:
"id" (unique string), "type" (e.g., "food", "crowd", "restroom", "timeline"), "title" (short with emoji), "message" (contextual, friendly, concise advice), and "time" (current simulated time e.g., "18:25").
Do not output any markdown codeblock backticks or explanations. Just raw JSON.`,
      });

      if (response && response.text) {
        let cleanText = response.text.trim();
        // Strip potential markdown backticks
        cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
        const parsedAlerts = JSON.parse(cleanText);
        if (Array.isArray(parsedAlerts)) {
          return parsedAlerts;
        }
      }
    } catch (apiError) {
      console.error("Gemini Proactive Alerts Error, falling back to rule-based alerts:", apiError);
    }
  }

  // Local Rule-Based Proactive Fallbacks
  const alerts = [];
  const timeStr = "18:15";

  // 1. Food queue suggestion
  // Find shortest wait time vendor
  const matchedStalls = [...crowdStatus.foodStalls];
  const vegetarianMatched = prefs.vegetarian;
  const bestFood = matchedStalls.sort((a,b) => a.waitTime - b.waitTime)[0];
  if (bestFood && bestFood.waitTime <= 5) {
    alerts.push({
      id: "food-queue-alert",
      type: "food",
      title: "🍔 Short Concession Line",
      message: `Wait time at ${bestFood.name} is currently only ${bestFood.waitTime} minutes! ${vegetarianMatched ? 'Grab your vegetarian snack now before queues build up.' : 'Grab a quick bite now.'}`,
      time: timeStr
    });
  }

  // 2. Timeline alert
  alerts.push({
    id: "timeline-kickoff",
    type: "timeline",
    title: "⚽ Kickoff Sequence",
    message: `Match warm-ups are finishing. Head to ${userSeat} now to catch the opening lightshow.`,
    time: "18:45"
  });

  // 3. Restroom alert
  const bestRestroom = [...crowdStatus.restrooms].sort((a,b) => a.waitTime - b.waitTime)[0];
  if (bestRestroom && bestRestroom.waitTime <= 2) {
    alerts.push({
      id: "restroom-wait-alert",
      type: "restroom",
      title: "🚻 Clear Restrooms",
      message: `${bestRestroom.name} has a wait time under ${bestRestroom.waitTime + 1} minute. Located near Section 102.`,
      time: "18:50"
    });
  }

  // 4. Gate congestion alert
  const worstGate = [...crowdStatus.gates].sort((a,b) => b.waitTime - a.waitTime)[0];
  if (worstGate && worstGate.waitTime >= 15) {
    alerts.push({
      id: "gate-congestion-alert",
      type: "crowd",
      title: "🚪 Gate Congestion Warning",
      message: `Congestion building up near ${worstGate.name} (est. wait: ${worstGate.waitTime}m). Exit/enter via Gate B for faster transit.`,
      time: "19:00"
    });
  }

  return alerts;
}

/**
 * Dynamic match clock generator.
 * Cycles match progression and score over a simulated time window.
 */
function getSimulatedMatchTime() {
  const elapsedMinutes = Math.floor((Date.now() / 1000 / 8) % 90) + 1; // cycles every 12 mins
  const scoreHome = Math.floor(elapsedMinutes / 30);
  const scoreAway = Math.floor(elapsedMinutes / 45);
  return {
    minute: elapsedMinutes,
    score: `${scoreHome} - ${scoreAway}`
  };
}

/**
 * Generates dynamic AI match insights based on live simulated match timeline.
 */
async function generateMatchInsights() {
  const matchState = getSimulatedMatchTime();
  
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-flash-latest',
        contents: `You are the StadiumVerseAI Match Analyst. Generate 3 short, high-quality live match-day insights for a spectator.
Match Info: StadiumVerse FC vs United SC.
Simulated Match Time: ${matchState.minute} minutes elapsed (${matchState.minute <= 45 ? 'First Half' : 'Second Half'})
Simulated Score: ${matchState.score}

Output ONLY a JSON array of insights. Each insight object must contain exactly:
"id" (unique string), "type" (e.g., "momentum", "excitement", "player", "prediction"), "title" (short with emoji), "content" (1-2 sentences of dynamic, detailed match commentary/stats), and "timestamp" (simulated game minute e.g. "28'").
Do not output any markdown codeblock backticks or explanations. Just raw JSON.`,
      });

      if (response && response.text) {
        let cleanText = response.text.trim();
        cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
        const parsedInsights = JSON.parse(cleanText);
        if (Array.isArray(parsedInsights)) {
          return {
            minute: matchState.minute,
            score: matchState.score,
            insights: parsedInsights
          };
        }
      }
    } catch (apiError) {
      console.error("Gemini Match Insights Error, falling back to local simulation:", apiError);
    }
  }

  // Local rule-based dynamic match simulator
  const insights = [];
  const possession = 50 + Math.floor(Math.sin(matchState.minute / 5) * 15);
  const attackDirection = possession > 53 ? 'StadiumVerse FC attacking left flank' : 'United SC pressing central corridors';

  insights.push({
    id: "momentum",
    type: "momentum",
    title: "📈 Momentum shift",
    content: `${possession > 50 ? 'StadiumVerse FC' : 'United SC'} is dominating possession (${possession}%) in recent play cycles. ${attackDirection}.`,
    timestamp: `${matchState.minute}'`
  });

  const noiseDecibels = 78 + Math.floor(Math.sin(matchState.minute / 2.5) * 18);
  insights.push({
    id: "excitement",
    type: "excitement",
    title: "🔊 Crowd Excitement Trend",
    content: `Sound sensors registering stadium decibel levels averaging ${noiseDecibels}dB. Excited cheers detected near Section 102 concourse pathways.`,
    timestamp: `${matchState.minute}'`
  });

  let prediction = "Next goal is likely to come from a set piece.";
  if (matchState.minute < 30) {
    prediction = "StadiumVerse FC is predicted to register their first shot on target in the next 5 minutes.";
  } else if (matchState.minute < 60) {
    prediction = "Tactical substitutions incoming. Expect midfield press intensities to increase.";
  } else {
    prediction = "United SC shifting defensive block formations to secure clean-sheet targets.";
  }

  insights.push({
    id: "prediction",
    type: "prediction",
    title: "🔮 Predicted Next Important Event",
    content: prediction,
    timestamp: `${matchState.minute}'`
  });

  return {
    minute: matchState.minute,
    score: matchState.score,
    insights
  };
}

module.exports = {
  generateResponse,
  generateProactiveResponse,
  generateMatchInsights
};
