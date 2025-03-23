const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/Product'); // Path to your model
const Rating = require("../models/Rating"); // Import your Rating schema


router.get('/getall', async (req, res) => {
  try {
    const product = await Product.find();
    res.status(201).json(product);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @route   POST /api/products/add
// @desc    Add a new product
router.post('/add', async (req, res) => {
  try {
    const { name, slug, description, category, price, variants } = req.body;

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({ error: "Product with this slug already exists" });
    }

    // Create new product
    const newProduct = new Product({
      name,
      slug,
      description,
      category,
      price,
      variants
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

router.get('/ratings/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const ratings = await Rating.find({ productId }).sort({ createdAt: -1 });

    // Calculate average
    const average = await Rating.aggregate([
      { $match: { productId: mongoose.Types.ObjectId(productId) } },
      { $group: { _id: '$productId', avgRating: { $avg: '$rating' } } }
    ]);

    res.json({
      ratings,
      averageRating: average[0]?.avgRating.toFixed(1) || '0.0'
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching ratings' });
  }
});


// POST route for submitting review
router.post("/submit-review/:productId", async (req, res) => {
  const { productId } = req.params;
  const { reviewText, rating } = req.body;
  console.log("Review form submitted for product:", productId);
console.log("Review text:", reviewText);
console.log("Rating:", rating);

  try {
    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send("Invalid product ID.");
    }

    // Create a new rating document
    const newRating = new Rating({
      productId: productId,
      rating: parseInt(rating),
      review: reviewText
      // Optionally add userId if you have authentication: userId: req.user._id
    });

    await newRating.save();

    // Redirect back to product page
    res.redirect(`/id=${productId}`);
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).send("Server error while submitting review.");
  }
});



module.exports = router;
