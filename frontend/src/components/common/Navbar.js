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
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand fw-bold" to={user ? "/dashboard" : "/"}>
                    <i className="fas fa-robot me-2"></i>
                    AI Hiring System
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                                        to="/dashboard"
                                    >
                                        <i className="fas fa-tachometer-alt me-1"></i>
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}
                                        to="/jobs"
                                    >
                                        <i className="fas fa-briefcase me-1"></i>
                                        Jobs
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/applications') ? 'active' : ''}`}
                                        to="/applications"
                                    >
                                        <i className="fas fa-file-alt me-1"></i>
                                        Applications
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                                        to="/"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/home-pro') ? 'active' : ''}`}
                                        to="/home-pro"
                                    >
                                        Enhanced Home
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}
                                        to="/jobs"
                                    >
                                        Jobs
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                                        to="/about"
                                    >
                                        About
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                                        to="/contact"
                                    >
                                        Contact
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <ul className="navbar-nav align-items-center" style={{ gap: '0.5rem' }}>
                        <li className="nav-item d-flex align-items-center">
                            <ThemeToggle />
                        </li>
                        {user ? (
                            <li className="nav-item dropdown">
                                <button
                                    className="nav-link dropdown-toggle"
                                    id="userMenuButton"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{ background: 'transparent' }}
                                >
                                    <i className="fas fa-user-circle me-1"></i>
                                    {user?.name}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="userMenuButton">
                                    <li>
                                        <Link className="dropdown-item" to="/profile">
                                            <i className="fas fa-user me-2"></i>
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/terms">
                                            <i className="fas fa-file-contract me-2"></i>
                                            Terms
                                        </Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            <i className="fas fa-sign-out-alt me-2"></i>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-light" to="/register">Sign Up</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
