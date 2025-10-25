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
        const { firstName, lastName, email, password, role, phone } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role,
            phone,
        });

        const token = signToken(user);

        return res.status(201).json({
            token,
            user: user.toJSON(),
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

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = signToken(user);

        return res.status(200).json({
            token,
            user: user.toJSON(),
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
