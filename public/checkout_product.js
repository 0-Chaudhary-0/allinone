// const pathParts = window.location.pathname.split("/"); 
// let rawId = pathParts[pathParts.length - 1]; // This is 'id=67cc03f93b7fe0271609508a'
// const productId = rawId.substring(3); // Removes 'id=' (first 3 characters)
// console.log(productId);

// const storedProducts = JSON.parse(localStorage.getItem("shoppingBag")) || [];

// const selectedProduct = storedProducts.find((p) => p._id === productId);

// const productContainer = document.getElementById("product-details");

// if (selectedProduct) {

//   productContainer.innerHTML += `
//     <div class="flex flex-col justify-between w-full">
//         <div>
//           <h3 class="text-gray-900 text-xl font-semibold">${selectedProduct.name}</h3>
//           <p class="text-gray-600 mt-2"><span class="font-medium">Color:</span> ${selectedProduct.color}</p>
//           <p class="text-gray-600 mt-1"><span class="font-medium">Size:</span> ${selectedProduct.size}</p>
//         </div>
//         <p class="text-gray-900 font-semibold mt-4 text-lg">Price: $${selectedProduct.price}</p>
//       </div>
//   `;
// } else {
//   productContainer.innerHTML += `<p class="text-red-500 font-semibold">Product not found.</p>`;
// }
