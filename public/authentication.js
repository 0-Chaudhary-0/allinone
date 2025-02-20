// Function to check if a token is expired
function isTokenExpired(token) {
  try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
  } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Assume expired if there's an error
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let checkoutButton = document.getElementById("checkAuthorization");

  if (!checkoutButton) {
    console.error("❌ Checkout button not found!");
    return;
  }

  checkoutButton.addEventListener("click", async function () {
    let token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      console.log("Access token expired, redirecting to login...");
      window.location.href = "/login.ejs"; // ✅ Directly redirect without refreshing
      return;
    }

    // ✅ Get product ID
    const productId = this.getAttribute("data-product-id");
    if (!productId) {
      console.error("❌ Product ID is missing!");
      alert("Error: Product ID is missing!");
      return;
    }

    
    const url = `/checkout/${productId}`;
    console.log(`Fetching from URL: ${url} ${token}`);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "text/html" // ✅ Important for getting HTML
        }
      });

      console.log("Fetch response status:", response.status);

      if (response.ok) {
        const htmlContent = await response.text();  // ✅ Convert response to text (HTML)
        document.body.innerHTML = htmlContent;  // ✅ Replace body content
        console.log("✅ Checkout page loaded successfully!");
      } else {
        console.error("❌ Authorization failed, redirecting to login...");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login.ejs";
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
      alert("An error occurred. Please try again.");
    }
  });
});
