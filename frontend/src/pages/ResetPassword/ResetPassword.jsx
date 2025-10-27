import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import './ResetPassword.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post(`/auth/reset-password/${token}`, {
                password,
            });

            toast.success(
                response.data.message || 'Password reset successful! You can now login.'
            );

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Failed to reset password. The link may have expired.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <div className="reset-password-header">
                    <div className="icon-wrapper">
                        <i className="fas fa-key"></i>
                    </div>
                    <h1>Reset Password</h1>
                    <p>Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit} className="reset-password-form">
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <div className="input-with-icon">
                            <i className="fas fa-lock"></i>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                disabled={isLoading}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i
                                    className={`fas fa-eye${showPassword ? '-slash' : ''}`}
                                ></i>
                            </button>
                        </div>
                        <small className="form-hint">
                            Must be at least 8 characters long
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-with-icon">
                            <i className="fas fa-lock"></i>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
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
                                <i className="fas fa-spinner fa-spin"></i> Resetting...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-check"></i> Reset Password
                            </>
                        )}
                    </button>
                </form>

                <div className="reset-password-footer">
                    <Link to="/login" className="back-link">
                        <i className="fas fa-arrow-left"></i> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
