// Click and drag the mouse to view the scene from different angles.
let viewer;

let landmarkTable;

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

function loadData(table) {
  landmarks = [];
  let tableRows = table.getRows();
  for (let row of tableRows) {
    // Get position, diameter, name,
    let x = row.getNum('x');
    let y = row.getNum('y');
    let radius = row.getNum('radius');
    let name = row.getString('name');

    // Put object in array
    bubbles.push(new Bubble(x, y, radius, name));
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
  for (let index = 0; index < points.length; index++) {
    if (index) {
      drawPoint(points[index]);
    }
    drawConnections(index);
    
  }
}

function drawPoint(array) {
  push();
  fill("black");
  translate(array[0]*width,array[1]*height,array[2]*width);
  sphere(5);
  pop();
}

function drawConnections(index) {
  push();
  strokeWeight(5);
  let theConnections = connections[index];
  for (let otherPoint of theConnections) {
    line(points[index][0]*width, points[index][1]*height, points[index][2]*width, points[otherPoint][0]*width, points[otherPoint][1]*height, points[otherPoint][2]*width);
    // line(points[index][0]*width, points[index][1]*height, points[index][2]*width, 0, 0, 0);
    console.log(points[otherPoint][0]*width);
  }
  pop();
}
