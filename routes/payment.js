const Product = require('../models/Product'); // Adjust path if needed
const Order = require('../models/Order'); // Adjust path if needed
const express = require('express');
const Stripe = require('stripe');
const nodemailer = require("nodemailer");
const router = express.Router();

// Replace with your secret key
const stripe = Stripe('sk_test_51OU7fQGEbwT151fvOfyx9H3iTBfjqQswGR45DS4HTtskNpy3f6GLGmrTMasIdfUl0tlbWSimoJw6JB4LvQNAoDjq002NyKsvPC');

function convertRsToUsd(totalRs) {
  const exchangeRate = 278; // 1 USD = 278 Rs
  const usdAmount = totalRs / exchangeRate;
  const usdCents = Math.round(usdAmount * 100); // Convert to cents
  return usdCents;
}

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "faheemshahid147@gmail.com", // Replace with your email
    pass: "#PATLILULLI@", // Replace with your app password
  },
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: "faheemshahid147@gmail.com",
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
router.post("/payment/create-payment-intent", async (req, res) => {
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
router.post("/payment/confirm", async (req, res) => {
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