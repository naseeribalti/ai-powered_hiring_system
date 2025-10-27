import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/auth/forgot-password', { email });
            setIsSuccess(true);
            toast.success(response.data.message || 'Password reset link sent to your email');
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Failed to send reset link. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <div className="forgot-password-header">
                    <div className="icon-wrapper">
                        <i className="fas fa-lock"></i>
                    </div>
                    <h1>Forgot Password?</h1>
                    <p>
                        {isSuccess
                            ? "Check your email for reset instructions"
                            : "Enter your email and we'll send you a reset link"}
                    </p>
                </div>

                {isSuccess ? (
                    <div className="success-message">
                        <i className="fas fa-check-circle"></i>
                        <h3>Email Sent!</h3>
                        <p>
                            If an account exists with <strong>{email}</strong>, you will
                            receive a password reset link shortly.
                        </p>
                        <p className="info-text">
                            Didn't receive the email? Check your spam folder or{' '}
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="link-button"
                            >
                                try again
                            </button>
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="forgot-password-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-with-icon">
                                <i className="fas fa-envelope"></i>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Sending...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane"></i> Send Reset Link
                                </>
                            )}
                        </button>
                    </form>
                )}

                <div className="forgot-password-footer">
                    <Link to="/login" className="back-link">
                        <i className="fas fa-arrow-left"></i> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
