const express = require('express');
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const Product = require('../models/Product');

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

router.get("/checkout.ejs/id=:id", async (req, res) => {
  try {
    const productId = req.params.id; // Extract product ID from the route parameter
    console.log(productId)
    // Fetch the product by ID from the database
    const product = await Product.findById(productId);

    if (!product) {
      // If the product is not found, render a 404 page
      return res.status(404).render("404", { message: "Product not found" });
    }

    // Render the checkout page with the product details
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


module.exports = router;