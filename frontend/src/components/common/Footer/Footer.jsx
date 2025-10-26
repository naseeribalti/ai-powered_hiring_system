import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="container py-4">
                <div className="row">
                    {/* Brand & Description */}
                    <div className="col-lg-4 col-md-6 mb-4">
                        <div className="brand mb-3">
                            <i className="fas fa-robot me-2" aria-hidden="true"></i>
                            <strong>AI Hiring System</strong>
                        </div>
                        <p className="text-muted small mb-3">
                            Revolutionizing recruitment with AI-powered matching, bias-aware screening, and actionable insights for better hiring decisions.
                        </p>
                        <div className="social-links">
                            <a href="https://www.linkedin.com/in/muhammad-usama-balti-3aa0a0257/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="me-3"
                                aria-label="LinkedIn">
                                <i className="fab fa-linkedin fa-2x"></i>
                            </a>
                            <a href="mailto:usamakj47@gmail.com" className="me-3" aria-label="Email">
                                <i className="fas fa-envelope fa-2x"></i>
                            </a>
                            <a href="tel:+923164374407" aria-label="Phone">
                                <i className="fas fa-phone fa-2x"></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 col-md-6 mb-4">
                        <h6 className="footer-heading mb-3">Platform</h6>
                        <ul className="footer-links list-unstyled">
                            <li><Link to="/jobs">Find Jobs</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="col-lg-2 col-md-6 mb-4">
                        <h6 className="footer-heading mb-3">Legal</h6>
                        <ul className="footer-links list-unstyled">
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-lg-4 col-md-6 mb-4">
                        <h6 className="footer-heading mb-3">Contact Us for Services</h6>
                        <div className="contact-info small">
                            <div className="mb-2">
                                <i className="fas fa-envelope me-2" aria-hidden="true"></i>
                                <a href="mailto:usamakj47@gmail.com">usamakj47@gmail.com</a>
                            </div>
                            <div className="mb-2">
                                <i className="fas fa-phone me-2" aria-hidden="true"></i>
                                <a href="tel:+923164374407">+92 316 4374407</a>
                            </div>
                            <div className="mb-2">
                                <i className="fas fa-user me-2" aria-hidden="true"></i>
                                <span>Muhammad Usama</span>
                            </div>
                            <div>
                                <i className="fab fa-linkedin me-2" aria-hidden="true"></i>
                                <a href="https://www.linkedin.com/in/muhammad-usama-balti-3aa0a0257/"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    LinkedIn Profile
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom pt-3 mt-3 border-top">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
                            <p className="mb-0 small text-muted">
                                © {new Date().getFullYear()} AI Hiring System. All rights reserved.
                            </p>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <p className="mb-0 small">
                                Developed by <strong>Muhammad Usama</strong> & <strong>Syed Qamar Abbas</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
