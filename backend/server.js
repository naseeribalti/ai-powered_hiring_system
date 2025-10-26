const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const { connectDB } = require('./utils/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Start the server first
        const server = app.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`✅ Backend server listening on port ${PORT}`);
        });

        // Then try to connect to MongoDB in the background
        connectDB()
            .then(() => {
                // eslint-disable-next-line no-console
                console.log('✅ MongoDB connected successfully');
            })
            .catch((dbError) => {
                // eslint-disable-next-line no-console
                console.log('⚠️  MongoDB connection failed, continuing in development mode');
                // eslint-disable-next-line no-console
                console.log(`   Error: ${dbError.message}`);
                if (process.env.NODE_ENV !== 'development') {
                    // eslint-disable-next-line no-console
                    console.error('❌ MongoDB connection required in production');
                    process.exit(1);
                }
            });

        // Handle process termination gracefully
        process.on('SIGTERM', () => {
            // eslint-disable-next-line no-console
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(() => {
                // eslint-disable-next-line no-console
                console.log('HTTP server closed');
            });
        });

        // Prevent the process from exiting
        process.on('uncaughtException', (error) => {
            // eslint-disable-next-line no-console
            console.error('❌ Uncaught Exception:', error);
        });

        process.on('unhandledRejection', (reason, promise) => {
            // eslint-disable-next-line no-console
            console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
        });

    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();

