import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="app-header">
            <div className="container">
                <nav className="nav-main">
                    <Link className="logo" to={user ? '/dashboard' : '/'}>
                        <i className="fas fa-robot"></i>
                        <span>AI Hiring</span>
                    </Link>

                    <div className="nav-links">
                        {user ? (
                            <>
                                <Link className={isActive('/dashboard') ? 'active' : ''} to="/dashboard">Dashboard</Link>
                                <Link className={isActive('/jobs') ? 'active' : ''} to="/jobs">Jobs</Link>
                                <Link className={isActive('/applications') ? 'active' : ''} to="/applications">Applications</Link>
                            </>
                        ) : (
                            <>
                                <Link className={isActive('/') ? 'active' : ''} to="/">Home</Link>
                                <Link className={isActive('/home-pro') ? 'active' : ''} to="/home-pro">Enhanced Home</Link>
                                <Link className={isActive('/jobs') ? 'active' : ''} to="/jobs">Jobs</Link>
                                <Link className={isActive('/about') ? 'active' : ''} to="/about">About</Link>
                                <Link className={isActive('/contact') ? 'active' : ''} to="/contact">Contact</Link>
                            </>
                        )}
                    </div>

                    <div className="nav-actions">
                        <ThemeToggle />
                        {user ? (
                            <div className="user-menu">
                                <button className="user-btn" aria-haspopup="true" aria-expanded="false">
                                    <i className="fas fa-user-circle"></i>
                                    <span className="user-name">{user?.name || 'Account'}</span>
                                </button>
                                <div className="user-menu-list">
                                    <Link to="/profile"><i className="fas fa-user"></i> Profile</Link>
                                    <Link to="/terms"><i className="fas fa-file-contract"></i> Terms</Link>
                                    <button onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</button>
                                </div>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link className="nav-btn nav-btn-outline" to="/login">Login</Link>
                                <Link className="nav-btn nav-btn-primary" to="/register">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
