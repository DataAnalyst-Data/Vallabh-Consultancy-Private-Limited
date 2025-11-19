function generateBookingId() {
  const timestamp = Date.now().toString().slice(-2); // Last 6 digits of timestamp
  const random = Math.floor(Math.random() * 1000); // 3-digit random number
  return `VCPT#${timestamp}-${random}`;
}

// Function to show the modal and blur the background
function showModal(bookingId) {
  const modal = document.getElementById("successModal");
  const backdrop = document.getElementById("modalBackdrop");
  const content = document.getElementById("content");
  const bookingIdDisplay = document.getElementById("bookingIdDisplay"); // New element to display booking ID

  if (bookingIdDisplay) {
    bookingIdDisplay.textContent = `Booking ID: ${bookingId}`;
  }

  modal.style.display = "block";
  backdrop.style.display = "block";

  // Add blur effect to the content
  if (content) content.classList.add("blur");
}

function addEmailField() {
  const emailContainer = document.getElementById("emailContainer");
  const newField = document.createElement("div");
  newField.style.display = "flex";
  newField.style.alignItems = "center";
  newField.style.marginBottom = "10px";
  newField.innerHTML = `
            <input class="input" type="email" placeholder="Enter Client Email" name="Email[]" style="flex: 1; margin-right: 10px;" oninput="validateEmail(this)" />
            <button type="button" class="button is-small is-danger" onclick="removeEmailField(this)" title="Remove this email field">-</button>
         `;
  emailContainer.insertBefore(newField, document.getElementById("emailError"));
}
// Function to remove an email field
function removeEmailField(button) {
  button.parentElement.remove();
}

// Function to validate the email
function validateEmail(input) {
  const emailError = document.getElementById("emailError");
  const email = input.value.trim(); // Trim spaces from input
  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Validate Gmail address format

  // // Step 1: Check general Gmail email format
  // if (!emailPattern.test(email)) {
  //  emailError.style.display = 'block';
  //  emailError.textContent = 'Please enter a valid Gmail address (e.g., example@gmail.com).';
  //  return;
  // }

  // Step 2: Check for mistakes before "@gmail.com"
  const localPart = email.split("@")[0]; // Get the part before @gmail.com
  const invalidCharPattern = /[^a-zA-Z0-9._%+-]/; // Invalid characters for email

  if (invalidCharPattern.test(localPart)) {
    emailError.style.display = "block";
    emailError.textContent =
      "The email contains invalid characters. Only letters, numbers, and ._%+- are allowed before @gmail.com.";
    return;
  }

  // If all checks pass
  emailError.style.display = "none";
}

function addMobileField() {
  // Get the container where mobile inputs are added
  const mobileContainer = document.getElementById("mobileContainer");

  // Create a new div to wrap the new mobile input and remove button
  const newMobileDiv = document.createElement("div");
  newMobileDiv.style.display = "flex";
  newMobileDiv.style.alignItems = "center";
  newMobileDiv.style.marginBottom = "10px";

  // Create the new mobile input
  const newMobileInput = document.createElement("input");
  newMobileInput.type = "number";
  newMobileInput.placeholder = "Enter Client Number";
  newMobileInput.name = "Mobile[]";
  newMobileInput.className = "input";
  newMobileInput.style.flex = "1";
  newMobileInput.style.marginRight = "10px";

  // Create the remove button
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "button is-small is-danger";
  removeButton.textContent = "-";
  removeButton.title = "Remove this number";
  removeButton.onclick = function () {
    mobileContainer.removeChild(newMobileDiv);
  };

  // Append the new input and remove button to the div
  newMobileDiv.appendChild(newMobileInput);
  newMobileDiv.appendChild(removeButton);

  // Append the new div to the container
  mobileContainer.appendChild(newMobileDiv);
}

// function calculateAmounts() {
//   const totalAmount =
//     parseFloat(document.getElementById("totalAmount").value) || 0;
//   const gstPercentage = 18;
//   const receivedAmount =
//     parseFloat(document.getElementById("receivedAmount").value) || 0;

//   // Calculate GST
//   const gstAmount = (totalAmount * gstPercentage) / 100;
//   const totalWithGst = totalAmount + gstAmount;

//   // Calculate Remaining Amount
//   const remainingAmount = totalWithGst - receivedAmount;

//   // Display Remaining Amount
//   document.getElementById("remainingAmount").value = remainingAmount.toFixed(2);
// }

