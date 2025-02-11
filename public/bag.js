document.addEventListener("DOMContentLoaded", () => {
    const bagContainer = document.getElementById("bag-container");

    // Get shopping bag items from localStorage
    const shoppingBag = JSON.parse(localStorage.getItem("shoppingBag")) || [];

    if (shoppingBag.length === 0) {
        // If no items, display a message
        bagContainer.innerHTML = `
            <p class="text-center text-gray-700 mt-10 font-medium text-lg">
                No items added in the bag.
            </p>
        `;
    } else {
        // Loop through items and display them
        shoppingBag.forEach((product, index) => {
            const productCard = document.createElement("div");
            productCard.classList.add(
                "flex",
                "mb-4",
                "w-full",
                "max-w-screen",
                "bg-white",
                "border",
                "border-gray-200",
                "rounded-lg",
                "shadow",
                "dark:bg-gray-800",
                "dark:border-gray-700"
            );

            productCard.innerHTML = `
                <img class="px-2 py-10 h-48 w-48 sm:w-32 sm:h-32 object-cover object-center" src="${product.img}" alt="${product.title}" style="border-radius: 28%; width: 10em;"/>
                <div class="px-2 pb-5 pt-6">
                    <h6 class="text-md font-semibold tracking-tight text-gray-900 dark:text-white">${product.title}</h6>
                    <p class="text-sm text-gray-700 dark:text-gray-400">${product.desc.substr(0, 20) + "..."}</p>
                    <div class="flex items-center justify-between mt-2.5 mb-5">
                        <p class="text-xl font-bold text-red-900 dark:text-white">$${product.price}</p>
                    </div>
                    <a href="id=${product._id}">
                        <button class="my-2 btn-sm flex items-center rounded-md bg-green-800 py-2 px-2 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                            View Item
                        </button>
                    </a>
                    <button class="my-2 remove-item btn-sm flex items-center rounded-md bg-red-800 py-2 px-2 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                        Remove Item
                    </button>
                </div>
            `;

            bagContainer.appendChild(productCard);

            // Add event listener to the "Remove Item" button
            const removeButton = productCard.querySelector(".remove-item");
            removeButton.addEventListener("click", () => {
                handleRemove(index);
            });
        });

        function handleRemove(index) {
            // Remove the item from the shopping bag
            shoppingBag.splice(index, 1);

            // Update localStorage
            localStorage.setItem("shoppingBag", JSON.stringify(shoppingBag));

            // Reload the content
            location.reload();
        }
    }
});
