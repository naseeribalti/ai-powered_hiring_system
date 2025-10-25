/* eslint-env jest */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const { connectDB, disconnectDB } = require('../utils/db');

jest.setTimeout(30000);

describe('Auth routes', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        process.env.MONGODB_URI = mongoServer.getUri();
        process.env.JWT_SECRET = 'test-secret-key';
        process.env.NODE_ENV = 'test';
        await connectDB();
    });

    afterAll(async () => {
        await disconnectDB();
        if (mongoServer) {
            await mongoServer.stop();
        }
    });

    afterEach(async () => {
        const collections = mongoose.connection.collections;
        await Promise.all(
            Object.values(collections).map((collection) => collection.deleteMany({}))
        );
    });

    it('registers a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'TestPass123',
            });

        expect(response.status).toBe(201);
        expect(response.body.token).toBeDefined();
        expect(response.body.user.email).toBe('john.doe@example.com');
        expect(response.body.user).not.toHaveProperty('password');
    });

    it('logs in an existing user', async () => {
        await request(app).post('/api/auth/register').send({
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            password: 'AnotherPass123',
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'jane.doe@example.com',
                password: 'AnotherPass123',
            });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    it('denies profile access without token', async () => {
        const response = await request(app).get('/api/auth/me');

        expect(response.status).toBe(401);
    });

    it('returns the authenticated user profile', async () => {
        const registerResponse = await request(app)
            .post('/api/auth/register')
            .send({
                firstName: 'Alice',
                lastName: 'Smith',
                email: 'alice.smith@example.com',
                password: 'Password321',
            });

        const { token } = registerResponse.body;

        const profileResponse = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);

        expect(profileResponse.status).toBe(200);
        expect(profileResponse.body.user.email).toBe('alice.smith@example.com');
    });
});
