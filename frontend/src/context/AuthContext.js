import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
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
    }, []);

    const verifyToken = async () => {
        try {
            const response = await authAPI.getProfile();
            setUser(response.data.user);
        } catch (error) {
            console.error('Token verification failed:', error);
            logout();
        }
    };

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
            const response = await authAPI.register(userData);
            const { token, user: newUser } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);

            toast.success(`Welcome to AI-Powered Hiring System, ${newUser.name}!`);
            return { success: true };
        } catch (error) {
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

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
