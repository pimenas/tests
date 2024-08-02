// Get HTML elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const locationDisplay = document.getElementById('location');
const mapLink = document.getElementById('map-link');
const context = canvas.getContext('2d');

// Access the camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing camera:', error);
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
