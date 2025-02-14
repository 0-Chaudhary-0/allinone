const checkoutButton = document.querySelector("[data-product-id]");

if (!checkoutButton) {
  console.error("Button with 'data-product-id' not found!");  
}

checkoutButton.addEventListener("click", async function () {
  console.log("Checkout button clicked");

  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found");
    window.location.href = "/login.ejs";
  }

  // ✅ Ensure product ID exists
  const productId = this.getAttribute("data-product-id");
  if (!productId || productId.trim() === "") {
    console.error("Product ID is missing or invalid!");
    alert("Error: Product ID is missing!");
    return;
  }

  // ✅ Check the final URL before making fetch request
  const url = `/checkout/${productId}`;
  console.log(`Fetching from URL: ${url}`);

  try {
    const response = await fetch(`/checkout/${productId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Fetch response status:", response.status);

    if (response.ok) {
      window.location.href = url;
    } else {
      const data = await response.json();
      alert(data.message || "Authorization failed!");
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("An error occurred. Please try again.");
  }
});
