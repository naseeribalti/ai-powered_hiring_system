import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Import pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ProfilePage from './pages/ProfilePage';

// Import components
import Navbar from './components/common/Navbar';
import LoadingSpinner from './components/common/LoadingSpinner';

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

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    return user ? children : <Navigate to="/login" />;
};

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

                    {/* Protected routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/jobs" element={
                        <ProtectedRoute>
                            <JobsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/applications" element={
                        <ProtectedRoute>
                            <ApplicationsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </main>
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
