import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Import pages
import LandingPage from './pages/Home/LandingPage';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Privacy from './pages/Privacy/Privacy';
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
            {user && <Navbar />}
            <main className={user ? 'main-content' : 'main-content-full'}>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={
                        <PublicRoute>
                            <LandingPage />
                        </PublicRoute>
                    } />
                    <Route path="/home" element={
                        <PublicRoute>
                            <Home />
                        </PublicRoute>
                    } />
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
            </main>
            <AIChatbot />
            <Toaster position="top-right" />
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
