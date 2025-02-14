const jwt = require('jsonwebtoken');
const jwtSecret = "#@abdulsattar";

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization; // ✅ Correct way to get token

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const token = authHeader.split(' ')[1]; // ✅ Extract token
    console.log(token)
    const verified = jwt.verify(token, jwtSecret);
    if (!verified) {
      console.log("user is unverified")
    }
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
}

module.exports = authenticateToken;
