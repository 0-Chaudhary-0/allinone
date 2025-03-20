const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Secret key for JWT
const jwtSecret = "#@abdulsattar";

// POST /signup — Handle signup form submission
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).render('message', {
        title: 'Signup Failed',
        message: 'Please fill in all fields.',
        redirectUrl: '/signup',
        buttonText: 'Try Again'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render('message', {
        title: 'Signup Failed',
        message: 'User already exists.',
        redirectUrl: '/signup',
        buttonText: 'Try Again'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Generate JWT tokens
    const accessToken = jwt.sign({ userId: newUser._id }, jwtSecret, { expiresIn: "20d" });
    const refreshToken = jwt.sign({ userId: newUser._id }, jwtSecret, { expiresIn: "20d" });

    // Set tokens in HttpOnly cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "strict",
      maxAge: 20 * 24 * 60 * 60 * 1000 // 20 days
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 20 * 24 * 60 * 60 * 1000
    });

    // Redirect to home or dashboard after signup
    res.redirect('/');

  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).render('message', {
      title: 'Signup Failed',
      message: 'Server error during signup. Please try again later.',
      redirectUrl: '/signup',
      buttonText: 'Try Again'
    });
  }
});

module.exports = router;
