import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Import pages
import LandingPage from './pages/Home/LandingPage';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Privacy from './pages/Privacy/Privacy';
import Terms from './pages/Terms/Terms';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import JobApplicationPage from './pages/JobApplicationPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ProfilePage from './pages/ProfilePage';

// Import components
import Navbar from './components/common/Navbar';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AIChatbot from './components/AIChatbot';
import ErrorBoundary from './components/common/ErrorBoundary';
import FaviconManager from './components/common/FaviconManager';

// Import styles
import './styles/App.css';

// React Router v6 future flags to suppress deprecation warnings
const routerFutureFlags = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
};

// Create a client for React Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

// Public Route component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    return user ? <Navigate to="/dashboard" /> : children;
};

function AppContent() {
    const { user } = useAuth();

    return (
        <div className="App">
            <FaviconManager />
            {user && <Navbar />}
            <main className={user ? 'main-content' : 'main-content-full'}>
                <ErrorBoundary>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={
                            <PublicRoute>
                                <LandingPage />
                            </PublicRoute>
                        } />
                        {/* /home route removed to avoid duplicate marketing page; use / instead */}
                        <Route path="/about" element={
                            <PublicRoute>
                                <About />
                            </PublicRoute>
                        } />
                        <Route path="/contact" element={
                            <PublicRoute>
                                <Contact />
                            </PublicRoute>
                        } />
                        <Route path="/privacy" element={
                            <PublicRoute>
                                <Privacy />
                            </PublicRoute>
                        } />
                        <Route path="/terms" element={
                            <PublicRoute>
                                <Terms />
                            </PublicRoute>
                        } />
                        <Route path="/login" element={
                            <PublicRoute>
                                <LoginPage />
                            </PublicRoute>
                        } />
                        <Route path="/register" element={
                            <PublicRoute>
                                <RegisterPage />
                            </PublicRoute>
                        } />

                        {/* 
                        Protected routes with role-based access control
                        Implements SRS FR-002: Access to user-specific dashboard
                        and Section 4.1.2: Role-specific overview
                    */}

                        {/* Dashboard - All authenticated users */}
                        <Route element={<ProtectedRoute allowedRoles={['jobSeeker', 'recruiter', 'admin']} />}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                        </Route>

                        {/* Jobs - All authenticated users can view */}
                        <Route element={<ProtectedRoute allowedRoles={['jobSeeker', 'recruiter', 'admin']} />}>
                            <Route path="/jobs" element={<JobsPage />} />
                            <Route path="/jobs/:id" element={<JobDetailPage />} />
                            <Route path="/jobs/:id/apply" element={<JobApplicationPage />} />
                        </Route>

                        {/* Applications - Job Seekers can view their applications */}
                        <Route element={<ProtectedRoute allowedRoles={['jobSeeker']} />}>
                            <Route path="/applications" element={<ApplicationsPage />} />
                        </Route>

                        {/* Recruiter-specific routes - FR-020: Create and manage job postings */}
                        <Route element={<ProtectedRoute allowedRoles={['recruiter', 'admin']} />}>
                            <Route path="/recruiter/jobs" element={<JobsPage recruiterView={true} />} />
                            <Route path="/recruiter/applications" element={<ApplicationsPage recruiterView={true} />} />
                        </Route>

                        {/* Default redirect for authenticated users handled by PublicRoute */}

                        {/* 404 Not Found */}
                        <Route path="*" element={
                            <div className="container mt-5">
                                <div className="row justify-content-center">
                                    <div className="col-md-6 text-center">
                                        <h1 className="display-1">404</h1>
                                        <p className="lead">Page not found</p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => window.history.back()}
                                        >
                                            Go Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        } />
                    </Routes>
                </ErrorBoundary>
            </main>
            <AIChatbot />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'var(--color-surface)',
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-md)',
                    },
                    success: {
                        style: {
                            background: '#f0fdf4',
                            color: '#166534',
                        },
                        iconTheme: {
                            primary: 'var(--color-success)',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        style: {
                            background: '#fef2f2',
                            color: '#991b1b',
                        },
                        iconTheme: {
                            primary: 'var(--color-danger)',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </div>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router future={routerFutureFlags}>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
