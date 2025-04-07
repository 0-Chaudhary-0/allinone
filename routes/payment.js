const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const express = require('express');
const Stripe = require('stripe');
const nodemailer = require("nodemailer");
const router = express.Router();

// Replace with your secret key
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

function convertRsToUsd(totalRs) {
  const exchangeRate = 282; // 1 USD = 282 Rs
  const usdAmount = totalRs / exchangeRate;
  const usdCents = Math.round(usdAmount * 100); // Convert to cents
  return usdCents;
}

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


// Create Payment Intent & Store Order
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { productId, totalAmountRs, address, userId, quantity } = req.body;

    // Verify product details from DB
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }

    const verifiedTotal = product.price * quantity;
    if (verifiedTotal !== totalAmountRs) {
      return res.status(400).json({ error: "Price mismatch detected" });
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: verifiedTotal * 100, // Convert to cents
      currency: "usd",
      metadata: { userId, productId, quantity },
    });

    // Store order with pending payment status
    const newOrder = new Order({
      userId,
      cartItems: { productId, quantity, price: product.price },
      totalAmount: verifiedTotal,
      address,
      paymentStatus: "Pending",
      paymentIntentId: paymentIntent.id,
    });

    await newOrder.save();

    // ✅ Fetch user before sending email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(user.email)

    await sendEmail(
      user.email,
      "Order Confirmation",
      `Your order for product ID ${productId} has been placed successfully.`
    );

    res.status(200).json({ clientSecret: paymentIntent.client_secret, orderId: newOrder._id });
  } catch (error) {
    console.error("Payment Intent Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Handle Payment Confirmation
router.post("/confirm", async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    // Confirm the payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      await sendEmail(order.userId.email, "Payment Failed", "Your payment was unsuccessful. Please try again.");
      return res.status(400).json({ error: "Payment not successful" });
    }

    // Update order as paid
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: "Paid" },
      { new: true }
    );

    await sendEmail(updatedOrder.userId.email, "Payment Successful", "Your payment has been received successfully.");
    res.status(200).json({ success: true, message: "Payment completed!", order: updatedOrder });
  } catch (error) {
    console.error("Payment Confirmation Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;