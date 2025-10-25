import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
                <Link className="navbar-brand fw-bold" to="/dashboard">
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
                    </ul>

                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                            >
                                <i className="fas fa-user-circle me-1"></i>
                                {user?.name}
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <Link className="dropdown-item" to="/profile">
                                        <i className="fas fa-user me-2"></i>
                                        Profile
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
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
