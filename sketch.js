// Click and drag the mouse to view the scene from different angles.
let viewer;
let landmarkTable;
let landmarks = [];
let frame = 0;
let lastFrame = 0;
let frameInterval = 1000/30;

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

function preload() {
  landmarkTable = loadTable('/assets/pose_landmarks.csv', 'csv', loadData);
}

function loadData(landmarkTable) {
  let rowCount = landmarkTable.getRowCount();
  let colCount = landmarkTable.getColumnCount();
  
  for (let row = 0; row < rowCount; row++) {
    let current_landmarks = [];
    for (let col = 0; col < colCount; col+=3) {
      current_landmarks.push([landmarkTable.getNum(row, col), landmarkTable.getNum(row, col+1), landmarkTable.getNum(row, col+2)]);
    }
    landmarks.push(current_landmarks);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // viewer = createGraphics(500, 500, WEBGL);
}

function draw() {
  scale(theScale);
  // clear();
  background(220);
  // orbitControl();
  rotationY+=0.005;
  rotateY(rotationY);
  if (millis() > lastFrame + frameInterval) {
    lastFrame = millis();
    frame++;
  }
  for (let index = 0; index < landmarks[frame].length; index++) {
    if (index > 10) {
      drawConnections(frame, index);
    }
    else if (index === 0) {
      push();
      fill("black");
      sphere(150);
      pop();
    }
    
  }
}

function drawConnections(frame, index) {
  push();
  translate(-landmarks[frame][0][0]*width,-landmarks[frame][0][1]*height,-landmarks[frame][0][2]*width/-250);
  strokeWeight(10*theScale);
  let theConnections = connections[index];
  for (let otherPoint of theConnections) {
    line(landmarks[frame][index][0]*width, landmarks[frame][index][1]*height, landmarks[frame][index][2]*width/3, landmarks[frame][otherPoint][0]*width, landmarks[frame][otherPoint][1]*height, landmarks[frame][otherPoint][2]*width/3);
    // line(points[index][0]*width, points[index][1]*height, points[index][2]*width, 0, 0, 0);
  }
  pop();
}

function mouseWheel(event) {
  if (event.delta > 0) {
    theScale+=0.1;
  } 
  else {
    if (theScale > 0.15) {
      theScale-=0.1;
    }
  }
}