import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * ProtectedRoute Component
 * 
 * Implements role-based access control as per SRS requirements:
 * - FR-002: Access to user-specific dashboard after login
 * - Section 4.1.2: Role-specific overview with key metrics
 * - Section 7.4.2: User roles (job_seeker, recruiter, admin)
 * 
 * @param {Array} allowedRoles - List of roles that can access this route
 */
const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    // Show loading spinner while checking authentication
    if (loading) {
        return <LoadingSpinner text="Verifying access..." />;
    }

    // Not authenticated - redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user's role is allowed
    if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
            // User is logged in but doesn't have permission
            return (
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card border-danger">
                                <div className="card-body text-center">
                                    <i className="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                                    <h3>Access Denied</h3>
                                    <p className="text-muted">
                                        You don't have permission to access this page.
                                    </p>
                                    <p className="text-muted">
                                        Your role: <span className="badge bg-secondary">{user.role}</span>
                                    </p>
                                    <p className="text-muted">
                                        Required role: <span className="badge bg-primary">{allowedRoles.join(' or ')}</span>
                                    </p>
                                    <button
                                        className="btn btn-primary mt-3"
                                        onClick={() => window.history.back()}
                                    >
                                        Go Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    // User is authenticated and authorized - render the protected component
    return <Outlet />;
};

export default ProtectedRoute;
