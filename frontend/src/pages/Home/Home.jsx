// Home.jsx - Public Marketing Home Page
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer/Footer';
import './Home.css';

const features = [
    { icon: 'fas fa-bolt', title: 'AI-Powered Matching', desc: 'Advanced ML models analyze skills, experience, and intent to surface ideal matches.' },
    { icon: 'fas fa-user-check', title: 'Bias-Aware Screening', desc: 'Reduce noise and improve fairness with explainable scoring and guidance.' },
    { icon: 'fas fa-chart-line', title: 'Actionable Insights', desc: 'Real-time analytics help recruiters and job seekers optimize outcomes.' },
    { icon: 'fas fa-shield-alt', title: 'Enterprise-Grade Security', desc: 'Data encryption, role-based access, and audit logs by default.' },
];

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero */}
            <section className="home-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="hero-title">
                                Hire smarter. Find faster. Powered by
                                <span className="gradient-text"> AI</span>
                            </h1>
                            <p className="hero-subtitle">
                                The modern hiring platform that connects qualified talent with the right opportunities.
                            </p>
                            <div className="cta-group">
                                <Link to="/register" className="btn btn-primary me-2">
                                    <i className="fas fa-user-plus me-2"></i>Get Started
                                </Link>
                                <Link to="/login" className="btn btn-outline-primary">
                                    <i className="fas fa-sign-in-alt me-2"></i>Sign In
                                </Link>
                            </div>
                            <div className="trust-note">
                                Trusted by startups and enterprises worldwide
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <img className="img-fluid rounded shadow-lg" src="/api/placeholder/560/360" alt="Product preview" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="home-features">
                <div className="container">
                    <div className="row">
                        {features.map((f, i) => (
                            <div key={i} className="col-lg-3 col-md-6 mb-4">
                                <div className="feature-card">
                                    <div className="feature-icon"><i className={f.icon}></i></div>
                                    <div className="feature-title">{f.title}</div>
                                    <div className="feature-desc">{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="home-testimonials">
                <div className="container">
                    <div className="testimonial-card">
                        <div className="quote">“We reduced time-to-hire by 60% and improved candidate quality dramatically.”</div>
                        <div className="author">— Dana S., Head of Talent, Fintech Co.</div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="home-cta">
                <div className="container">
                    <div className="cta-card">
                        <h2>Ready to supercharge your hiring?</h2>
                        <p>Join thousands using AI to build stronger teams and careers.</p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-primary me-2">Create Account</Link>
                            <Link to="/about" className="btn btn-outline-primary">Learn More</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chatbot is global in App.js */}
            <Footer />
        </div>
    );
};

export default Home;
