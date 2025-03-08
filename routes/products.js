const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Path to your model

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

module.exports = router;
