document.addEventListener("DOMContentLoaded", () => {
  const themeController = document.getElementById("theme-controller-switch");

  // Load the current theme from localStorage (fast initial load)
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
    themeController.checked = currentTheme !== "dark";
  }

  // Fetch the current theme from the server (theme consistency across multiple devices)
  fetch("/get-theme")
    .then((response) => response.json())
    .then((data) => {
      const { theme } = data;
      document.documentElement.setAttribute("data-theme", theme);
      themeController.checked = theme !== "dark";
    })
    .catch((error) => console.error("Error fetching theme:", error));

  themeController.addEventListener("change", function () {
    const theme = this.checked ? "light" : "dark";

    // Save the theme to localStorage
    localStorage.setItem("theme", theme);

    // Update the theme without a page reload
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
