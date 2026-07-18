const { GoogleGenAI } = require('@google/genai');
const crowdService = require('./crowdService');

// Initialize Gemini client matching aiService.js
const apiKey = process.env.GEMINI_API_KEY;
let aiClient = null;

if (apiKey && apiKey.trim() !== '') {
  aiClient = new GoogleGenAI({ apiKey });
}

// Pre-defined local fallback scenario database
const localEmergencyFallbacks = {
  "medical": {
    advice: "Do not move the patient unless there is immediate danger. Check if they are conscious and breathing. Keep onlookers at a distance to ensure clear ventilation.",
    facility: "Concourse Level 2 Medical Center next to Gate 4.",
    route: "Take the escalators or North elevator to Level 2 and proceed right. Look for the Red Cross indicator above the entrance doors.",
    contact: "Stadium Medical Dispatch: 555-0199 (Option 1) or alert the nearest Guest Services steward (Teal Jacket)."
  },
  "lost_child": {
    advice: "Report details (age, clothing, name) immediately. Do not leave the area where you last saw the child. Instruct the child (if contact is made) to look for a uniformed steward.",
    facility: "Guest Relations & Lost Kids Lounge at Gate A Main Entrance.",
    route: "Proceed along Concourse ring A to the main entrance lobby near Gate A.",
    contact: "Family Safety Coordinator: 555-0100 or alert any local steward immediately."
  },
  "fire": {
    advice: "Evacuate the immediate area immediately. Walk quickly, do not run. Avoid elevators; use concourse stairs only. Bypass crowded gates if visible smoke is present.",
    facility: "Safest Exit Gates (Gates A and B are currently clear).",
    route: "Follow the glowing green emergency escape direction arrows on the floor and walls.",
    contact: "Fire Marshall dispatch line: 555-0112 (Dispatched)."
  },
  "security": {
    advice: "Move away from the threat. Do not engage or react to aggressive behavior. Inform those around you quietly to move to a safe zone.",
    facility: "Security Hub at Gate B entrance area.",
    route: "Follow the concourse path towards Gate B main foyer security post.",
    contact: "Arena Security Control: 555-0155. Stewards are being dispatched."
  },
  "accessibility": {
    advice: "Remain seated at your section. If evacuation is required, wait for an accessibility steward who will carry transit chairs.",
    facility: "North Elevator / Accessible Concourse Ramp.",
    route: "Avoid escalators. Follow indicators to the North Lift or Ramp 2.",
    contact: "Guest Lounge Assistance desk: 555-0122."
  }
};

