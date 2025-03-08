document.addEventListener("DOMContentLoaded", function () {
  // Check and apply the theme from localStorage on page load
  const theme = localStorage.getItem("theme") || "light"; // Default to light if not set
  if (theme === "dark") {
    document.documentElement.classList.add("dark"); // Add dark mode class to root element
    applyDarkMode();
  } else {
    document.documentElement.classList.remove("dark"); // Remove dark mode class
    applyLightMode();
  }

  // Toggle dark mode when the button is clicked
  const darkModeToggle = document.getElementById("darkModeToggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {

      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");

      // Apply the corresponding theme styles
      if (isDark) {
        applyDarkMode();
      } else {
        applyLightMode();
      }
    });
  }

  // Apply dark mode styles to elements
  function applyDarkMode() {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
    document.body.style.fontFamily = "Arial, sans-serif";
    document.body.style.margin = "0";

    // Select and style specific elements for dark mode
    styleElements("div", 1, -5, "white", "black");
    styleElements("a", 14, -2, "white", "black");
    styleElements("p", 1, -5, "white", "black");
    styleElements("h1", 1, -2, "white", "black");
    styleElements("h2", 1, -2, "white", "black");
    styleElements("h3", 1, 0, "white", "black");
    styleElements("h6", 0, 0, "white", "black");
  }

  // Apply light mode styles to elements
  function applyLightMode() {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    document.body.style.fontFamily = "Arial, sans-serif";
    document.body.style.margin = "0";

    // Select and style specific elements for light mode
    styleElements("div", 1, -5, "black", "white");
    styleElements("p", 1, -5, "black", "white");
    styleElements("a", 14, -2, "black", "white");
    styleElements("h1", 1, -2, "black", "white");
    styleElements("h2", 1, -1, "black", "white");
    styleElements("h3", 1, -2, "black", "white");
    styleElements("h6", 0, 0, "black", "white");
  }

  // Helper function to style elements based on conditions and colors
  function styleElements(
    element,
    startIndex,
    endIndex,
    textColor = "white",
    bgColor = "black"
  ) {
    const elements = document.querySelectorAll(element);
    elements.forEach((el, index) => {
      if (index >= startIndex && index < elements.length + endIndex) {
        // Skip carousel dots
        if (el.classList.contains("carousel__navigation-button")) return;

        el.style.color = textColor;
        el.style.backgroundColor = bgColor;
        el.style.textDecoration = "none";
      }
    });
  }
});
