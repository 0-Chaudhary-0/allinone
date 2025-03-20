// Select all "Add in Bag" buttons
const addButtons = document.querySelectorAll('.add-in-bag');

addButtons.forEach(button => {
  button.addEventListener("click", () => {
    const product = JSON.parse(button.getAttribute('data-product'));
    const action = button.getAttribute('data-action'); // 'add' or 'checkout'

    // Get selected color
    const selectedColorButton = document.querySelector('.color-option.selected');
    if (!selectedColorButton) {
      alert("Please select a color before adding to the bag.");
      return;
    }
    const selectedColor = selectedColorButton.dataset.color;

    // Get selected size
    const selectedSizeButton = document.querySelector('.size-option.selected');
    if (!selectedSizeButton) {
      alert("Please select a size before adding to the bag.");
      return;
    }
    const selectedSize = selectedSizeButton.dataset.size;

    // Prepare product object
    const productToBag = {
      _id: product._id,
      id: product.slug + "-" + selectedColor + "-" + selectedSize,
      name: product.name,
      color: selectedColor,
      size: selectedSize,
      price: product.price
    };

    // Retrieve shopping bag from localStorage
    let shoppingBag = JSON.parse(localStorage.getItem('shoppingBag')) || [];

    // Remove existing product with same _id if exists
    const existingIndex = shoppingBag.findIndex(item => item._id === productToBag._id);
    if (existingIndex !== -1) {
      shoppingBag.splice(existingIndex, 1);
    }

    // Add updated product
    shoppingBag.push(productToBag);
    localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));

    alert(`${product.name} (${selectedColor}, ${selectedSize}) has been added to your bag.`);

    // If action is checkout, redirect
    if (action === 'checkout') {
      window.location.href = `/checkout/${button.getAttribute("data-product-id")}`; // or '/checkout.ejs' depending on routing
    }
  });
});



document.addEventListener("DOMContentLoaded", function () {
  const colorButtons = document.querySelectorAll(".color-option");
  const sizeContainers = document.querySelectorAll(".size-options");
  const sizeButtons = document.querySelectorAll(".size-option");
  const carouselViewport = document.getElementById("carouselViewport");
  const carouselDots = document.getElementById("carouselDots");

  let currentIndex = 0;
  let slideInterval;

  // Function to highlight selected item
  function selectItem(items, selectedItem) {
      items.forEach(item => item.classList.remove("selected", "border-4", "border-gray-700"));
      selectedItem.classList.add("selected", "border-4", "border-gray-700");
  }

  // Function to update carousel images dynamically
  function updateCarousel(imagesJson) {
      const images = JSON.parse(imagesJson);

      if (!images || images.length === 0) {
          carouselViewport.innerHTML = `<li class="carousel__slide"><div class="carousel__snapper"><p>No images available</p></div></li>`;
          carouselDots.innerHTML = ""; // Remove previous dots
          return;
      }

      // Clear existing images and dots
      carouselViewport.innerHTML = "";
      carouselDots.innerHTML = "";

      // Populate new images
      images.forEach((image, index) => {
          const slide = document.createElement("li");
          slide.className = "carousel__slide";
          slide.id = `carousel__slide${index + 1}`;
          slide.innerHTML = `<div class="carousel__snapper"><img src="${image}" alt="Product Image ${index + 1}"></div>`;
          carouselViewport.appendChild(slide);

          // Create navigation dot
          const dot = document.createElement("li");
          const button = document.createElement("button");
          button.className = "carousel__navigation-button";
          button.setAttribute("data-index", index);
          dot.appendChild(button);
          carouselDots.appendChild(dot);
      });

      // Reinitialize dots and auto-slide
      initializeCarousel();
  }

  // Function to initialize carousel behavior
  function initializeCarousel() {
      const slides = document.querySelectorAll(".carousel__slide");
      const dots = document.querySelectorAll(".carousel__navigation-button");

      function updateActiveDot(index) {
          dots.forEach(dot => dot.classList.remove("active"));
          if (dots[index]) dots[index].classList.add("active");
      }

      // Click event for dots navigation
      dots.forEach(dot => {
          dot.addEventListener("click", function () {
              currentIndex = parseInt(this.getAttribute("data-index"));
              carouselViewport.scrollTo({
                  left: slides[currentIndex].offsetLeft,
                  behavior: "smooth"
              });
              updateActiveDot(currentIndex);
          });
      });

      // Auto slide function
      function autoSlide() {
          currentIndex = (currentIndex + 1) % slides.length;
          carouselViewport.scrollTo({
              left: slides[currentIndex].offsetLeft,
              behavior: "smooth"
          });
          updateActiveDot(currentIndex);
      }

      // Start auto-slide every 3 seconds
      clearInterval(slideInterval);
      slideInterval = setInterval(autoSlide, 3000);

      // Pause auto-slide on manual interaction
      carouselViewport.addEventListener("scroll", function () {
          clearInterval(slideInterval);
          slideInterval = setInterval(autoSlide, 3000);
      });

      // Initialize first active dot
      updateActiveDot(0);
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
      updateCarousel(firstColor.dataset.images);
  }

  // Color selection event
  colorButtons.forEach(button => {
      button.addEventListener("click", () => {
          selectItem(colorButtons, button);
          showSizesForColor(button.dataset.color);
          updateCarousel(button.dataset.images);
      });
  });

  // Size selection event
  sizeButtons.forEach(button => {
      button.addEventListener("click", () => {
          selectItem(button.parentElement.querySelectorAll(".size-option"), button);
      });
  });
});
