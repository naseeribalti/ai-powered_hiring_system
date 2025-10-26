
const mongoose = require('mongoose');

class DatabaseManager {
    constructor() {
        this.isConnected = false;
        this.connection = null;
        this.connectOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 5,
            maxIdleTimeMS: 30000,
            retryWrites: true,
            w: 'majority'
        };
    }

    // Build MongoDB connection URI
    buildConnectionURI() {
        const { MONGODB_URI, MONGODB_HOST, MONGODB_PORT, MONGODB_DB, MONGODB_USER, MONGODB_PASS } = process.env;

        if (MONGODB_URI) {
            return MONGODB_URI;
        }

        let uri = 'mongodb://';

        if (MONGODB_USER && MONGODB_PASS) {
            uri += `${encodeURIComponent(MONGODB_USER)}:${encodeURIComponent(MONGODB_PASS)}@`;
        }

        uri += `${MONGODB_HOST || 'localhost'}:${MONGODB_PORT || '27017'}`;
        uri += `/${MONGODB_DB || 'ai-hiring-system'}`;

        // Add connection options for replica sets
        if (process.env.MONGODB_REPLICA_SET) {
            uri += `?replicaSet=${process.env.MONGODB_REPLICA_SET}`;
        }

        return uri;
    }

    // Connect to MongoDB
    async connect() {
        try {
            if (this.isConnected) {
                console.log('✅ Using existing database connection');
                return this.connection;
            }

            const uri = this.buildConnectionURI();

            console.log('🔄 Connecting to MongoDB...');

            await mongoose.connect(uri, this.connectOptions);

            this.connection = mongoose.connection;
            this.isConnected = true;

            // Set up connection event handlers
            this.setupEventHandlers();

            console.log('✅ MongoDB connected successfully');
            console.log(`📊 Database: ${this.connection.db.databaseName}`);
            console.log(`🎯 Environment: ${process.env.NODE_ENV || 'development'}`);

            return this.connection;
        } catch (error) {
            console.error('❌ MongoDB connection error:', error.message);

            // Implement retry logic for production
            if (process.env.NODE_ENV === 'production') {
                console.log('🔄 Retrying connection in 5 seconds...');
                setTimeout(() => this.connect(), 5000);
            } else {
                throw error;
            }
        }
    }

    // Set up database event handlers
    setupEventHandlers() {
        this.connection.on('connected', () => {
            console.log('✅ Mongoose connected to MongoDB');
        });

        this.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
            this.isConnected = false;
        });

        this.connection.on('disconnected', () => {
            console.log('⚠️ Mongoose disconnected from MongoDB');
            this.isConnected = false;
        });

        // Close connection on app termination
        process.on('SIGINT', async () => {
            await this.closeConnection();
            process.exit(0);
        });
    }

    // Close database connection
    async closeConnection() {
        try {
            if (this.isConnected) {
                await mongoose.connection.close();
                this.isConnected = false;
                console.log('✅ MongoDB connection closed');
            }
        } catch (error) {
            console.error('❌ Error closing MongoDB connection:', error);
        }
    }

    // Health check for database
    async healthCheck() {
        try {
            if (!this.isConnected) {
                return { healthy: false, error: 'Not connected to database' };
            }

            // Run a simple query to check database responsiveness
            await this.connection.db.admin().ping();

            return {
                healthy: true,
                database: this.connection.db.databaseName,
                collections: await this.connection.db.listCollections().toArray()
            };
        } catch (error) {
            return { healthy: false, error: error.message };
        }
    }

    // Get database statistics
    async getStats() {
        try {
            if (!this.isConnected) {
                throw new Error('Database not connected');
            }

            const adminDb = this.connection.db.admin();
            const serverStatus = await adminDb.serverStatus();
            const dbStats = await this.connection.db.stats();

            return {
                version: serverStatus.version,
                host: serverStatus.host,
                uptime: serverStatus.uptime,
                connections: serverStatus.connections,
                storage: {
                    dataSize: dbStats.dataSize,
                    storageSize: dbStats.storageSize,
                    indexSize: dbStats.indexSize
                },
                collections: dbStats.collections,
                objects: dbStats.objects
            };
        } catch (error) {
            console.error('Error getting database stats:', error);
            return null;
        }
    }

    // Utility method to check if collection exists
    async collectionExists(collectionName) {
        try {
            const collections = await this.connection.db.listCollections({
                name: collectionName
            }).toArray();

            return collections.length > 0;
        } catch (error) {
            console.error('Error checking collection existence:', error);
            return false;
        }
    }

    // Create indexes for performance
    async createIndexes() {
        try {
            console.log('🔄 Creating database indexes...');

            // User collection indexes
            await this.connection.collection('users').createIndex({ email: 1 }, { unique: true });
            await this.connection.collection('users').createIndex({ user_type: 1, status: 1 });
            await this.connection.collection('users').createIndex({ 'company_name': 'text', 'name': 'text' });

            // Jobs collection indexes
            await this.connection.collection('jobs').createIndex({ title: 'text', description: 'text', company: 'text' });
            await this.connection.collection('jobs').createIndex({ status: 1, job_type: 1 });
            await this.connection.collection('jobs').createIndex({ location: 1 });
            await this.connection.collection('jobs').createIndex({ salary_min: 1, salary_max: 1 });
            await this.connection.collection('jobs').createIndex({ recruiter_id: 1 });
            await this.connection.collection('jobs').createIndex({ created_at: -1 });

            // Applications collection indexes
            await this.connection.collection('applications').createIndex({ job_id: 1, user_id: 1 }, { unique: true });
            await this.connection.collection('applications').createIndex({ status: 1 });
            await this.connection.collection('applications').createIndex({ user_id: 1 });
            await this.connection.collection('applications').createIndex({ created_at: -1 });

            // Resumes collection indexes
            await this.connection.collection('resumes').createIndex({ user_id: 1 });
            await this.connection.collection('resumes').createIndex({ is_primary: 1 });
            await this.connection.collection('resumes').createIndex({ created_at: -1 });

            console.log('✅ Database indexes created successfully');
        } catch (error) {
            console.error('❌ Error creating database indexes:', error);
        }
    }
}

// Create singleton instance
const databaseManager = new DatabaseManager();

module.exports = databaseManager;

