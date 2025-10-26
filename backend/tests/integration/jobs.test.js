/* eslint-env jest */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const { connectDB, disconnectDB } = require('../utils/db');
const User = require('../models/User');
const Job = require('../models/Job');

jest.setTimeout(30000);

describe('Job routes', () => {
    let mongoServer;
    let recruiterToken;
    let recruiterId;
    let jobSeekerToken;
    let adminToken;
    let testJobId;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        process.env.MONGODB_URI = mongoServer.getUri();
        process.env.JWT_SECRET = 'test-secret-key';
        process.env.NODE_ENV = 'test';
        await connectDB();

        const recruiter = await User.create({
            firstName: 'HR',
            lastName: 'Manager',
            email: 'hr@company.com',
            password: 'Password123',
            role: 'recruiter',
        });
        recruiterId = recruiter._id;

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({ email: 'hr@company.com', password: 'Password123' });
        recruiterToken = loginResponse.body.token;

        await User.create({
            firstName: 'John',
            lastName: 'Seeker',
            email: 'seeker@example.com',
            password: 'Password123',
            role: 'jobSeeker',
        });

        const seekerLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: 'seeker@example.com', password: 'Password123' });
        jobSeekerToken = seekerLogin.body.token;

        await User.create({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: 'Password123',
            role: 'admin',
        });

        const adminLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@example.com', password: 'Password123' });
        adminToken = adminLogin.body.token;
    });

    afterAll(async () => {
        await disconnectDB();
        if (mongoServer) {
            await mongoServer.stop();
        }
    });

    afterEach(async () => {
        await Job.deleteMany({});
    });

    describe('POST /api/jobs', () => {
        it('creates a job as recruiter', async () => {
            const response = await request(app)
                .post('/api/jobs')
                .set('Authorization', `Bearer ${recruiterToken}`)
                .send({
                    title: 'Software Engineer',
                    description: 'We are looking for a talented software engineer.',
                    company: 'Tech Corp',
                    location: 'San Francisco, CA',
                    jobType: 'full-time',
                    skills: ['JavaScript', 'Node.js'],
                    experienceLevel: 'mid',
                });

            expect(response.status).toBe(201);
            expect(response.body.job.title).toBe('Software Engineer');
            expect(response.body.job.postedBy).toBeDefined();
            testJobId = response.body.job._id;
        });

        it('denies job creation for job seekers', async () => {
            const response = await request(app)
                .post('/api/jobs')
                .set('Authorization', `Bearer ${jobSeekerToken}`)
                .send({
                    title: 'Software Engineer',
                    description: 'We are looking for a talented software engineer.',
                    company: 'Tech Corp',
                    location: 'San Francisco, CA',
                    jobType: 'full-time',
                });

            expect(response.status).toBe(403);
        });

        it('requires authentication', async () => {
            const response = await request(app).post('/api/jobs').send({
                title: 'Software Engineer',
                description: 'We are looking for a talented software engineer.',
                company: 'Tech Corp',
                location: 'San Francisco, CA',
                jobType: 'full-time',
            });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/jobs', () => {
        beforeEach(async () => {
            await Job.create({
                title: 'Backend Developer',
                description: 'Build scalable backend systems.',
                company: 'Tech Corp',
                location: 'New York, NY',
                jobType: 'full-time',
                skills: ['Node.js', 'MongoDB'],
                postedBy: recruiterId,
                status: 'active',
            });

            await Job.create({
                title: 'Frontend Developer',
                description: 'Create beautiful user interfaces.',
                company: 'Design Co',
                location: 'Remote',
                jobType: 'remote',
                skills: ['React', 'CSS'],
                postedBy: recruiterId,
                status: 'active',
            });
        });

        it('returns paginated job listings', async () => {
            const response = await request(app).get('/api/jobs');

            expect(response.status).toBe(200);
            expect(response.body.jobs).toHaveLength(2);
            expect(response.body.pagination.total).toBe(2);
        });

        it('filters jobs by location', async () => {
            const response = await request(app).get('/api/jobs?location=Remote');

            expect(response.status).toBe(200);
            expect(response.body.jobs).toHaveLength(1);
            expect(response.body.jobs[0].location).toBe('Remote');
        });

        it('filters jobs by skills', async () => {
            const response = await request(app).get('/api/jobs?skills=React');

            expect(response.status).toBe(200);
            expect(response.body.jobs).toHaveLength(1);
            expect(response.body.jobs[0].skills).toContain('React');
        });

        it('searches jobs by text', async () => {
            const response = await request(app).get('/api/jobs?search=backend');

            expect(response.status).toBe(200);
            expect(response.body.jobs.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/jobs/:id', () => {
        beforeEach(async () => {
            const job = await Job.create({
                title: 'Full Stack Developer',
                description: 'Work on both frontend and backend.',
                company: 'Startup Inc',
                location: 'Austin, TX',
                jobType: 'full-time',
                postedBy: recruiterId,
                status: 'active',
            });
            testJobId = job._id;
        });

        it('returns job details by ID', async () => {
            const response = await request(app).get(`/api/jobs/${testJobId}`);

            expect(response.status).toBe(200);
            expect(response.body.job.title).toBe('Full Stack Developer');
            expect(response.body.job.postedBy).toBeDefined();
        });

        it('returns 404 for non-existent job', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app).get(`/api/jobs/${fakeId}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/jobs/:id', () => {
        beforeEach(async () => {
            const job = await Job.create({
                title: 'Data Scientist',
                description: 'Analyze data and build models.',
                company: 'Data Co',
                location: 'Boston, MA',
                jobType: 'full-time',
                postedBy: recruiterId,
                status: 'draft',
            });
            testJobId = job._id;
        });

        it('updates job as owner', async () => {
            const response = await request(app)
                .put(`/api/jobs/${testJobId}`)
                .set('Authorization', `Bearer ${recruiterToken}`)
                .send({
                    title: 'Senior Data Scientist',
                    status: 'active',
                });

            expect(response.status).toBe(200);
            expect(response.body.job.title).toBe('Senior Data Scientist');
            expect(response.body.job.status).toBe('active');
        });

        it('allows admin to update any job', async () => {
            const response = await request(app)
                .put(`/api/jobs/${testJobId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    status: 'closed',
                });

            expect(response.status).toBe(200);
            expect(response.body.job.status).toBe('closed');
        });

        it('denies update for non-owner recruiter', async () => {
            await User.create({
                firstName: 'Other',
                lastName: 'HR',
                email: 'other@company.com',
                password: 'Password123',
                role: 'recruiter',
            });

            const otherLogin = await request(app)
                .post('/api/auth/login')
                .send({ email: 'other@company.com', password: 'Password123' });

            const response = await request(app)
                .put(`/api/jobs/${testJobId}`)
                .set('Authorization', `Bearer ${otherLogin.body.token}`)
                .send({
                    status: 'active',
                });

            expect(response.status).toBe(403);
        });
    });

    describe('DELETE /api/jobs/:id', () => {
        beforeEach(async () => {
            const job = await Job.create({
                title: 'Temporary Job',
                description: 'This job will be deleted.',
                company: 'Temp Co',
                location: 'Anywhere',
                jobType: 'contract',
                postedBy: recruiterId,
                status: 'draft',
            });
            testJobId = job._id;
        });

        it('deletes job as owner', async () => {
            const response = await request(app)
                .delete(`/api/jobs/${testJobId}`)
                .set('Authorization', `Bearer ${recruiterToken}`);

            expect(response.status).toBe(200);

            const deletedJob = await Job.findById(testJobId);
            expect(deletedJob).toBeNull();
        });

        it('allows admin to delete any job', async () => {
            const response = await request(app)
                .delete(`/api/jobs/${testJobId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
        });
    });

    describe('GET /api/jobs/my-jobs', () => {
        beforeEach(async () => {
            await Job.create({
                title: 'My Job 1',
                description: 'First job by recruiter.',
                company: 'My Company',
                location: 'City',
                jobType: 'full-time',
                postedBy: recruiterId,
                status: 'active',
            });

            await Job.create({
                title: 'My Job 2',
                description: 'Second job by recruiter.',
                company: 'My Company',
                location: 'City',
                jobType: 'part-time',
                postedBy: recruiterId,
                status: 'draft',
            });
        });

        it('returns jobs created by the authenticated recruiter', async () => {
            const response = await request(app)
                .get('/api/jobs/my-jobs')
                .set('Authorization', `Bearer ${recruiterToken}`);

            expect(response.status).toBe(200);
            expect(response.body.jobs).toHaveLength(2);
        });

        it('requires recruiter role', async () => {
            const response = await request(app)
                .get('/api/jobs/my-jobs')
                .set('Authorization', `Bearer ${jobSeekerToken}`);

            expect(response.status).toBe(403);
        });
    });
});
