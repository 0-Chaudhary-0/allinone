if (document.getElementById("informational-banner")) {
  if (localStorage.getItem("token")) {
    document.getElementById("informational-banner").classList.add("hidden");
  }
}

document.getElementById("nav-toggle").addEventListener("click", function () {
  var menu = document.getElementById("mobile-menu");
  if (menu.classList.contains("hidden")) {
    menu.classList.remove("hidden");
    menu.classList.add("transition-height");
    menu.style.maxHeight = menu.scrollHeight + "px";
    document.getElementById(
      "nav-toggle"
    ).innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
</svg>`;
  } else {
    menu.classList.add("hidden");
    menu.classList.remove("transition-height");
    menu.style.maxHeight = "0";
    document.getElementById(
      "nav-toggle"
    ).innerHTML = `<svg class="w-6 h-6 dark:text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h10"/>
                  </svg>`;
  }
});

document.getElementById("submitComment").addEventListener("click", async function (event) {
  event.preventDefault(); // Prevent default form submission

  // Check if the user is logged in
  const userLoggedIn = localStorage.getItem("token")

  if (!userLoggedIn) {
    window.location.href = "/login.ejs"; // Redirect to login
    return;
  }

  // Get form values
  const email = document.getElementById("email").value.trim();
  const comment = document.getElementById("comment").value.trim();

  console.log(email, comment)
  // Validation
  if (!email || !comment) {
    alert("Please fill in all fields.");
    return;
  }

  // Submit the form via AJAX
  try {
    const response = await fetch("/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, comment }),
    });

    const result = await response.json();

    console.log(result)
    if (response.ok) {
      document.getElementById("commentForm").reset();
      alert(result.message)
    }
  } catch (error) {
    alert("Something went wrong. Please try again.");
  }
});
