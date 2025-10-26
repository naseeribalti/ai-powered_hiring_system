const path = require('path');
const fs = require('fs').promises;

class ChatbotService {
    constructor() {
        this.trainingData = null;
        this.loadTrainingData();
    }

    async loadTrainingData() {
        try {
            const dataPath = path.join(__dirname, '../../ai-ml/data/chatbot_training_data.json');
            const data = await fs.readFile(dataPath, 'utf8');
            this.trainingData = JSON.parse(data);
            console.log(`✅ Chatbot training data loaded: ${this.trainingData.intents.length} intents`);
        } catch (error) {
            console.error('⚠️  Could not load chatbot training data:', error.message);
            this.trainingData = { intents: [] };
        }
    }

    /**
     * Find the best matching intent for user message
     * @param {string} message - User's message
     * @returns {object} - Matched intent with confidence score
     */
    findIntent(message) {
        if (!this.trainingData || !this.trainingData.intents) {
            return null;
        }

        const normalizedMessage = message.toLowerCase().trim();
        let bestMatch = null;
        let highestScore = 0;

        for (const intent of this.trainingData.intents) {
            for (const pattern of intent.patterns) {
                const normalizedPattern = pattern.toLowerCase();

                // Calculate similarity score
                let score = 0;

                // Exact match
                if (normalizedMessage === normalizedPattern) {
                    score = 1.0;
                }
                // Contains pattern
                else if (normalizedMessage.includes(normalizedPattern)) {
                    score = 0.8;
                }
                // Pattern contains message
                else if (normalizedPattern.includes(normalizedMessage)) {
                    score = 0.7;
                }
                // Word overlap
                else {
                    const messageWords = normalizedMessage.split(/\s+/);
                    const patternWords = normalizedPattern.split(/\s+/);
                    const overlap = messageWords.filter(word =>
                        patternWords.some(pWord => pWord.includes(word) || word.includes(pWord))
                    ).length;

                    score = overlap / Math.max(messageWords.length, patternWords.length);
                }

                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = intent;
                }
            }
        }

