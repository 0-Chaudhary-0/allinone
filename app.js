const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require("./lib/connect");
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');

// 👉 MUST be before app.use()
const app = express(); 

require('./config/passport');

// Session setup (must be before passport)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// JWT middleware for EJS global user access
const jwtSecret = process.env.JWT_SECRET;
app.use((req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const verified = jwt.verify(token, jwtSecret);
            res.locals.user = verified;
        } catch (err) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});

// Routes
const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');
const indexRoutes = require('./routes/index');
const productRoute = require("./routes/products");
const paymentRoute = require("./routes/payment");

app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/products', productRoute);
app.use('/payment', paymentRoute);
app.use('/', indexRoutes);

// Connect DB and Start Server
connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
