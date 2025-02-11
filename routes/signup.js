const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Handle signup form submission
router.post('/', async (req, res) => {
    const jwtSecret = "#@abdulsattar";
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('message', {
                title: 'Signup Failed',
                message: 'Please fill in all fields',
                redirectUrl: '/signup.ejs',
                buttonText: 'Try Again',
                token: null
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).render('message', {
                title: 'Signup Failed',
                message: 'User already exists',
                redirectUrl: '/signup.ejs',
                buttonText: 'Try Again',
                token: null
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Generate JWT
        const token = jwt.sign({ userId: newUser._id }, jwtSecret, { expiresIn: '1h' });

        // Render message page with JWT
        res.render('message', {
            title: 'Signup Successful',
            message: 'You have signed up successfully.',
            redirectUrl: '/',
            buttonText: 'Go to Home',
            token // Include the token in the response
        });
    } catch (err) {
        console.error('Error during signup:', err.message);
        res.status(500).render('message', {
            title: 'Signup Failed',
            message: 'An error occurred while processing your request. Please try again later.',
            redirectUrl: '/signup.ejs',
            buttonText: 'Try Again',
            token: null
        });
    }
});

module.exports = router;
