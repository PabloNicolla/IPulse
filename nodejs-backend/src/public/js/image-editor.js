document.addEventListener("DOMContentLoaded", (event) => {
  const form = document.getElementById("imageForm");
  document
    .getElementById("SaveAsNewButton")
    .addEventListener("click", function () {
      var formData = new FormData(form);
      if (currentImageBlob) {
        // Proceed to append the Blob to FormData and submit it as shown in the previous example
        formData.append("imageFile", currentImageBlob, "image.jpg");
      }

      fetch("/image/editor/upload", {
        method: "POST",
        body: formData,
        // Important: Do not set Content-Type header when sending FormData
        // The browser will set it along with the correct boundary
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Success:", result);
          // Handle success response
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle error
        });
    });

  document
    .getElementById("SaveChangesButton")
    .addEventListener("click", function () {
      // Check if the Blob is available
      var formData = new FormData(form);
      if (currentImageBlob) {
        // Proceed to append the Blob to FormData and submit it as shown in the previous example
        formData.append("imageFile", currentImageBlob, "image.jpg");
      }

      fetch("/image/editor/update", {
        method: "POST",
        body: formData,
        // Important: Do not set Content-Type header when sending FormData
        // The browser will set it along with the correct boundary
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Success:", result);
          // Handle success response
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle error
        });
    });
});

// Define a variable in a scope accessible to both the fetching and the submitting parts of your code
let currentImageBlob = null;

document
  .getElementById("applyGrayscaleButton")
  .addEventListener("click", function () {
    fetch("/image/editor/grayscale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: undefined, // No need to send any data
    })
      .then((response) => response.blob())
      .then((blob) => {
        currentImageBlob = blob; // Store the fetched Blob for later use
        const imageUrl = URL.createObjectURL(blob);
        document.getElementById("imageFormDisplay").src = imageUrl;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

export {};
//imageFormDisplay
