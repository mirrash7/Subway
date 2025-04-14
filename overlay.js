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
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Dark background for better visibility
  overlay.style.zIndex = '99999';
  overlay.style.pointerEvents = 'none';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.color = 'white';
  overlay.style.fontFamily = 'Arial, sans-serif';
  
  // Create calibration UI
  const calibrationUI = document.createElement('div');
  calibrationUI.id = 'calibration-ui';
  calibrationUI.style.textAlign = 'center';
  calibrationUI.style.pointerEvents = 'auto';
  
  const title = document.createElement('h1');
  title.textContent = 'Motion Control Calibration';
  title.style.marginBottom = '20px';
  
  const instructions = document.createElement('p');
  instructions.textContent = '1. Stand in front of camera';
  instructions.style.fontSize = '18px';
  instructions.style.marginBottom = '10px';
  
  const instructions2 = document.createElement('p');
  instructions2.textContent = '2. Raise hand above head for 3 seconds';
  instructions2.style.fontSize = '18px';
  instructions2.style.marginBottom = '20px';
  
  const progressContainer = document.createElement('div');
  progressContainer.style.width = '300px';
  progressContainer.style.height = '20px';
  progressContainer.style.border = '2px solid white';
  progressContainer.style.borderRadius = '10px';
  progressContainer.style.overflow = 'hidden';
  progressContainer.style.marginBottom = '20px';
  
  const progressBar = document.createElement('div');
  progressBar.id = 'calibration-progress';
  progressBar.style.width = '0%';
  progressBar.style.height = '100%';
  progressBar.style.backgroundColor = '#4CAF50';
  progressBar.style.transition = 'width 0.3s';
  
  const statusText = document.createElement('p');
  statusText.id = 'status-text';
  statusText.textContent = 'Loading pose detection model...';
  statusText.style.fontSize = '16px';
  statusText.style.marginBottom = '20px';
  
  const videoElement = document.createElement('video');
  videoElement.id = 'webcam';
  videoElement.style.width = '320px';
  videoElement.style.height = '240px';
  videoElement.style.transform = 'scaleX(-1)'; // Mirror the video
  videoElement.style.marginBottom = '20px';
  videoElement.style.border = '3px solid white';
  videoElement.style.borderRadius = '5px';
  
  const canvasContainer = document.createElement('div');
  canvasContainer.style.position = 'relative';
  canvasContainer.style.width = '320px';
  canvasContainer.style.height = '240px';
  canvasContainer.style.marginBottom = '20px';
  
  const canvasElement = document.createElement('canvas');
  canvasElement.id = 'pose-canvas';
  canvasElement.width = 320;
  canvasElement.height = 240;
  canvasElement.style.position = 'absolute';
  canvasElement.style.top = '0';
  canvasElement.style.left = '0';
  canvasElement.style.transform = 'scaleX(-1)'; // Mirror the canvas
  canvasElement.style.zIndex = '2';
  
  const toggleButton = document.createElement('button');
  toggleButton.id = 'toggle-overlay';
  toggleButton.textContent = 'Skip Calibration';
  toggleButton.style.padding = '10px 15px';
  toggleButton.style.backgroundColor = '#fff';
  toggleButton.style.border = '2px solid #ff8c00';
  toggleButton.style.borderRadius = '5px';
  toggleButton.style.cursor = 'pointer';
  toggleButton.style.fontWeight = 'bold';
  toggleButton.style.marginTop = '20px';
  
  // Assemble the UI
  progressContainer.appendChild(progressBar);
  calibrationUI.appendChild(title);
  calibrationUI.appendChild(instructions);
  calibrationUI.appendChild(instructions2);
  calibrationUI.appendChild(progressContainer);
  calibrationUI.appendChild(statusText);
  
  canvasContainer.appendChild(videoElement);
  canvasContainer.appendChild(canvasElement);
  calibrationUI.appendChild(canvasContainer);
  
  calibrationUI.appendChild(toggleButton);
  
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
      overlay.style.display = 'flex';
      toggleButton.textContent = 'Skip Calibration';
    } else {
      overlay.style.display = 'none';
      toggleButton.textContent = 'Show Calibration';
      // Stop the webcam if it's running
      if (videoElement.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach(track => track.stop());
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
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    try {
      // Draw video frame on canvas for debugging
      ctx.globalAlpha = 0.5;
      ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
      ctx.globalAlpha = 1.0;
      
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
      
      // Debug the output format
      console.log("Model output shape:", posesData.length, posesData[0].length);
      
      // Extract keypoints from the model output
      // MoveNet returns a 1x1x17x3 tensor where:
      // - First dimension is batch size (1)
      // - Second dimension is number of people detected (1)
      // - Third dimension is number of keypoints (17)
      // - Fourth dimension is [y, x, confidence] for each keypoint
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
    
    ctx.fillStyle = '#00FF00';
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    
    // Draw each keypoint
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];
      if (!keypoint || keypoint.length < 3) continue;
      
      const score = keypoint[2];
      if (score > 0.3) {
        const y = keypoint[0] * canvasElement.height;
        const x = keypoint[1] * canvasElement.width;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    
    // Draw skeleton connections
    const connections = [
      [0, 1], [0, 2], [1, 3], [2, 4], // Head to shoulders to elbows
      [3, 5], [4, 6], // Elbows to wrists
      [5, 7], [6, 8], // Wrists to hands
      [0, 9], [0, 10], // Shoulders to hips
      [9, 11], [10, 12], // Hips to knees
      [11, 13], [12, 14], // Knees to ankles
      [13, 15], [14, 16] // Ankles to feet
    ];
    
    for (const [p1, p2] of connections) {
      if (p1 >= keypoints.length || p2 >= keypoints.length) continue;
      
      const keypoint1 = keypoints[p1];
      const keypoint2 = keypoints[p2];
      
      if (!keypoint1 || !keypoint2 || keypoint1.length < 3 || keypoint2.length < 3) continue;
      
      if (keypoint1[2] > 0.3 && keypoint2[2] > 0.3) {
        const y1 = keypoint1[0] * canvasElement.height;
        const x1 = keypoint1[1] * canvasElement.width;
        const y2 = keypoint2[0] * canvasElement.height;
        const x2 = keypoint2[1] * canvasElement.width;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
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
        instructions.textContent = 'Move your body to control the game';
        instructions2.textContent = '';
        progressContainer.style.display = 'none';
        toggleButton.textContent = 'Turn Off Motion Control';
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