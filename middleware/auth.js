const jwt = require('jsonwebtoken');
const jwtSecret = "#@abdulsattar";

function authenticateToken(req, res, next) {
    // Extract token from cookie
    const token = req.cookies.accessToken;

    if (!token) {
        console.warn("⚠️ No token found in cookies.");
        return res.status(401).render("message", {
            title: "Unauthorized",
            message: "You must be logged in to access this page.",
            redirectUrl: "/login.ejs",
            buttonText: "Login",
            token: null
        });
    }

    try {
        const verified = jwt.verify(token, jwtSecret);
        console.log("✅ User verified:", verified);

        req.user = verified; // Set user info for use in routes
        next();
    } catch (err) {
        console.error("❌ Token verification error:", err.message);
        return res.status(403).render("message", {
            title: "Invalid Token",
            message: "Your session has expired or token is invalid.",
            redirectUrl: "/login.ejs",
            buttonText: "Login Again",
            token: null
        });
    }
}


module.exports = authenticateToken;