// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // For this example, the first registered user becomes an admin
        const userCount = await User.countDocuments();
        const role = userCount === 0 ? 'admin' : 'user';

        user = new User({ email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error during signup' });
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // --- More Robust Error Handling ---
    // 1. Check if JWT_SECRET is defined. This is a common point of failure.
    if (!process.env.JWT_SECRET) {
        console.error('FATAL ERROR: JWT_SECRET is not defined in .env file.');
        // This specific error message will now be sent as JSON
        return res.status(500).json({ message: 'Server configuration error: JWT secret is missing.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id, role: user.role } };
        
        // 2. Sign the token and send response
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });

        res.json({ token, userId: user.id, role: user.role });

    } catch (error) {
        console.error(error.message);
        // This will catch any other unexpected errors during the login process
        res.status(500).json({ message: 'Server Error during login' });
    }
});

module.exports = router;