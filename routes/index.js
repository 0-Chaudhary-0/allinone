const express = require('express');
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const Product = require('../models/Product');
const Comment = require('../models/Comment');

// Define your routes here
router.get("/", (req, res)=>{
  res.render("index.ejs")
})

router.get("/books.ejs", (req, res)=>{
  res.render("books.ejs")
})

router.get("/about.ejs", (req, res)=>{
  res.render("about.ejs")
})

router.get("/videos.ejs", (req, res)=>{
  res.render("videos.ejs")
})

router.get("/login.ejs", (req, res)=>{
  res.render("login.ejs")
})

router.get("/signup.ejs", (req, res)=>{
  res.render("signup.ejs")
})

router.get("/account.ejs", (req, res)=>{
  res.render("account.ejs")
})

router.get("/cart.ejs", (req, res)=>{
  res.render("cart.ejs")
})

router.get("/shopping.ejs", async (req, res)=>{
  const products = await Product.find();
  res.render("shopping.ejs", {products})
})


router.get("/checkout/:id", authenticateToken, async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      console.error("Product ID is undefined in route!");
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).render("404", { message: "Product not found" });
    }

    res.render("checkout.ejs", { product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Server error");
  }
});


router.get("/id=:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Fetch all products from the database
    const products = await Product.find();

    // Find the product by ID from the fetched array
    const product = products.find(p => p._id.toString() === productId);

    if (!product) {
      return res.status(404).render("404", { message: "Product not found" });
    }

    // Render the product details page
    res.render("productDetails.ejs", { product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Server error");
  }
});

router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  let jwtSecret = "#@abdulsattar"
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  try {
    const verified = jwt.verify(refreshToken, jwtSecret);
    const newAccessToken = jwt.sign({ userId: verified.userId }, jwtSecret, { expiresIn: "15m" }); // Shorter time
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

router.post("/comment", async (req, res) => {
  const { email, comment } = req.body;
  console.log("Received Data:", req.body); // Debugging

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