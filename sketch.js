// Click and drag the mouse to view the scene from different angles.
let viewer;
let landmarkTable;
let landmarks = [];
let frame = 0;
let lastFrame = 0;
let frameInterval = 1000/60;

let firstNoseFrame = 0;

let inputState = "import-csv";

let theScale = 0.25;

let rotationY = 0;

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

// function preload() {
//   landmarkTable = loadTable('/assets/pose_landmarks.csv', 'csv', loadData);
// }

// function loadData(landmarkTable) {
//   let rowCount = landmarkTable.getRowCount();
//   let colCount = landmarkTable.getColumnCount();
  
//   for (let row = 0; row < rowCount; row++) {
//     let current_landmarks = [];
//     for (let col = 0; col < colCount; col+=3) {
//       current_landmarks.push([
//         landmarkTable.getNum(row, col), 
//         landmarkTable.getNum(row, col+1), 
//         landmarkTable.getNum(row, col+2)]);
//     }
//     landmarks.push(current_landmarks);
//   }
// }

let noseX;
let noseY;
let noseZ;

function handleFile(file) {
  // While looking at importing CSV files online, I found that it would be easier to parse the files rather than read them like tables. I got a whole bunch of errors when trying to import, so I found that parsing works way faster and is overall better
  if (file.type === 'comma-separated-values' || file.name.endsWith('.csv')) {
    let cols;
    landmarks = []; 
    let rawText = file.data;
    
    let rows = rawText.split('\n');

    if (rows.length < 99) {
      return;
    }

    for (let row = 0; row < rows.length; row++) {
      let current_landmarks = [];
      cols = rows[row].split(',');
      for (let col = 0; col < cols.length; col+=3) {
        current_landmarks.push([
          parseFloat(cols[col]), // Found these functions by looking on the MDN and found this: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
          parseFloat(cols[col+1]), 
          parseFloat(cols[col+2])
        ]);
      }
      landmarks.push(current_landmarks);
    }
    firstNoseFrame = findFirstFrameWithNose(landmarks);
    inputState = "run";  
  } 
  else {
    alert("Please upload a valid CSV file.");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  input = createFileInput(handleFile);
  input.position(20, 20); 
  input.style('z-index', '10');
}

function draw() {
  background(220);
  if (inputState === "run") {
    scale(theScale);
    orbitControl();
    if (frame >= landmarks.length-1) {
      frame = 0;
    }

    push();
    rotateX(HALF_PI);
    translate(0,0,-680);
    fill(200, 50, 50, 100);
    plane(1500); 
    pop();

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

    if (millis() > lastFrame + frameInterval) {
      lastFrame = millis();
      frame++;
    }
    for (let index = 0; index < landmarks[frame].length; index++) {
      if (index > 10) {
        drawConnections(frame, index);
        drawTorso(frame);
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
}

function drawConnections(frame, index) {
  strokeWeight(10*theScale);
  let theConnections = connections[index];
  for (let otherPoint of theConnections) {
    line(landmarks[frame][index][0]*width, landmarks[frame][index][1]*height, -landmarks[frame][index][2]*height/1.5, landmarks[frame][otherPoint][0]*width, landmarks[frame][otherPoint][1]*height, -landmarks[frame][otherPoint][2]*height/1.5);
  }
}

function mouseWheel(event) {
  let direction = Math.sign(event.delta);
  if (direction > 0) {
    theScale+=0.01;
  } 
  else if (direction < 0) {
    theScale-=0.01;
  }
  theScale = constrain(theScale, 0.1, 5.0);
}

function drawTorso(frame) {
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

function findFirstFrameWithNose(landmarks) {
  for (let frame = 0; frame < landmarks.length; frame++) {
    if (!isNaN(landmarks[frame][0][0])) {
      return frame;
    }
  }
}