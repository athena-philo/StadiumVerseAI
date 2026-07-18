require('dotenv').config();
const express = require('express');
const chatRoutes = require('./routes/chatRoutes');
const crowdRoutes = require('./routes/crowdRoutes');
const plannerRoutes = require('./routes/plannerRoutes');
const translateRoutes = require('./routes/translateRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

app.use('/api/chat', chatRoutes);
app.use('/api/crowd', crowdRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/announcements', announcementRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
