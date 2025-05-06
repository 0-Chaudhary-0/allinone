const express = require('express');
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const checkLoginStatus = require("../middleware/checkLoginStatus");
const Product = require('../models/Product');
const Comment = require('../models/Comment');
const nodemailer = require("nodemailer");
const Order = require('../models/Order');
const User = require('../models/User');
const Rating = require("../models/Rating");
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: '"Allinone" <no-reply@yourdomain.com>',
      to,
      subject: "Your Order Confirmation",
      text: "Thanks for your order! We'll notify you once it's shipped.",
      html: "<p>Thanks for your order! We'll notify you once it's shipped.</p>"
    });
    console.log("Email sent successfully");
    console.log("Sending to:", to); // Check what value is passed
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

router.use(checkLoginStatus);

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.render("index.ejs", { products });
});

router.get("/books", (req, res) => res.render("books.ejs"));
router.get("/about", (req, res) => res.render("about.ejs"));
router.get("/videos", (req, res) => res.render("videos.ejs"));

router.get("/login", (req, res) => {
  if (req.cookies.accessToken) return res.redirect("/");
  res.render("login.ejs");
});

router.get("/order-success", (req, res) => res.render("order-success.ejs"));

router.get("/signup", (req, res) => {
  if (req.cookies.accessToken) return res.redirect("/");
  res.render("signup.ejs");
});

router.get("/cart", (req, res) => res.render("cart.ejs"));
router.get("/chemistryquiz", (req, res) => res.render("chemistryquiz.ejs"));

router.get("/shopping", async (req, res) => {
  const category = req.query.category;
  const products = category
    ? await Product.find({ category: category.toLowerCase() })
    : await Product.find();
  res.render("shopping.ejs", { products });
});

router.get("/search", async (req, res) => {
  const query = req.query.query?.toLowerCase() || "";
  const products = await Product.find({ name: { $regex: new RegExp(query, "i") } });
  res.render("search.ejs", { products, query });
});

router.get("/checkout/:id", authenticateToken, (req, res) => {
  res.render("checkout.ejs", { userId: req.user.userId });
});

router.get("/id=:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const products = await Product.find();
    const product = products.find(p => p._id.toString() === productId);
    if (!product) return res.status(404).render("404", { message: "Product not found" });

    const reviews = await Rating.find({ productId }).sort({ createdAt: -1 });

    // Fetch user details for each review
    const populatedReviews = await Promise.all(reviews.map(async review => {
      let user = null;
      if (review.userId) {
        user = await User.findById(review.userId);
      }
      return {
        ...review.toObject(),
        userName: user?.name || "Anonymous",
        userImage: user?.image || "/images/user.png"
      };
    }));

    console.log(populatedReviews)
    res.render("productDetails.ejs", { product, reviews: populatedReviews, products });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Server error");
  }
});

router.post('/order/create/:productId', authenticateToken, async (req, res) => {
  try {
    const { address, quantity } = req.body;
    const userId = req.user?.userId || req.body.userId;
    const productId = req.params.productId;

    if (!userId || !address || !address.fullName || !address.phone || !address.street || !address.city || !address.postalCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(400).json({ error: 'Invalid product' });

    const newOrder = new Order({
      userId,
      cartItems: { productId, quantity, price: product.price },
      totalAmount: product.price * quantity,
      address,
      paymentStatus: 'Pending',
    });

    await newOrder.save();
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await sendEmail(user.email, "Order Confirmation", `Your order for product ID ${productId} has been placed.`);
    res.status(200).json({ success: true, message: 'Order placed!', orderId: newOrder._id });

  } catch (error) {
    console.error('Order Creation Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId || req.query.userId;
    if (!userId) return res.status(401).json({ error: "User not authenticated" });
    const orders = await Order.find({ userId }).populate("cartItems.productId");
    res.render("orders.ejs", { orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  const jwtSecret = process.env.JWT_SECRET;
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  try {
    const verified = jwt.verify(refreshToken, jwtSecret);
    const newAccessToken = jwt.sign({ userId: verified.userId }, jwtSecret, { expiresIn: "15m" });
    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

router.post("/comment", async (req, res) => {
  const { email, comment } = req.body;
  if (!email || !comment) return res.status(400).json({ message: "Email and comment are required!" });

  try {
    const newComment = new Comment({ email, comment });
    await newComment.save();
    res.status(201).json({ message: "Comment submitted." });
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
  res.redirect("/");
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user;
  
    // ✅ Save user to session
    req.session.user = {
      _id: user._id,
      name: user.name,
      image: user.image
    };
  
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "20d" });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "20d" });
  
    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
  
    res.redirect('/');
  });

module.exports = router;
