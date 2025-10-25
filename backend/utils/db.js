const mongoose = require('mongoose');

let cachedConnection = null;

const buildConnectionString = () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI environment variable is not defined');
    }
    return uri;
};

const connectDB = async () => {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    const uri = buildConnectionString();

    try {
        mongoose.set('strictQuery', true);

        // For development, allow connection timeout of 30 seconds
        cachedConnection = await mongoose.connect(uri, {
            autoIndex: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });

        const connection = mongoose.connection;

        connection.on('connected', () => {
            if (process.env.NODE_ENV !== 'test') {
                // eslint-disable-next-line no-console
                console.log('MongoDB connected');
            }
        });

        connection.on('error', (error) => {
            if (process.env.NODE_ENV !== 'test') {
                // eslint-disable-next-line no-console
                console.error('MongoDB connection error:', error);
            }
        });

        connection.on('disconnected', () => {
            if (process.env.NODE_ENV !== 'test') {
                // eslint-disable-next-line no-console
                console.warn('MongoDB disconnected');
            }
        });

        return cachedConnection;
    } catch (error) {
        cachedConnection = null;

        // In development, allow running without MongoDB
        if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️  WARNING: MongoDB connection failed');
            console.warn(`   Error: ${error.message}`);
            console.warn('   The backend will run but persistence will not work.');
            console.warn('   To fix: Install MongoDB or update MONGODB_URI in .env');
            return null;
        }

        throw error;
    }
};

const disconnectDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
    cachedConnection = null;
};

module.exports = {
    connectDB,
    disconnectDB,
};
