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

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal that user doesn't exist for security
            return res.status(200).json({
                message: 'If an account exists with this email, a password reset link has been sent.'
            });
        }

        // Generate reset token
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send email with reset link
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@ai-hiring.com',
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0077b5;">Password Reset Request</h2>
                    <p>Hi ${user.firstName},</p>
                    <p>You requested to reset your password. Click the button below to reset it:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #0077b5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                    </div>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="word-break: break-all; color: #0077b5;">${resetUrl}</p>
                    <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
                    <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Email send error:', emailError);
            // Continue even if email fails - in development mode
        }

        return res.status(200).json({
            message: 'If an account exists with this email, a password reset link has been sent.'
        });
    } catch (error) {
        return next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        // Hash the token to compare with stored hash
        const crypto = require('crypto');
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired reset token'
            });
        }

        // Update password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({
            message: 'Password reset successful. You can now login with your new password.'
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    register,
    login,
    getProfile,
    forgotPassword,
    resetPassword,
};
