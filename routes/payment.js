const express = require('express');
const Stripe = require('stripe');
const router = express.Router();

// Replace with your secret key
const stripe = Stripe('sk_test_51OU7fQGEbwT151fvOfyx9H3iTBfjqQswGR45DS4HTtskNpy3f6GLGmrTMasIdfUl0tlbWSimoJw6JB4LvQNAoDjq002NyKsvPC');

function convertRsToUsd(totalRs) {
  const exchangeRate = 278; // 1 USD = 278 Rs
  const usdAmount = totalRs / exchangeRate;
  const usdCents = Math.round(usdAmount * 100); // Convert to cents
  return usdCents;
}

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { cartItems, totalAmountRs } = req.body;

    // ✅ Rs ➜ USD cents
    const amountInCents = convertRsToUsd(totalAmountRs);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        cart: JSON.stringify(cartItems), // optional, for logs
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error('Payment Intent Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;