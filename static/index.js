// Select elements
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureButton = document.getElementById("capture");
const sendButton = document.getElementById("send");
const preview = document.getElementById("preview");
const ctx = canvas.getContext("2d");

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

  fetch("http://127.0.0.1:5000/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: imageData }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      console.log(data);
    })
    .catch((error) => {
      console.error("Error uploading photo: ", error);
    });
});
