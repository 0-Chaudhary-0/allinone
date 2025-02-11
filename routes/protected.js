const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.get('/chemistryquiz', authenticateToken, (req, res) => {
  res.render('chemistryquiz', { message: 'Welcome to the dashboard!', user: req.user });
});

module.exports = router;
