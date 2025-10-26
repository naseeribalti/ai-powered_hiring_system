const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not defined');
    }

    return jwt.sign(
        {
            sub: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d',
        }
    );
};

const register = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            role,
            phone,
            companyName,
            companyWebsite,
            companyDetails
        } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // Create user data object
        const userData = {
            firstName,
            lastName,
            email,
            password,
            role: role || 'jobSeeker',
            phone,
        };

        // Add recruiter-specific fields if role is recruiter
        if (role === 'recruiter') {
            if (!companyName) {
                return res.status(400).json({
                    message: 'Company name is required for recruiters'
                });
            }
            userData.companyName = companyName;
            userData.companyWebsite = companyWebsite;
            userData.companyDetails = companyDetails;
            // Recruiters require admin approval before they can post jobs
            userData.status = 'pending_approval';
        }

        const user = await User.create(userData);

        const token = signToken(user);

        return res.status(201).json({
            token,
            user: user.toJSON(),
            message: role === 'recruiter'
                ? 'Recruiter account created. Awaiting admin approval to post jobs.'
                : 'Account created successfully'
        });
    } catch (error) {
        return next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                message: 'Account is inactive. Please contact administrator.'
            });
        }

        // Check account status for recruiters
        if (user.role === 'recruiter' && user.status === 'pending_approval') {
            return res.status(401).json({
                message: 'Your recruiter account is pending approval. Please wait for admin approval.'
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login timestamp
        await user.updateLastLogin();

        const token = signToken(user);

        return res.status(200).json({
            token,
            user: user.toJSON(),
            message: 'Login successful'
        });
    } catch (error) {
        return next(error);
    }
};

const getProfile = async (req, res) => {
    return res.json({ user: req.user });
};

module.exports = {
    register,
    login,
    getProfile,
};
