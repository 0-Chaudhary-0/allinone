document.addEventListener("DOMContentLoaded", function () {
  // Check and apply the theme from localStorage on page load
  const theme = localStorage.getItem("theme") || "light"; // Default to light mode
  const darkModeToggle = document.getElementById("darkModeToggle");

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    applyDarkMode();
  } else {
    document.documentElement.classList.remove("dark");
    applyLightMode();
  }

  // Toggle theme on button click
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");

      // Apply corresponding mode styles
      isDark ? applyDarkMode() : applyLightMode();
    });
  }

  // Function to apply dark mode styles
  function applyDarkMode() {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";

    // Select and apply styles to all elements dynamically (excluding "free" class elements)
    document.querySelectorAll("*:not(.free)").forEach((el) => {
      el.style.color = "white";
      el.style.backgroundColor = "black";
    });

    // Exclude buttons with "free" class from being changed
    document.querySelectorAll("button:not(.free)").forEach((button, index) => {
      if (index >= 4) {
        button.style.backgroundColor = "white";
        button.style.color = "black";
      }
    });
  }

  // Function to apply light mode styles
  function applyLightMode() {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";

    // Select and apply styles to all elements dynamically (excluding "free" class elements)
    document.querySelectorAll("*:not(.free)").forEach((el) => {
      el.style.color = "black";
      el.style.backgroundColor = "white";
    });

    // Exclude buttons with "free" class from being changed
    document.querySelectorAll("button:not(.free)").forEach((button, index) => {
      if (index >= 4) {
        button.style.backgroundColor = "black";
        button.style.color = "white";
      }
    });
  }
});
