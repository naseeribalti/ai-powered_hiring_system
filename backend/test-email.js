// backend/test-email.js - Quick Email Service Test
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const emailService = require('../config/email');

(async function quickTest() {
    console.log('🚀 Testing EmailService integration...\n');

    // Show service status first
    if (typeof emailService.getStatus === 'function') {
        console.log('Service status:', emailService.getStatus());
    }

    const testUser = {
        name: 'Nasir Udeen',
        email: process.env.TEST_EMAIL_TO || 'example@example.com',
    };

    const testJob = {
        title: 'Senior React Developer',
        company: 'Tech Innovations Inc',
        location: 'Remote',
    };

    try {
        console.log('1) Testing WELCOME template...');
        const res1 = await emailService.sendTemplateEmail(
            testUser.email,
            'WELCOME',
            testUser
        );
        console.log('WELCOME result:', res1);
    } catch (err) {
        console.error('WELCOME failed:', err.message || err);
    }

    try {
        console.log('\n2) Testing APPLICATION_RECEIVED template...');
        // Our EmailService expects (application, job, user)
        const application = { _id: 'test-app-123' };
        const res2 = await emailService.sendTemplateEmail(
            testUser.email,
            'APPLICATION_RECEIVED',
            { application, job: testJob, user: testUser }
        );
        console.log('APPLICATION_RECEIVED result:', res2);
    } catch (err) {
        console.error('APPLICATION_RECEIVED failed:', err.message || err);
    }

    console.log('\n✅ Test completed.');
})();
