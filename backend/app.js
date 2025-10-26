const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const adminRoutes = require('./routes/admin');
const resumeRoutes = require('./routes/resume');
const aiRoutes = require('./routes/ai');
const notificationRoutes = require('./routes/notifications');
const userRoutes = require('./routes/users');
const searchRoutes = require('./routes/search');
const billingRoutes = require('./routes/billing');
const supportRoutes = require('./routes/support');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS configuration
// Allow FRONTEND_URL from env (comma-separated for multiple), fallback to localhost in dev
const rawOrigins = process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = rawOrigins.split(',').map(o => o.trim()).filter(Boolean);

// Helper: allow wildcard origins like https://*.vercel.app
const isOriginAllowed = (origin) => {
    if (!origin) return true; // non-browser or same-origin
    for (const entry of allowedOrigins) {
        if (entry === '*' || entry === origin) return true;
        // Support simple wildcard subdomain patterns
        if (entry.includes('*')) {
            // Escape regex special chars except '*', then replace '*' with '.*'
            const pattern = '^' + entry
                .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
                .replace(/\*/g, '.*') + '$';
            const re = new RegExp(pattern);
            if (re.test(origin)) return true;
        }
    }
    return false;
};

const corsOptions = {
    origin: (origin, callback) => {
        if (isOriginAllowed(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
// Ensure preflight requests are handled
app.options('*', cors(corsOptions));

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
app.use('/api/admin', adminRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/support', supportRoutes);

// Global error handler
app.use(errorHandler);

module.exports = app;

