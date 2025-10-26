// paymentService: provider-agnostic wrappers (Stripe or fallback manual mode)
// For now, this uses a safe fallback that doesn't hit any real provider.

async function createCheckoutSession(user, plan) {
    // Free plans don't need checkout
    if (!plan.price || plan.price <= 0) {
        return { mode: 'free', sessionId: null, clientSecret: null };
    }

    // Placeholder manual mode: in production replace with Stripe session creation
    const sessionId = `sess_${Date.now()}`;
    return { mode: 'manual', sessionId, clientSecret: null };
}

async function cancelAtPeriodEnd() {
    // Placeholder for provider cancel request; no-op for manual mode
    return { success: true };
}

module.exports = {
    createCheckoutSession,
    cancelAtPeriodEnd,
};
