// Click and drag the mouse to view the scene from different angles.
let viewer;

let landmarkTable;

let landmarks = [];

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
  console.log(connections[0].length);
  
}

function draw() {
  background(200);
  orbitControl();
  for (let frame = 0; frame < landmarks.length; frame++) {
    for (let index = 0; index < landmarks[frame].length; index++) {
      drawPoint(landmarks[frame][index]);
      drawConnections(frame, index);
    
    }
  }
}

function drawPoint(array) {
  push();
  fill("black");
  translate(array[0]*width,array[1]*height,array[2]*width);
  sphere(5);
  pop();
}

function drawConnections(frame, index) {
  push();
  strokeWeight(5);
  let theConnections = connections[index];
  for (let otherPoint of theConnections) {
    line(landmarks[frame][index][0]*width, landmarks[frame][index][1]*height, landmarks[frame][index][2]*width, landmarks[frame][otherPoint][0]*width, landmarks[frame][otherPoint][1]*height, landmarks[frame][otherPoint][2]*width);
    // line(points[index][0]*width, points[index][1]*height, points[index][2]*width, 0, 0, 0);
    console.log(landmarks[frame][otherPoint][0]*width);
  }
  pop();
}