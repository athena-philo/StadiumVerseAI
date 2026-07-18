// Live Announcements Service mapping simulated match broadcast updates
const initialAnnouncements = [
  { id: 1, text: "⚽ Kickoff starts in 10 minutes. Please find your seat coordinates.", time: new Date(Date.now() - 180000).toISOString() },
  { id: 2, text: "🌧️ Light rain expected. Roof closure has been activated.", time: new Date(Date.now() - 360000).toISOString() }
];

const mockAnnouncementPool = [
  "🍔 East Concourse Grill has only a 2-minute wait.",
  "🚪 Gate B is currently congested. Please proceed to Gate A.",
  "🚇 Metro service has been extended after the match.",
  "📢 Trophy ceremony begins in 20 minutes.",
  "🪪 Souvenir shops on Level 1 have a 10% discount on team jerseys.",
  "🥤 Free soda refills at South Concourse stalls for the next 15 minutes.",
  "🚻 Concourse Level 2 restroom queues are now clear.",
  "🧣 Exclusive match-day scarf available at the East Fan Shop."
];

let activeAnnouncements = [...initialAnnouncements];
let nextId = 3;
let poolIndex = 0;

// Dynamic simulation: add a new announcement from the pool every 20 seconds
setInterval(() => {
  const nextAnnouncementText = mockAnnouncementPool[poolIndex];
  
  // Avoid inserting duplicates
  if (!activeAnnouncements.some(a => a.text === nextAnnouncementText)) {
    activeAnnouncements.unshift({
      id: nextId++,
      text: nextAnnouncementText,
      time: new Date().toISOString()
    });
  }

  // Cycle through pool index
  poolIndex = (poolIndex + 1) % mockAnnouncementPool.length;
}, 20000);

function getAnnouncements() {
  return activeAnnouncements;
}

module.exports = {
  getAnnouncements
};
