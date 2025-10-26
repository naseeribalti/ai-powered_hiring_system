const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        price: { type: Number, required: true, min: 0 },
        currency: { type: String, default: 'USD', uppercase: true },
        interval: { type: String, enum: ['month', 'year'], default: 'month' },
        features: [{ type: String, trim: true }],
        active: { type: Boolean, default: true },
        // Payment provider bindings (optional)
        stripePriceId: { type: String, trim: true },
        sortOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

planSchema.index({ active: 1, price: 1 });

module.exports = mongoose.model('Plan', planSchema);