        return highestScore > 0.3 ? {
            intent: bestMatch,
            confidence: highestScore,
            response: bestMatch.responses[Math.floor(Math.random() * bestMatch.responses.length)]
        } : null;
    }

    /**
     * Generate contextual job recommendations based on query
     * @param {string} query - User's job search query
     * @param {object} filters - Additional filters (salary, location, etc.)
     * @returns {object} - Job suggestions with reasoning
     */
    generateJobSuggestions(query, filters = {}) {
        const suggestions = {
            categories: [],
            salaryRange: null,
            experienceLevel: null,
            recommendations: []
        };

        const normalizedQuery = query.toLowerCase();

        // Detect salary preferences
        if (normalizedQuery.includes('best salary') || normalizedQuery.includes('highest pay')) {
            suggestions.salaryRange = { min: 100000, max: 250000 };
            suggestions.categories.push('High-Paying Positions');
            suggestions.recommendations.push({
                title: 'Software Architect',
                reason: 'Highest paying tech role with strong market demand',
                salaryRange: '$150K-$250K'
            });
        } else if (normalizedQuery.includes('good salary') || normalizedQuery.includes('competitive')) {
            suggestions.salaryRange = { min: 60000, max: 100000 };
            suggestions.categories.push('Competitive Mid-Range Positions');
        }

        // Detect experience level
        if (normalizedQuery.includes('training') || normalizedQuery.includes('trainee') ||
            normalizedQuery.includes('intern') || normalizedQuery.includes('entry')) {
            suggestions.experienceLevel = 'entry';
            suggestions.categories.push('Training & Entry-Level Positions');
            suggestions.recommendations.push({
                title: 'Management Trainee Program',
                reason: 'Structured training with career progression',
                salaryRange: '$45K-$60K + training'
            });
        }

        // Detect remote preference
        if (normalizedQuery.includes('remote') || normalizedQuery.includes('work from home')) {
            suggestions.categories.push('Remote Opportunities');
            suggestions.recommendations.push({
                title: 'Remote Software Engineer',
                reason: 'High demand for remote tech talent',
                salaryRange: '$90K-$150K'
            });
        }

        // Detect industry
        if (normalizedQuery.includes('tech') || normalizedQuery.includes('software') || normalizedQuery.includes('it')) {
            suggestions.categories.push('Technology & Software');
        } else if (normalizedQuery.includes('marketing') || normalizedQuery.includes('digital')) {
            suggestions.categories.push('Marketing & Advertising');
        } else if (normalizedQuery.includes('finance') || normalizedQuery.includes('accounting')) {
            suggestions.categories.push('Finance & Accounting');
        } else if (normalizedQuery.includes('healthcare') || normalizedQuery.includes('medical')) {
            suggestions.categories.push('Healthcare & Medical');
        }

        return suggestions;
    }

    /**
     * Process user message and generate response
     * @param {string} message - User's message
     * @param {object} context - User context (role, preferences, history)
     * @returns {object} - Chatbot response with suggestions
     */
    async processMessage(message, context = {}) {
        // Try to find intent match
        const intentMatch = this.findIntent(message);

        if (intentMatch && intentMatch.confidence > 0.5) {
            const response = {
                message: intentMatch.response,
                confidence: intentMatch.confidence,
                intent: intentMatch.intent.tag,
                suggestions: []
            };

            // Add contextual job suggestions if relevant
            if (['best_salary_jobs', 'good_salary_jobs', 'training_jobs', 'remote_jobs',
                'entry_level', 'it_jobs', 'healthcare_jobs', 'marketing_jobs',
                'finance_jobs'].includes(intentMatch.intent.tag)) {
                const jobSuggestions = this.generateJobSuggestions(message);
                response.jobCategories = jobSuggestions.categories;
                response.recommendations = jobSuggestions.recommendations;
                response.suggestions = [
                    'View matching jobs',
                    'Filter by salary',
                    'Save search criteria',
                    'Get email alerts'
                ];
            }

            // Add quick actions based on intent
            if (intentMatch.intent.tag === 'resume_help') {
                response.suggestions = [
                    'Upload resume for AI analysis',
                    'View resume templates',
                    'Get personalized feedback'
                ];
            } else if (intentMatch.intent.tag === 'interview_prep') {
                response.suggestions = [
                    'Practice common questions',
                    'Watch interview tips video',
                    'Schedule mock interview'
                ];
            } else if (intentMatch.intent.tag === 'job_search_help') {
                response.suggestions = [
                    'Start job search',
                    'Upload your resume',
                    'Set job alerts',
                    'View recommended jobs'
                ];
            }

            return response;
        }

        // Fallback response
        return {
            message: "I'm here to help you with your job search! You can ask me about:\n\n" +
                "• Finding jobs (best salary, training positions, remote work)\n" +
                "• Career advice (resume tips, interview prep, salary negotiation)\n" +
                "• Industry information (IT, healthcare, marketing, finance)\n" +
                "• Job search strategies\n\n" +
                "What would you like to know?",
            confidence: 0,
            intent: 'fallback',
            suggestions: [
                'Show me best paying jobs',
                'I need interview tips',
                'Help with my resume',
                'Find training positions'
            ]
        };
    }

    /**
     * Get conversation starters based on user profile
     * @param {object} userProfile - User's profile data
     * @returns {array} - Suggested conversation starters
     */
    getConversationStarters(userProfile) {
        const starters = [];

        if (userProfile.role === 'jobSeeker') {
            if (!userProfile.resume_uploaded) {
                starters.push('Upload your resume for AI-powered job matching');
            }
            if (userProfile.applications_count === 0) {
                starters.push('Show me jobs that match my profile');
            }
            starters.push('What are the highest paying jobs in my field?');
            starters.push('Help me prepare for interviews');
        } else if (userProfile.role === 'recruiter') {
            starters.push('How can I attract top talent?');
            starters.push('Show me recruiting best practices');
            starters.push('Help me write a compelling job description');
        }

        return starters;
    }
}

// Singleton instance
const chatbotService = new ChatbotService();

module.exports = chatbotService;
