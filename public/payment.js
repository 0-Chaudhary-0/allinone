// Replace with your Stripe publishable key

document.addEventListener("DOMContentLoaded", async () => {
  const stripe = Stripe('pk_test_51OU7fQGEbwT151fvpdaeWbpnMrr5OyM4g3TvzQQnSHPuFxysYXaaEwDjMT3Om0bVtVJNZRWWsSISUUQ7eDZJd00800YpegB5mj');
  
  const placeOrderBtn = document.getElementById("next-btn");
  placeOrderBtn.addEventListener("click", async () => {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

    if (paymentMethod === 'card') {
      // 1️⃣ Get Input Values
      const cardNumber = document.querySelector('input[placeholder="Card Number"]').value.trim();
      const expiryDate = document.querySelector('input[placeholder="Expiry Date (MM/YY)"]').value.trim();
      const cvv = document.querySelector('input[placeholder="CVV"]').value.trim();

      // 2️⃣ Validate Inputs
      if (!cardNumber || !expiryDate || !cvv) {
        showModal({
          title: "Incomplete Details",
          message: "Please fill all card details.",
          showCancel: false
        });        
        return;
      }

      const [exp_monthStr, exp_yearStr] = expiryDate.split('/');
      const exp_month = parseInt(exp_monthStr);
      const exp_year = 2000 + parseInt(exp_yearStr); // Convert YY to YYYY

      // 3️⃣ Get Cart Info
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      if (cartItems.length === 0) {
        showModal({
          title: "Empty Cart",
          message: "Your cart is empty.",
          showCancel: false
        });        
        return;
      }

      const totalAmountRs = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

      try {
        // 4️⃣ Create PaymentIntent from Backend
        const response = await fetch('/payment/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartItems, totalAmountRs })
        });

        const { clientSecret } = await response.json();

        // 5️⃣ Confirm Payment with Stripe
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: {
              number: cardNumber,
              exp_month,
              exp_year,
              cvc: cvv,
            },
          },
        });

        if (result.error) {
          showModal({
            title: "❌ Payment Failed",
            message: result.error.message,
            showCancel: false
          });          
        } else if (result.paymentIntent.status === 'succeeded') {
          alert("✅ Payment Successful!");
          localStorage.removeItem("cartItems");
          window.location.href = "/payment-success"; // Or any success page
        }

      } catch (err) {
        console.error("Payment Error:", err.message);
        showModal({
          title: "⚠️ Payment Failed",
          message: "Payment processing failed.",
          showCancel: false
        });        
      }
    } else {
      showModal({
        title: "✅ COD Selected",
        message: "Payment not required.",
        showCancel: false
      });      
    }
  });
});
