import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        companyDetails: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const passwordChecks = {
        length: formData.password.length >= 8,
        upper: /[A-Z]/.test(formData.password),
        lower: /[a-z]/.test(formData.password),
        number: /\d/.test(formData.password),
        symbol: /[^A-Za-z0-9]/.test(formData.password)
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        // Validate recruiter-specific fields
        if (formData.role === 'recruiter') {
            if (!formData.companyName || formData.companyName.trim().length < 2) {
                setError('Company name is required for recruiters');
                return;
            }
            if (!formData.phone || formData.phone.trim().length < 7) {
                setError('Phone number is required for recruiters');
                return;
            }
        }

        setLoading(true);

        // Remove confirmPassword and clean empty optional fields
        const { confirmPassword, ...userData } = formData;

        // Remove empty strings for optional fields to prevent validation errors
        // Backend .optional() only works with undefined/null, not empty strings
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
        <div className="min-vh-100 d-flex align-items-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <div className="text-center mb-4">
                                    <i className="fas fa-robot fa-3x text-primary mb-3"></i>
                                    <h2 className="card-title">Join AI Hiring System</h2>
                                    <p className="text-muted">Create your account</p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="firstName" className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your first name"
                                            minLength="2"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="lastName" className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your last name"
                                            minLength="2"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="role" className="form-label">Role</label>
                                        <select
                                            className="form-select"
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="jobSeeker">Job Seeker</option>
                                            <option value="recruiter">Recruiter</option>
                                        </select>
                                        <small className="text-muted">
                                            {formData.role === 'recruiter' && 'Recruiters can post and manage job openings'}
                                        </small>
                                    </div>

                                    {/* Recruiter-specific fields */}
                                    {formData.role === 'recruiter' && (
                                        <>
                                            <div className="mb-3">
                                                <label htmlFor="companyName" className="form-label">
                                                    Company Name <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="companyName"
                                                    name="companyName"
                                                    value={formData.companyName}
                                                    onChange={handleChange}
                                                    required={formData.role === 'recruiter'}
                                                    placeholder="Enter your company name"
                                                    minLength="2"
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="phone" className="form-label">
                                                    Phone Number <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required={formData.role === 'recruiter'}
                                                    placeholder="+1 (555) 123-4567"
                                                    minLength="7"
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="companyWebsite" className="form-label">
                                                    Company Website <small className="text-muted">(Optional)</small>
                                                </label>
                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    id="companyWebsite"
                                                    name="companyWebsite"
                                                    value={formData.companyWebsite}
                                                    onChange={handleChange}
                                                    placeholder="https://www.example.com"
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="companyDetails" className="form-label">
                                                    Company Details <small className="text-muted">(Optional)</small>
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    id="companyDetails"
                                                    name="companyDetails"
                                                    value={formData.companyDetails}
                                                    onChange={handleChange}
                                                    rows="3"
                                                    placeholder="Brief description of your company"
                                                    maxLength="1000"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your password (min 8 characters)"
                                            minLength="8"
                                        />
                                        {formData.password && (
                                            <div className="mt-2" style={{ fontSize: '0.875rem' }}>
                                                <div className="d-flex gap-2 mb-1">
                                                    <span className={passwordChecks.length ? 'text-success' : 'text-muted'}>✓ At least 8 characters</span>
                                                </div>
                                                <div className="d-flex gap-2 flex-wrap">
                                                    <span className={passwordChecks.upper ? 'text-success' : 'text-muted'}>✓ Uppercase</span>
                                                    <span className={passwordChecks.lower ? 'text-success' : 'text-muted'}>✓ Lowercase</span>
                                                    <span className={passwordChecks.number ? 'text-success' : 'text-muted'}>✓ Number</span>
                                                    <span className={passwordChecks.symbol ? 'text-success' : 'text-muted'}>✓ Symbol</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="Confirm your password"
                                            minLength="8"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="acceptTerms"
                                                checked={acceptedTerms}
                                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                                required
                                            />
                                            <label className="form-check-label" htmlFor="acceptTerms">
                                                I agree to the <Link to="/terms">Terms of Service</Link>
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Creating account...
                                            </>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </button>
                                </form>

                                <div className="text-center mt-3">
                                    <p className="mb-0">
                                        Already have an account?
                                        <Link to="/login" className="text-primary ms-1">Sign in</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
