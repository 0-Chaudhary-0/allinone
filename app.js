const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectDB = require("./lib/connect")
const path = require('path');
const cors = require('cors');
const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');
const indexRoutes = require('./routes/index');
const productRoute = require("./routes/products")


const app = express();

// Added Cors Policy
app.use(cors());

// Connect to MongoDB
connectDB();

// Set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set up static folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/products', productRoute);
app.use('/', indexRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
