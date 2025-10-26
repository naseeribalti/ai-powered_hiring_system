const SupportTicket = require('../models/SupportTicket');

// Create new support ticket
exports.createTicket = async (req, res, next) => {
    try {
        const { subject, description, category, priority } = req.body;

        if (!subject || !description) {
            return res.status(400).json({ message: 'Subject and description are required' });
        }

        const ticket = await SupportTicket.create({
            user: req.user._id,
            subject,
            description,
            category: category || 'other',
            priority: priority || 'medium',
            messages: [],
        });

        await ticket.populate('user', 'name email');

        res.status(201).json({ ticket });
    } catch (err) {
        next(err);
    }
};

// Get user's own tickets
exports.getMyTickets = async (req, res, next) => {
    try {
        const { status, category } = req.query;
        const filter = { user: req.user._id };

        if (status) filter.status = status;
        if (category) filter.category = category;

        const tickets = await SupportTicket.find(filter)
            .sort({ createdAt: -1 })
            .populate('user', 'name email')
            .populate('assignedTo', 'name email');

        res.json({ tickets });
    } catch (err) {
        next(err);
    }
};

// Get single ticket details (user can only see their own)
exports.getTicket = async (req, res, next) => {
    try {
        const ticket = await SupportTicket.findOne({
            _id: req.params.id,
            user: req.user._id,
        })
            .populate('user', 'name email')
            .populate('assignedTo', 'name email')
            .populate('messages.sender', 'name email role');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json({ ticket });
    } catch (err) {
        next(err);
    }
};

// Add message to ticket
exports.addMessage = async (req, res, next) => {
    try {
        const { message, attachments } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: 'Message content is required' });
        }

        const ticket = await SupportTicket.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.messages.push({
            sender: req.user._id,
            senderRole: 'user',
            content: message,
            attachments: attachments || [],
        });

        // If ticket was waiting for user, set back to in_progress
        if (ticket.status === 'waiting_for_user') {
            ticket.status = 'in_progress';
        }

        await ticket.save();
        await ticket.populate('messages.sender', 'name email role');

        res.json({ ticket });
    } catch (err) {
        next(err);
    }
};

// Close ticket (user)
exports.closeTicket = async (req, res, next) => {
    try {
        const ticket = await SupportTicket.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { status: 'closed' },
            { new: true }
        ).populate('user', 'name email');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json({ ticket });
    } catch (err) {
        next(err);
    }
};

// ============= ADMIN ENDPOINTS =============

// Get all tickets (admin)
exports.getAllTickets = async (req, res, next) => {
    try {
        const { status, priority, category, assignedTo, search } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (category) filter.category = category;
        if (assignedTo) filter.assignedTo = assignedTo;
        if (search) {
            filter.$or = [
                { subject: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [tickets, total] = await Promise.all([
            SupportTicket.find(filter)
                .sort({ priority: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('user', 'name email role')
                .populate('assignedTo', 'name email'),
            SupportTicket.countDocuments(filter),
        ]);

        res.json({
            tickets,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit,
            },
        });
    } catch (err) {
        next(err);
    }
};

// Get single ticket (admin - can see any)
exports.getTicketAdmin = async (req, res, next) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id)
            .populate('user', 'name email role')
            .populate('assignedTo', 'name email')
            .populate('messages.sender', 'name email role');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json({ ticket });
    } catch (err) {
        next(err);
    }
};

// Update ticket status/priority/assignment (admin)
exports.updateTicket = async (req, res, next) => {
    try {
        const { status, priority, assignedTo, tags } = req.body;
        const updates = {};

        if (status) updates.status = status;
        if (priority) updates.priority = priority;
        if (assignedTo !== undefined) updates.assignedTo = assignedTo;
        if (tags) updates.tags = tags;

        const ticket = await SupportTicket.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        )
            .populate('user', 'name email')
            .populate('assignedTo', 'name email');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json({ ticket });
    } catch (err) {
        next(err);
    }
};

// Add admin/support message
exports.addAdminMessage = async (req, res, next) => {
    try {
        const { message, attachments, isInternal } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: 'Message content is required' });
        }

        const ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.messages.push({
            sender: req.user._id,
            senderRole: 'admin',
            content: message,
            attachments: attachments || [],
            isInternal: isInternal || false,
        });

        // Update status if replying
        if (ticket.status === 'open') {
            ticket.status = 'in_progress';
        } else if (!isInternal) {
            ticket.status = 'waiting_for_user';
        }

        await ticket.save();
        await ticket.populate('messages.sender', 'name email role');

        res.json({ ticket });
    } catch (err) {
        next(err);
    }
};

// Get support analytics (admin)
exports.getSupportAnalytics = async (req, res, next) => {
    try {
        const [
            totalTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
            byPriority,
            byCategory,
        ] = await Promise.all([
            SupportTicket.countDocuments(),
            SupportTicket.countDocuments({ status: 'open' }),
            SupportTicket.countDocuments({ status: 'in_progress' }),
            SupportTicket.countDocuments({ status: 'resolved' }),
            SupportTicket.aggregate([
                { $group: { _id: '$priority', count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
            ]),
            SupportTicket.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
        ]);

        // Average resolution time (for resolved tickets in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentResolved = await SupportTicket.find({
            status: { $in: ['resolved', 'closed'] },
            updatedAt: { $gte: thirtyDaysAgo },
        }).select('createdAt updatedAt');

        let avgResolutionHours = 0;
        if (recentResolved.length > 0) {
            const totalTime = recentResolved.reduce((sum, ticket) => {
                return sum + (ticket.updatedAt - ticket.createdAt);
            }, 0);
            avgResolutionHours = Math.round(totalTime / recentResolved.length / (1000 * 60 * 60));
        }

        res.json({
            summary: {
                total: totalTickets,
                open: openTickets,
                inProgress: inProgressTickets,
                resolved: resolvedTickets,
                avgResolutionTime: `${avgResolutionHours} hours`,
            },
            byPriority: byPriority.map((p) => ({ priority: p._id, count: p.count })),
            byCategory: byCategory.map((c) => ({ category: c._id, count: c.count })),
        });
    } catch (err) {
        next(err);
    }
};
