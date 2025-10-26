import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ModernAuth.css';

// Inline password strength indicator component
const PasswordStrength = ({ password }) => {
    const checks = [
        { label: '8+ chars', pass: password.length >= 8 },
        { label: 'upper', pass: /[A-Z]/.test(password) },
        { label: 'lower', pass: /[a-z]/.test(password) },
        { label: 'number', pass: /\d/.test(password) },
        { label: 'symbol', pass: /[^A-Za-z0-9]/.test(password) },
    ];
    const score = checks.filter(c => c.pass).length;
    const percent = (score / checks.length) * 100;
    const colors = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#16a34a'];
    const color = colors[Math.max(0, score - 1)];

    return (
        <div>
            <div style={{ height: 6, background: '#e5e7eb', borderRadius: 999 }}>
                <div style={{ width: `${percent}%`, height: 6, background: color, borderRadius: 999, transition: 'width .2s ease' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                {checks.map((c, idx) => (
                    <span key={idx} style={{ opacity: c.pass ? 1 : 0.6 }}>
                        {c.pass ? '✓' : '○'} {c.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'jobSeeker',
        phone: '',
        companyName: '',
        companyWebsite: '',
        companyDetails: '',
        companyType: '',
        employeesCount: '',
        companyAddress: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRoleChange = (role) => {
        setFormData({
            ...formData,
            role: role
        });
    };

    const validateStep1 = () => {
        return formData.firstName && formData.lastName && formData.email && formData.role;
    };

    const validateStep2 = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        if (formData.role === 'recruiter' && (!formData.companyName || !formData.phone)) {
            setError('Company name and phone are required for recruiters');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        setError('');
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
        }
    };

    const handleBack = () => {
        setCurrentStep(1);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateStep2()) {
            return;
        }

        setLoading(true);

        const { confirmPassword, ...userData } = formData;

        Object.keys(userData).forEach(key => {
            if (userData[key] === '' || userData[key] === null) {
                delete userData[key];
            }
        });

        const result = await register(userData);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message || 'Registration failed. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="modern-auth-container">
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
                                <h2>Join Our Platform!</h2>
                                <p>Create your account and start your journey with AI-powered recruitment. Whether you're a job seeker or recruiter, we've got you covered.</p>
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <div className="stat-number">10K+</div>
                                        <div className="stat-label">Active Users</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-number">500+</div>
                                        <div className="stat-label">Companies</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-number">95%</div>
                                        <div className="stat-label">Success Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Register Form */}
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
                                    <h2 className="form-title">Create Account</h2>
                                    <p className="form-subtitle">Join thousands of users today</p>

                                    {/* Progress Steps */}
                                    <div className="progress-steps">
                                        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                                            <div className="step-number">1</div>
                                            <span>Basic Info</span>
                                        </div>
                                        <div className="step-line"></div>
                                        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                                            <div className="step-number">2</div>
                                            <span>Complete</span>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="error-alert">
                                        <i className="fas fa-exclamation-triangle"></i>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="auth-form">
                                    {currentStep === 1 && (
                                        <div className="step-content">
                                            {/* Role Selection */}
                                            <div className="role-selection">
                                                <label className="role-label">I am a:</label>
                                                <div className="role-options">
                                                    <div
                                                        className={`role-card ${formData.role === 'jobSeeker' ? 'selected' : ''}`}
                                                        onClick={() => handleRoleChange('jobSeeker')}
                                                    >
                                                        <div className="role-icon">
                                                            <i className="fas fa-user-tie"></i>
                                                        </div>
                                                        <h4>Job Seeker</h4>
                                                        <p>Looking for opportunities</p>
                                                    </div>
                                                    <div
                                                        className={`role-card ${formData.role === 'recruiter' ? 'selected' : ''}`}
                                                        onClick={() => handleRoleChange('recruiter')}
                                                    >
                                                        <div className="role-icon">
                                                            <i className="fas fa-building"></i>
                                                        </div>
                                                        <h4>Recruiter</h4>
                                                        <p>Hiring talented people</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <div className="input-wrapper">
                                                        <i className="fas fa-user input-icon"></i>
                                                        <input
                                                            type="text"
                                                            className="modern-input"
                                                            id="firstName"
                                                            name="firstName"
                                                            value={formData.firstName}
                                                            onChange={handleChange}
                                                            required
                                                            placeholder="First Name"
                                                        />
                                                        <label htmlFor="firstName" className="floating-label">First Name</label>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="input-wrapper">
                                                        <i className="fas fa-user input-icon"></i>
                                                        <input
                                                            type="text"
                                                            className="modern-input"
                                                            id="lastName"
                                                            name="lastName"
                                                            value={formData.lastName}
                                                            onChange={handleChange}
                                                            required
                                                            placeholder="Last Name"
                                                        />
                                                        <label htmlFor="lastName" className="floating-label">Last Name</label>
                                                    </div>
                                                </div>
                                            </div>

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
                                                        placeholder="Email Address"
                                                    />
                                                    <label htmlFor="email" className="floating-label">Email Address</label>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className="modern-btn primary-btn"
                                                onClick={handleNext}
                                                disabled={!validateStep1()}
                                            >
                                                <span>Continue</span>
                                                <i className="fas fa-arrow-right btn-icon"></i>
                                            </button>
                                        </div>
                                    )}

                                    {currentStep === 2 && (
                                        <div className="step-content">
                                            {formData.role === 'recruiter' && (
                                                <>
                                                    <div className="form-group">
                                                        <div className="input-wrapper">
                                                            <i className="fas fa-building input-icon"></i>
                                                            <input
                                                                type="text"
                                                                className="modern-input"
                                                                id="companyName"
                                                                name="companyName"
                                                                value={formData.companyName}
                                                                onChange={handleChange}
                                                                required
                                                                placeholder="Company Name"
                                                            />
                                                            <label htmlFor="companyName" className="floating-label">Company Name</label>
                                                        </div>
                                                    </div>

                                                    <div className="form-group">
                                                        <div className="input-wrapper">
                                                            <i className="fas fa-phone input-icon"></i>
                                                            <input
                                                                type="tel"
                                                                className="modern-input"
                                                                id="phone"
                                                                name="phone"
                                                                value={formData.phone}
                                                                onChange={handleChange}
                                                                required
                                                                placeholder="Phone Number"
                                                            />
                                                            <label htmlFor="phone" className="floating-label">Phone Number</label>
                                                        </div>
                                                    </div>

                                                    <div className="form-group">
                                                        <div className="input-wrapper">
                                                            <i className="fas fa-globe input-icon"></i>
                                                            <input
                                                                type="url"
                                                                className="modern-input"
                                                                id="companyWebsite"
                                                                name="companyWebsite"
                                                                value={formData.companyWebsite}
                                                                onChange={handleChange}
                                                                placeholder="Company Website (Optional)"
                                                            />
                                                            <label htmlFor="companyWebsite" className="floating-label">Company Website</label>
                                                        </div>
                                                    </div>

                                                    <div className="form-row">
                                                        <div className="form-group">
                                                            <div className="input-wrapper">
                                                                <i className="fas fa-industry input-icon"></i>
                                                                <select
                                                                    className="modern-input"
                                                                    id="companyType"
                                                                    name="companyType"
                                                                    value={formData.companyType}
                                                                    onChange={handleChange}
                                                                >
                                                                    <option value="" disabled hidden></option>
                                                                    <option value="IT">IT</option>
                                                                    <option value="Tech">Tech</option>
                                                                    <option value="Business">Business</option>
                                                                    <option value="Health">Health</option>
                                                                    <option value="Education">Education</option>
                                                                    <option value="Finance">Finance</option>
                                                                    <option value="Other">Other</option>
                                                                </select>
                                                                <label htmlFor="companyType" className="floating-label">Company Type</label>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <div className="input-wrapper">
                                                                <i className="fas fa-users input-icon"></i>
                                                                <select
                                                                    className="modern-input"
                                                                    id="employeesCount"
                                                                    name="employeesCount"
                                                                    value={formData.employeesCount}
                                                                    onChange={handleChange}
                                                                >
                                                                    <option value="" disabled hidden></option>
                                                                    <option value="1-10">1-10</option>
                                                                    <option value="11-50">11-50</option>
                                                                    <option value="51-200">51-200</option>
                                                                    <option value="201-500">201-500</option>
                                                                    <option value="501-1000">501-1000</option>
                                                                    <option value="1000+">1000+</option>
                                                                </select>
                                                                <label htmlFor="employeesCount" className="floating-label">Employees</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-group">
                                                        <div className="input-wrapper">
                                                            <i className="fas fa-map-marker-alt input-icon"></i>
                                                            <input
                                                                type="text"
                                                                className="modern-input"
                                                                id="companyAddress"
                                                                name="companyAddress"
                                                                value={formData.companyAddress}
                                                                onChange={handleChange}
                                                                placeholder="Company Address (Optional)"
                                                            />
                                                            <label htmlFor="companyAddress" className="floating-label">Company Address</label>
                                                        </div>
                                                    </div>

                                                    <div className="form-group">
                                                        <div className="input-wrapper">
                                                            <i className="fas fa-info-circle input-icon"></i>
                                                            <textarea
                                                                className="modern-input"
                                                                id="companyDetails"
                                                                name="companyDetails"
                                                                rows="3"
                                                                value={formData.companyDetails}
                                                                onChange={handleChange}
                                                                placeholder="About the company (Optional)"
                                                            />
                                                            <label htmlFor="companyDetails" className="floating-label">About Company</label>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

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
                                                        placeholder="Password"
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
                                                {/* Password strength meter */}
                                                {formData.password && (
                                                    <div style={{ marginTop: '0.5rem' }}>
                                                        <PasswordStrength password={formData.password} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <div className="input-wrapper">
                                                    <i className="fas fa-lock input-icon"></i>
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        className="modern-input"
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Confirm Password"
                                                    />
                                                    <label htmlFor="confirmPassword" className="floating-label">Confirm Password</label>
                                                    <button
                                                        type="button"
                                                        className="password-toggle"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="form-actions">
                                                <button
                                                    type="button"
                                                    className="modern-btn secondary-btn"
                                                    onClick={handleBack}
                                                >
                                                    <i className="fas fa-arrow-left btn-icon"></i>
                                                    <span>Back</span>
                                                </button>

                                                <button
                                                    type="submit"
                                                    className="modern-btn primary-btn"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <div className="btn-spinner"></div>
                                                            <span>Creating...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Create Account</span>
                                                            <i className="fas fa-check btn-icon"></i>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="auth-switch">
                                        <p>Already have an account?</p>
                                        <Link to="/login" className="switch-link">
                                            Sign In
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

export default RegisterPage;
