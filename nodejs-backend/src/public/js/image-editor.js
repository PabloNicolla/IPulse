document.addEventListener("DOMContentLoaded", (event) => {
  const form = document.getElementById("imageForm");
  document
    .getElementById("SaveAsNewButton")
    .addEventListener("click", function () {
      var formData = new FormData(form);
      if (currentImageBlob) {
        formData.append("imageFile", currentImageBlob, "image.jpg");
      }

      fetch("/image/editor/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          // Check if the response requires a redirect
          if (response.redirected) {
            window.location.href = response.url; // Redirect to the response URL
          } else {
            return response.json(); // Continue processing as before
          }
        })
        .then((result) => {
          console.log("Success:", result);
          // Optional: redirect based on the result content if needed
          // if (result.redirectUrl) window.location.href = result.redirectUrl;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });

  document
    .getElementById("SaveChangesButton")
    .addEventListener("click", function () {
      var formData = new FormData(form);
      if (currentImageBlob) {
        formData.append("imageFile", currentImageBlob, "image.jpg");
      }

      fetch("/image/editor/update", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          // Check if the response requires a redirect
          if (response.redirected) {
            window.location.href = response.url; // Redirect to the response URL
          } else {
            return response.json(); // Continue processing as before
          }
        })
        .then((result) => {
          console.log("Success:", result);
          // Optional: redirect based on the result content if needed
          // if (result.redirectUrl) window.location.href = result.redirectUrl;
        })
        .catch((error) => {
          console.error("Error:", error);
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

document
  .getElementById("applyInvertButton")
  .addEventListener("click", function () {
    fetch("/image/editor/invert", {
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
