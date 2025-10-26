// About.jsx - Company Information Page
import React from 'react';
import './About.css';

const About = () => {
    const teamMembers = [
        {
            name: 'Alex Johnson',
            role: 'CEO & Founder',
            image: '/api/placeholder/150/150',
            bio: 'Former VP of Engineering at Google with 15+ years in AI and machine learning.',
            linkedin: '#'
        },
        {
            name: 'Sarah Chen',
            role: 'CTO',
            image: '/api/placeholder/150/150',
            bio: 'AI researcher and former lead engineer at Microsoft, specializing in NLP and ML.',
            linkedin: '#'
        },
        {
            name: 'Michael Rodriguez',
            role: 'Head of Product',
            image: '/api/placeholder/150/150',
            bio: 'Product strategist with experience at LinkedIn and Uber, focused on user experience.',
            linkedin: '#'
        },
        {
            name: 'Emily Davis',
            role: 'Head of Marketing',
            image: '/api/placeholder/150/150',
            bio: 'Growth marketing expert with successful campaigns at top tech companies.',
            linkedin: '#'
        }
    ];

    const values = [
        {
            icon: 'fas fa-lightbulb',
            title: 'Innovation',
            description: 'We constantly push the boundaries of AI technology to create better hiring solutions.'
        },
        {
            icon: 'fas fa-users',
            title: 'People First',
            description: 'Every decision we make prioritizes the human experience in the hiring process.'
        },
        {
            icon: 'fas fa-shield-alt',
            title: 'Trust & Security',
            description: 'We maintain the highest standards of data security and privacy protection.'
        },
        {
            icon: 'fas fa-chart-line',
            title: 'Results Driven',
            description: 'We measure success by the meaningful connections and successful hires we enable.'
        }
    ];

    const achievements = [
        { number: '50K+', label: 'Successful Matches' },
        { number: '1000+', label: 'Partner Companies' },
        { number: '95%', label: 'Match Accuracy' },
        { number: '60%', label: 'Time Saved' }
    ];

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="hero-title">
                                Revolutionizing Hiring with
                                <span className="gradient-text"> AI Intelligence</span>
                            </h1>
                            <p className="hero-subtitle">
                                We're on a mission to make hiring more efficient, fair, and successful
                                for both companies and job seekers through the power of artificial intelligence.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <div className="hero-image">
                                <img src="/api/placeholder/500/400" alt="About Us" className="img-fluid rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="story-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <div className="story-content">
                                <h2 className="section-title">Our Story</h2>
                                <p className="story-text">
                                    Founded in 2023, our platform was born from a simple observation: traditional
                                    hiring processes were broken. Recruiters spent countless hours sifting through
                                    resumes, while qualified candidates were overlooked due to keyword mismatches
                                    and unconscious bias.
                                </p>
                                <p className="story-text">
                                    Our team of AI researchers, engineers, and hiring experts came together to build
                                    a solution that would level the playing field. By leveraging advanced machine
                                    learning algorithms, we created a platform that truly understands both job
                                    requirements and candidate capabilities.
                                </p>
                                <p className="story-text">
                                    Today, we're proud to serve thousands of companies and job seekers, facilitating
                                    meaningful connections that drive career growth and business success.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">Our Values</h2>
                        <p className="section-subtitle">
                            The principles that guide everything we do
                        </p>
                    </div>
                    <div className="row">
                        {values.map((value, index) => (
                            <div key={index} className="col-lg-3 col-md-6 mb-4">
                                <div className="value-card">
                                    <div className="value-icon">
                                        <i className={value.icon}></i>
                                    </div>
                                    <h5 className="value-title">{value.title}</h5>
                                    <p className="value-description">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">Meet Our Team</h2>
                        <p className="section-subtitle">
                            The brilliant minds behind our AI-powered platform
                        </p>
                    </div>
                    <div className="row">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="col-lg-3 col-md-6 mb-4">
                                <div className="team-card">
                                    <div className="member-image">
                                        <img src={member.image} alt={member.name} />
                                    </div>
                                    <div className="member-info">
                                        <h5 className="member-name">{member.name}</h5>
                                        <p className="member-role">{member.role}</p>
                                        <p className="member-bio">{member.bio}</p>
                                        <a href={member.linkedin} className="linkedin-link" aria-label={`${member.name} LinkedIn`}>
                                            <i className="fab fa-linkedin"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Achievements Section */}
            <section className="achievements-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">Our Impact</h2>
                        <p className="section-subtitle">
                            Numbers that showcase our commitment to excellence
                        </p>
                    </div>
                    <div className="row">
                        {achievements.map((achievement, index) => (
                            <div key={index} className="col-lg-3 col-md-6 mb-4">
                                <div className="achievement-card">
                                    <div className="achievement-number">{achievement.number}</div>
                                    <div className="achievement-label">{achievement.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Chatbot is globally injected in App.js */}
        </div>
    );
};

export default About;
