const express = require('express');
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const checkLoginStatus = require("../middleware/checkLoginStatus");
const Product = require('../models/Product');
const Comment = require('../models/Comment');

// Apply checkLoginStatus to all GET routes
router.use(checkLoginStatus);

// Public pages
router.get("/", (req, res) => {
  res.render("index.ejs", { user: req.user });
});

router.get("/books.ejs", (req, res) => {
  res.render("books.ejs", { user: req.user });
});

router.get("/about.ejs", (req, res) => {
  res.render("about.ejs", { user: req.user });
});

router.get("/videos.ejs", (req, res) => {
  res.render("videos.ejs", { user: req.user });
});

router.get("/login.ejs", (req, res) => {
  res.render("login.ejs", { user: req.user });
});

router.get("/signup.ejs", (req, res) => {
  res.render("signup.ejs", { user: req.user });
});

router.get("/account.ejs", (req, res) => {
  res.render("account.ejs", { user: req.user });
});

router.get("/cart.ejs", (req, res) => {
  res.render("cart.ejs", { user: req.user });
});

router.get("/chemistryquiz.ejs", (req, res) => {
  res.render("chemistryquiz.ejs", { user: req.user });
});

router.get("/shopping.ejs", async (req, res) => {
  const products = await Product.find();
  res.render("shopping.ejs", { products, user: req.user });
});

router.get("/payment.ejs", async (req, res) => {
  const products = await Product.find();
  res.render("payment.ejs", { products, user: req.user });
});

// Protected route: Checkout
router.get("/checkout/:id", authenticateToken, async (req, res) => {
    res.render("checkout.ejs", { user: req.user });
});


router.get("/id=:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const products = await Product.find();
    const product = products.find(p => p._id.toString() === productId);

    if (!product) {
      return res.status(404).render("404", { message: "Product not found" });
    }

    res.render("productDetails.ejs", { product, user: req.user });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Server error");
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

module.exports = router;
