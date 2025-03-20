// Replace with your Stripe publishable key
const stripe = Stripe('pk_test_51OU7fQGEbwT151fvpdaeWbpnMrr5OyM4g3TvzQQnSHPuFxysYXaaEwDjMT3Om0bVtVJNZRWWsSISUUQ7eDZJd00800YpegB5mj');

document.addEventListener('DOMContentLoaded', async () => {
  console.log("welcome to payment.js")
  const elements = stripe.elements();
  const cardElement = elements.create('card');
  cardElement.mount('#card-element');

  const submitButton = document.getElementById('submit-payment');
  submitButton.addEventListener('click', async () => {
    submitButton.disabled = true;

    // Fetch price from DOM or set fixed amount (e.g., PKR 500)
    const amountInPKR = 500;

    try {
      const res = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountInPKR }),
      });
      const { clientSecret } = await res.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        document.getElementById('card-errors').textContent = error.message;
        submitButton.disabled = false;
      } else if (paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
        // Redirect or show confirmation
      }
    } catch (err) {
      console.error(err);
      alert('Payment failed.');
      submitButton.disabled = false;
    }
  });
});
