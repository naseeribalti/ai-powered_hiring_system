import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ModernAuth.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(formData);

        if (result.success) {
            navigate('/dashboard');
        }

        setLoading(false);
    };

    return (
        <div className="modern-auth-container">
            {/* Animated Background */}
            <div className="auth-background">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                </div>
            </div>

            <div className="container-fluid h-100">
                <div className="row h-100">
                    {/* Left Side - Branding */}
                    <div className="col-lg-6 d-none d-lg-flex auth-branding">
                        <div className="branding-content">
                            <div className="brand-logo">
                                <div className="logo-icon">
                                    <i className="fas fa-robot"></i>
                                </div>
                                <h1 className="brand-title">AI Hiring System</h1>
                            </div>
                            <div className="brand-description">
                                <h2>Welcome Back!</h2>
                                <p>Revolutionize your hiring process with AI-powered recruitment solutions. Connect with top talent and streamline your hiring workflow.</p>
                                <div className="feature-list">
                                    <div className="feature-item">
                                        <i className="fas fa-check-circle"></i>
                                        <span>AI-Powered Matching</span>
                                    </div>
                                    <div className="feature-item">
                                        <i className="fas fa-check-circle"></i>
                                        <span>Smart Resume Analysis</span>
                                    </div>
                                    <div className="feature-item">
                                        <i className="fas fa-check-circle"></i>
                                        <span>Automated Screening</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="col-lg-6 col-12 auth-form-section">
                        <div className="auth-form-container">
                            <div className="glass-card">
                                <div className="card-header">
                                    <div className="mobile-brand d-lg-none">
                                        <div className="logo-icon-small">
                                            <i className="fas fa-robot"></i>
                                        </div>
                                        <h3>AI Hiring System</h3>
                                    </div>
                                    <h2 className="form-title">Sign In</h2>
                                    <p className="form-subtitle">Access your account to continue</p>
                                </div>

                                <form onSubmit={handleSubmit} className="auth-form">
                                    <div className="form-group">
                                        <div className="input-wrapper">
                                            <i className="fas fa-envelope input-icon"></i>
                                            <input
                                                type="email"
                                                className="modern-input"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder=" "
                                            />
                                            <label htmlFor="email" className="floating-label">Email Address</label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="input-wrapper">
                                            <i className="fas fa-lock input-icon"></i>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="modern-input"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                placeholder=" "
                                            />
                                            <label htmlFor="password" className="floating-label">Password</label>
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-options">
                                        <label className="custom-checkbox">
                                            <input type="checkbox" />
                                            <span className="checkmark"></span>
                                            Remember me
                                        </label>
                                        <Link to="/forgot-password" className="forgot-link">
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    <button
                                        type="submit"
                                        className="modern-btn primary-btn"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="btn-spinner"></div>
                                                <span>Signing in...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Sign In</span>
                                                <i className="fas fa-arrow-right btn-icon"></i>
                                            </>
                                        )}
                                    </button>

                                    <div className="divider">
                                        <span>or continue with</span>
                                    </div>

                                    <div className="social-login">
                                        <button type="button" className="social-btn google-btn">
                                            <i className="fab fa-google"></i>
                                            <span>Google</span>
                                        </button>
                                        <button type="button" className="social-btn linkedin-btn">
                                            <i className="fab fa-linkedin-in"></i>
                                            <span>LinkedIn</span>
                                        </button>
                                    </div>

                                    <div className="auth-switch">
                                        <p>Don't have an account?</p>
                                        <Link to="/register" className="switch-link">
                                            Create Account
                                            <i className="fas fa-arrow-right"></i>
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
