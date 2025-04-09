// ✅ Existing: Handle "Add in Bag" button
const addButtons = document.querySelectorAll('.add-in-bag');

addButtons.forEach(button => {
  button.addEventListener("click", () => {
    const product = JSON.parse(button.getAttribute('data-product'));
    const action = button.getAttribute('data-action'); // 'add' or 'checkout'

    const selectedColorButton = document.querySelector('.color-option.selected');
    if (!selectedColorButton) {
      showModal({
        title: "⚠️ Select Color",
        message: "Please select a color before adding to the bag.",
        showCancel: false
      });      
      return;
    }
    const selectedColor = selectedColorButton.dataset.color;

    const selectedSizeButton = document.querySelector('.size-option.selected');
    if (!selectedSizeButton) {
      showModal({
        title: "⚠️ Select Size",
        message: "Please select a size before adding to the bag.",
        showCancel: false
      });      
      return;
    }
    const selectedSize = selectedSizeButton.dataset.size;

    const productToBag = {
      _id: product._id,
      id: product.slug + "-" + selectedColor + "-" + selectedSize,
      name: product.name,
      color: selectedColor,
      size: selectedSize,
      price: product.price
    };

    let shoppingBag = JSON.parse(localStorage.getItem('shoppingBag')) || [];

    const existingIndex = shoppingBag.findIndex(item => item._id === productToBag._id);
    if (existingIndex !== -1) {
      shoppingBag.splice(existingIndex, 1);
    }

    shoppingBag.push(productToBag);
    localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));

    showModal({
      title: "🛍️ Added to Bag",
      message: `${product.name} (${selectedColor}, ${selectedSize}) has been added to your bag.`,
      showCancel: false
    });
    
    if (action === 'checkout') {
      window.location.href = `/checkout/${button.getAttribute("data-product-id")}`;
    }
  });
});


function initCarousel() {
  const carouselViewport = document.getElementById("carouselViewport");
  const carouselDots = document.getElementById("carouselDots");
  let currentIndex = 0;
  let slideInterval;

  function updateCarousel(imagesJson) {
    const images = JSON.parse(imagesJson);

    if (!images || images.length === 0) {
      carouselViewport.innerHTML = `<li class="carousel__slide"><div class="carousel__snapper"><p>No images available</p></div></li>`;
      carouselDots.innerHTML = "";
      return;
    }

    carouselViewport.innerHTML = "";
    carouselDots.innerHTML = "";

    images.forEach((image, index) => {
      const slide = document.createElement("li");
      slide.className = "carousel__slide";
      slide.id = `carousel__slide${index + 1}`;
      slide.innerHTML = `<div class="carousel__snapper"><img src="${image}" alt="Product Image ${index + 1}"></div>`;
      carouselViewport.appendChild(slide);

      const dot = document.createElement("li");
      const button = document.createElement("button");
      button.className = "carousel__navigation-button";
      button.setAttribute("data-index", index);
      dot.appendChild(button);
      carouselDots.appendChild(dot);
    });

    initializeCarouselBehavior();
  }

  function initializeCarouselBehavior() {
    const slides = document.querySelectorAll(".carousel__slide");
    const dots = document.querySelectorAll(".carousel__navigation-button");

    function updateActiveDot(index) {
      dots.forEach(dot => dot.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    }

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

    function autoSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      carouselViewport.scrollTo({
        left: slides[currentIndex].offsetLeft,
        behavior: "smooth"
      });
      updateActiveDot(currentIndex);
    }

    clearInterval(slideInterval);
    slideInterval = setInterval(autoSlide, 3000);

    carouselViewport.addEventListener("scroll", function () {
      clearInterval(slideInterval);
      slideInterval = setInterval(autoSlide, 3000);
    });

    updateActiveDot(0);
  }

  // 👉 Expose this so other logic can call it
  window.updateCarousel = updateCarousel;

  // Event listener for color selection
  const colorButtons = document.querySelectorAll(".color-option");
  colorButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const imagesJson = this.getAttribute("data-images");
      updateCarousel(imagesJson); // Update the carousel with the selected color's images
      document.getElementById("selectedColorInput").value = this.getAttribute("data-color"); // Set the selected color in the hidden input
    });
  });
}


window.addEventListener('DOMContentLoaded', () => {
  // Select the first color button and make it selected
  const colorButtons = document.querySelectorAll('.color-option');
  const sizeContainers = document.querySelectorAll('.size-options');

  // Set default color selection (first color button)
  if (colorButtons.length > 0) {
    const firstColorButton = colorButtons[0];
    firstColorButton.classList.add('selected');
    const selectedColor = firstColorButton.dataset.color;
    
    // Set the color value in the hidden input
    document.getElementById('selectedColorInput').value = selectedColor;

    // Show the size options for the selected color
    sizeContainers.forEach(container => {
      if (container.getAttribute('data-color') === selectedColor) {
        container.classList.remove('hidden');
      } else {
        container.classList.add('hidden');
      }
    });
  }

  // Set default size selection (first size of the first color)
  const sizeButtons = document.querySelectorAll('.size-option');
  if (sizeButtons.length > 0) {
    const firstSizeButton = sizeButtons[0];
    firstSizeButton.classList.add('selected');
    const selectedSize = firstSizeButton.dataset.size;

    // Set the size value in the hidden input
    document.getElementById('selectedSizeInput').value = selectedSize;
  }

  // Color button click event
  colorButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      colorButtons.forEach(btn => btn.classList.remove('selected')); // Deselect all colors
      e.target.classList.add('selected'); // Select clicked color
      const selectedColor = e.target.dataset.color;
      document.getElementById('selectedColorInput').value = selectedColor;

      // Show the corresponding size options for the selected color
      sizeContainers.forEach(container => {
        if (container.getAttribute('data-color') === selectedColor) {
          container.classList.remove('hidden');
        } else {
          container.classList.add('hidden');
        }
      });

      // Reset and select the first available size for the selected color
      const firstSizeButton = sizeContainers.querySelector('.size-option');
      if (firstSizeButton) {
        firstSizeButton.classList.add('selected');
        document.getElementById('selectedSizeInput').value = firstSizeButton.dataset.size;
      }
    });
  });

  // Size button click event
  sizeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      sizeButtons.forEach(btn => btn.classList.remove('selected')); // Deselect all sizes
      e.target.classList.add('selected'); // Select clicked size
      document.getElementById('selectedSizeInput').value = e.target.dataset.size;
    });
  });
});



initCarousel();  // This sets up the carousel and exposes updateCarousel globally
