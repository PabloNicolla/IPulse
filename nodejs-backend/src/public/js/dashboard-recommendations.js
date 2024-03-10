import { handleSubmit } from "./dashboard.js";

document
  .getElementById("search-input")
  .addEventListener("input", async function () {
    const query = this.value;
    if (query.length < 3) {
      // Minimum characters before fetching recommendations
      document.getElementById("search-dropdown").classList.add("hidden");
      return;
    }

    // Fetch recommendations from your Express.js backend
    // This is a placeholder; you'll need to implement the actual fetch call based on your backend API
    const recommendations = await fetch(
      `/users/dashboard/recommendations?q=${encodeURIComponent(query)}`,
    )
      .then((response) => response.json())
      .catch((error) =>
        console.error("Error fetching recommendations:", error),
      );

    // Update the dropdown with recommendations
    const dropdown = document.getElementById("search-dropdown");
    dropdown.innerHTML = recommendations
      .map(
        (item) =>
          `<div class="p-2 hover:bg-gray-100 cursor-pointer">${item}</div>`,
      )
      .join("");

    // Attach click event listeners to each dropdown item
    dropdown.childNodes.forEach((child) => {
      child.addEventListener("click", () => handleSubmit(child.textContent));
    });
    dropdown.classList.remove("hidden");
  });

// Add event listener to hide dropdown when not focused
document.getElementById("search-input").addEventListener("blur", function () {
  setTimeout(() => {
    // Timeout to allow click event to register on recommendations
    document.getElementById("search-dropdown").classList.add("hidden");
  }, 200);
});

export {};
