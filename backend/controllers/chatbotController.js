const chatbotService = require('../services/chatbotService');

/**
 * @desc    Send message to chatbot and get response
 * @route   POST /api/chatbot/message
 * @access  Public (but enhanced for authenticated users)
 */
exports.sendMessage = async (req, res, next) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Message is required'
            });
        }

        // Build user context
        const context = {
            userId: req.user?._id,
            role: req.user?.role,
            conversationHistory
        };

        // Process message through chatbot service
        const response = await chatbotService.processMessage(message, context);

        res.status(200).json({
            status: 'success',
            data: {
                userMessage: message,
                botResponse: response.message,
                confidence: response.confidence,
                intent: response.intent,
                suggestions: response.suggestions || [],
                recommendations: response.recommendations || [],
                jobCategories: response.jobCategories || [],
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get conversation starters for user
 * @route   GET /api/chatbot/starters
 * @access  Public (enhanced for authenticated users)
 */
exports.getConversationStarters = async (req, res, next) => {
    try {
        const userProfile = req.user ? {
            role: req.user.role,
            resume_uploaded: req.user.resume ? true : false,
            applications_count: req.user.applications?.length || 0
        } : {
            role: 'guest'
        };

        const starters = chatbotService.getConversationStarters(userProfile);

        res.status(200).json({
            status: 'success',
            data: {
                starters: starters.length > 0 ? starters : [
                    'Show me the best paying jobs',
                    'I need help with my resume',
                    'What training positions are available?',
                    'Find me remote work opportunities'
                ]
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get job suggestions based on chatbot query
 * @route   POST /api/chatbot/job-suggestions
 * @access  Public
 */
exports.getJobSuggestions = async (req, res, next) => {
    try {
        const { query, filters = {} } = req.body;

        if (!query || query.trim().length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Query is required'
            });
        }

        const suggestions = chatbotService.generateJobSuggestions(query, filters);

        res.status(200).json({
            status: 'success',
            data: suggestions
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get chatbot analytics (for admin)
 * @route   GET /api/chatbot/analytics
 * @access  Private/Admin
 */
exports.getChatbotAnalytics = async (req, res, next) => {
    try {
        // This would typically pull from a database of chatbot interactions
        // For now, return mock analytics
        res.status(200).json({
            status: 'success',
            data: {
                totalConversations: 15420,
                totalMessages: 45680,
                averageConfidence: 0.78,
                topIntents: [
                    { intent: 'best_salary_jobs', count: 3420 },
                    { intent: 'job_search_help', count: 2890 },
                    { intent: 'resume_help', count: 2560 },
                    { intent: 'interview_prep', count: 1980 },
                    { intent: 'remote_jobs', count: 1750 }
                ],
                userSatisfaction: 4.3,
                resolvedQueries: 12340,
                unresolvedQueries: 3080
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = exports;
