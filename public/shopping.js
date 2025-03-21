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
}



document.addEventListener("DOMContentLoaded", () => {
  const colorButtons = document.querySelectorAll(".color-option");
  const sizeOptionsContainers = document.querySelectorAll(".size-options");
  const selectedColorInput = document.getElementById("selectedColorInput");
  const selectedSizeInput = document.getElementById("selectedSizeInput");

  let selectedColorButton = null;
  let selectedSizeButton = null;

  // Select first color by default
  if (colorButtons.length > 0) {
    colorButtons[0].click();
  }

  // Color Button Click
  colorButtons.forEach(button => {
    button.addEventListener("click", () => {
      if (selectedColorButton) {
        selectedColorButton.classList.remove("selected", "border-4", "border-blue-700", "free");
      }

      selectedColorButton = button;
      button.classList.add("selected", "border-4", "border-blue-700", "free");

      const selectedColor = button.dataset.color;
      if (selectedColorInput) selectedColorInput.value = selectedColor;

      sizeOptionsContainers.forEach(container => {
        if (container.dataset.color === selectedColor) {
          container.classList.remove("hidden");
          const sizeButtons = container.querySelectorAll(".size-option");
          if (sizeButtons.length > 0) {
            sizeButtons[0].click();
          }
        } else {
          container.classList.add("hidden");
        }
      });

      const imagesJson = button.dataset.images.replace(/&quot;/g, '"');
      const images = JSON.parse(imagesJson);
      window.updateCarousel(JSON.stringify(images));
    });
  });

  // Size Button Click
  document.querySelectorAll(".size-option").forEach(button => {
    button.addEventListener("click", () => {
      if (selectedSizeButton) {
        selectedSizeButton.classList.remove("selected", "border-4", "border-blue-700", "free");
      }

      selectedSizeButton = button;
      button.classList.add("selected", "border-4", "border-blue-700", "free");

      const selectedSize = button.dataset.size;
      if (selectedSizeInput) selectedSizeInput.value = selectedSize;
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  initCarousel();  // This sets up the carousel and exposes updateCarousel globally
});
