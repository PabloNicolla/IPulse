document.addEventListener("DOMContentLoaded", function () {
  // Example condition: this should be replaced with your actual logic
  // to check if the user is logged in
  var isLoggedIn = true; // Change this based on your authentication logic

  if (isLoggedIn) {
    var userNav = document.getElementById("user-nav");
    userNav.innerHTML = `
            <a href="#" class="flex items-center py-5 px-3">
                <img src="path/to/user/image.jpg" alt="User Name" class="h-8 w-8 rounded-full mr-2">
                <span>User Name</span>
            </a>
        `;
  }
});
