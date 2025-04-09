const express = require('express');
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const checkLoginStatus = require("../middleware/checkLoginStatus");
const Product = require('../models/Product');
const Comment = require('../models/Comment');
const nodemailer = require("nodemailer");
const Order = require('../models/Order');
const User = require('../models/User');
const Rating = require("../models/Rating"); // Import your Rating schema

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Replace with your email
    pass: process.env.EMAIL_PASS, // Replace with your app password
  },
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


// Apply checkLoginStatus to all GET routes
router.use(checkLoginStatus);

// Public pages
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.render("index.ejs", { products, user: req.user });
});

router.get("/books", (req, res) => {
  res.render("books.ejs", { user: req.user });
});

router.get("/about", (req, res) => {
  res.render("about.ejs", { user: req.user });
});

router.get("/videos", (req, res) => {
  res.render("videos.ejs", { user: req.user });
});

router.get("/login", (req, res) => {
  let token = req.cookies.accessToken
  if (token) {
    res.redirect("/")
  }
  res.render("login.ejs", { user: req.user });
});

router.get("/order-success", (req, res) => {
  res.render("order-success.ejs", { user: req.user });
});

router.get("/signup", (req, res) => {
  let token = req.cookies.accessToken
  if (token) {
    res.redirect("/")
  }
  res.render("signup.ejs", { user: req.user });
});

router.get("/cart", (req, res) => {
  res.render("cart.ejs", { user: req.user });
});

router.get("/chemistryquiz", (req, res) => {
  res.render("chemistryquiz.ejs", { user: req.user });
});

router.get("/shopping", async (req, res) => {
  const products = await Product.find();
  res.render("shopping.ejs", { products, user: req.user });
});

router.get("/search", async (req, res) => {
  const query = req.query.query?.toLowerCase() || "";

  const products = await Product.find({
    name: { $regex: new RegExp(query, "i") }
  });

  res.render("search.ejs", { products, user: req.user, query });
});

// Protected route: Checkout
router.get("/checkout/:id", authenticateToken, async (req, res) => {
  res.render("checkout.ejs", { user: req.user, userId: req.user.userId });
});

router.get("/id=:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const products = await Product.find();
    const product = products.find(p => p._id.toString() === productId);

    if (!product) {
      return res.status(404).render("404", { message: "Product not found" });
    }

    // Fetch related reviews from Rating model
    const reviews = await Rating.find({ productId }).sort({ createdAt: -1 }); // Newest first

    res.render("productDetails.ejs", { product, user: req.user, reviews });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Server error");
  }
});

// Create order for Cash on Delivery (COD)
router.post('/order/create/:productId', authenticateToken, async (req, res) => {
  try {
    const { address, quantity } = req.body;
    const userId = req.user?.userId || req.body.userId; // Get userId from authenticated request
    const productId = req.params.productId; // Extract product ID from URL

    // Validate required fields
    if (!userId || !address || !address.fullName || !address.phone || !address.street || !address.city || !address.postalCode) {
      return res.status(400).json({ error: 'Missing required fields in address or userId' });
    }

    // Fetch product from DB
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ error: 'Invalid product' });
    }

    const verifiedTotal = product.price * quantity;

    // Save Order in DB with 'Pending' payment status for COD
    const newOrder = new Order({
      userId,
      cartItems: { productId, quantity, price: product.price }, // Single product order
      totalAmount: verifiedTotal,
      address,
      paymentStatus: 'Pending', // COD orders remain pending until confirmed
    });

    await newOrder.save();

    // ✅ Fetch user before sending email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await sendEmail(
      user.email,
      "Order Confirmation",
      `Your order for product ID ${productId} has been placed successfully.`
    );

    res.status(200).json({ success: true, message: 'Order placed successfully!', orderId: newOrder._id });

  } catch (error) {
    console.error('Order Creation Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId || req.query.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const orders = await Order.find({ userId }).populate("cartItems.productId");

    res.render("orders.ejs", { orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Refresh token endpoint
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  const jwtSecret = "#@abdulsattar";

  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  try {
    const verified = jwt.verify(refreshToken, jwtSecret);
    const newAccessToken = jwt.sign({ userId: verified.userId }, jwtSecret, { expiresIn: "15m" });
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

// Handle comment submission
router.post("/comment", async (req, res) => {
  const { email, comment } = req.body;

  if (!email || !comment) {
    return res.status(400).json({ message: "Email and comment are required!" });
  }

  try {
    const newComment = new Comment({ email, comment });
    await newComment.save();
    res.status(201).json({ message: "Comment Successfully Submitted. Thanks For Your Comment" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// In your logout route
router.get('/logout', (req, res) => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
  res.redirect("/"); // or wherever you want
});

module.exports = router;
