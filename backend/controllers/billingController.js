const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const { createCheckoutSession, cancelAtPeriodEnd } = require('../services/paymentService');

// List active plans (public)
exports.getPlans = async (req, res, next) => {
    try {
        const plans = await Plan.find({ active: true }).sort({ sortOrder: 1, price: 1 });
        res.json({ plans });
    } catch (err) {
        next(err);
    }
};

// Get current user's subscription
exports.getMySubscription = async (req, res, next) => {
    try {
        const sub = await Subscription.findOne({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('plan');
        res.json({ subscription: sub });
    } catch (err) {
        next(err);
    }
};

// Subscribe current user to a plan
exports.subscribe = async (req, res, next) => {
    try {
        const { planId } = req.body || {};
        if (!planId) {
            return res.status(400).json({ message: 'planId is required' });
        }

        const plan = await Plan.findById(planId);
        if (!plan || !plan.active) {
            return res.status(404).json({ message: 'Plan not found or inactive' });
        }

        // Create or update user's subscription
        const now = new Date();
        const periodMs = plan.interval === 'year' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
        const currentPeriodEnd = new Date(now.getTime() + periodMs);

        if (!plan.price || plan.price <= 0) {
            // Free plan: activate immediately
            const sub = await Subscription.findOneAndUpdate(
                { user: req.user._id },
                {
                    user: req.user._id,
                    plan: plan._id,
                    status: 'active',
                    startDate: now,
                    currentPeriodEnd,
                    cancelAtPeriodEnd: false,
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            ).populate('plan');
            return res.json({ subscription: sub, checkout: null });
        }

        // Paid plan: initiate checkout session (placeholder)
        const checkout = await createCheckoutSession(req.user, plan);
        const sub = await Subscription.findOneAndUpdate(
            { user: req.user._id },
            {
                user: req.user._id,
                plan: plan._id,
                status: 'pending',
                startDate: now,
                currentPeriodEnd,
                cancelAtPeriodEnd: false,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).populate('plan');

        res.json({ subscription: sub, checkout });
    } catch (err) {
        next(err);
    }
};

// Cancel at period end
exports.cancel = async (req, res, next) => {
    try {
        const sub = await Subscription.findOne({ user: req.user._id }).populate('plan');
        if (!sub) return res.status(404).json({ message: 'No active subscription found' });

        if (sub.cancelAtPeriodEnd) {
            return res.json({ subscription: sub });
        }

        await cancelAtPeriodEnd();
        sub.cancelAtPeriodEnd = true;
        await sub.save();

        res.json({ subscription: sub });
    } catch (err) {
        next(err);
    }
};

// Webhook placeholder (e.g., Stripe) — for now, just 200 OK
exports.webhook = async (req, res) => {
    return res.status(200).send('ok');
};
