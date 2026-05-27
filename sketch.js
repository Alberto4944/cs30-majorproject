// Click and drag the mouse to view the scene from different angles.
let viewer;
let landmarks = [];
let frame = 0;
let lastFrame = 0;
let frameInterval;
let myFont;

const FRAME_RATE = 60;
let THE_SCALE = 0.25;

let firstNoseFrame = 0;
let slider;
let state = "IMPORT CSV";
// ALL STATES:
// MENU - User selects either 3d viewer or all data viewer
// 
let autoPlay = true;
let playbackPaused = false;
let landmarkNodes = [];

// MAIN MENU
let menuButtons = [];
let threeDMenuButton;
let datasetViewerMenuButton;

// 3D VIEWER MENU

// DARK MODE
let darkModeToggleButton;
let darkModeColor;
let lightModeColor ;
let buttonDarkModeColor;
let buttonLightModeColor;
let currentButtonColor;

// THEME SETTINGS
let darkModeEnabled = true;
let foregroundColor = "import"; // Either white or black, depending if dark mode is enabled or not
let backgroundColor = darkModeColor;

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

class LandmarkNode {
  constructor(x,y,z, landmarkIndex) {
    this.x = x * width;
    this.y = y * height;
    this.z = z * width / 2;
    this.connections = connections[landmarkIndex];
  }

  drawConnection(otherNode) {
    strokeWeight(10*THE_SCALE);
    line(this.x, this.y, -this.z, otherNode.x, otherNode.y, -otherNode.z);
  }
}

class Button {
  constructor(x, y, buttonText, backgroundColor, buttonWidth, buttonHeight, borderRadius) {
    this.x = x-width/2;
    this.y = y-height/2;
    this.buttonText = buttonText;
    this.backgroundColor = backgroundColor;
    this.selectedColor = color(red(backgroundColor)-10, green(backgroundColor)-10, blue(backgroundColor)-10);
    this.buttonWidth = buttonWidth;
    this.buttonHeight = buttonHeight;
    this.borderRadius = borderRadius; 
    this.buttonTextColor = foregroundColor;
  }

  drawButton() {
    noStroke();
    rectMode(CENTER);

    if (this.isSelected()) {
      console.log("IN");
      fill(this.selectedColor);
    }
    else {
      fill(this.backgroundColor);
    }
    rect(this.x, this.y, this.buttonWidth, this.buttonHeight, this.borderRadius, this.borderRadius, this.borderRadius, this.borderRadius);
    this.drawText();
  }

  drawText() {
    textFont(myFont);
    fill(this.buttonTextColor);
    textAlign(CENTER);
    textSize(this.buttonHeight/6);
    text(this.buttonText, this.x, this.y);
  }
  
  isSelected() {
    let w = this.buttonWidth/2;
    let h = this.buttonHeight/2;
    if (mouseX - width/2 > this.x - w && mouseX - width/2 < this.x + w && mouseY - height/2 > this.y - h && mouseY - height/2 < this.y + h) {
      return true;
    }
    return false;
  }
}

let noseX;
let noseY;
let noseZ;

