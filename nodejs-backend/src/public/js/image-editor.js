document.addEventListener("DOMContentLoaded", (event) => {
  const form = document.getElementById("imageForm");

  // Define a reusable function for form submission
  function submitForm(actionEndpoint) {
    let formData = new FormData(form);
    if (currentImageBlob) {
      formData.append("imageFile", currentImageBlob, "image.jpg");
    }

    fetch(`/image/editor/${actionEndpoint}`, {
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
  }

  // Add event listener for the "Save as New" button
  document
    .getElementById("SaveAsNewButton")
    .addEventListener("click", function () {
      submitForm("upload");
    });

  // Add event listener for the "Save Changes" button
  document
    .getElementById("SaveChangesButton")
    .addEventListener("click", function () {
      submitForm("update");
    });
});

// Define a variable in a scope accessible to both the fetching and the submitting parts of your code
let currentImageBlob = null;

// Define a reusable function for applying image effects
function applyImageEffect(effectEndpoint) {
  fetch(`/image/editor/${effectEndpoint}`, {
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
}

// Add event listeners for each button and call the applyImageEffect function with the appropriate endpoint
document
  .getElementById("applyGrayscaleButton")
  .addEventListener("click", () => applyImageEffect("grayscale"));
document
  .getElementById("applyInvertButton")
  .addEventListener("click", () => applyImageEffect("invert"));
document
  .getElementById("applyGaussianBlurButton")
  .addEventListener("click", () => applyImageEffect("gaussianBlur"));
document
  .getElementById("applyCannyEdgeDetectionButton")
  .addEventListener("click", () => applyImageEffect("cannyEdgeDetection"));
document
  .getElementById("applyEqualizeHistButton")
  .addEventListener("click", () => applyImageEffect("equalizeHist"));

export {};

//imageFormDisplay
