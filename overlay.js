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
  
  // Add a third instruction for the controls explanation
  const instructions3 = document.createElement('div');
  instructions3.style.fontSize = '16px';
  instructions3.style.marginTop = '15px';
  instructions3.style.color = '#555';
  instructions3.style.textAlign = 'left';
  instructions3.style.padding = '10px';
  instructions3.style.backgroundColor = '#f5f5f5';
  instructions3.style.borderRadius = '5px';
  instructions3.style.display = 'none'; // Hide initially, show after calibration

  instructions3.innerHTML = `
  <strong>Controls:</strong><br>
  • Move left/right: Lean body left/right<br>
  • Jump (ArrowUp): Raise both shoulders above jump line<br>
  • Action (Space): Raise one hand above nose level<br>
  • Pause: Raise both hands above nose level<br>
  • Duck: Lower shoulders below duck line
  `;
  
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
  
  // Create section labels as HTML elements instead of drawing on canvas
  const leftLabel = document.createElement('div');
  leftLabel.textContent = 'Right';
  leftLabel.style.position = 'absolute';
  leftLabel.style.top = '5px';
  leftLabel.style.right = '30px';
  leftLabel.style.color = 'white';
  leftLabel.style.fontSize = '12px';
  leftLabel.style.fontWeight = 'bold';
  leftLabel.style.textShadow = '1px 1px 2px black';
  leftLabel.style.zIndex = '4';

  const centerLabel = document.createElement('div');
  centerLabel.textContent = 'Center';
  centerLabel.style.position = 'absolute';
  centerLabel.style.top = '5px';
  centerLabel.style.left = '50%';
  centerLabel.style.transform = 'translateX(-50%)'; // Center the label
  centerLabel.style.color = 'white';
  centerLabel.style.fontSize = '12px';
  centerLabel.style.fontWeight = 'bold';
  centerLabel.style.textShadow = '1px 1px 2px black';
  centerLabel.style.zIndex = '4';

  const rightLabel = document.createElement('div');
  rightLabel.textContent = 'Right';
  rightLabel.style.position = 'absolute';
  rightLabel.style.top = '5px';
  rightLabel.style.left = '30px';
  rightLabel.style.color = 'white';
  rightLabel.style.fontSize = '12px';
  rightLabel.style.fontWeight = 'bold';
  rightLabel.style.textShadow = '1px 1px 2px black';
  rightLabel.style.zIndex = '4';
  
  // Create threshold labels as HTML elements
  const standingLabel = document.createElement('div');
  standingLabel.textContent = 'Standing';
  standingLabel.style.position = 'absolute';
  standingLabel.style.right = '10px';
  standingLabel.style.color = 'white';
  standingLabel.style.fontSize = '14px';
  standingLabel.style.fontWeight = 'bold';
  standingLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  standingLabel.style.padding = '2px 6px';
  standingLabel.style.borderRadius = '3px';
  standingLabel.style.display = 'none'; // Hide initially
  standingLabel.style.zIndex = '5';

  const jumpLabel = document.createElement('div');
  jumpLabel.textContent = 'Jump';
  jumpLabel.style.position = 'absolute';
  jumpLabel.style.right = '10px';
  jumpLabel.style.color = 'white';
  jumpLabel.style.fontSize = '14px';
  jumpLabel.style.fontWeight = 'bold';
  jumpLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  jumpLabel.style.padding = '2px 6px';
  jumpLabel.style.borderRadius = '3px';
  jumpLabel.style.display = 'none'; // Hide initially
  jumpLabel.style.zIndex = '5';

  const duckLabel = document.createElement('div');
  duckLabel.textContent = 'Duck';
  duckLabel.style.position = 'absolute';
  duckLabel.style.right = '10px';
  duckLabel.style.color = 'white';
  duckLabel.style.fontSize = '14px';
  duckLabel.style.fontWeight = 'bold';
  duckLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  duckLabel.style.padding = '2px 6px';
  duckLabel.style.borderRadius = '3px';
  duckLabel.style.display = 'none'; // Hide initially
  duckLabel.style.zIndex = '5';
  
  // Assemble the UI
  instructionsContainer.appendChild(instructions);
  instructionsContainer.appendChild(instructions2);
  instructionsContainer.appendChild(instructions3);
  instructionsContainer.appendChild(progressLabel);
  progressContainer.appendChild(progressBar);
  instructionsContainer.appendChild(progressContainer);
  
  calibrationUI.appendChild(instructionsContainer);
  
  // Add status text to canvas container instead of main UI
  canvasContainer.appendChild(videoElement);
  canvasContainer.appendChild(canvasElement);
  canvasContainer.appendChild(statusText);
  
  // Add the labels to the canvas container
  canvasContainer.appendChild(leftLabel);
  canvasContainer.appendChild(centerLabel);
  canvasContainer.appendChild(rightLabel);
  canvasContainer.appendChild(standingLabel);
  canvasContainer.appendChild(jumpLabel);
  canvasContainer.appendChild(duckLabel);
  
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
  let currentPose = null;
  let lastShoulderPosition = 'middle'; // Track the last position of shoulders
  let currentPositionZone = 'middle'; // Track the current position zone
  
  // Initialize calibration variables
  let calibrationShoulders = [];
  let calibrationHips = [];
  let calibrationBodyHeights = [];
  let shoulderBaseline = null;
  let hipBaseline = null;
  let bodyHeight = null;
  let jumpThreshold = null;
  let duckThreshold = null;
  
  // Add debounce variables
  let lastCommandTime = 0;
  let lastCommand = null;
  const commandCooldown = 300; // milliseconds between commands
  
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
      toggleButton.textContent = 'Play with computer controls';
      
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
    
    // Draw vertical lines to divide the view into three sections
    const sectionWidth = canvasElement.width / 3;
    
    // Draw first dividing line (1/3 of the way)
    ctx.beginPath();
    ctx.moveTo(sectionWidth, 0);
    ctx.lineTo(sectionWidth, canvasElement.height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw second dividing line (2/3 of the way)
    ctx.beginPath();
    ctx.moveTo(sectionWidth * 2, 0);
    ctx.lineTo(sectionWidth * 2, canvasElement.height);
    ctx.stroke();
    
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
    
    // Draw baselines if calibration is complete
    if (calibrated && shoulderBaseline) {
      // Draw shoulder baseline
      ctx.beginPath();
      ctx.moveTo(0, shoulderBaseline * canvasElement.height);
      ctx.lineTo(canvasElement.width, shoulderBaseline * canvasElement.height);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'green';
      ctx.stroke();
      
      // Draw jump threshold line
      ctx.beginPath();
      ctx.setLineDash([8, 5]);
      ctx.moveTo(0, (shoulderBaseline - jumpThreshold) * canvasElement.height);
      ctx.lineTo(canvasElement.width, (shoulderBaseline - jumpThreshold) * canvasElement.height);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'red';
      ctx.stroke();
      
      // Draw duck threshold line
      ctx.beginPath();
      ctx.moveTo(0, (shoulderBaseline - duckThreshold) * canvasElement.height);
      ctx.lineTo(canvasElement.width, (shoulderBaseline - duckThreshold) * canvasElement.height);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'orange';
      ctx.stroke();
      
      ctx.setLineDash([]);
      
      // Position the HTML labels
      standingLabel.style.display = 'block';
      standingLabel.style.top = (shoulderBaseline * canvasElement.height - 25) + 'px';
      
      jumpLabel.style.display = 'block';
      jumpLabel.style.top = ((shoulderBaseline - jumpThreshold) * canvasElement.height - 25) + 'px';
      
      duckLabel.style.display = 'block';
      duckLabel.style.top = ((shoulderBaseline - duckThreshold) * canvasElement.height - 25) + 'px';
    } else {
      // Hide the labels if not calibrated
      standingLabel.style.display = 'none';
      jumpLabel.style.display = 'none';
      duckLabel.style.display = 'none';
    }
  }
  
  function checkCalibrationMoveNet(pose) {
    // Get keypoints
    const nose = pose[0];
    const leftShoulder = pose[5];
    const rightShoulder = pose[6];
    const leftWrist = pose[9];
    const rightWrist = pose[10];
    const leftHip = pose[11];
    const rightHip = pose[12];
    
    // Only proceed if we have shoulders detected with good confidence
    if (leftShoulder[2] < 0.5 || rightShoulder[2] < 0.5) return;
    
    // Calculate average shoulder Y position
    const avgShoulderY = (leftShoulder[0] + rightShoulder[0]) / 2;
    
    // Check if either wrist is above shoulders
    const handRaised = (leftWrist[2] > 0.5 && leftWrist[0] < avgShoulderY) || 
                       (rightWrist[2] > 0.5 && rightWrist[0] < avgShoulderY);
    
    if (handRaised) {
      // If this is the first frame with hand raised, start the timer
      if (calibrationStartTime === 0) {
        calibrationStartTime = Date.now();
        
        // Initialize calibration data arrays
        calibrationShoulders = [];
        calibrationHips = [];
        calibrationBodyHeights = [];
      }
      
      // Collect calibration data
      calibrationShoulders.push(avgShoulderY);
      
      // Get hip positions if available
      if (leftHip[2] > 0.3 && rightHip[2] > 0.3) {
        const avgHipY = (leftHip[0] + rightHip[0]) / 2;
        calibrationHips.push(avgHipY);
        
        // Calculate body height
        const currentBodyHeight = Math.abs(avgShoulderY - avgHipY);
        calibrationBodyHeights.push(currentBodyHeight);
      }
      
      // Calculate elapsed time and update progress
      const elapsedTime = Date.now() - calibrationStartTime;
      calibrationProgress = Math.min(100, (elapsedTime / 3000) * 100);
      progressBar.style.width = `${calibrationProgress}%`;
      
      // Check if calibration is complete
      if (calibrationProgress >= 100) {
        calibrated = true;
        statusText.textContent = 'Calibration complete! You can now control the game with your movements.';
        
        // Calculate baselines from collected data
        shoulderBaseline = average(calibrationShoulders);
        hipBaseline = average(calibrationHips);
        bodyHeight = average(calibrationBodyHeights);
        
        // Calculate thresholds - only one jump threshold at 20%
        jumpThreshold = bodyHeight * 0.20;   // 20% of body height
        duckThreshold = bodyHeight * -0.50;  // 50% of body height below
        
        // Hide the entire instructions container instead of just the elements inside it
        instructionsContainer.style.display = 'none';
        
        toggleButton.textContent = 'Play with computer controls';
        
        // Change overlay background to transparent
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        
        // Try to focus the game element
        focusGameElement();
        
        console.log("Calibration complete!");
        console.log("Shoulder baseline:", shoulderBaseline);
        console.log("Body height:", bodyHeight);
        console.log("Jump threshold:", jumpThreshold);
        console.log("Duck threshold:", duckThreshold);
      }
    } else {
      // Reset if hand is lowered
      calibrationStartTime = 0;
      calibrationProgress = 0;
      progressBar.style.width = '0%';
      calibrationShoulders = [];
      calibrationHips = [];
      calibrationBodyHeights = [];
    }
  }
  
  function average(arr) {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }
  
  function controlGameMoveNet(pose) {
    // Get relevant keypoints
    const nose = pose[0];
    const leftShoulder = pose[5];
    const rightShoulder = pose[6];
    const leftWrist = pose[9];
    const rightWrist = pose[10];
    const leftHip = pose[11];
    const rightHip = pose[12];
    
    // Only proceed if shoulders and nose are detected with good confidence
    if (leftShoulder[2] > 0.5 && rightShoulder[2] > 0.5 && nose[2] > 0.5) {
      const currentTime = Date.now();
      
      // Calculate midpoint of shoulders for left/right movement
      const shoulderMidpointX = (leftShoulder[1] + rightShoulder[1]) / 2;
      const avgShoulderY = (leftShoulder[0] + rightShoulder[0]) / 2;
      
      // Define the three sections of the screen
      const leftThreshold = 1/3;
      const rightThreshold = 2/3;
      
      // Determine which zone the player is currently in
      // NOTE: We're inverting the zones here to fix the control direction
      let newPositionZone;
      if (shoulderMidpointX < leftThreshold) {
        // When player is in the left third of the screen, they should move right
        newPositionZone = 'right';
      } else if (shoulderMidpointX > rightThreshold) {
        // When player is in the right third of the screen, they should move left
        newPositionZone = 'left';
      } else {
        newPositionZone = 'middle';
      }
      
      // Only send input when crossing boundaries between zones
      if (newPositionZone !== currentPositionZone) {
        console.log(`Zone change: ${currentPositionZone} -> ${newPositionZone}`);
        
        // Handle zone transitions
        if (newPositionZone === 'left') {
          // Moving to left zone
          simulateKeyPress('ArrowLeft');
          statusText.textContent = 'Action: Move Left';
          lastCommand = 'left';
          lastCommandTime = currentTime;
        } else if (newPositionZone === 'right') {
          // Moving to right zone
          simulateKeyPress('ArrowRight');
          statusText.textContent = 'Action: Move Right';
          lastCommand = 'right';
          lastCommandTime = currentTime;
        } else if (newPositionZone === 'middle') {
          // Moving from left to middle - send right input
          if (currentPositionZone === 'left') {
            simulateKeyPress('ArrowRight');
            statusText.textContent = 'Action: Move Right (from left)';
            lastCommand = 'right_from_left';
            lastCommandTime = currentTime;
          } 
          // Moving from right to middle - send left input
          else if (currentPositionZone === 'right') {
            simulateKeyPress('ArrowLeft');
            statusText.textContent = 'Action: Move Left (from right)';
            lastCommand = 'left_from_right';
            lastCommandTime = currentTime;
          }
        }
        
        // Update the current position zone
        currentPositionZone = newPositionZone;
      } else {
        // If we're in the same zone, update the status text but don't send inputs
        if (currentPositionZone === 'left') {
          statusText.textContent = 'Position: Left';
        } else if (currentPositionZone === 'right') {
          statusText.textContent = 'Position: Right';
        } else {
          statusText.textContent = 'Position: Middle';
        }
      }
      
      // NEW CONTROL: Jump action (ArrowUp) - both shoulders above jump threshold
      if (avgShoulderY < shoulderBaseline - jumpThreshold) {
        if (lastCommand !== 'jump' || currentTime - lastCommandTime > commandCooldown) {
          simulateKeyPress('ArrowUp');
          statusText.textContent = 'Action: Jump (ArrowUp)';
          lastCommand = 'jump';
          lastCommandTime = currentTime;
        }
      }
      
      // NEW CONTROL: Space bar - one hand raised above nose level
      const leftHandAboveNose = leftWrist[2] > 0.5 && leftWrist[0] < nose[0];
      const rightHandAboveNose = rightWrist[2] > 0.5 && rightWrist[0] < nose[0];
      
      if ((leftHandAboveNose || rightHandAboveNose) && !(leftHandAboveNose && rightHandAboveNose)) {
        if (lastCommand !== 'space' || currentTime - lastCommandTime > commandCooldown) {
          simulateKeyPress(' '); // Space key
          statusText.textContent = 'Action: Space';
          lastCommand = 'space';
          lastCommandTime = currentTime;
        }
      }
      
      // NEW CONTROL: Pause - both hands raised above nose level
      if (leftHandAboveNose && rightHandAboveNose) {
        if (lastCommand !== 'pause' || currentTime - lastCommandTime > commandCooldown) {
          simulateKeyPress('p'); // Assuming 'p' is the pause key
          statusText.textContent = 'Action: Pause';
          lastCommand = 'pause';
          lastCommandTime = currentTime;
        }
      }
      
      // Duck action - shoulders below duck threshold
      if (avgShoulderY > shoulderBaseline - duckThreshold) {
        if (lastCommand !== 'duck' || currentTime - lastCommandTime > commandCooldown) {
          simulateKeyPress('ArrowDown');
          statusText.textContent = 'Action: Duck';
          lastCommand = 'duck';
          lastCommandTime = currentTime;
        }
      }
    }
  }
  
  function simulateKeyPress(key) {
    // Try multiple approaches to ensure the key press is recognized
    
    // 1. Try to find the Unity canvas/container
    const unityCanvas = document.querySelector('canvas');
    const unityContainer = document.getElementById('unity-container') || 
                           document.querySelector('[id*="unity"]') ||
                           document.querySelector('.webgl-content');
    
    // 2. Create standard keyboard events
    const keyDownEvent = new KeyboardEvent('keydown', {
      key: key,
      code: key === ' ' ? 'Space' : (key.startsWith('Arrow') ? key : `Key${key.toUpperCase()}`),
      keyCode: key === ' ' ? 32 : (key === 'ArrowLeft' ? 37 : key === 'ArrowUp' ? 38 : key === 'ArrowRight' ? 39 : key === 'ArrowDown' ? 40 : key.charCodeAt(0)),
      which: key === ' ' ? 32 : (key === 'ArrowLeft' ? 37 : key === 'ArrowUp' ? 38 : key === 'ArrowRight' ? 39 : key === 'ArrowDown' ? 40 : key.charCodeAt(0)),
      bubbles: true,
      cancelable: true,
      view: window
    });
    
    // 3. Try to access the Unity instance directly
    if (window.unityInstance) {
      console.log('Found Unity instance, sending input directly');
      try {
        // Try to send input directly to Unity
        if (key === ' ') {
          window.unityInstance.SendMessage('GameController', 'Jump');
        } else if (key === 'ArrowLeft') {
          window.unityInstance.SendMessage('GameController', 'MoveLeft');
        } else if (key === 'ArrowRight') {
          window.unityInstance.SendMessage('GameController', 'MoveRight');
        } else if (key === 'ArrowDown') {
          window.unityInstance.SendMessage('GameController', 'Duck');
        }
      } catch (e) {
        console.log('Error sending direct message to Unity:', e);
      }
    }
    
    // 4. Try to use the Poki bridge if available
    if (window.PokiSDK) {
      console.log('Found PokiSDK, trying to use it for input');
      try {
        if (window.pokiBridge) {
          if (key === ' ') {
            window.unityGame.SendMessage(window.pokiBridge, 'Jump');
          } else if (key === 'ArrowLeft') {
            window.unityGame.SendMessage(window.pokiBridge, 'MoveLeft');
          } else if (key === 'ArrowRight') {
            window.unityGame.SendMessage(window.pokiBridge, 'MoveRight');
          } else if (key === 'ArrowDown') {
            window.unityGame.SendMessage(window.pokiBridge, 'Duck');
          }
        }
      } catch (e) {
        console.log('Error using Poki bridge:', e);
      }
    }
    
    // 5. Dispatch events to all possible targets
    document.dispatchEvent(keyDownEvent);
    window.dispatchEvent(keyDownEvent);
    
    if (unityCanvas) {
      unityCanvas.dispatchEvent(keyDownEvent);
      // Also try to focus the canvas first
      unityCanvas.focus();
    }
    
    if (unityContainer) {
      unityContainer.dispatchEvent(keyDownEvent);
    }
    
    // 6. Try to use document.activeElement
    if (document.activeElement) {
      document.activeElement.dispatchEvent(keyDownEvent);
    }
    
    // 7. Create and dispatch a more basic event as fallback
    const fallbackEvent = {
      keyCode: key === ' ' ? 32 : (key === 'ArrowLeft' ? 37 : key === 'ArrowUp' ? 38 : key === 'ArrowRight' ? 39 : key === 'ArrowDown' ? 40 : key.charCodeAt(0)),
      preventDefault: function() {}
    };
    
    // Try to find any game-related event handlers
    if (window.handleKeyDown) {
      window.handleKeyDown(fallbackEvent);
    }
    
    // Release key after a short delay
    setTimeout(() => {
      const keyUpEvent = new KeyboardEvent('keyup', {
        key: key,
        code: key === ' ' ? 'Space' : (key.startsWith('Arrow') ? key : `Key${key.toUpperCase()}`),
        keyCode: key === ' ' ? 32 : (key === 'ArrowLeft' ? 37 : key === 'ArrowUp' ? 38 : key === 'ArrowRight' ? 39 : key === 'ArrowDown' ? 40 : key.charCodeAt(0)),
        which: key === ' ' ? 32 : (key === 'ArrowLeft' ? 37 : key === 'ArrowUp' ? 38 : key === 'ArrowRight' ? 39 : key === 'ArrowDown' ? 40 : key.charCodeAt(0)),
        bubbles: true,
        cancelable: true,
        view: window
      });
      
      document.dispatchEvent(keyUpEvent);
      window.dispatchEvent(keyUpEvent);
      
      if (unityCanvas) {
        unityCanvas.dispatchEvent(keyUpEvent);
      }
      
      if (unityContainer) {
        unityContainer.dispatchEvent(keyUpEvent);
      }
      
      if (document.activeElement) {
        document.activeElement.dispatchEvent(keyUpEvent);
      }
      
      if (window.handleKeyUp) {
        window.handleKeyUp(fallbackEvent);
      }
    }, 100);
    
    console.log(`Simulated key press: ${key}`);
  }

  // Add a direct keyboard event handler to help debug
  document.addEventListener('keydown', function(event) {
    console.log('Key pressed:', event.key);
  });

  // Add this new function
  function focusGameElement() {
    // Try to find and focus the game canvas or container
    const gameCanvas = document.querySelector('canvas');
    const gameContainer = document.getElementById('unity-container') || 
                         document.querySelector('[id*="unity"]') ||
                         document.querySelector('.webgl-content');
    
    if (gameCanvas) {
      console.log('Found game canvas, focusing it');
      gameCanvas.focus();
    } else if (gameContainer) {
      console.log('Found game container, focusing it');
      gameContainer.focus();
    }
    
    // Also try to click on the canvas to ensure it has focus
    if (gameCanvas) {
      const centerX = gameCanvas.width / 2;
      const centerY = gameCanvas.height / 2;
      
      try {
        // Create and dispatch a mouse click event
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: centerX,
          clientY: centerY
        });
        
        gameCanvas.dispatchEvent(clickEvent);
      } catch (e) {
        console.log('Error simulating click on canvas:', e);
      }
    }
  }

  // Add this after the document is loaded
  window.addEventListener('load', function() {
    // Try to hook into the game's input system
    hookIntoGameInput();
  });

  function hookIntoGameInput() {
    // Wait a bit for the game to initialize
    setTimeout(() => {
      console.log('Attempting to hook into game input system...');
      
      // Try to find Unity instance
      if (window.unityInstance) {
        console.log('Found Unity instance');
      } else if (window.unityGame) {
        console.log('Found Unity game');
      }
      
      // Try to find any input-related functions
      const possibleInputHandlers = [
        'handleKeyDown',
        'onKeyDown',
        'keyDown',
        'processInput',
        'handleInput'
      ];
      
      for (const handler of possibleInputHandlers) {
        if (typeof window[handler] === 'function') {
          console.log(`Found input handler: ${handler}`);
        }
      }
      
      // Check for iframe and try to access its content
      const iframes = document.querySelectorAll('iframe');
      if (iframes.length > 0) {
        console.log(`Found ${iframes.length} iframes, trying to access content`);
        
        for (const iframe of iframes) {
          try {
            const iframeWindow = iframe.contentWindow;
            if (iframeWindow && iframeWindow.document) {
              console.log('Successfully accessed iframe content');
              
              // Try to find game canvas in iframe
              const iframeCanvas = iframeWindow.document.querySelector('canvas');
              if (iframeCanvas) {
                console.log('Found canvas in iframe');
                window.gameIframe = iframe;
                window.gameIframeCanvas = iframeCanvas;
              }
            }
          } catch (e) {
            console.log('Error accessing iframe content:', e);
          }
        }
      }
    }, 2000);
  }

  // Create a controls button to toggle instructions display
  const controlsButton = document.createElement('button');
  controlsButton.textContent = 'Controls';
  controlsButton.style.position = 'fixed';
  controlsButton.style.bottom = '330px';
  controlsButton.style.right = '240px'; // Position it to the left of the toggle button
  controlsButton.style.padding = '10px 15px';
  controlsButton.style.backgroundColor = '#4CAF50';
  controlsButton.style.color = 'white';
  controlsButton.style.border = 'none';
  controlsButton.style.borderRadius = '5px';
  controlsButton.style.cursor = 'pointer';
  controlsButton.style.fontWeight = 'bold';
  controlsButton.style.zIndex = '100000';
  controlsButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

  // Create a container for the controls instructions that can be toggled
  const controlsInstructionsContainer = document.createElement('div');
  controlsInstructionsContainer.style.position = 'fixed';
  controlsInstructionsContainer.style.top = '50%';
  controlsInstructionsContainer.style.left = '50%';
  controlsInstructionsContainer.style.transform = 'translate(-50%, -50%)';
  controlsInstructionsContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
  controlsInstructionsContainer.style.padding = '20px';
  controlsInstructionsContainer.style.borderRadius = '10px';
  controlsInstructionsContainer.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
  controlsInstructionsContainer.style.zIndex = '100001';
  controlsInstructionsContainer.style.maxWidth = '400px';
  controlsInstructionsContainer.style.width = '90%';
  controlsInstructionsContainer.style.display = 'none'; // Hidden by default

  // Add a close button to the controls instructions
  const closeControlsButton = document.createElement('button');
  closeControlsButton.textContent = '×';
  closeControlsButton.style.position = 'absolute';
  closeControlsButton.style.top = '10px';
  closeControlsButton.style.right = '10px';
  closeControlsButton.style.backgroundColor = 'transparent';
  closeControlsButton.style.border = 'none';
  closeControlsButton.style.fontSize = '24px';
  closeControlsButton.style.cursor = 'pointer';
  closeControlsButton.style.color = '#333';
  closeControlsButton.style.width = '30px';
  closeControlsButton.style.height = '30px';
  closeControlsButton.style.lineHeight = '30px';
  closeControlsButton.style.textAlign = 'center';
  closeControlsButton.style.padding = '0';

  // Add a title to the controls instructions
  const controlsTitle = document.createElement('h2');
  controlsTitle.textContent = 'Motion Controls';
  controlsTitle.style.marginTop = '0';
  controlsTitle.style.marginBottom = '15px';
  controlsTitle.style.color = '#333';
  controlsTitle.style.fontSize = '24px';
  controlsTitle.style.textAlign = 'center';

  // Clone the instructions3 content for the controls popup
  const controlsContent = document.createElement('div');
  controlsContent.innerHTML = `
  <strong>Controls:</strong><br>
  • Move left/right: Lean body left/right<br>
  • Jump (ArrowUp): Raise both shoulders above jump line<br>
  • Action (Space): Raise one hand above nose level<br>
  • Pause: Raise both hands above nose level<br>
  • Duck: Lower shoulders below duck line
  `;
  controlsContent.style.fontSize = '16px';
  controlsContent.style.lineHeight = '1.6';
  controlsContent.style.color = '#333';

  // Assemble the controls instructions container
  controlsInstructionsContainer.appendChild(closeControlsButton);
  controlsInstructionsContainer.appendChild(controlsTitle);
  controlsInstructionsContainer.appendChild(controlsContent);

  // Update the event listener to toggle the controls instructions
  controlsButton.addEventListener('click', function() {
    if (controlsInstructionsContainer.style.display === 'none') {
      controlsInstructionsContainer.style.display = 'block';
    } else {
      controlsInstructionsContainer.style.display = 'none';
    }
  });

  // Add event listener to close the controls instructions
  closeControlsButton.addEventListener('click', function() {
    controlsInstructionsContainer.style.display = 'none';
  });

  // Add the controls button and instructions container to the document
  document.body.appendChild(controlsButton);
  document.body.appendChild(controlsInstructionsContainer);
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