async function generateEmergencyResponse(userInput) {
  const crowdStatus = crowdService.getCurrentCrowdStatus();
  const category = (userInput.category || '').toLowerCase().trim();
  const descLower = (userInput.description || '').toLowerCase();

  // Determine severity based on emergency classification guidelines
  let severity = "low";
  if (category.includes('fire') || descLower.includes('fire') || descLower.includes('smoke')) {
    severity = "critical";
  } else if (category.includes('medical') || descLower.includes('faint') || descLower.includes('heart') || descLower.includes('unconscious')) {
    severity = "critical";
  } else if (category.includes('lost') || category.includes('child') || descLower.includes('lost my child') || descLower.includes('lost child') || descLower.includes('kid')) {
    severity = "high";
  } else if (category.includes('security') || descLower.includes('aggressive') || descLower.includes('fight') || descLower.includes('suspicious') || descLower.includes('weapon') || descLower.includes('shout')) {
    severity = "high";
  } else if (descLower.includes('injury') || descLower.includes('cut') || descLower.includes('bleed') || descLower.includes('minor') || category.includes('accessibility') || descLower.includes('wheelchair')) {
    severity = "medium";
  } else if (descLower.includes('where is') || descLower.includes('info') || descLower.includes('request')) {
    severity = "low";
  } else {
    // Default categories backup
    if (category === 'medical' || category === 'fire') {
      severity = "critical";
    } else if (category === 'lost_child' || category === 'security') {
      severity = "high";
    } else if (category === 'accessibility') {
      severity = "medium";
    }
  }

  // If Gemini client is loaded, analyze using LLM FIRST
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-flash-latest',
        contents: `You are the StadiumVerseAI Emergency Assistant. 
Analyze the spectator emergency report and generate the response.
You must output a raw JSON object matching this schema:
{
  "severity": "critical" | "high" | "medium" | "low",
  "plan": "detailed Markdown text covering immediate advice, route, facility, contact details. Use bold lists."
}

Do not add any Markdown blocks or outer quotes surrounding the JSON. Output only valid JSON.

Classification guidelines for severity:
- Fire/smoke, fainted, heart issues, severe injuries -> "critical"
- Lost child, suspicious person, fighting, aggression -> "high"
- Minor cut/bruise, wheelchair escort, accessibility ramp guides -> "medium"
- General stadium navigation details, lost item queries, info questions -> "low"

User Emergency Report:
- Incident Category: ${category}
- Details: "${userInput.description}"

Live Stadium Context:
- Gates Wait Times: ${crowdStatus.gates.map(g => `${g.name}: ${g.waitTime}m wait (Status: ${g.status})`).join(', ')}
- Concessions: ${crowdStatus.foodStalls.map(f => `${f.name}: ${f.waitTime}m wait`).join(', ')}
- Restrooms: ${crowdStatus.restrooms.map(r => `${r.name}: ${r.waitTime}m wait`).join(', ')}
- Emergency points: Medical center on Level 2 Concourse near Gate 4. Security outpost at Gate B. Guest relations lounge at Gate A.`,
      });

      if (response && response.text) {
        const text = response.text.trim();
        // Safe regex parsing for JSON block wraps
        const jsonStr = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
        const result = JSON.parse(jsonStr);
        if (result && result.severity && result.plan) {
          return {
            severity: result.severity.toLowerCase().trim(),
            plan: result.plan.trim()
          };
        }
      }
    } catch (err) {
      console.error("Gemini API error in emergencyService, using fallback dictionary:", err);
    }
  }

  // FALLBACK: Local category lookup
  let selectedFallback = localEmergencyFallbacks[category];
  
  // Try mapping common sub-terms if no direct match
  if (!selectedFallback) {
    if (category.includes('medical') || descLower.includes('faint') || descLower.includes('hurt') || descLower.includes('injury')) {
      selectedFallback = localEmergencyFallbacks.medical;
    } else if (category.includes('child') || descLower.includes('lost') || descLower.includes('kid')) {
      selectedFallback = localEmergencyFallbacks.lost_child;
    } else if (category.includes('fire') || descLower.includes('smoke') || descLower.includes('gas')) {
      selectedFallback = localEmergencyFallbacks.fire;
    } else if (category.includes('security') || descLower.includes('fight') || descLower.includes('aggressive')) {
      selectedFallback = localEmergencyFallbacks.security;
    } else if (category.includes('accessibility') || descLower.includes('wheelchair') || descLower.includes('elevator')) {
      selectedFallback = localEmergencyFallbacks.accessibility;
    } else {
      selectedFallback = localEmergencyFallbacks.medical; // Default to medical advice
    }
  }

  // Format local response plan
  const plan = `⚠️ **STADIUM EMERGENCY RESPONSE (Local Fallback)**

🚨 **Reported Incident:** ${userInput.category.toUpperCase()}
> "${userInput.description}"

Please follow these immediate instructions:

1. **Immediate Safety Advice:**
   - ${selectedFallback.advice}

2. **Nearest Facility / Staff Point:**
   - **Target Station:** ${selectedFallback.facility}

3. **Recommended Route:**
   - **Path:** ${selectedFallback.route}

4. **Emergency Contacts:**
   - **Hotline:** ${selectedFallback.contact}
   - *A safety marshall has been alerted to coordinate this sector.*

Stay calm and wait for staff arrival. 🛡️`;

  return {
    severity,
    plan
  };
}

module.exports = {
  generateEmergencyResponse
};
