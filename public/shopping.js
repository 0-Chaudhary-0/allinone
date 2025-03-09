// Select all "Add in Bag" buttons
const addButtons = document.querySelectorAll('.add-in-bag');

addButtons.forEach(button => {
    button.addEventListener("click", () => {
        const product = JSON.parse(button.getAttribute('data-product'));

        // Get the selected color
        const selectedColorButton = document.querySelector('.color-option.selected');
        if (!selectedColorButton) {
            alert("Please select a color before adding to the bag.");
            return;
        }
        const selectedColor = selectedColorButton.dataset.color;

        // Get the selected size
        const selectedSizeButton = document.querySelector('.size-option.selected');
        if (!selectedSizeButton) {
            alert("Please select a size before adding to the bag.");
            return;
        }
        const selectedSize = selectedSizeButton.dataset.size;

        // Prepare the final product object with variant details
        const productToBag = {
            _id: product._id,  // 🔹 Store _id for product navigation
            id: product.slug + "-" + selectedColor + "-" + selectedSize, // Unique identifier
            name: product.name,
            color: selectedColor,
            size: selectedSize,
            price: product.price
        };

        // Get current shopping bag from localStorage
        const shoppingBag = JSON.parse(localStorage.getItem('shoppingBag')) || [];

        // Check if the item is already in the bag
        const productExists = shoppingBag.find(item => item.id === productToBag.id);

        if (productExists) {
            alert(`${product.name} (${selectedColor}, ${selectedSize}) is already in your bag.`);
        } else {
            shoppingBag.push(productToBag);
            localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));
            alert(`${product.name} (${selectedColor}, ${selectedSize}) has been added to your bag.`);
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const colorButtons = document.querySelectorAll(".color-option");
  const sizeContainers = document.querySelectorAll(".size-options");
  const sizeButtons = document.querySelectorAll(".size-option");

  // Function to highlight selected item
  function selectItem(items, selectedItem) {
      items.forEach(item => item.classList.remove("selected", "border-4", "border-gray-700"));
      selectedItem.classList.add("selected", "border-4", "border-gray-700");
  }

  // Function to show sizes for selected color
  function showSizesForColor(color) {
      sizeContainers.forEach(container => {
          if (container.dataset.color === color) {
              container.classList.remove("hidden");
              const firstSize = container.querySelector(".size-option");
              if (firstSize) {
                  selectItem(container.querySelectorAll(".size-option"), firstSize);
              }
          } else {
              container.classList.add("hidden");
          }
      });
  }

  // Select first color and corresponding sizes by default
  if (colorButtons.length > 0) {
      const firstColor = colorButtons[0];
      selectItem(colorButtons, firstColor);
      showSizesForColor(firstColor.dataset.color);
  }

  // Color selection event
  colorButtons.forEach(button => {
      button.addEventListener("click", () => {
          selectItem(colorButtons, button);
          showSizesForColor(button.dataset.color);
      });
  });

  // Size selection event
  sizeButtons.forEach(button => {
      button.addEventListener("click", () => {
          selectItem(button.parentElement.querySelectorAll(".size-option"), button);
      });
  });
});
