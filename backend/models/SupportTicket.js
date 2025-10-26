const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, enum: ['user', 'admin', 'system'], required: true },
    content: { type: String, required: true, trim: true },
    attachments: [{ type: String, trim: true }],
    createdAt: { type: Date, default: Date.now }
});

const supportTicketSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        subject: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        category: {
            type: String,
            enum: ['technical', 'billing', 'account', 'feature_request', 'bug_report', 'other'],
            default: 'other'
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium'
        },
        status: {
            type: String,
            enum: ['open', 'in_progress', 'waiting_for_user', 'resolved', 'closed'],
            default: 'open',
            index: true
        },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        messages: [messageSchema],
        tags: [{ type: String, trim: true }],
        metadata: { type: Map, of: String }
    },
    { timestamps: true }
);

supportTicketSchema.index({ user: 1, status: 1 });
supportTicketSchema.index({ assignedTo: 1, status: 1 });
supportTicketSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
