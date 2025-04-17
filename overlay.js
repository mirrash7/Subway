window.addEventListener('load', async function() {
  // Remove existing overlay if any
  const existingOverlay = document.getElementById('overlay');
  if (existingOverlay) {
    existingOverlay.parentNode.removeChild(existingOverlay);
  }
  
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.id = 'overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'; // White background for calibration
  overlay.style.zIndex = '99999';
  overlay.style.pointerEvents = 'none';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.color = 'black'; // Change text color to black for better visibility on white
  overlay.style.fontFamily = 'Arial, sans-serif';
  
  // Create calibration UI
  const calibrationUI = document.createElement('div');
  calibrationUI.id = 'calibration-ui';
  calibrationUI.style.textAlign = 'center';
  calibrationUI.style.pointerEvents = 'auto';
  
  // Move the title into the instructions container
  const title = document.createElement('h1');
  title.textContent = 'Motion Control Calibration';
  title.style.marginBottom = '30px';
  title.style.fontSize = '32px';
  title.style.fontWeight = 'bold';
  title.style.color = '#333';
  title.style.textShadow = '1px 1px 2px rgba(0,0,0,0.1)';
  title.style.textAlign = 'center'; // Center the title in the container
  
  // Create a container for the instructions
  const instructionsContainer = document.createElement('div');
  instructionsContainer.style.backgroundColor = 'rgba(255, 255, 255, 1)';
  instructionsContainer.style.padding = '25px 40px';
  instructionsContainer.style.borderRadius = '10px';
  instructionsContainer.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
  instructionsContainer.style.marginBottom = '30px';
  instructionsContainer.style.maxWidth = '500px';
  instructionsContainer.style.width = '100%';
  
  // Add the title to the instructions container first
  instructionsContainer.appendChild(title);
  
  const instructions = document.createElement('p');
  instructions.textContent = '1. Stand in front of camera';
  instructions.style.fontSize = '22px';
  instructions.style.fontWeight = 'bold';
  instructions.style.marginBottom = '15px';
  instructions.style.color = '#333';
  
  const instructions2 = document.createElement('p');
  instructions2.textContent = '2. Raise hand above head for 3 seconds';
  instructions2.style.fontSize = '22px';
  instructions2.style.fontWeight = 'bold';
  instructions2.style.marginBottom = '25px';
  instructions2.style.color = '#333';
  
  // Improve the progress container styling
  const progressContainer = document.createElement('div');
  progressContainer.style.width = '100%';
  progressContainer.style.height = '25px';
  progressContainer.style.border = '2px solid #333';
  progressContainer.style.borderRadius = '15px';
  progressContainer.style.overflow = 'hidden';
  progressContainer.style.marginBottom = '10px';
  progressContainer.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.2)';
  
  // Add a label for the progress
  const progressLabel = document.createElement('div');
  progressLabel.textContent = 'Calibration Progress';
  progressLabel.style.fontSize = '16px';
  progressLabel.style.fontWeight = 'bold';
  progressLabel.style.marginBottom = '10px';
  progressLabel.style.color = '#555';
  
  // Improve the progress bar styling
  const progressBar = document.createElement('div');
  progressBar.id = 'calibration-progress';
  progressBar.style.width = '0%';
  progressBar.style.height = '100%';
  progressBar.style.backgroundColor = '#4CAF50';
  progressBar.style.transition = 'width 0.3s';
  progressBar.style.backgroundImage = 'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)';
  progressBar.style.backgroundSize = '35px 35px';
  progressBar.style.animation = 'progress-bar-stripes 2s linear infinite';
  
  // Add a style for the animation
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes progress-bar-stripes {
      from { background-position: 35px 0; }
      to { background-position: 0 0; }
    }
  `;
  document.head.appendChild(styleElement);
  
  // Create camera container
  const canvasContainer = document.createElement('div');
  canvasContainer.style.position = 'fixed';
  canvasContainer.style.bottom = '20px';
  canvasContainer.style.right = '20px';
  canvasContainer.style.width = '400px';
  canvasContainer.style.height = '300px';
  canvasContainer.style.zIndex = '99999';
  canvasContainer.style.borderRadius = '5px';
  canvasContainer.style.overflow = 'hidden';
  canvasContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
  
  // Create video element
  const videoElement = document.createElement('video');
  videoElement.id = 'webcam';
  videoElement.style.width = '100%';
  videoElement.style.height = '100%';
  videoElement.style.transform = 'scaleX(-1)';
  videoElement.style.marginBottom = '0';
  videoElement.style.border = '3px solid white';
  videoElement.style.borderRadius = '5px';
  
  // Create canvas element
  const canvasElement = document.createElement('canvas');
  canvasElement.id = 'pose-canvas';
  canvasElement.width = 400;
  canvasElement.height = 300;
  canvasElement.style.position = 'absolute';
  canvasElement.style.top = '0';
  canvasElement.style.left = '0';
  canvasElement.style.width = '100%';
  canvasElement.style.height = '100%';
  canvasElement.style.transform = 'scaleX(-1)';
  canvasElement.style.zIndex = '2';
  
  // Create status text that will only appear on the camera view
  const statusText = document.createElement('div');
  statusText.id = 'status-text';
  statusText.textContent = 'Loading pose detection model...';
  statusText.style.position = 'absolute';
  statusText.style.bottom = '10px';
  statusText.style.left = '10px';
  statusText.style.color = 'white';
  statusText.style.fontSize = '14px';
  statusText.style.fontWeight = 'bold';
  statusText.style.textShadow = '1px 1px 2px black';
  statusText.style.zIndex = '3';
  
  // Create toggle button
  const toggleButton = document.createElement('button');
  toggleButton.id = 'toggle-overlay';
  toggleButton.textContent = 'Play with computer controls';
  toggleButton.style.padding = '10px 15px';
  toggleButton.style.backgroundColor = '#fff';
  toggleButton.style.border = '2px solid #ff8c00';
  toggleButton.style.borderRadius = '5px';
  toggleButton.style.cursor = 'pointer';
  toggleButton.style.fontWeight = 'bold';
  toggleButton.style.marginTop = '20px';
  
  // Assemble the UI
  instructionsContainer.appendChild(instructions);
  instructionsContainer.appendChild(instructions2);
  instructionsContainer.appendChild(progressLabel);
  progressContainer.appendChild(progressBar);
  instructionsContainer.appendChild(progressContainer);
  
  calibrationUI.appendChild(instructionsContainer);
  
  // Add status text to canvas container instead of main UI
  canvasContainer.appendChild(videoElement);
  canvasContainer.appendChild(canvasElement);
  canvasContainer.appendChild(statusText);
  
  calibrationUI.appendChild(canvasContainer);
  
  // Update the button positioning to be consistent
  // First, let's set the initial position of the button to be above the camera view
  toggleButton.style.position = 'fixed';
  toggleButton.style.bottom = '330px';
  toggleButton.style.right = '20px';
  toggleButton.style.zIndex = '100000';
  toggleButton.style.marginTop = '0';
  
  // Remove the button from the calibrationUI and add it directly to the body
  // so it's always in the same position
  document.body.appendChild(toggleButton);
  
  overlay.appendChild(calibrationUI);
  document.body.appendChild(overlay);
  
  // Initialize variables
  let model = null;
  let calibrated = false;
  let calibrationProgress = 0;
  let calibrationStartTime = 0;
  let handRaisedThreshold = 0;
  let currentPose = null;
  
  // Toggle overlay when button is clicked
  toggleButton.addEventListener('click', function() {
    if (overlay.style.display === 'none') {
      // Switching back to motion controls
      overlay.style.display = 'flex';
      toggleButton.textContent = 'Play with computer controls';
      
      // Reset calibration if needed
      if (!calibrated) {
        // Show calibration UI again
        instructionsContainer.style.display = 'block';
        progressContainer.style.display = 'block';
        overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        
        // Reset calibration variables
        calibrationStartTime = 0;
        calibrationProgress = 0;
        progressBar.style.width = '0%';
      }
      
      // Restart webcam if it was stopped
      if (!videoElement.srcObject) {
        startWebcam();
      }
    } else {
      // Switching to computer controls
      overlay.style.display = 'none';
      toggleButton.textContent = 'Play with motion controls';
      
      // Stop the webcam
      if (videoElement.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoElement.srcObject = null;
      }
    }
  });
  
  // First load TensorFlow.js
  try {
    statusText.textContent = 'Loading TensorFlow.js...';
    await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js');
    console.log('TensorFlow.js loaded');
    
    // Then load the model
    statusText.textContent = 'Loading pose detection model...';
    
    // Use a simpler model that's more likely to work
    model = await tf.loadGraphModel('https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4', { fromTFHub: true });
    console.log('Model loaded');
    statusText.textContent = 'Model loaded! Starting camera...';
    
    // Now start the webcam
    startWebcam();
  } catch (error) {
    console.error('Error loading model:', error);
    statusText.textContent = 'Error loading model. Please try refreshing the page.';
  }
  
  async function startWebcam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      videoElement.srcObject = stream;
      videoElement.play();
      
      videoElement.addEventListener('loadeddata', () => {
        statusText.textContent = 'Ready! Raise your hand above your head to calibrate.';
        // Start pose detection
        detectPose();
      });
    } catch (error) {
      console.error('Error accessing webcam:', error);
      statusText.textContent = 'Error accessing webcam. Please ensure you have granted camera permissions.';
    }
  }
  
  async function detectPose() {
    if (!videoElement.srcObject || !model) return;
    
    const ctx = canvasElement.getContext('2d');
    
    try {
      // Create a temporary canvas to get the exact size we need
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 192;
      tempCanvas.height = 192;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(videoElement, 0, 0, 192, 192);
      
      // Get image data as a tensor with the right format
      const imageData = tempCtx.getImageData(0, 0, 192, 192);
      const input = tf.tidy(() => {
        return tf.browser.fromPixels(imageData).expandDims(0);
      });
      
      // Get pose prediction
      const output = await model.execute(input);
      const posesData = await output.array();
      input.dispose();
      output.dispose();
      
      // Extract keypoints from the model output
      if (posesData && posesData.length > 0 && posesData[0].length > 0) {
        const keypoints = posesData[0][0]; // Get the first person's keypoints
        
        // Draw the pose if we have valid keypoints
        if (keypoints && keypoints.length > 0) {
          // Store the current pose
          currentPose = keypoints;
          
          // Draw the pose
          drawKeypoints(keypoints, ctx);
          
          if (!calibrated) {
            checkCalibrationMoveNet(keypoints);
          } else {
            // Use pose for game control
            controlGameMoveNet(keypoints);
          }
        }
      }
    } catch (error) {
      console.error('Error in pose detection:', error);
      statusText.textContent = 'Error in pose detection. Retrying...';
    }
    
    requestAnimationFrame(detectPose);
  }
  
  function drawKeypoints(keypoints, ctx) {
    if (!keypoints || keypoints.length === 0) return;
    
    // Clear the canvas first
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Set background to semi-transparent black like in pose-detection.js
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Draw keypoints with yellow circles like in pose-detection.js
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];
      if (!keypoint || keypoint.length < 3) continue;
      
      const score = keypoint[2];
      if (score > 0.5) { // Use same threshold as pose-detection.js
        const y = keypoint[0] * canvasElement.height;
        const x = keypoint[1] * canvasElement.width;
        
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI); // Same size as pose-detection.js
        ctx.fillStyle = 'yellow'; // Same color as pose-detection.js
        ctx.fill();
      }
    }
    
    // Draw skeleton with green lines like in pose-detection.js
    const connections = [
      [0, 1], [0, 2], // Nose to eyes
      [1, 3], [2, 4], // Eyes to ears
      [5, 6], // Connect shoulders
      [5, 7], [7, 9], // Left shoulder to elbow to wrist
      [6, 8], [8, 10], // Right shoulder to elbow to wrist
      [5, 11], [6, 12], // Shoulders to hips
      [11, 12], // Connect hips
      [11, 13], [13, 15], // Left hip to knee to ankle
      [12, 14], [14, 16] // Right hip to knee to ankle
    ];
    
    for (const [p1, p2] of connections) {
      if (p1 >= keypoints.length || p2 >= keypoints.length) continue;
      
      const keypoint1 = keypoints[p1];
      const keypoint2 = keypoints[p2];
      
      if (!keypoint1 || !keypoint2 || keypoint1.length < 3 || keypoint2.length < 3) continue;
      
      if (keypoint1[2] > 0.5 && keypoint2[2] > 0.5) {
        const y1 = keypoint1[0] * canvasElement.height;
        const x1 = keypoint1[1] * canvasElement.width;
        const y2 = keypoint2[0] * canvasElement.height;
        const x2 = keypoint2[1] * canvasElement.width;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 3; // Same thickness as pose-detection.js
        ctx.strokeStyle = 'green'; // Same color as pose-detection.js
        ctx.stroke();
      }
    }
  }
  
  function checkCalibrationMoveNet(pose) {
    // Get nose and wrist keypoints
    const nose = pose[0];
    const leftWrist = pose[9];
    const rightWrist = pose[10];
    
    // Check if either wrist is above the nose (y-coordinate)
    const handRaised = (leftWrist[2] > 0.5 && leftWrist[0] < nose[0]) || 
                       (rightWrist[2] > 0.5 && rightWrist[0] < nose[0]);
    
    if (handRaised) {
      if (calibrationStartTime === 0) {
        calibrationStartTime = Date.now();
      }
      
      const elapsedTime = Date.now() - calibrationStartTime;
      calibrationProgress = Math.min(100, (elapsedTime / 3000) * 100);
      progressBar.style.width = `${calibrationProgress}%`;
      
      if (calibrationProgress >= 100) {
        calibrated = true;
        statusText.textContent = 'Calibration complete! You can now control the game with your movements.';
        
        // Store the hand raised position for threshold
        handRaisedThreshold = Math.min(leftWrist[0], rightWrist[0]);
        
        // Change UI to show game is ready
        title.textContent = 'Motion Control Active';
        instructionsContainer.style.display = 'none';
        progressContainer.style.display = 'none';
        toggleButton.textContent = 'Play with computer controls';
        
        // Change overlay background to transparent
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        
        // Hide calibration UI elements except for the canvas container and button
        instructionsContainer.style.display = 'none';
        progressContainer.style.display = 'none';
        
        // Button position is already set and doesn't need to change
      }
    } else {
      calibrationStartTime = 0;
      calibrationProgress = 0;
      progressBar.style.width = '0%';
    }
  }
  
  function controlGameMoveNet(pose) {
    // Get relevant keypoints
    const nose = pose[0];
    const leftWrist = pose[9];
    const rightWrist = pose[10];
    const leftHip = pose[11];
    const rightHip = pose[12];
    
    // Only proceed if nose is detected with good confidence
    if (nose[2] > 0.5) {
      // Jump action - hand raised above threshold
      if ((leftWrist[2] > 0.5 && leftWrist[0] < handRaisedThreshold) || 
          (rightWrist[2] > 0.5 && rightWrist[0] < handRaisedThreshold)) {
        // Trigger jump
        simulateKeyPress(' '); // Space key for jump
        statusText.textContent = 'Action: Jump';
      }
      
      // Duck action - hands below waist
      if (leftWrist[2] > 0.5 && rightWrist[2] > 0.5 && 
          leftWrist[0] > leftHip[0] && rightWrist[0] > rightHip[0]) {
        // Trigger duck
        simulateKeyPress('ArrowDown');
        statusText.textContent = 'Action: Duck';
      }
      
      // Left/Right movement based on body position
      if (nose[1] < 0.4) {
        simulateKeyPress('ArrowLeft');
        statusText.textContent = 'Action: Move Left';
      } else if (nose[1] > 0.6) {
        simulateKeyPress('ArrowRight');
        statusText.textContent = 'Action: Move Right';
      } else {
        statusText.textContent = 'Action: Standing';
      }
    }
  }
  
  function simulateKeyPress(key) {
    const keyDownEvent = new KeyboardEvent('keydown', {
      key: key,
      code: key === ' ' ? 'Space' : key,
      keyCode: key === ' ' ? 32 : key.charCodeAt(0),
      which: key === ' ' ? 32 : key.charCodeAt(0),
      bubbles: true
    });
    
    document.dispatchEvent(keyDownEvent);
    
    // Release key after a short delay
    setTimeout(() => {
      const keyUpEvent = new KeyboardEvent('keyup', {
        key: key,
        code: key === ' ' ? 'Space' : key,
        keyCode: key === ' ' ? 32 : key.charCodeAt(0),
        which: key === ' ' ? 32 : key.charCodeAt(0),
        bubbles: true
      });
      document.dispatchEvent(keyUpEvent);
    }, 100);
  }
});

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
} 