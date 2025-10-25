const express = require('express');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Basic middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Global error handler
app.use(errorHandler);

module.exports = app;

