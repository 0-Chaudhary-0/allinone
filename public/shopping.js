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

// Color selection logic
document.querySelectorAll('.color-option').forEach(button => {
    button.addEventListener("click", function () {
        // Remove the selected class from all color buttons
        document.querySelectorAll('.color-option').forEach(btn => btn.classList.remove('selected'));

        // Add selected class to the clicked button
        this.classList.add('selected');

        // Get the selected color
        const selectedColor = this.dataset.color;

        // Hide all size options first
        document.querySelectorAll('.size-options').forEach(sizeDiv => sizeDiv.classList.add('hidden'));

        // Show the sizes for the selected color
        const sizeDiv = document.querySelector(`.size-options[data-color='${selectedColor}']`);
        if (sizeDiv) {
            sizeDiv.classList.remove('hidden');
        }
    });
});

// Size selection logic
document.querySelectorAll('.size-option').forEach(button => {
    button.addEventListener("click", function () {
        document.querySelectorAll('.size-option').forEach(btn => btn.classList.remove('selected'));
        this.classList.add('selected');
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const colorButtons = document.querySelectorAll(".color-option");
    const viewport = document.getElementById("carouselViewport");
  
    colorButtons.forEach(button => {
      button.addEventListener("click", function () {
        let images = JSON.parse(this.dataset.images); // Get images for selected color
        viewport.innerHTML = ""; // Clear existing images
  
        if (images.length > 0) {
          images.forEach((image, index) => {
            let slide = document.createElement("li");
            slide.className = "carousel__slide";
            slide.innerHTML = `
              <div class="carousel__snapper">
                <img src="${image}" alt="Product Image ${index + 1}">
              </div>
            `;
            viewport.appendChild(slide);
          });
        } else {
          viewport.innerHTML = `
            <li class="carousel__slide">
              <div class="carousel__snapper">
                <p>No images available</p>
              </div>
            </li>
          `;
        }
      });
    });
  });
  
