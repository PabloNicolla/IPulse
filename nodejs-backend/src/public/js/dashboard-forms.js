document
  .getElementById("publishImageButton")
  .addEventListener("click", function () {
    const checkboxes = document.querySelectorAll(
      "#tableContainer .checkbox-primary:checked",
    );
    if (checkboxes.length === 1) {
      document.getElementById("image_id_form").value = checkboxes[0].value;
      document.getElementById("my_modal_2").showModal();
    } else {
      alert("Please select exactly one image to publish.");
    }
  });

document
  .getElementById("editImageButton")
  .addEventListener("click", function () {
    const checkboxes = document.querySelectorAll(
      "#tableContainer .checkbox-primary:checked",
    );

    if (checkboxes.length === 1) {
      // Set the hidden input's value to the checked checkbox's value
      document.getElementById("image_id_editor_form").value =
        checkboxes[0].value;

      // Now, submit the form programmatically since the check passed
      document.getElementById("editImageForm").submit(); // Submit the form
    } else {
      // Alert the user if not exactly one checkbox is selected
      alert("Please select exactly one image to edit.");
    }
  });

export {};
