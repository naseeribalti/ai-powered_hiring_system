// AIChatbot.jsx - Smart AI Assistant for Hiring Platform
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AIChatbot.css';

const AIChatbot = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: `Hi${user ? ` ${user.firstName}` : ''}! 👋 I'm your AI hiring assistant. How can I help you today?`,
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // AI Response Logic
    const getAIResponse = (message) => {
        const lowerMessage = message.toLowerCase();

        // Role-based responses
        const roleContext = user?.role || 'visitor';

        // Common responses
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return `Hello! I'm here to help you with your ${roleContext === 'recruiter' ? 'recruitment' : roleContext === 'jobSeeker' ? 'job search' : 'hiring platform'} needs. What would you like to know?`;
        }

        if (lowerMessage.includes('help')) {
            if (roleContext === 'recruiter') {
                return "I can help you with:\n• Posting new jobs\n• Managing applications\n• Finding the right candidates\n• Understanding AI scoring\n• Platform analytics\n\nWhat specific area interests you?";
            } else if (roleContext === 'jobSeeker') {
                return "I can help you with:\n• Finding relevant jobs\n• Improving your profile\n• Application tips\n• Resume optimization\n• Interview preparation\n\nWhat would you like assistance with?";
            } else {
                return "I can help you with:\n• Platform features\n• Getting started\n• Account setup\n• Job search tips\n• Recruitment guidance\n\nWhat interests you most?";
            }
        }

        // Job-related queries
        if (lowerMessage.includes('job') || lowerMessage.includes('position')) {
            if (roleContext === 'recruiter') {
                return "For job posting, you can:\n• Use our AI-powered job description generator\n• Set specific skill requirements\n• Define salary ranges\n• Target specific experience levels\n\nWould you like me to guide you through posting a job?";
            } else {
                return "For job searching, I recommend:\n• Using our AI job matching\n• Setting up job alerts\n• Optimizing your profile keywords\n• Applying to jobs with 80%+ match scores\n\nWant me to help you find relevant positions?";
            }
        }

        // Resume/Profile queries
        if (lowerMessage.includes('resume') || lowerMessage.includes('profile')) {
            return "For profile optimization:\n• Upload a recent resume\n• Add relevant skills and certifications\n• Include work experience details\n• Use industry keywords\n• Keep information updated\n\nOur AI analyzes your profile for better job matching!";
        }

        // Application queries
        if (lowerMessage.includes('application') || lowerMessage.includes('apply')) {
            if (roleContext === 'recruiter') {
                return "For managing applications:\n• Review AI-scored candidates\n• Use bulk actions for efficiency\n• Set up automated responses\n• Track application pipeline\n• Schedule interviews directly\n\nNeed help with any specific application management task?";
            } else {
                return "For job applications:\n• Tailor your cover letter to each job\n• Highlight relevant skills\n• Apply within 24-48 hours of posting\n• Follow up professionally\n• Track your application status\n\nWant tips for a specific application?";
            }
        }

        // AI/Scoring queries
        if (lowerMessage.includes('ai') || lowerMessage.includes('score') || lowerMessage.includes('matching')) {
            return "Our AI system provides:\n• Skills matching analysis\n• Experience level assessment\n• Education relevance scoring\n• Location compatibility\n• Salary expectation alignment\n• Overall compatibility percentage\n\nThe higher the match score, the better the fit! Aim for 80%+ matches.";
        }

        // Salary queries
        if (lowerMessage.includes('salary') || lowerMessage.includes('pay') || lowerMessage.includes('compensation')) {
            return "Regarding compensation:\n• Research market rates for your role\n• Consider total compensation package\n• Factor in location and experience\n• Use our salary insights tool\n• Be prepared to negotiate professionally\n\nWould you like help with salary research or negotiation tips?";
        }

        // Interview queries
        if (lowerMessage.includes('interview')) {
            return "Interview preparation tips:\n• Research the company thoroughly\n• Practice common interview questions\n• Prepare specific examples (STAR method)\n• Dress appropriately for company culture\n• Prepare thoughtful questions to ask\n• Follow up with a thank-you note\n\nNeed help with specific interview scenarios?";
        }

        // Technical queries
        if (lowerMessage.includes('technical') || lowerMessage.includes('skills')) {
            return "For technical skills:\n• Keep your skills list updated\n• Include proficiency levels\n• Add relevant certifications\n• Showcase recent projects\n• Highlight in-demand technologies\n\nOur AI matches your skills with job requirements automatically!";
        }

        // Default responses
        const defaultResponses = [
            "That's an interesting question! Could you provide more details so I can give you a more specific answer?",
            "I'd be happy to help with that! Can you tell me more about what you're looking for?",
            "Great question! Let me know if you need information about jobs, applications, profiles, or platform features.",
            "I'm here to assist you! Feel free to ask about any aspect of the hiring process or platform features."
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate AI thinking time
        setTimeout(() => {
            const aiResponse = {
                id: Date.now() + 1,
                text: getAIResponse(inputMessage),
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1000 + Math.random() * 2000); // 1-3 seconds delay
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const quickActions = [
        { text: "How do I post a job?", action: () => setInputMessage("How do I post a job?") },
        { text: "Find me relevant jobs", action: () => setInputMessage("Find me relevant jobs") },
        { text: "Improve my profile", action: () => setInputMessage("How can I improve my profile?") },
        { text: "Application tips", action: () => setInputMessage("Give me application tips") }
    ];

    return (
        <>
            {/* Chat Toggle Button */}
            <div
                className={`chat-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <i className="fas fa-times"></i>
                ) : (
                    <>
                        <i className="fas fa-robot"></i>
                        <span className="chat-badge">AI</span>
                    </>
                )}
            </div>

            {/* Chat Window */}
            <div className={`chat-window ${isOpen ? 'open' : ''}`}>
                <div className="chat-header">
                    <div className="chat-header-info">
                        <div className="bot-avatar">
                            <i className="fas fa-robot"></i>
                        </div>
                        <div className="bot-info">
                            <h6>AI Hiring Assistant</h6>
                            <span className="status">Online</span>
                        </div>
                    </div>
                    <button
                        className="chat-minimize"
                        onClick={() => setIsOpen(false)}
                    >
                        <i className="fas fa-minus"></i>
                    </button>
                </div>

                <div className="chat-messages">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message ${message.sender}`}
                        >
                            {message.sender === 'bot' && (
                                <div className="message-avatar">
                                    <i className="fas fa-robot"></i>
                                </div>
                            )}
                            <div className="message-content">
                                <div className="message-text">
                                    {message.text.split('\n').map((line, index) => (
                                        <div key={index}>{line}</div>
                                    ))}
                                </div>
                                <div className="message-time">
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="message bot typing">
                            <div className="message-avatar">
                                <i className="fas fa-robot"></i>
                            </div>
                            <div className="message-content">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length <= 1 && (
                    <div className="quick-actions">
                        <div className="quick-actions-title">Quick Help:</div>
                        <div className="quick-actions-buttons">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    className="quick-action-btn"
                                    onClick={action.action}
                                >
                                    {action.text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="chat-input">
                    <div className="input-container">
                        <textarea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything about jobs, applications, or the platform..."
                            rows="1"
                            disabled={isTyping}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isTyping}
                            className="send-button"
                        >
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AIChatbot;
