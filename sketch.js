// Click and drag the mouse to view the scene from different angles.
let viewer;
let landmarks = [];
let frame = 0;
let lastFrame = 0;
let frameInterval;
let myFont;
let otherCanvas;

// had a merge conflcit, will fix later (i just did some work on the menu screen)

// let input;

const FRAME_RATE = 60;
let THE_SCALE = 0.25;

let firstNoseFrame = 0;
let slider;
let inputState = "import-csv";
let autoPlay = true;
let playbackPaused = false;

let connections = [
  [2, 5], // 0: Nose
  [2], // 1: Left Eye (inner)
  [0, 7], // 2: Left Eye
  [2], // 3: left Eye (outer)
  [5], // 4: Right Eye (inner)
  [0, 8], // 5: Right Eye
  [5], // 6: Right Eye (outer)
  [2], // 7: Left Ear
  [5], // 8: Right Ear
  [10], // 9: Mouth (left)
  [9], // 10: Mouth (right)
  [12, 13, 23], // 11: Left Shoulder
  [11, 14, 24 ], // 12: Right Shoulder
  [11, 15], // 13: Left Elbow
  [12, 16], // 14: Right Elbow
  [13, 17, 19, 21], // 15: Left Wrist
  [14, 18, 20, 22], // 16: Right Wrist
  [15, 19], // 17: Left Pinky
  [16, 20], // 18: Right Pinky
  [15, 17], // 19: Left Index
  [16, 18], // 20: Right Index
  [15], // 21: left Thumb
  [16], // 22: Right Thumb
  [11, 24, 25], // 23: Left Hip
  [12, 23, 26], // 24: Right Hip
  [23, 27], // 25: Left Knee
  [24, 28], // 26: Right Knee
  [25, 29], // 27: Left Ankle
  [26, 30], // 28: Right Ankle
  [27, 31], // 29: Left Heel
  [28, 32], // 30: Right Heel
  [27, 29], // 31: Left Foot Index
  [28, 30] // 32: Right Foot Index
];

let noseX;
let noseY;
let noseZ;

function preload() {
  myFont = loadFont('fonts/Montserrat-Regular.ttf');
}