function preload() {
  myFont = loadFont('fonts/Montserrat-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  darkModeColor = color(16,18,17);
  lightModeColor = color(255,255,255);
  buttonDarkModeColor = color(35, 37, 36);
  buttonLightModeColor = color(220);

  fill("white");
  input = createFileInput(handleFile);
  input.position(width*0.45, height*0.55); 
  input.style('z-index', '10');

  // frameInterval = 1000/FRAME_RATE;
  // textFont(myFont);

  // ALL BUTTONS HAVE THEIR ORIGIN AT TOP-LEFT CORNER (0,0)
  menuButtons.push(new Button(width*0.4, height*0.6, "3D Viewer", buttonDarkModeColor, width/6, width/9, 20));
  menuButtons.push(new Button(width*0.6, height*0.6, "Dataset Viewer", buttonDarkModeColor, width/6, width/9, 20));
  darkModeToggleButton = new Button(0.97*width, 0.06*height, "Dark/Light", color(255,255,255), width/25, width/25, 15);
}

function handleFile(file) {
  // While looking at importing CSV files online, I found that it would be easier to parse the files rather than read them like tables. I got a whole bunch of errors when trying to import, so I found that parsing works way faster and is overall better
  if (file.type === 'comma-separated-values' || file.name.endsWith('.csv')) {
    let rawText = file.data;

    let rows = rawText.split('\n');

    if (rows.length === 0 || rows[0].split(',').length < 99) {
      return;
    }
    // For each row (frame), parse the values and add it it the main landmarks array
    for (let row = 0; row < rows.length; row++) {
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
      landmarks.push(current_landmarks);
    }
    // This is to put the origin to be the nose, so it looks better for the user
    firstNoseFrame = findFirstFrameWithNose();
    firstNoseFrame = findFirstFrameWithNose();
    state = "MAIN MENU";  

    // makeSlider(landmarks);
  } 
  else {
    alert("Please upload a valid CSV file.");
  }
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
  updateTheme();
  background(backgroundColor);
  darkModeToggleButton.drawButton();
  if (state === "IMPORT CSV") {
    importCSV();
  }
  else if (state === "MAIN MENU") {
    mainMenu();
  }
  else if (state === "3D VIEWER") {
    orbitControl();
    threeDViewer();
  }
  else if (state === "DATASET VIEWER") {
    datasetViewer();
  }
}

function threeDViewer() {
  scale(THE_SCALE);
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

  push();
  fill("black");
  text(`Frame: ${frame+1}/${landmarks.length} or ${Math.round((frame+1) / FRAME_RATE * 10) / 10}/${Math.round(landmarks.length / FRAME_RATE * 10) / 10}s`, 400, 150);
  pop();

  drawConnections(frame);
}

function drawConnections(frame) {
  landmarkNodes = [];
  for (let nodeIndex = 0; nodeIndex < landmarks[0].length; nodeIndex++) {
    landmarkNodes.push(new LandmarkNode(landmarks[frame][nodeIndex][0], landmarks[frame][nodeIndex][1], landmarks[frame][nodeIndex][2], nodeIndex));
  }
  for (let node of landmarkNodes) {
    for (let otherIndex of node.connections) {
      node.drawConnection(landmarkNodes[otherIndex]);
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

// function repaint() {
//   push();
//   fill("black");
//   text(`Targeted Frame Rate: ${input.value()}`, 200, 150);
//   pop();
//   FRAME_RATE = int(input.value());
// }

function mainMenu() {
  input.hide();
  fill(foregroundColor);
  textSize(width*0.03);
  text(`Next, select if you want to view the coordinates
in 3D or view it in a regular table/chart form.`, 0, height*-0.15);
  for (let button of menuButtons) {
    button.drawButton();
  }
}

function datasetMenu() {

}

function datasetViewer() {

}

function threeDViewerMenu() {

}

function mouseClicked() {
  if (darkModeToggleButton.isSelected()) {
    darkModeEnabled = !darkModeEnabled;
  }
  if (state === "MAIN MENU") {
    for (let btn of menuButtons) {
      if (btn.isSelected()) {
        if (btn.buttonText === "3D Viewer") {
          state = "3D VIEWER";
        }
      }
    }
  }
}

function updateTheme() {
  if (darkModeEnabled) {
    backgroundColor = darkModeColor;
    foregroundColor = color(255);
    currentButtonColor = buttonDarkModeColor;
    darkModeToggleButton.backgroundColor = color(255);
    darkModeToggleButton.buttonTextColor = color(0);
    darkModeToggleButton.buttonText = "Light Mode";
  }
  else {
    backgroundColor = lightModeColor;
    foregroundColor = color(0);
    currentButtonColor = buttonLightModeColor;
    darkModeToggleButton.backgroundColor = color(0);
    darkModeToggleButton.buttonTextColor = color(255);
    darkModeToggleButton.buttonText = "Dark Mode";
  }
  darkModeToggleButton.selectedColor = color(red(darkModeToggleButton.backgroundColor)-10, green(darkModeToggleButton.backgroundColor)-10, blue(darkModeToggleButton.backgroundColor)-10);

  for (let button of menuButtons) {
    button.backgroundColor = currentButtonColor;
    button.selectedColor = color(red(currentButtonColor)-10, green(currentButtonColor)-10, blue(currentButtonColor)-10);
    if (darkModeEnabled) {
      button.buttonTextColor = color(255);
    }
    else {
      button.buttonTextColor = color(0);
    }
  }
}

function importCSV() {
  input.show();
  textSize(width*0.02);
  fill(buttonLightModeColor);
  rect(0, height*0.06, width*0.12, height*0.05, 30);
  fill(foregroundColor);
  text(`Welcome to the table tennis AI-assisted coaching
web-viewer made by Albert Wu for a CS30 SDS!
If not done already, play around with the python program,
where you will be able to export a pose_landmarks.csv
file, so you can import it here. Then, you can select
either to visualize in 3D or view the full dataset in a 
user-friendly way. Begin by importing the CSV file.`, 0, -height*0.3);
}