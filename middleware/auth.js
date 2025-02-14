const jwt = require('jsonwebtoken');
const jwtSecret = "#@abdulsattar";

function authenticateToken(req, res, next) {
    console.log("🔍 Request Headers:", req.headers); // ✅ Log all headers

    const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1]; // ✅ Extract token
    console.log("Received Token:", token); // 🔍 Debugging log

    try {
        const verified = jwt.verify(token, jwtSecret);
        console.log("✅ User is verified:", verified); // ✅ If verification is successful

        req.user = verified;
        next();
    } catch (err) {
        console.error("❌ Token verification error:", err.message);
        return res.status(403).json({ message: "Invalid token." });
    }
}

module.exports = authenticateToken;
