/**
 * Test Registration API Endpoint
 * Run this with: node test-registration.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

// Test data
const testUsers = {
    jobSeeker: {
        firstName: 'John',
        lastName: 'Doe',
        email: `test.jobseeker.${Date.now()}@example.com`, // Unique email
        password: 'Password123!',
        role: 'jobSeeker',
        phone: '555-123-4567'
    },
    recruiter: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: `test.recruiter.${Date.now()}@example.com`, // Unique email
        password: 'Password123!',
        role: 'recruiter',
        phone: '555-987-6543',
        companyName: 'Tech Corp',
        companyWebsite: 'https://techcorp.com',
        companyDetails: 'Leading technology company'
    }
};

async function testRegistration(userData, userType) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing ${userType.toUpperCase()} Registration`);
    console.log('='.repeat(60));

    console.log('\n📤 Sending data:');
    console.log(JSON.stringify(userData, null, 2));

    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);

        console.log('\n✅ SUCCESS!');
        console.log('\n📥 Response:');
        console.log(`Status: ${response.status}`);
        console.log('Data:', JSON.stringify(response.data, null, 2));

        return { success: true, data: response.data };
    } catch (error) {
        console.log('\n❌ FAILED!');

        if (error.response) {
            console.log(`\nStatus: ${error.response.status}`);
            console.log('Error Response:', JSON.stringify(error.response.data, null, 2));

            // If validation errors (422)
            if (error.response.status === 422 && error.response.data.errors) {
                console.log('\n🔍 Validation Errors:');
                error.response.data.errors.forEach(err => {
                    console.log(`  - ${err.field}: ${err.message}`);
                });
            }
        } else if (error.request) {
            console.log('\n❌ No response received from server');
            console.log('Is the backend running on http://localhost:3001?');
        } else {
            console.log('\n❌ Error:', error.message);
        }

        return { success: false, error };
    }
}

async function runTests() {
    console.log('\n🧪 AI HIRING SYSTEM - REGISTRATION API TEST');
    console.log('='.repeat(60));
    console.log('Testing registration endpoint at:', API_URL);
    console.log('Make sure your backend is running on port 3001!');

    // Test Job Seeker registration
    await testRegistration(testUsers.jobSeeker, 'Job Seeker');

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test Recruiter registration
    await testRegistration(testUsers.recruiter, 'Recruiter');

    console.log('\n' + '='.repeat(60));
    console.log('✅ Tests Complete!');
    console.log('='.repeat(60));
    console.log('\nCheck the results above to see if registration worked.');
    console.log('If you see validation errors, those are the fields that need fixing.\n');
}

// Run tests
runTests().catch(error => {
    console.error('\n❌ Unexpected error:', error.message);
    process.exit(1);
});
