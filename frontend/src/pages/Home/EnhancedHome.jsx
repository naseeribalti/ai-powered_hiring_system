// EnhancedHome.jsx - Enhanced AI Hiring System with Dark/Light Mode
// Developed by Muhammad Usama & Syed Qamar Abbas
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer/Footer';
import { useTheme } from '../../context/ThemeContext';
import './Home.css';

const EnhancedHome = () => {
    const { setTheme, resolvedTheme } = useTheme();

    const companies = [
        { name: 'Google', logo: '🔍' },
        { name: 'Microsoft', logo: '🪟' },
        { name: 'Amazon', logo: '📦' },
        { name: 'Meta', logo: '👥' },
        { name: 'Apple', logo: '🍎' },
        { name: 'Netflix', logo: '🎬' }
    ];

    const stats = [
        { number: '50K+', label: 'Active Jobs', icon: '💼' },
        { number: '10K+', label: 'Companies', icon: '🏢' },
        { number: '500K+', label: 'Candidates', icon: '👥' },
        { number: '95%', label: 'Success Rate', icon: '🎯' },
    ];

    const features = [
        { icon: '🤖', title: 'AI-Powered Matching', desc: 'Advanced ML analyzes skills and culture to find perfect job matches.' },
        { icon: '⚡', title: 'Instant Applications', desc: '1-click apply with smart parsing, autofill, and tracking.' },
        { icon: '📊', title: 'Smart Analytics', desc: 'Salary trends, skill demand, and growth insights with dashboards.' },
        { icon: '🔒', title: 'Enterprise Security', desc: 'Encryption, GDPR compliance, and secure data handling.' },
        { icon: '🎯', title: 'Bias-Free Screening', desc: 'AI reduces unconscious bias to ensure fair opportunities.' },
        { icon: '🚀', title: 'Career Acceleration', desc: 'Coaching, skill recommendations, and interview prep.' },
    ];

    const testimonials = [
        { quote: 'We reduced our hiring time by 65%. AI matching is incredibly accurate.', author: 'Sarah Chen', role: 'Head of Talent, TechFlow', avatar: '👩‍💼', rating: 5 },
        { quote: 'I landed my dream job in 2 weeks. Resume analysis and prep were game-changers!', author: 'Michael Rodriguez', role: 'Senior Full-Stack Developer', avatar: '👨‍💻', rating: 5 },
        { quote: 'D&I features helped us build a representative team. 40% quality improvement.', author: 'Dr. Aisha Patel', role: 'Chief People Officer, InnovateCorp', avatar: '👩‍🔬', rating: 5 },
    ];

    const cycleTheme = () => {
        // Quick toggle between light and dark for the hero button; Navbar provides full selector
        const next = resolvedTheme === 'dark' ? 'light' : 'dark';
        setTheme(next);
    };

    return (
        <>
            <div className="home-page">
                {/* Theme Toggle Button (quick flip) */}
                <button className="theme-toggle" onClick={cycleTheme} aria-label="Toggle theme">
                    <span className="theme-icon">{resolvedTheme === 'dark' ? '☀️' : '🌙'}</span>
                    <span className="theme-text">{resolvedTheme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>

                {/* Hero Section */}
                <section className="home-hero">
                    <div className="hero-background">
                        <div className="hero-particles" />
                        <div className="hero-gradient" />
                    </div>

                    <div className="container">
                        <div className="row align-items-center min-vh-100">
                            <div className="col-lg-6">
                                <div className="hero-content">
                                    <div className="hero-badge">
                                        <span className="badge-icon">✨</span>
                                        <span>AI-Powered Hiring Platform</span>
                                    </div>

                                    <h1 className="hero-title">
                                        Find Your <span className="gradient-text">Dream Career</span>
                                        <br /> With AI Precision
                                    </h1>

                                    <p className="hero-subtitle">
                                        We connect exceptional talent with life-changing opportunities at top companies—
                                        powered by advanced AI.
                                    </p>

                                    <div className="hero-features">
                                        <div className="hero-feature"><span className="feature-icon">⚡</span><span>Instant Matching</span></div>
                                        <div className="hero-feature"><span className="feature-icon">🎯</span><span>95% Success Rate</span></div>
                                        <div className="hero-feature"><span className="feature-icon">🔒</span><span>100% Secure</span></div>
                                    </div>

                                    <div className="cta-group">
                                        <Link to="/register" className="btn btn-primary btn-lg">
                                            <span className="btn-icon">🚀</span>
                                            <span>Start Your Journey</span>
                                            <span className="btn-arrow">→</span>
                                        </Link>
                                        <Link to="/about" className="btn btn-outline btn-lg">
                                            <span className="btn-icon">📚</span>
                                            <span>How It Works</span>
                                        </Link>
                                    </div>

                                    <div className="trust-section">
                                        <div className="trust-label">Trusted by leading companies worldwide</div>
                                        <div className="company-logos">
                                            {companies.map((c, i) => (
                                                <div key={i} className="company-logo">
                                                    <span className="company-icon">{c.logo}</span>
                                                    <span className="company-name">{c.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="hero-visual">
                                    <div className="dashboard-preview">
                                        <div className="preview-header">
                                            <div className="preview-controls">
                                                <span className="control red"></span>
                                                <span className="control yellow"></span>
                                                <span className="control green"></span>
                                            </div>
                                            <div className="preview-title">AI Hiring Dashboard</div>
                                        </div>
                                        <div className="preview-content">
                                            <div className="preview-stats">
                                                <div className="stat-item"><div className="stat-value">24</div><div className="stat-label">Applications</div></div>
                                                <div className="stat-item"><div className="stat-value">6</div><div className="stat-label">Interviews</div></div>
                                                <div className="stat-item"><div className="stat-value">95%</div><div className="stat-label">Match Rate</div></div>
                                            </div>
                                            <div className="preview-chart" />
                                        </div>
                                    </div>

                                    <div className="floating-cards">
                                        <div className="floating-card card-1">
                                            <div className="card-header">
                                                <span className="avatar">👨‍💼</span>
                                                <div className="card-info">
                                                    <div className="job-title">Senior React Developer</div>
                                                    <div className="company">TechCorp • $120K-150K</div>
                                                </div>
                                            </div>
                                            <div className="match-badge excellent">95% Match</div>
                                        </div>

                                        <div className="floating-card card-2">
                                            <div className="card-header">
                                                <span className="avatar">👩‍🔬</span>
                                                <div className="card-info">
                                                    <div className="job-title">Data Scientist</div>
                                                    <div className="company">DataFlow • $140K-180K</div>
                                                </div>
                                            </div>
                                            <div className="match-badge good">92% Match</div>
                                        </div>

                                        <div className="floating-card card-3">
                                            <div className="card-header">
                                                <span className="avatar">🧑‍💻</span>
                                                <div className="card-info">
                                                    <div className="job-title">DevOps Engineer</div>
                                                    <div className="company">CloudSys • $130K-160K</div>
                                                </div>
                                            </div>
                                            <div className="match-badge average">88% Match</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="home-stats">
                    <div className="container">
                        <div className="stats-grid">
                            {stats.map((s, i) => (
                                <div key={i} className="stat-card">
                                    <div className="stat-icon">{s.icon}</div>
                                    <div className="stat-content">
                                        <div className="stat-number">{s.number}</div>
                                        <div className="stat-label">{s.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="home-features">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Why Choose AI Hiring System?</h2>
                            <p className="section-subtitle">Revolutionizing recruitment with cutting-edge AI</p>
                        </div>

                        <div className="features-grid">
                            {features.map((f, i) => (
                                <div key={i} className="feature-card">
                                    <div className="feature-icon">{f.icon}</div>
                                    <div className="feature-content">
                                        <h3 className="feature-title">{f.title}</h3>
                                        <p className="feature-desc">{f.desc}</p>
                                    </div>
                                    <div className="feature-arrow">→</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="home-process">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Get Hired in 3 Simple Steps</h2>
                            <p className="section-subtitle">Your journey to the perfect job starts here</p>
                        </div>

                        <div className="process-timeline">
                            <div className="process-step">
                                <div className="step-number">1</div>
                                <div className="step-content">
                                    <h3 className="step-title">Create Your AI Profile</h3>
                                    <p className="step-desc">Upload your resume or build your profile with our AI assistant.</p>
                                    <div className="step-features">
                                        <span className="step-feature">Smart Resume Parser</span>
                                        <span className="step-feature">Skill Assessment</span>
                                        <span className="step-feature">Career Goals Analysis</span>
                                    </div>
                                </div>
                            </div>
                            <div className="process-step">
                                <div className="step-number">2</div>
                                <div className="step-content">
                                    <h3 className="step-title">Get AI-Powered Matches</h3>
                                    <p className="step-desc">Personalized job recommendations based on your profile.</p>
                                    <div className="step-features">
                                        <span className="step-feature">Personalized Matching</span>
                                        <span className="step-feature">Salary Insights</span>
                                        <span className="step-feature">Culture Fit Analysis</span>
                                    </div>
                                </div>
                            </div>
                            <div className="process-step">
                                <div className="step-number">3</div>
                                <div className="step-content">
                                    <h3 className="step-title">Apply & Get Hired</h3>
                                    <p className="step-desc">One-click apply with real-time tracking and interview coaching.</p>
                                    <div className="step-features">
                                        <span className="step-feature">One-Click Apply</span>
                                        <span className="step-feature">Interview Coaching</span>
                                        <span className="step-feature">Real-Time Tracking</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="home-testimonials">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Success Stories</h2>
                            <p className="section-subtitle">See what our users are saying</p>
                        </div>

                        <div className="testimonials-grid">
                            {testimonials.map((t, i) => (
                                <div key={i} className="testimonial-card">
                                    <div className="testimonial-content">
                                        <div className="quote-icon">❝</div>
                                        <div className="testimonial-rating">
                                            {Array.from({ length: t.rating }).map((_, j) => <span key={j} className="star">⭐</span>)}
                                        </div>
                                        <p className="testimonial-quote">{t.quote}</p>
                                        <div className="testimonial-author">
                                            <div className="author-avatar">{t.avatar}</div>
                                            <div className="author-info">
                                                <div className="author-name">{t.author}</div>
                                                <div className="author-role">{t.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="home-cta">
                    <div className="container">
                        <div className="cta-card">
                            <div className="cta-content">
                                <h2 className="cta-title">Ready to Transform Your Career?</h2>
                                <p className="cta-subtitle">Join over 500,000 professionals finding their dream jobs</p>

                                <div className="cta-buttons">
                                    <Link to="/register" className="btn btn-primary btn-lg">
                                        <span className="btn-icon">🎯</span>
                                        <span>Start Free Today</span>
                                        <span className="btn-arrow">→</span>
                                    </Link>
                                    <Link to="/jobs" className="btn btn-outline btn-lg">
                                        <span className="btn-icon">🔍</span>
                                        <span>Browse Jobs</span>
                                    </Link>
                                </div>

                                <div className="cta-features">
                                    <div className="cta-feature"><span className="feature-icon">✅</span><span>No credit card required</span></div>
                                    <div className="cta-feature"><span className="feature-icon">🆓</span><span>Free for job seekers</span></div>
                                    <div className="cta-feature"><span className="feature-icon">⚡</span><span>Get started in 2 minutes</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
};

export default EnhancedHome;
