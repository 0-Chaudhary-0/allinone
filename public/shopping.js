// Select all "Add in Bag" buttons
const addButtons = document.querySelectorAll('.add-in-bag');

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
  
