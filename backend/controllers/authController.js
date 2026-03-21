const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateEmail, validatePassword } = require('../middleware/validationMiddleware');
const logger = require('../utils/logger');

/**
 * Register a new user
 * POST /api/auth/register
 */
exports.registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email input
        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            logger.logValidationFailure('/api/auth/register', emailValidation.error, {
                ip: req.ip,
            });
            return res.status(400).json({ error: emailValidation.error });
        }

        // Validate password input
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            logger.logValidationFailure('/api/auth/register', passwordValidation.error, {
                ip: req.ip,
            });
            return res.status(400).json({ error: passwordValidation.error });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: emailValidation.value });
        if (existingUser) {
            logger.logAuthEvent('REGISTER', emailValidation.value, 'DUPLICATE', { ip: req.ip });
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password with bcrypt
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(passwordValidation.value, salt);

        // Create new user
        const user = new User({ email: emailValidation.value, passwordHash });
        await user.save();

        logger.logAuthEvent('REGISTER', user._id, 'SUCCESS', { email: emailValidation.value });
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        logger.error('Registration error', {
            error: error.message,
            ip: req.ip,
        });
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email input
        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            logger.logValidationFailure('/api/auth/login', emailValidation.error, { ip: req.ip });
            return res.status(400).json({ error: emailValidation.error });
        }

        // Validate password input
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            logger.logValidationFailure('/api/auth/login', passwordValidation.error, {
                ip: req.ip,
            });
            return res.status(400).json({ error: passwordValidation.error });
        }

        // Find user by email
        const user = await User.findOne({ email: emailValidation.value });
        if (!user) {
            // Log attempt but don't reveal if email exists
            logger.logAuthEvent('LOGIN', null, 'INVALID_EMAIL', {
                email: emailValidation.value,
                ip: req.ip,
            });
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(passwordValidation.value, user.passwordHash);
        if (!isMatch) {
            logger.logAuthEvent('LOGIN', user._id, 'INVALID_PASSWORD', { ip: req.ip });
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Ensure JWT_SECRET is configured
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            logger.error('JWT_SECRET not configured', { context: 'loginUser' });
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Generate JWT token with expiration
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            jwtSecret,
            {
                expiresIn: '7d', // Token expires in 7 days
                algorithm: 'HS256',
            },
        );

        logger.logAuthEvent('LOGIN', user._id, 'SUCCESS', { ip: req.ip });
        return res.json({ token });
    } catch (error) {
        logger.error('Login error', {
            error: error.message,
            ip: req.ip,
        });
        return res.status(500).json({ error: 'Server error' });
    }
};
