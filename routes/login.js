const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Handle login form submission
let jwtSecret = "#@abdulsattar"
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
      return res.render("message", {
          title: "Login Failed",
          message: "Invalid email or password!",
          redirectUrl: "/login.ejs",
          buttonText: "Try Again",
          token: null,
          refreshToken: null
      });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
      return res.render("message", {
          title: "Login Failed",
          message: "Invalid email or password!",
          redirectUrl: "/login.ejs",
          buttonText: "Try Again",
          token: null,
          refreshToken: null
      });
  }

  // Generate tokens
  const accessToken = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "20d" });
  const refreshToken = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "20d" });

  // Render message.ejs and inject tokens for frontend storage
  res.render("message", {
      title: "Login Successful",
      message: "You have logged in successfully!",
      redirectUrl: "/",
      buttonText: "Go to Dashboard",
      token: accessToken,
      refreshToken: refreshToken
  });
});


module.exports = router;