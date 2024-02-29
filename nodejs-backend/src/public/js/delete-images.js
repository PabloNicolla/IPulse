document
  .getElementById("deleteSelected")
  .addEventListener("click", function () {
    // Find all checkboxes
    const tableContainer = document.querySelector("#tableContainer"); // The container of your table
    const checkboxes = tableContainer.querySelectorAll(
      ".checkbox-primary:checked",
    );

    // Collect the IDs of checked checkboxes
    const selectedIds = Array.from(checkboxes).map(
      (checkbox) => checkbox.value,
    );

    if (selectedIds.length > 0) {
      // Send POST request with Fetch API
      fetch("/delete/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include any additional headers like authentication tokens if needed
        },
        body: JSON.stringify({ ids: selectedIds }),
      })
        .then((response) => {
          if (response.ok) {
            // Uncheck all checkboxes after successful POST request
            checkboxes.forEach((checkbox) => {
              checkbox.checked = false;
            });
            console.log("Success:", response);
            // Optionally, redirect or refresh the page to show the changes
            window.location.reload();
          } else {
            // Handle error response
            console.error("Error:", response.statusText);
          }
        })
        .catch((error) => console.error("Fetch Error:", error));
    } else {
      alert("No items selected.");
    }
  });

export {};
