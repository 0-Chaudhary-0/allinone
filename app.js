const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectDB = require("./lib/connect");
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Routes
const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');
const indexRoutes = require('./routes/index');
const productRoute = require("./routes/products");

const app = express();
const jwtSecret = "#@abdulsattar"; // Secret for JWT

// Connect to MongoDB
connectDB();

// Set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 🔥 Global middleware to set user for all views
app.use((req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const verified = jwt.verify(token, jwtSecret);
            res.locals.user = verified; // Accessible in all EJS files (partials too)
        } catch (err) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});

// Routes
app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/products', productRoute);
app.use('/', indexRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
