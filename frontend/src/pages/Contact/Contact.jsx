// Contact.jsx - Contact and Support Page
import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder submit behavior
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    const supportChannels = [
        { icon: 'fas fa-envelope', title: 'Email Support', value: 'support@aihiring.com' },
        { icon: 'fas fa-comments', title: 'Live Chat', value: 'Mon–Fri, 9am–6pm' },
        { icon: 'fas fa-phone', title: 'Phone', value: '+1 (555) 123-4567' },
        { icon: 'fas fa-book', title: 'Help Center', value: 'Guides & FAQs' },
    ];

    return (
        <div className="contact-page">
            {/* Hero */}
            <section className="contact-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="hero-title">We'd love to hear from you</h1>
                            <p className="hero-subtitle">
                                Questions, feedback, or partnership ideas? Our team is here to help.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <img className="img-fluid rounded shadow" src="/api/placeholder/500/320" alt="Contact" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact content */}
            <section className="contact-content">
                <div className="container">
                    <div className="row g-4">
                        {/* Form */}
                        <div className="col-lg-7">
                            <div className="contact-card">
                                <h2 className="section-title">Send us a message</h2>
                                <form onSubmit={handleSubmit} className="contact-form" noValidate>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input id="name" name="name" type="text" className="form-control" value={form.name} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input id="email" name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="subject" className="form-label">Subject</label>
                                        <input id="subject" name="subject" type="text" className="form-control" value={form.subject} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="message" className="form-label">Message</label>
                                        <textarea id="message" name="message" className="form-control" rows="5" value={form.message} onChange={handleChange} required></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        <i className="fas fa-paper-plane me-2"></i>Send Message
                                    </button>
                                    {submitted && (
                                        <p className="mt-3 text-success">Thanks! We'll get back to you shortly.</p>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Support channels */}
                        <div className="col-lg-5">
                            <div className="contact-card">
                                <h2 className="section-title">Support channels</h2>
                                <div className="row">
                                    {supportChannels.map((ch, idx) => (
                                        <div key={idx} className="col-12 mb-3">
                                            <div className="channel-item">
                                                <div className="channel-icon"><i className={ch.icon}></i></div>
                                                <div>
                                                    <div className="channel-title">{ch.title}</div>
                                                    <div className="channel-value">{ch.value}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="contact-card mt-4">
                                <h2 className="section-title">Our office</h2>
                                <p className="mb-2">San Francisco, CA</p>
                                <div className="map-placeholder">
                                    <img src="/api/placeholder/480/220" alt="Map placeholder" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chatbot is global in App.js */}
        </div>
    );
};

export default Contact;
