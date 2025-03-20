const express = require('express');
const router = express.Router();

// Replace with your secret key
const stripe = Stripe('sk_test_51OU7fQGEbwT151fvOfyx9H3iTBfjqQswGR45DS4HTtskNpy3f6GLGmrTMasIdfUl0tlbWSimoJw6JB4LvQNAoDjq002NyKsvPC');

router.post('/create-payment-intent', async (req, res) => {
  const { amountInPKR } = req.body;

  // Convert PKR to USD (e.g., 1 USD = 280 PKR)
  const exchangeRate = 280;
  const amountInUSD = amountInPKR / exchangeRate;

  // Stripe needs amount in cents
  const amountInCents = Math.round(amountInUSD * 100);

  // Ensure at least $0.50
  if (amountInCents < 50) {
    return res.status(400).json({ error: 'Minimum amount is $0.50 USD (~140 PKR).' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;