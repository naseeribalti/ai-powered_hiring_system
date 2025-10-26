const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
        status: {
            type: String,
            enum: [
                'active',
                'trialing',
                'past_due',
                'canceled',
                'incomplete',
                'incomplete_expired',
                'unpaid',
                'pending'
            ],
            default: 'pending'
        },
        startDate: { type: Date, default: Date.now },
        currentPeriodEnd: { type: Date },
        cancelAtPeriodEnd: { type: Boolean, default: false },
        // Provider bindings (Stripe, etc.)
        stripeCustomerId: { type: String, trim: true },
        stripeSubscriptionId: { type: String, trim: true },
        metadata: { type: Map, of: String },
    },
    { timestamps: true }
);

subscriptionSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
