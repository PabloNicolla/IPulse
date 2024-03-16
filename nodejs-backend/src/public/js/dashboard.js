const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

function handleSubmit(searchTerm = searchInput.value) {
  const route = "/users/dashboard"; // Replace with the correct route

  // Construct the URL with the search term
  const searchURL = `${route}?q=${searchTerm}`;

  // Redirect the user
  window.location.href = searchURL;
}

searchInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    handleSubmit();
  }
});

searchButton.addEventListener("click", () => {
  handleSubmit();
});

export { handleSubmit };
