document.addEventListener("DOMContentLoaded", async () => {
  const stripe = Stripe('pk_test_51OU7fQGEbwT151fvpdaeWbpnMrr5OyM4g3TvzQQnSHPuFxysYXaaEwDjMT3Om0bVtVJNZRWWsSISUUQ7eDZJd00800YpegB5mj');

  const placeOrderBtn = document.getElementById("next-btn");
  placeOrderBtn.addEventListener("click", async () => {
    const userId = window.userId;

    if (!userId) {
      alert("Error: User not logged in!");
      return;
    }

    const paymentMethodElement = document.querySelector('input[name="payment-method"]:checked');
    if (!paymentMethodElement) {
      alert("Please select a payment method.");
      return;
    }
    const paymentMethod = paymentMethodElement.value;

    // Get Address Info
    const address = {
      fullName: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      street: document.getElementById("street").value,
      city: document.getElementById("city").value,
      postalCode: document.getElementById("postalCode").value,
      country: "Pakistan"
    };

    if (Object.values(address).some(val => val === "")) {
      alert("Please fill in all address fields.");
      return;
    }

    const productId = window.location.pathname.split("/").pop(); // Get product ID from URL
    const cartItems = JSON.parse(localStorage.getItem("shoppingBag")) || [];
    const selectedProduct = cartItems.find((p) => p._id === productId);

    if (!selectedProduct) {
      alert("Error: Product not found in cart!");
      return;
    }

    const totalAmountRs = selectedProduct.price;
    const quantity = selectedProduct.quantity || 1; // Default to 1 if not provided

    if (paymentMethod === "cod") {
      try {
        const response = await fetch(`/order/create/${productId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, userId, quantity })
        });

        const result = await response.json();
        if (result.success) {
          alert("✅ Order Placed Successfully (Cash on Delivery)!");
          localStorage.removeItem("shoppingBag");
          window.location.href = "/order-success.ejs";
        } else {
          alert("⚠️ Order Failed: " + result.error);
        }
      } catch (err) {
        alert("⚠️ Order Error: " + err.message);
      }

    } else {
      try {
        try {
          const response = await fetch('/payment/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, totalAmountRs, address, userId, quantity })
          });
        
          const { clientSecret, orderId } = await response.json();
        
          const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement),
            },
          });
        
          if (result.error) {
            alert("❌ Payment Failed: " + result.error.message);
          } else {
            // Mark payment as completed
            await fetch('/payment/confirm', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentIntentId: clientSecret, orderId })
            });
        
            alert("✅ Payment Successful!");
            localStorage.removeItem("shoppingBag");
            window.location.href = "/order-success";
          }
        } catch (err) {
          alert("⚠️ Payment Error: " + err.message);
        }
        

        const { clientSecret, orderId } = await response.json();

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

        if (result.error) {
          alert("❌ Payment Failed: " + result.error.message);
        } else {
          alert("✅ Payment Successful!");
          localStorage.removeItem("shoppingBag");
          window.location.href = "/order-success";
        }
      } catch (err) {
        alert("⚠️ Payment Error: " + err.message);
      }
    }
  });
});
