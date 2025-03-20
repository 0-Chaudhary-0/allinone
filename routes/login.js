const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Secret key for JWT
const jwtSecret = "#@abdulsattar";

// POST /login — Handle login form submission
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.render("message", {
        title: "Login Failed",
        message: "Email and password are required.",
        redirectUrl: "/login",
        buttonText: "Try Again",
        token: null,
        refreshToken: null
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("message", {
        title: "Login Failed",
        message: "Invalid email or password!",
        redirectUrl: "/login",
        buttonText: "Try Again",
        token: null,
        refreshToken: null
      });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("message", {
        title: "Login Failed",
        message: "Invalid email or password!",
        redirectUrl: "/login",
        buttonText: "Try Again",
        token: null,
        refreshToken: null
      });
    }

    // Generate access and refresh tokens
    const accessToken = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "20d" });
    const refreshToken = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "20d" });

    // Set tokens in HttpOnly cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS (localhost => false)
      sameSite: "strict",
      maxAge: 20 * 24 * 60 * 60 * 1000 // 20 days
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "strict",
      maxAge: 20 * 24 * 60 * 60 * 1000
    });

    // Redirect to home or dashboard after login
    res.redirect("/");

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).render("message", {
      title: "Login Error",
      message: "Server error during login. Please try again later.",
      redirectUrl: "/login",
      buttonText: "Try Again",
      token: null,
      refreshToken: null
    });
  }
});

module.exports = router;
