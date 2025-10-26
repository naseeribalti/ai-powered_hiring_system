// Seed default subscription plans
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });

const { connectDB, disconnectDB } = require('../backend/utils/db');
const Plan = require('../backend/models/Plan');

async function run() {
    await connectDB();

    const defaults = [
        {
            name: 'Free',
            description: 'Basic access with limited features',
            price: 0,
            currency: 'USD',
            interval: 'month',
            features: [
                'Apply to up to 5 jobs/month',
                'Basic resume parsing',
                'Email notifications',
            ],
            sortOrder: 0,
            active: true,
        },
        {
            name: 'Pro',
            description: 'Advanced features for recruiters and teams',
            price: 49,
            currency: 'USD',
            interval: 'month',
            features: [
                'Unlimited job postings',
                'AI candidate ranking',
                'Priority support',
                'Advanced analytics',
            ],
            sortOrder: 1,
            active: true,
        },
        {
            name: 'Pro (Annual)',
            description: 'Annual plan with a discount',
            price: 499,
            currency: 'USD',
            interval: 'year',
            features: [
                'Unlimited job postings',
                'AI candidate ranking',
                'Priority support',
                'Advanced analytics',
            ],
            sortOrder: 2,
            active: true,
        },
    ];

    for (const plan of defaults) {
        const existing = await Plan.findOne({ name: plan.name, interval: plan.interval });
        if (existing) {
            await Plan.updateOne({ _id: existing._id }, { $set: plan });
            // eslint-disable-next-line no-console
            console.log(`Updated plan: ${plan.name} (${plan.interval})`);
        } else {
            await Plan.create(plan);
            // eslint-disable-next-line no-console
            console.log(`Created plan: ${plan.name} (${plan.interval})`);
        }
    }

    await disconnectDB();
}

run().then(() => {
    // eslint-disable-next-line no-console
    console.log('Done seeding plans');
    process.exit(0);
}).catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to seed plans:', err);
    process.exit(1);
});
