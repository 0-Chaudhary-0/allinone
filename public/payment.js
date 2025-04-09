document.addEventListener("DOMContentLoaded", async () => {
  const stripe = Stripe('pk_test_51OU7fQGEbwT151fvpdaeWbpnMrr5OyM4g3TvzQQnSHPuFxysYXaaEwDjMT3Om0bVtVJNZRWWsSISUUQ7eDZJd00800YpegB5mj');
  const elements = stripe.elements();
  const cardElement = elements.create('card');
  cardElement.mount('#card-number');

  const placeOrderBtn = document.getElementById("next-btn");
  placeOrderBtn.addEventListener("click", async (e) => {
    // Disable the button and change color
    placeOrderBtn.disabled = true;
    placeOrderBtn.classList.add('bg-blue-200', 'cursor-not-allowed');
    
    const userId = window.userId;

    if (!userId) {
      showModal({
        title: "❌ Error",
        message: "User not logged in!",
        showCancel: false
      });
      placeOrderBtn.disabled = false;
      placeOrderBtn.classList.remove('bg-blue-200', 'cursor-not-allowed');
      return;
    }

    const paymentMethodElement = document.querySelector('input[name="payment-method"]:checked');
    if (!paymentMethodElement) {
      showModal({
        title: "⚠️ Warning",
        message: "Please select a payment method.",
        showCancel: false
      });
      placeOrderBtn.disabled = false;
      placeOrderBtn.classList.remove('bg-blue-200', 'cursor-not-allowed');
      return;
    }

    const paymentMethod = paymentMethodElement.value;

    const address = {
      fullName: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      street: document.getElementById("street").value,
      city: document.getElementById("city").value,
      postalCode: document.getElementById("postalCode").value,
      country: "Pakistan"
    };

    if (Object.values(address).some(val => val === "")) {
      showModal({
        title: "⚠️ Incomplete Address",
        message: "Please fill in all address fields.",
        showCancel: false
      });
      placeOrderBtn.disabled = false;
      placeOrderBtn.classList.remove('bg-blue-200', 'cursor-not-allowed');
      return;
    }

    const productId = window.location.pathname.split("/").pop();
    const cartItems = JSON.parse(localStorage.getItem("shoppingBag")) || [];
    const selectedProduct = cartItems.find((p) => p._id === productId);

    if (!selectedProduct) {
      showModal({
        title: "❌ Error",
        message: "Product not found in cart!",
        showCancel: false
      });
      placeOrderBtn.disabled = false;
      placeOrderBtn.classList.remove('bg-blue-200', 'cursor-not-allowed');
      return;
    }

    const totalAmountRs = selectedProduct.price;
    const quantity = selectedProduct.quantity || 1;

    if (paymentMethod === "cod") {
      try {
        const response = await fetch(`/order/create/${productId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, userId, quantity })
        });

        const result = await response.json();
        if (result.success) {
          showModal({
            title: "✅ Success",
            message: "Order Placed Successfully (Cash on Delivery)!",
            showCancel: false
          });
          localStorage.removeItem("shoppingBag");
          window.location.href = "/order-success";
        } else {
          showModal({
            title: "⚠️ Order Failed",
            message: "Error: " + result.error,
            showCancel: false
          });
        }
      } catch (err) {
        showModal({
          title: "⚠️ Order Error",
          message: "Error: " + err.message,
          showCancel: false
        });
      }
    } else {
      try {
        const res = await fetch('/payment/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, totalAmountRs, address, userId, quantity })
        });

        const { clientSecret, orderId } = await res.json();

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

        if (result.error) {
          showModal({
            title: "❌ Payment Failed",
            message: "Error: " + result.error.message,
            showCancel: false
          });
        } else {
          await fetch('/payment/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentIntentId: result.paymentIntent.id, orderId })
          });

          showModal({
            title: "✅ Payment Successful!",
            message: "Your payment has been completed successfully.",
            showCancel: false
          });
          localStorage.removeItem("shoppingBag");
          window.location.href = "/order-success";
        }
      } catch (err) {
        showModal({
          title: "⚠️ Payment Error",
          message: "Error: " + err.message,
          showCancel: false
        });
      }
    }

    // Re-enable the button and restore its original color
    placeOrderBtn.disabled = false;
    placeOrderBtn.classList.remove('bg-blue-200', 'cursor-not-allowed');
  });
});
