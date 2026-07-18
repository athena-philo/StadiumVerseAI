/**
 * Crowd Intelligence Service for StadiumVerseAI.
 * Simulates real-time IoT crowd sensor feeds.
 * Easily replace with live IoT endpoints or database logs later.
 */

let currentCrowdData = {
  gates: [
    { id: 'gate-a', name: 'Gate A (North Entrance)', count: 120, capacity: 500, waitTime: 2, status: 'low' },
    { id: 'gate-b', name: 'Gate B (South Entrance)', count: 420, capacity: 500, waitTime: 24, status: 'high' }
  ],
  foodStalls: [
    { id: 'stadium-bites', name: 'Stadium Bites (Food)', count: 140, capacity: 200, waitTime: 6, status: 'medium', tags: ['gluten-free', 'kid-friendly', 'budget-friendly', 'halal', 'family-friendly'] },
    { id: 'east-grill', name: 'East Concourse Grill', count: 35, capacity: 200, waitTime: 2, status: 'low', tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'family-friendly'] },
    { id: 'south-cafe', name: 'South Fan Store Café', count: 175, capacity: 200, waitTime: 14, status: 'high', tags: ['vegetarian', 'halal', 'budget-friendly', 'kid-friendly'] }
  ],
  restrooms: [
    { id: 'restroom-a', name: 'Restrooms Concourse A', count: 15, capacity: 50, waitTime: 1, status: 'low' },
    { id: 'restroom-b', name: 'Restrooms Concourse B', count: 42, capacity: 50, waitTime: 8, status: 'high' }
  ],
  seating: [
    { id: 'sec-101', name: 'Section 101', count: 380, capacity: 400, status: 'high' },
    { id: 'sec-102', name: 'Section 102', count: 120, capacity: 450, status: 'low' },
    { id: 'sec-103', name: 'Section 103', count: 260, capacity: 400, status: 'medium' }
  ]
};

// Simulate active stadium changes
function updateSimulatedCrowd() {
  currentCrowdData.gates.forEach(g => {
    g.waitTime = Math.max(1, g.waitTime + (Math.random() > 0.5 ? 2 : -2));
    g.status = g.waitTime < 5 ? 'low' : (g.waitTime < 15 ? 'medium' : 'high');
    g.count = Math.max(50, Math.min(g.capacity, g.count + Math.round((Math.random() - 0.5) * 40)));
  });
  currentCrowdData.foodStalls.forEach(f => {
    f.waitTime = Math.max(1, f.waitTime + (Math.random() > 0.5 ? 2 : -2));
    f.status = f.waitTime < 4 ? 'low' : (f.waitTime < 10 ? 'medium' : 'high');
    f.count = Math.max(20, Math.min(f.capacity, f.count + Math.round((Math.random() - 0.5) * 30)));
  });
  currentCrowdData.restrooms.forEach(r => {
    r.waitTime = Math.max(0, r.waitTime + (Math.random() > 0.5 ? 1 : -1));
    r.status = r.waitTime < 3 ? 'low' : (r.waitTime < 6 ? 'medium' : 'high');
    r.count = Math.max(5, Math.min(r.capacity, r.count + Math.round((Math.random() - 0.5) * 10)));
  });
  currentCrowdData.seating.forEach(s => {
    s.count = Math.max(50, Math.min(s.capacity, s.count + Math.round((Math.random() - 0.5) * 20)));
    const ratio = s.count / s.capacity;
    s.status = ratio < 0.4 ? 'low' : (ratio < 0.75 ? 'medium' : 'high');
  });
}

// Update the simulated crowd data every 25 seconds
setInterval(updateSimulatedCrowd, 25000);

function getCurrentCrowdStatus() {
  return currentCrowdData;
}

module.exports = {
  getCurrentCrowdStatus
};
