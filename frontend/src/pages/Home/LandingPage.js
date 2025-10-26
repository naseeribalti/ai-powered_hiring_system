import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FaSearch,
    FaMapMarkerAlt,
    FaBriefcase,
    FaChartLine,
    FaUsers,
    FaRocket,
    FaShieldAlt,
    FaStar,
    FaArrowRight,
    FaBuilding,
    FaTrophy,
    FaLightbulb
} from 'react-icons/fa';
import './LandingPage.css';
import Footer from '../../components/common/Footer/Footer';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');
    const stats = {
        jobs: 10000,
        companies: 500,
        candidates: 50000,
        placements: 5000
    };

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/jobs?search=${searchQuery}&location=${location}`);
    };

    const features = [
        {
            icon: <FaRocket />,
            title: 'AI-Powered Matching',
            description: 'Our intelligent algorithm matches you with the perfect job opportunities based on your skills and experience.'
        },
        {
            icon: <FaChartLine />,
            title: 'Career Analytics',
            description: 'Get insights into your career growth with detailed analytics and personalized recommendations.'
        },
        {
            icon: <FaShieldAlt />,
            title: 'Verified Companies',
            description: 'Apply with confidence to verified companies and trusted recruiters in our network.'
        },
        {
            icon: <FaUsers />,
            title: 'Expert Support',
            description: 'Get professional guidance from our career experts throughout your job search journey.'
        }
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Software Engineer',
            company: 'Tech Corp',
            image: '/images/testimonials/user1.jpg',
            rating: 5,
            text: 'Found my dream job in just 2 weeks! The AI matching system is incredibly accurate.'
        },
        {
            name: 'Michael Chen',
            role: 'Product Manager',
            company: 'StartupXYZ',
            image: '/images/testimonials/user2.jpg',
            rating: 5,
            text: 'The platform made job hunting effortless. Highly recommend to anyone looking for their next opportunity!'
        },
        {
            name: 'Emily Davis',
            role: 'UX Designer',
            company: 'Design Studio',
            image: '/images/testimonials/user3.jpg',
            rating: 5,
            text: 'Best hiring platform I\'ve used. The interface is intuitive and the job recommendations are spot-on.'
        }
    ];

    const companies = [
        'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta',
        'Netflix', 'Tesla', 'Spotify', 'Adobe', 'IBM'
    ];

    return (
        <>
            <div className="landing-page">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-background">
                        <div className="hero-shapes">
                            <div className="shape shape-1"></div>
                            <div className="shape shape-2"></div>
                            <div className="shape shape-3"></div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="hero-content">
                            <div className="hero-text">
                                <h1 className="hero-title">
                                    Find Your <span className="gradient-text">Dream Job</span>
                                    <br />
                                    with AI-Powered Matching
                                </h1>
                                <p className="hero-subtitle">
                                    Join thousands of professionals who found their perfect career match.
                                    Let our intelligent system connect you with opportunities that truly fit.
                                </p>

                                {/* Search Bar */}
                                <form className="hero-search" onSubmit={handleSearch}>
                                    <div className="search-input-group">
                                        <FaSearch className="search-icon" />
                                        <input
                                            type="text"
                                            placeholder="Job title, keywords, or company"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="search-input"
                                        />
                                    </div>
                                    <div className="search-input-group">
                                        <FaMapMarkerAlt className="search-icon" />
                                        <input
                                            type="text"
                                            placeholder="City, state, or remote"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="search-input"
                                        />
                                    </div>
                                    <button type="submit" className="search-button">
                                        Search Jobs <FaArrowRight />
                                    </button>
                                </form>

                                {/* Quick Links */}
                                <div className="hero-quick-links">
                                    <span>Popular searches:</span>
                                    <Link to="/jobs?search=developer">Developer</Link>
                                    <Link to="/jobs?search=designer">Designer</Link>
                                    <Link to="/jobs?search=manager">Manager</Link>
                                    <Link to="/jobs?search=marketing">Marketing</Link>
                                </div>
                            </div>

                            <div className="hero-image">
                                <div className="hero-illustration">
                                    <div className="floating-card card-1">
                                        <FaBriefcase />
                                        <span>10,000+ Jobs</span>
                                    </div>
                                    <div className="floating-card card-2">
                                        <FaBuilding />
                                        <span>500+ Companies</span>
                                    </div>
                                    <div className="floating-card card-3">
                                        <FaTrophy />
                                        <span>98% Success Rate</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="stats-section">
                    <div className="container">
                        <div className="stats-grid">
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <FaBriefcase />
                                </div>
                                <div className="stat-number">{stats.jobs.toLocaleString()}+</div>
                                <div className="stat-label">Active Jobs</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <FaBuilding />
                                </div>
                                <div className="stat-number">{stats.companies.toLocaleString()}+</div>
                                <div className="stat-label">Top Companies</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <FaUsers />
                                </div>
                                <div className="stat-number">{stats.candidates.toLocaleString()}+</div>
                                <div className="stat-label">Job Seekers</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <FaTrophy />
                                </div>
                                <div className="stat-number">{stats.placements.toLocaleString()}+</div>
                                <div className="stat-label">Successful Placements</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Why Choose Us</h2>
                            <p className="section-subtitle">
                                Powerful features to accelerate your career growth
                            </p>
                        </div>
                        <div className="features-grid">
                            {features.map((feature, index) => (
                                <div key={index} className="feature-card" data-aos="fade-up" data-aos-delay={index * 100}>
                                    <div className="feature-icon">
                                        {feature.icon}
                                    </div>
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-description">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="how-it-works-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">How It Works</h2>
                            <p className="section-subtitle">
                                Get hired in 3 simple steps
                            </p>
                        </div>
                        <div className="steps-grid">
                            <div className="step-item">
                                <div className="step-number">1</div>
                                <div className="step-icon">
                                    <FaUsers />
                                </div>
                                <h3 className="step-title">Create Your Profile</h3>
                                <p className="step-description">
                                    Sign up and build your professional profile with your skills, experience, and preferences.
                                </p>
                            </div>
                            <div className="step-item">
                                <div className="step-number">2</div>
                                <div className="step-icon">
                                    <FaLightbulb />
                                </div>
                                <h3 className="step-title">Get AI Recommendations</h3>
                                <p className="step-description">
                                    Our AI analyzes your profile and recommends the best-matching job opportunities.
                                </p>
                            </div>
                            <div className="step-item">
                                <div className="step-number">3</div>
                                <div className="step-icon">
                                    <FaTrophy />
                                </div>
                                <h3 className="step-title">Land Your Dream Job</h3>
                                <p className="step-description">
                                    Apply with one click and connect directly with hiring managers to land your perfect role.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="testimonials-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Success Stories</h2>
                            <p className="section-subtitle">
                                Hear from professionals who found their dream jobs
                            </p>
                        </div>
                        <div className="testimonials-grid">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="testimonial-card">
                                    <div className="testimonial-rating">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <FaStar key={i} className="star-icon" />
                                        ))}
                                    </div>
                                    <p className="testimonial-text">"{testimonial.text}"</p>
                                    <div className="testimonial-author">
                                        <div className="author-avatar">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div className="author-info">
                                            <div className="author-name">{testimonial.name}</div>
                                            <div className="author-role">{testimonial.role} at {testimonial.company}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Companies Section */}
                <section className="companies-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Trusted by Leading Companies</h2>
                            <p className="section-subtitle">
                                Join professionals working at top organizations worldwide
                            </p>
                        </div>
                        <div className="companies-grid">
                            {companies.map((company, index) => (
                                <div key={index} className="company-logo">
                                    {company}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="cta-section">
                    <div className="container">
                        <div className="cta-content">
                            <h2 className="cta-title">Ready to Start Your Journey?</h2>
                            <p className="cta-subtitle">
                                Join thousands of professionals and find your perfect career match today
                            </p>
                            <div className="cta-buttons">
                                <Link to="/register" className="btn btn-primary btn-large">
                                    Get Started Free <FaArrowRight />
                                </Link>
                                <Link to="/jobs" className="btn btn-outline-primary btn-large">
                                    Browse Jobs
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default LandingPage;
