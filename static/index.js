// Select elements
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureButton = document.getElementById("capture");
const sendButton = document.getElementById("send");
const preview = document.getElementById("preview");
const ctx = canvas.getContext("2d");
const categoryInputs = document.getElementsByName("category");

// Access webcam
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error("Error accessing webcam: ", err);
  });

// Capture photo
captureButton.addEventListener("click", () => {
  // Set canvas size to video size
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw video frame onto canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Show the captured photo
  const imageData = canvas.toDataURL("image/png");
  preview.src = imageData;
  preview.style.display = "block";
  sendButton.style.display = "inline-block";
});

// Send photo to Flask endpoint
sendButton.addEventListener("click", () => {
  const imageData = canvas.toDataURL("image/png");

  // Determine the selected category
  let selectedCategory = "chilli"; // Default category
  categoryInputs.forEach((input) => {
    if (input.checked) {
      selectedCategory = input.value;
    }
  });

  // Determine the endpoint based on the selected category
  const endpoint =
    selectedCategory === "chilli"
      ? "http://127.0.0.1:5000/predictchillidisesase"
      : "http://127.0.0.1:5000/predicttomatodisesase";

  // Send the request
  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: imageData }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
    })
    .catch((error) => {
      console.error(`Error uploading photo to ${selectedCategory}:`, error);
    });
});
