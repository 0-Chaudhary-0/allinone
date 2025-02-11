const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Handle login form submission
router.post('/', async (req, res) => {
    const jwtSecret = "#@abdulsattar";
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render('message', {
        title: 'Login Failed',
        message: 'Please fill in all fields',
        redirectUrl: '/login.ejs',
        buttonText: 'Login Now',
        token: null
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).render('message', {
        title: 'Login Failed',
        message: 'Invalid email or password',
        redirectUrl: '/login.ejs',
        buttonText: 'Login Now',
        token: null
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).render('message', {
        title: 'Login Failed',
        message: 'Invalid email or password',
        redirectUrl: '/login.ejs',
        buttonText: 'Login Now',
        token: null
      });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, jwtSecret );

    // Render message page with JWT
    res.render('message', {
      title: 'Login Successful',
      message: 'You have logged in successfully.',
      redirectUrl: '/',
      buttonText: 'Go to Home',
      token // Include the token in the response
    });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).render('message', {
      title: 'Login Failed',
      message: 'Server error',
      redirectUrl: '/login.ejs',
      buttonText: 'Login Now',
      token: null
    });
  }
});

module.exports = router;
