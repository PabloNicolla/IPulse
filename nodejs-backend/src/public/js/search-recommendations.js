import { handleSubmit } from "./search-form.js";

let debounceTimer;
document.getElementById("search-input").addEventListener("input", function () {
  clearTimeout(debounceTimer); // Clear the timer on every input event
  const query = this.value;
  if (query.length < 3) {
    document.getElementById("search-dropdown").classList.add("hidden");
    return;
  }
  debounceTimer = setTimeout(async () => {
    // Set a new timer
    // Fetch recommendations from your Express.js backend
    const recommendations = await fetch(
      `/search/recommendations?q=${encodeURIComponent(query)}`,
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
  }, 500); // 300ms delay
});

// Add event listener to hide dropdown when not focused
document.getElementById("search-input").addEventListener("blur", function () {
  setTimeout(() => {
    // Timeout to allow click event to register on recommendations
    document.getElementById("search-dropdown").classList.add("hidden");
  }, 200);
});

export {};
