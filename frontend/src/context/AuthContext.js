import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, usersAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on app start
    const verifyToken = useCallback(async () => {
        try {
            const response = await authAPI.getProfile();
            setUser(response.data.user);
        } catch (error) {
            console.error('Token verification failed:', error);
            logout();
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
                // Optionally verify token with backend
                verifyToken();
            } catch (error) {
                console.error('Error parsing saved user data:', error);
                logout();
            }
        }
        setLoading(false);
    }, [verifyToken]);

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await authAPI.login(credentials);
            const { token, user: userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            toast.success(`Welcome back, ${userData.name}!`);
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);

            // Debug: Log what we're sending
            console.log('📤 Registration attempt:', {
                ...userData,
                password: '[HIDDEN]'
            });

            const response = await authAPI.register(userData);
            const { token, user: newUser } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);

            toast.success(`Welcome to AI-Powered Hiring System, ${newUser.name}!`);
            return { success: true };
        } catch (error) {
            console.error('❌ Registration error:', error.response?.data);

            // Handle validation errors (422)
            if (error.response?.status === 422 && error.response?.data?.errors) {
                const validationErrors = error.response.data.errors;
                console.log('🔍 Validation errors:', validationErrors);

                // Show each validation error
                validationErrors.forEach(err => {
                    toast.error(`${err.field}: ${err.message}`);
                });

                // Return detailed error message
                const errorMsg = validationErrors
                    .map(err => `${err.field}: ${err.message}`)
                    .join(', ');
                return { success: false, message: errorMsg, errors: validationErrors };
            }

            // Handle other errors
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out successfully');
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await authAPI.updateProfile(profileData);
            const updatedUser = response.data.user;

            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            toast.success('Profile updated successfully');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Profile update failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const uploadProfilePhoto = async (file) => {
        try {
            const response = await usersAPI.uploadMyPhoto(file);
            const updatedUser = response.data?.data?.user || response.data?.user;

            if (updatedUser) {
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            }

            toast.success('Profile photo updated');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Photo upload failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        uploadProfilePhoto,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
