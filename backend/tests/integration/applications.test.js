/* eslint-env jest */

const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const { connectDB, disconnectDB } = require('../utils/db');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

jest.setTimeout(30000);

describe('Application routes', () => {
    let mongoServer;
    let jobSeekerToken;
    let jobSeekerId;
    let recruiterToken;
    let recruiterId;
    let adminToken;
    let testJobId;
    let testApplicationId;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        process.env.MONGODB_URI = mongoServer.getUri();
        process.env.JWT_SECRET = 'test-secret-key';
        process.env.NODE_ENV = 'test';
        await connectDB();

        const jobSeeker = await User.create({
            firstName: 'John',
            lastName: 'Seeker',
            email: 'seeker@example.com',
            password: 'Password123',
            role: 'jobSeeker',
        });
        jobSeekerId = jobSeeker._id;

        const seekerLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: 'seeker@example.com', password: 'Password123' });
        jobSeekerToken = seekerLogin.body.token;

        const recruiter = await User.create({
            firstName: 'HR',
            lastName: 'Manager',
            email: 'hr@company.com',
            password: 'Password123',
            role: 'recruiter',
        });
        recruiterId = recruiter._id;

        const recruiterLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: 'hr@company.com', password: 'Password123' });
        recruiterToken = recruiterLogin.body.token;

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

        const job = await Job.create({
            title: 'Backend Developer',
            description: 'Build scalable backend systems.',
            company: 'Tech Corp',
            location: 'San Francisco, CA',
            jobType: 'full-time',
            skills: ['Node.js', 'MongoDB'],
            postedBy: recruiterId,
            status: 'active',
        });
        testJobId = job._id;
    });

    afterAll(async () => {
        await disconnectDB();
        if (mongoServer) {
            await mongoServer.stop();
        }
    });

    afterEach(async () => {
        await Application.deleteMany({});
    });

    describe('POST /api/applications', () => {
        it('allows job seeker to apply to a job', async () => {
            const response = await request(app)
                .post('/api/applications')
                .set('Authorization', `Bearer ${jobSeekerToken}`)
                .send({
                    jobId: testJobId.toString(),
                    coverLetter: 'I am interested in this position and have relevant experience.',
                });

            expect(response.status).toBe(201);
            expect(response.body.application.applicant).toBeDefined();
            expect(response.body.application.job).toBeDefined();
            expect(response.body.application.status).toBe('pending');
            testApplicationId = response.body.application._id;
        });

        it('prevents duplicate applications', async () => {
            await Application.create({
                applicant: jobSeekerId,
                job: testJobId,
                coverLetter: 'First application',
            });

            const response = await request(app)
                .post('/api/applications')
                .set('Authorization', `Bearer ${jobSeekerToken}`)
                .send({
                    jobId: testJobId.toString(),
                    coverLetter: 'Attempting duplicate application',
                });

            expect(response.status).toBe(409);
        });

        it('prevents application to inactive job', async () => {
            const inactiveJob = await Job.create({
                title: 'Old Job',
                description: 'This job is closed.',
                company: 'Old Corp',
                location: 'Nowhere',
                jobType: 'full-time',
                postedBy: recruiterId,
                status: 'closed',
            });

            const response = await request(app)
                .post('/api/applications')
                .set('Authorization', `Bearer ${jobSeekerToken}`)
                .send({
                    jobId: inactiveJob._id.toString(),
                    coverLetter: 'Applying to closed job',
                });

            expect(response.status).toBe(400);
        });

        it('denies non-jobSeekers from applying', async () => {
            const response = await request(app)
                .post('/api/applications')
                .set('Authorization', `Bearer ${recruiterToken}`)
                .send({
                    jobId: testJobId.toString(),
                    coverLetter: 'Recruiter applying',
                });

            expect(response.status).toBe(403);
        });

        it('requires authentication', async () => {
            const response = await request(app)
                .post('/api/applications')
                .send({
                    jobId: testJobId.toString(),
                    coverLetter: 'Unauthenticated attempt',
                });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/applications/my-applications', () => {
        beforeEach(async () => {
            await Application.deleteMany({});

            const job2 = await Job.create({
                title: 'Frontend Developer',
                description: 'Build beautiful UIs.',
                company: 'Design Co',
                location: 'Remote',
                jobType: 'remote',
                postedBy: recruiterId,
                status: 'active',
            });

            await Application.create({
                applicant: jobSeekerId,
                job: testJobId,
                coverLetter: 'Application 1',
                status: 'pending',
            });

            await Application.create({
                applicant: jobSeekerId,
                job: job2._id,
                coverLetter: 'Application 2',
                status: 'reviewed',
            });
        });

        it('returns job seeker applications', async () => {
            const response = await request(app)
                .get('/api/applications/my-applications')
                .set('Authorization', `Bearer ${jobSeekerToken}`);

            expect(response.status).toBe(200);
            expect(response.body.applications).toHaveLength(2);
        });

        it('filters applications by status', async () => {
            const response = await request(app)
                .get('/api/applications/my-applications?status=pending')
                .set('Authorization', `Bearer ${jobSeekerToken}`);

            expect(response.status).toBe(200);
            expect(response.body.applications).toHaveLength(1);
            expect(response.body.applications[0].status).toBe('pending');
        });

        it('supports pagination', async () => {
            const response = await request(app)
                .get('/api/applications/my-applications?page=1&limit=1')
                .set('Authorization', `Bearer ${jobSeekerToken}`);

            expect(response.status).toBe(200);
            expect(response.body.applications).toHaveLength(1);
            expect(response.body.pagination.pages).toBe(2);
        });
    });

    describe('GET /api/applications/jobs/:jobId/applications', () => {
        beforeEach(async () => {
            await Application.deleteMany({});

            const seeker2 = await User.create({
                firstName: 'Jane',
                lastName: 'Applicant',
                email: `jane-${Date.now()}@example.com`,
                password: 'Password123',
                role: 'jobSeeker',
            });

            await Application.create({
                applicant: jobSeekerId,
                job: testJobId,
                coverLetter: 'Application 1',
                status: 'pending',
            });

            await Application.create({
                applicant: seeker2._id,
                job: testJobId,
                coverLetter: 'Application 2',
                status: 'reviewed',
            });
        });

        it('allows job owner to view applications', async () => {
            const response = await request(app)
                .get(`/api/applications/jobs/${testJobId}/applications`)
                .set('Authorization', `Bearer ${recruiterToken}`);

            expect(response.status).toBe(200);
            expect(response.body.applications).toHaveLength(2);
            expect(response.body.stats).toBeDefined();
            expect(response.body.stats.total).toBe(2);
        });

        it('includes application statistics', async () => {
            const response = await request(app)
                .get(`/api/applications/jobs/${testJobId}/applications`)
                .set('Authorization', `Bearer ${recruiterToken}`);

            expect(response.status).toBe(200);
            expect(response.body.stats.pending).toBe(1);
            expect(response.body.stats.reviewed).toBe(1);
        });

        it('denies non-owner recruiter access', async () => {
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
                .get(`/api/applications/jobs/${testJobId}/applications`)
                .set('Authorization', `Bearer ${otherLogin.body.token}`);

            expect(response.status).toBe(403);
        });

        it('allows admin to view any job applications', async () => {
            const response = await request(app)
                .get(`/api/applications/jobs/${testJobId}/applications`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
        });
    });

    describe('PUT /api/applications/:applicationId/status', () => {
        beforeEach(async () => {
            const app1 = await Application.create({
                applicant: jobSeekerId,
                job: testJobId,
                coverLetter: 'Test application',
                status: 'pending',
            });
            testApplicationId = app1._id;
        });

        it('allows job owner to update application status', async () => {
            const response = await request(app)
                .put(`/api/applications/${testApplicationId}/status`)
                .set('Authorization', `Bearer ${recruiterToken}`)
                .send({ status: 'reviewed' });

            expect(response.status).toBe(200);
            expect(response.body.application.status).toBe('reviewed');
            expect(response.body.application.statusHistory).toHaveLength(1);
        });

        it('tracks status change history', async () => {
            await request(app)
                .put(`/api/applications/${testApplicationId}/status`)
                .set('Authorization', `Bearer ${recruiterToken}`)
                .send({ status: 'reviewed' });

            const response = await request(app)
                .put(`/api/applications/${testApplicationId}/status`)
                .set('Authorization', `Bearer ${recruiterToken}`)
                .send({ status: 'interview' });

            expect(response.body.application.statusHistory).toHaveLength(2);
            expect(response.body.application.statusHistory[0].status).toBe('reviewed');
            expect(response.body.application.statusHistory[1].status).toBe('interview');
        });

        it('denies non-owner recruiter from updating', async () => {
            await User.create({
                firstName: 'Other',
                lastName: 'HR',
                email: 'other2@company.com',
                password: 'Password123',
                role: 'recruiter',
            });

            const otherLogin = await request(app)
                .post('/api/auth/login')
                .send({ email: 'other2@company.com', password: 'Password123' });

            const response = await request(app)
                .put(`/api/applications/${testApplicationId}/status`)
                .set('Authorization', `Bearer ${otherLogin.body.token}`)
                .send({ status: 'reviewed' });

            expect(response.status).toBe(403);
        });

        it('allows admin to update any application', async () => {
            const response = await request(app)
                .put(`/api/applications/${testApplicationId}/status`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ status: 'accepted' });

            expect(response.status).toBe(200);
            expect(response.body.application.status).toBe('accepted');
        });
    });

    describe('GET /api/applications/:applicationId', () => {
        beforeEach(async () => {
            await Application.deleteMany({});

            const app1 = await Application.create({
                applicant: jobSeekerId,
                job: testJobId,
                coverLetter: 'Test application',
            });
            testApplicationId = app1._id;
        });

        it('allows applicant to view own application', async () => {
            const response = await request(app)
                .get(`/api/applications/${testApplicationId}`)
                .set('Authorization', `Bearer ${jobSeekerToken}`);

            expect(response.status).toBe(200);
            expect(response.body.application.applicant).toBeDefined();
        });

        it('allows job owner to view application', async () => {
            const response = await request(app)
                .get(`/api/applications/${testApplicationId}`)
                .set('Authorization', `Bearer ${recruiterToken}`);

            expect(response.status).toBe(200);
        });

        it('denies unauthorized access', async () => {
            await User.create({
                firstName: 'Other',
                lastName: 'Seeker',
                email: 'other3@example.com',
                password: 'Password123',
                role: 'jobSeeker',
            });

            const otherLogin = await request(app)
                .post('/api/auth/login')
                .send({ email: 'other3@example.com', password: 'Password123' });

            const response = await request(app)
                .get(`/api/applications/${testApplicationId}`)
                .set('Authorization', `Bearer ${otherLogin.body.token}`);

            expect(response.status).toBe(403);
        });
    });
});
