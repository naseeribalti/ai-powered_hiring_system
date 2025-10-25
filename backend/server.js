require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./utils/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Try to connect to MongoDB, but don't fail if unavailable in dev mode
        const dbConnection = await connectDB();
        if (!dbConnection && process.env.NODE_ENV !== 'development') {
            throw new Error('MongoDB connection required in production');
        }

        app.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`✅ Backend server listening on port ${PORT}`);
            if (!dbConnection) {
                // eslint-disable-next-line no-console
                console.log('⚠️  Running in development mode without database');
            }
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();

