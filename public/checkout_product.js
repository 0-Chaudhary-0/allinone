// Extract product ID from URL (e.g., /checkout/67cc03f93b7fe0271609508a)
const pathParts = window.location.pathname.split("/");
const productId = pathParts[pathParts.length - 1]; // Get '67cc03f93b7fe0271609508a'

// Get shopping bag from localStorage
const storedProducts = JSON.parse(localStorage.getItem("shoppingBag")) || [];

// Find selected product
const selectedProduct = storedProducts.find((p) => p._id === productId);

// Get container to render product details
const productContainer = document.getElementById("product-details");

// Display product or error message
if (selectedProduct) {
  productContainer.innerHTML = `
    <div class="flex flex-col justify-between w-full">
      <div>
        <h3 class="text-gray-900 text-xl font-semibold">${selectedProduct.name}</h3>
        <p class="text-gray-600 mt-2"><span class="font-medium">Color:</span> ${selectedProduct.color}</p>
        <p class="text-gray-600 mt-1"><span class="font-medium">Size:</span> ${selectedProduct.size}</p>
      </div>
      <p class="text-right text-gray-600 mt-4"><span class="font-medium">Price :</span> ${selectedProduct.price}</p>
      <p class="free text-right text-green-600 mt-1 font-semibold"><span class="font-medium text-green-600 free">Delivery fee :</span> Rs 0 </p>
      <p class="free text-right text-red-700 font-semibold text-lg">Total : ${selectedProduct.price}</p>
    </div>
  `;
} else {
  productContainer.innerHTML = `<p class="text-red-500 font-semibold">Product not found.</p>`;
}


const cardRadio = document.getElementById('card-radio');
const codRadio = document.getElementById('cod-radio');
const cardDetails = document.getElementById('card-details');

cardRadio.addEventListener('change', () => {
  cardDetails.classList.remove('hidden');
});

codRadio.addEventListener('change', () => {
  cardDetails.classList.add('hidden');
});
