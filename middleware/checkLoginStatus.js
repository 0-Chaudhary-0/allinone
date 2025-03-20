const jwt = require('jsonwebtoken');
const jwtSecret = "#@abdulsattar";

function checkLoginStatus(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const verified = jwt.verify(token, jwtSecret);
    req.user = verified;
  } catch (err) {
    req.user = null; // Token invalid or expired
  }

  next();
}

module.exports = checkLoginStatus;
