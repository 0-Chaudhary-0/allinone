if (document.getElementById("informational-banner")) {
  if (localStorage.getItem("token")) {
    document.getElementById("informational-banner").classList.add("hidden")
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
    ).innerHTML = `<svg class="w-6 h-6 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h10"/>
                  </svg>`;
  }
});

if (localStorage.getItem("token")) {
  document.getElementById("add-user").innerHTML = `<a href="account.ejs" id="user">
            <button class="flex">
            <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clip-rule="evenodd"/>
</svg> &nbsp; <span class="text-gray-100 font-semibold"> User123</span>
</button> 
            </a>`;
} else {
  document.getElementById("add-user").innerHTML = `<a href="/login.ejs" id="add-user">
            <button class="flex">
                <svg class="w-6 h-6 text-white dark:text-white block text-right" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
                  </svg> &nbsp; <span class="text-gray-100 font-semibold"> Login</span>
                </button>
            </a>   `
}

document.getElementById('access-protected').addEventListener('click', async function () {
  console.log('Quizzes button clicked'); // Debug log
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.log('No token found'); // Debug log
    window.location.href = "/login.ejs";
    return;
  }

  try {
    const response = await fetch('/protected/chemistryquiz', {
      method: 'GET',
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Fetch response status:', response.status); // Debug log

    if (response.ok) {
      const data = await response.text(); // Fetch the entire response as text
      document.open();
      document.write(data);
      document.close();
    } else {
      const data = await response.json();
      alert(data.message);
      window.location.href = "/login.ejs";
    }
  } catch (error) {
    console.error('Fetch error:', error); // Debug log
    alert('An error occurred. Please try again.');
  }
});

