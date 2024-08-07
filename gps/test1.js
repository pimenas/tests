// Get HTML elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const switchCameraButton = document.getElementById('switch-camera');
const locationDisplay = document.getElementById('location');
const mapLink = document.getElementById('map-link');
const context = canvas.getContext('2d');

// Initialize facingMode
let currentFacingMode = 'environment';

// Function to start the camera with the specified facing mode
function startCamera(facingMode) {
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: facingMode, // Use 'user' for the front camera
        }
    })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing camera:', error);
        alert('Could not access the camera. Please check camera permissions.');
    });
}

// Start the camera with the initial facing mode
startCamera(currentFacingMode);

// Add event listener to switch the camera
switchCameraButton.addEventListener('click', () => {
    // Toggle facing mode
    currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
    
    // Restart the camera with the new facing mode
    startCamera(currentFacingMode);
});

// Get location and capture photo
captureButton.addEventListener('click', () => {
    // Check for geolocation support
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            locationDisplay.textContent = `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`;

            // Set canvas dimensions to match the video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the video frame onto the canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Overlay the location text
            context.font = '20px Arial';
            context.fillStyle = 'red';
            context.fillText(`Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`, 10, 30);

            // Create a map link
            const mapUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
            mapLink.href = mapUrl;
            mapLink.style.display = 'block';
        }, error => {
            console.error('Error getting location:', error);
            locationDisplay.textContent = 'Unable to retrieve location.';
            mapLink.style.display = 'none';
        });
    } else {
        console.log('Geolocation is not supported by this browser.');
        locationDisplay.textContent = 'Geolocation not supported.';
        mapLink.style.display = 'none';
    }
});
