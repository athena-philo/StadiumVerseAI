const announcementService = require('../services/announcementService');

function handleGetAnnouncements(req, res) {
  try {
    const list = announcementService.getAnnouncements();
    return res.json({ announcements: list });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return res.status(500).json({ error: 'Failed to retrieve live announcements.' });
  }
}

module.exports = {
  handleGetAnnouncements
};
