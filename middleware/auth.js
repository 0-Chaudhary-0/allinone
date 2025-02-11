const jwt = require('jsonwebtoken');
const jwtSecret = "#@abdulsattar";

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (token == null) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.user = user; // Add user info to request object
    next();
  });
};

module.exports = authenticateToken;