function handleFile(file) {
  // While looking at importing CSV files online, I found that it would be easier to parse the files rather than read them like tables. I got a whole bunch of errors when trying to import, so I found that parsing works way faster and is overall better
  if (file.type === 'comma-separated-values' || file.name.endsWith('.csv')) {
    // Converts the csv file into readable p5js data
    let rawText = file.data;

    // Split file into rows by finding every line and splitting it there
    let rows = rawText.split('\n');

    // Makes sure there at least 1 row and that there is 99 collumns
    if (rows.length === 0 || rows[0].split(',').length < 99) {
      return;
    }

    // For each row (frame), parse the values and add it it the main landmarks array
    for (let row = 0; row < rows.length; row++) {
      // Let current landmarks as well as split all values in the row
      let current_landmarks = [];
      let cols = rows[row].split(',');

      // Loops through each value and works in groups of 3
      for (let col = 0; col < cols.length; col+=3) {
        current_landmarks.push([
          parseFloat(cols[col]), // Found these functions by looking on the MDN and found this: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
          parseFloat(cols[col+1]), 
          parseFloat(cols[col+2])
          
        ]);
      }
      // Push all current frame landmarks into the main landmarks array
      landmarks.push(current_landmarks);
    }
    // This is to put the origin to be the nose, so it looks better for the user
    firstNoseFrame = findFirstFrameWithNose();
    inputState = "run";  

    // Makes the slider for the frames
    makeSlider(landmarks);
  } 
  else {
    alert("Please upload a valid CSV file.");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // otherCanvas = createGraphics(windowWidth, windowHeight);
  input = createFileInput(handleFile);
  input.position(20, 20); 
  input.style('z-index', '10');
  frameInterval = 1000/FRAME_RATE;
  textFont(myFont);
  textSize(50);
  textAlign(CENTER, CENTER);
  // input = createInput('');
  // input.position(200, 150);
  // input.input(repaint);
}

function keyPressed() {
  if (key === "a") {
    autoPlay = !autoPlay;
    frame = 0;
  }
  else if (key === " ") {
    playbackPaused = !playbackPaused;
  }
}

function draw() {
  background(220);
  if (inputState === "run") {
    scale(THE_SCALE);
    orbitControl();
    if (frame >= landmarks.length-1) {
      frame = 0;
    }
    
    if (!autoPlay) {
      slider.show();
      frame = slider.value();
    }
    
    push();
    rotateX(HALF_PI);
    translate(0,0,-680);
    fill(200, 50, 50, 100);
    plane(1500); 

    
    if (autoPlay && !playbackPaused & millis() > lastFrame + frameInterval) {
      lastFrame = millis();
      frame++;
    }

    pop();

    // drawFrameCount(frame, landmarks, otherCanvas);
    push();
    fill("black");
    text(`Frame: ${frame+1}/${landmarks.length} or ${Math.round((frame+1) / FRAME_RATE * 10) / 10}/${Math.round(landmarks.length / FRAME_RATE * 10) / 10}s`, 400, 150);
    // text(`${landmarks[frame][0][1]}`, 400, 150);
    pop();

    drawConnections(frame);


    
  }
  
}

function drawConnections(frame) {
  if (frame > firstNoseFrame) {
    noseX = landmarks[frame][0][0] * width;
    noseY = landmarks[frame][0][1] * height;
    noseZ = -landmarks[frame][0][2] * width / 2;
  }
  else {
    noseX = landmarks[firstNoseFrame][0][0] * width;
    noseY = landmarks[firstNoseFrame][0][1] * height;
    noseZ = -landmarks[firstNoseFrame][0][2] * width / 2;
  }

  translate(-noseX, -noseY, -noseZ);
  
  if (autoPlay && !playbackPaused & millis() > lastFrame + frameInterval) {
    lastFrame = millis();
    frame++;
  }
  for (let index = 0; index < landmarks[frame].length; index++) {
    if (index > 10) {
      strokeWeight(10*THE_SCALE);
      let theConnections = connections[index];
      for (let otherPoint of theConnections) {
        line(landmarks[frame][index][0]*width, landmarks[frame][index][1]*height, -landmarks[frame][index][2]*height/1.5, landmarks[frame][otherPoint][0]*width, landmarks[frame][otherPoint][1]*height, -landmarks[frame][otherPoint][2]*height/1.5);
      }   
      drawTorso(frame);
      drawPoint(index);
    }
    else if (index === 0) {
      push();
      fill("black");
      translate(landmarks[frame][0][0]*width,landmarks[frame][0][1]*height,-landmarks[frame][0][2]*height-210);
      sphere(50);
      pop();
    }
  }
  
}

function mouseWheel(event) {
  let direction = Math.sign(event.delta);
  if (direction > 0) {
    THE_SCALE+=0.01;
  } 
  else if (direction < 0) {
    THE_SCALE-=0.01;
  }
  THE_SCALE = constrain(THE_SCALE, 0.1, 5.0);
}

function drawTorso() {
  let leftShoulder = landmarks[frame][11];
  let rightShoulder = landmarks[frame][12];
  let leftHip = landmarks[frame][23];
  let rightHip = landmarks[frame][24];

  push();
  fill('black');
  noStroke();
  beginShape();
  vertex(leftShoulder[0]*width, leftShoulder[1]*height, -leftShoulder[2]*height/1.5);
  vertex(rightShoulder[0]*width, rightShoulder[1]*height, -rightShoulder[2]*height/1.5);
  vertex(rightHip[0]*width, rightHip[1]*height, -rightHip[2]*height/1.5);
  vertex(leftHip[0]*width, leftHip[1]*height, -leftHip[2]*height/1.5);
  endShape(CLOSE);
  pop();
}

function findFirstFrameWithNose() {
  for (let frame = 0; frame < landmarks.length; frame++) {
    if (!isNaN(landmarks[frame][0][0])) {
      return frame;
    }
  }
}

function makeSlider() {
  slider = createSlider(0, landmarks.length-1, 0);
  slider.position(width/2-200,100);
  slider.size(400);
  slider.style('z-index', '10');
}

function drawPoint(index) {
  push();
  stroke("red");
  strokeWeight(10);
  point(landmarks[frame][index][0]*width, landmarks[frame][index][1]*height, -landmarks[frame][index][2]*height/1.5);
  pop();
}

function repaint() {
  push();
  fill("black");
  text(`Targeted Frame Rate: ${input.value()}`, 200, 150);
  pop();
  FRAME_RATE = int(input.value());
}