function handleFileSelection() {
  const fileInput = document.getElementById("fileUpload");
  const fileListContainer = document.getElementById("fileList");

  // Clear any previous file list
  fileListContainer.innerHTML = "";

  const files = fileInput.files;
  if (files.length === 0) {
    fileListContainer.innerHTML = "No files Selected.";
    return;
  }
  const fileList = document.createElement("ul");
  for (let i = 0; i < files.length; i++) {
    const fileItem = document.createElement("li");
    fileItem.textContent = files[i].name;
    fileList.appendChild(fileItem);
  }
  fileListContainer.appendChild(fileList);
}

// Function to close the modal, remove blur, and reset the form
function closeModal() {
  const modal = document.getElementById("successModal");
  const backdrop = document.getElementById("modalBackdrop");
  const content = document.getElementById("content");
  const form = document.getElementById("form");

  modal.style.display = "none";
  backdrop.style.display = "none";

  // Remove blur effect
  if (content) content.classList.remove("blur");

  // Reset the form if it exists
  if (form) form.reset();
}

// Form submission logic
document.getElementById("form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent default form submission

  const messageElement = document.getElementById("message");
  const submitButton = document.getElementById("submit-button");
  const fileInput = document.getElementById("fileUpload");
  const form = document.getElementById("form");
  const bookingIdInput = document.getElementById("bookingId"); // Get the hidden booking ID input

  // Generate booking ID
  const bookingId = generateBookingId();
  bookingIdInput.value = bookingId; // Set the value of the hidden input

  // Show submitting message
  if (messageElement) {
    messageElement.textContent = "Submitting...";
    messageElement.style.display = "block";
  }

  submitButton.disabled = true;

  try {
    // Create FormData to include file data
    const formData = new FormData(form);
    const payload = {};

    // Convert form data to JSON
    formData.forEach((value, key) => {
      if (!payload[key]) {
        payload[key] = value;
      } else if (Array.isArray(payload[key])) {
        payload[key].push(value);
      } else {
        payload[key] = [payload[key], value];
      }
    });

    // Handle selected services
    const servicesSelect = document.getElementById("servicesNameSelect");
    if (servicesSelect) {
      const services = Array.from(servicesSelect.selectedOptions).map(
        (option) => option.value
      );
      if (services.length > 0) {
        payload["Services[]"] = services;
      }
    }

    // Handle file upload
    if (fileInput && fileInput.files.length > 0) {
      payload["files[]"] = await Promise.all(
        Array.from(fileInput.files).map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                const base64 = reader.result.split(",")[1]; // Extract Base64 content
                resolve(base64);
              };
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
      );
    }

    // Send the payload to the server
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwBIraaCcKmo5O-hKJEUtQYR63jy1eZ8FsaOUg7VEXp5kdBDoQ230hGeYDAJTz6-1Telw/exec",
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Corrected content type for JSON payload
        },
      }
    );

    // Handle response
    if (!response.ok) {
      throw new Error("Failed to submit the form.");
    }

    const data = await response.json();

    // Show success modal with booking ID
    showModal(bookingId);

    // Optional: Show success message in the form area
    if (messageElement) {
      messageElement.textContent = "Form submitted successfully!";
      messageElement.style.backgroundColor = "green";
      messageElement.style.color = "beige";

      // Hide message after a timeout
      setTimeout(() => {
        messageElement.textContent = "";
        messageElement.style.display = "none";
      }, 2600);
    }
  } catch (error) {
    console.error(error);

    // Show error message
    if (messageElement) {
      messageElement.textContent =
        "An error occurred while submitting the form.";
      messageElement.style.backgroundColor = "red";
      messageElement.style.color = "white";
    }
  } finally {
    submitButton.disabled = false;
    if (messageElement) messageElement.style.display = "none";
  }
});

// Close modal when clicking the backdrop
document.getElementById("modalBackdrop").addEventListener("click", closeModal);

function clearForm() {
  // Get the form element
  const form = document.getElementById("form");

  // Reset all form fields
  form.reset();

  // If Select2 dropdowns are used, clear their selections
  // $("#servicesNameSelect").val(null).trigger("change"); // This line is commented out in the original HTML
  document.getElementById("fileList").innerHTML = ""; // Clear file list
  document.getElementById("message").style.display = "none";

  // Clear any custom dynamic fields (like emails or mobile numbers) except the first ones
  const emailContainer = document.getElementById("emailContainer");
  const emailFields = emailContainer.querySelectorAll("div:not(:first-child)");
  emailFields.forEach((field) => field.remove());

  const mobileContainer = document.getElementById("mobileContainer");
  const mobileFields = mobileContainer.querySelectorAll(
    "div:not(:first-child)"
  );
  mobileFields.forEach((field) => field.remove());

}
