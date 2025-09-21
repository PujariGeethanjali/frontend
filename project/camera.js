const cameraContainer = document.getElementById('camera-container');
const video = document.getElementById('webcam');

// Access webcam
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => { video.srcObject = stream; })
        .catch(err => {
            alert("Camera access denied or not available.");
            console.error(err);
        });
} else {
    alert("Your browser does not support webcam access.");
}

// Drag functionality for floating camera
let isDragging = false;
let offsetX, offsetY;

cameraContainer.addEventListener('mousedown', e => {
    isDragging = true;
    // Calculate offset between mouse and container top-left
    offsetX = e.clientX - cameraContainer.offsetLeft;
    offsetY = e.clientY - cameraContainer.offsetTop;
});

document.addEventListener('mousemove', e => {
    if(isDragging){
        // Move container based on mouse position
        cameraContainer.style.left = (e.clientX - offsetX) + 'px';
        cameraContainer.style.top = (e.clientY - offsetY) + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});
