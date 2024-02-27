document.addEventListener("DOMContentLoaded", (event) => {
  const themeController = document.getElementById("theme-controller-switch");

  // Load the current theme from localStorage
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
    themeController.checked = currentTheme !== "dark";
  }

  themeController.addEventListener("change", function () {
    const theme = this.checked ? "light" : "dark";

    // Save the theme to localStorage
    localStorage.setItem("theme", theme);

    // Optionally, update the theme without a page reload
    document.documentElement.setAttribute("data-theme", theme);

    // Send the theme choice to the server
    fetch("/set-theme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ theme }),
    }).then((response) => {
      if (response.ok) {
        console.log("Theme updated successfully");
      }
    });
  });
});

export {};
