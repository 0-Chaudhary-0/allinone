// Select all "Add in Bag" buttons
const addButtons = document.querySelectorAll('.add-in-bag');

addButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Get the product data from the data attribute
        const product = JSON.parse(button.getAttribute('data-product'));

        // Get the current shopping bag from localStorage or initialize it
        const shoppingBag = JSON.parse(localStorage.getItem('shoppingBag')) || [];
        
        // Check if the product is already in the shopping bag
        const productExists = shoppingBag.find(item => item._id === product._id);

        if (productExists) {
            alert(`${product.title} is already in your bag.`);
        } else {
            // Add the product to the shopping bag
            shoppingBag.push(product);

            // Save the updated shopping bag back to localStorage
            localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));

            alert(`${product.title} has been added to your bag.`);
        }
    });
});
