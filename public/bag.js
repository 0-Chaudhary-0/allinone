document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("bag-container");

    const shoppingBag = JSON.parse(localStorage.getItem("shoppingBag")) || [];

    if (shoppingBag.length === 0) {
        cartContainer.innerHTML = `
            <p class="text-center text-gray-700 mt-10 font-medium text-lg">
                <a href="shopping.ejs" class="text-blue-600 hover:underline flex justify-center items-center gap-2">
                    No items added in the cart <i class="fas fa-shopping-cart text-xl"></i>
                </a>
            </p>
        `;
    } else {
        shoppingBag.forEach((product, index) => {
            const productCard = document.createElement("div");
            productCard.classList.add(
                "flex",
                "items-center",
                "justify-between",
                "mb-4",
                "w-full",
                "max-w-screen",
                "bg-white",
                "dark:bg-gray-800",
                "dark:border-gray-700",
                "p-4",
                "rounded-lg",
                "shadow",
                "border-b",
                "border-gray-100" // Added bottom border with gray-100
            );

            productCard.innerHTML = `
                <div class="flex justify-between items-center w-full">
    <div>
        <h6 class="text-md font-semibold tracking-tight text-gray-900 dark:text-white">${product.name}</h6>
        <p class="text-sm text-gray-700 dark:text-gray-400">Color: ${product.color}</p>
        <p class="text-sm text-gray-700 dark:text-gray-400">Size: ${product.size}</p>
        <p class="text-xl font-bold text-red-900 dark:text-white mt-2">Rs ${product.price}</p>
    </div>

    <!-- Buttons on the right side -->
    <div class="flex gap-4">
        <!-- View Item Button -->
        <a href="id=${product._id}">
            <i class="text-green-600 free fa-solid fa-cart-arrow-down text-2xl"></i>
        </a>
            
        <!-- Remove Button (Trash Icon) -->
        <button class="remove-item free">
            <i class="fas fa-trash text-2xl free text-red-400"></i> <!-- Trash Bin Icon -->
        </button>
    </div>
</div>

            `;

            // <hr class="w-full border-gray-300 mt-4">
            cartContainer.appendChild(productCard);

            // Add event listener to the remove button
            const removeButton = productCard.querySelector(".remove-item");
            removeButton.addEventListener("click", () => {
                handleRemove(index);
            });
        });

        function handleRemove(index) {
            shoppingBag.splice(index, 1);
            localStorage.setItem("shoppingBag", JSON.stringify(shoppingBag));
            location.reload();
        }
    }
});
