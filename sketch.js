// Computer-Vision Usage in Table Tennis Training Research Project - Javscript Side
// This side of the project was to create a frontend interface for my python programs
// PYTHON GITHUB REPOSITORY: https://github.com/Alberto4944/Research-Methods-20 (STILL WIP, WILL WORK OVER SUMMER)
// Albert Wu
// 2026/06/12

// DECLARE VARIABLES
let landmarks = [];
let frame = 0;
let lastFrame = 0;
let frameInterval;
let regularFont;
let boldFont;

// Frame rate
const FRAME_RATE = 60;

let firstNoseFrame = 0;
let state = "IMPORT CSV";
let autoPlay = true;
let playbackPaused = false;
let landmarkNodes = [];

// MAIN MENU
let menuButtons = [];

// DARK MODE
let darkModeToggleButton;
let darkModeColor;
let lightModeColor ;
let buttonDarkModeColor;
let buttonLightModeColor;
let currentButtonColor;

// THEME SETTINGS
let darkModeEnabled = true;
let foregroundColor = "white"; // Either white or black, depending if dark mode is enabled or not
let backgroundColor = darkModeColor;

// DATASET VIEWER
let datasetHeaders = [];
let datasetRows = [];
let datasetTab = "Table";
let datasetTabButtons = [];
let tableScrollY = 0;
let rowHeight = 28;
let visibleCols = [];
let chartColors = ["#FF6B6B", "#FF8E53", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];

// TIPS SCREEN
let tipsButton;
let tipsEnabled = false;

// EXEMPLAR VIEWER, FOR THE TIPS SCREEN
let exemplarLandmarks = [];
let exemplarFrame = 0;
let lastExemplarFrame = 0;
let currentTipStroke = "None"; // Tracks which stroke details to display
let tipGridButtons = [];

// TABLE DIMENSIONS
const TABLE_LENGTH = 274;
const TABLE_WIDTH = 152.5;
const TABLE_THICKNESS = 10;
const NET_HEIGHT = 15.25;
const TABLE_HEIGHT = 76;

// CAMERA BUTTON
let cameraButton;
let cameraEnabled = false;

// BACK BUTTON
let backButton;

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

// Displays the landmarks and makes connections to all other nodes nearby
class LandmarkNode {
  constructor(x,y,z, landmarkIndex) {
    this.x = x * width;
    this.y = y * height;
    this.z = z * width / 3;
    this.connections = connections[landmarkIndex];
  }

  drawConnection(otherNode) {
    strokeWeight(2.5);
    stroke(foregroundColor);
    line(this.x, this.y, -this.z, otherNode.x, otherNode.y, -otherNode.z);
  }
}

// Creates buttons
class Button {
  constructor(x, y, buttonText, backgroundColor, buttonWidth, buttonHeight, borderRadius, buttonTextSize = 6) {
    this.x = x-width/2;
    this.y = y-height/2;
    this.buttonText = buttonText;
    this.backgroundColor = backgroundColor;
    this.selectedColor = color(red(backgroundColor)-10, green(backgroundColor)-10, blue(backgroundColor)-10);
    this.buttonWidth = buttonWidth;
    this.buttonHeight = buttonHeight;
    this.borderRadius = borderRadius; 
    this.buttonTextColor = foregroundColor;
    this.buttonTextSize = buttonTextSize;
  }

  // Draw button
  drawButton() {
    noStroke();
    rectMode(CENTER);

    if (this.isSelected()) {
      fill(this.selectedColor);
    }
    else {
      fill(this.backgroundColor);
    }
    rect(this.x, this.y, this.buttonWidth, this.buttonHeight, this.borderRadius, this.borderRadius, this.borderRadius, this.borderRadius);
    this.drawText();
  }

  // Draws the text in the button box
  drawText() {
    push();
    fill(this.buttonTextColor);
    textAlign(CENTER, CENTER);
    textSize(this.buttonHeight/this.buttonTextSize);
    
    text(this.buttonText, this.x, this.y);
    pop();
  }
  
  // Returns if the mouse is inside the box / button
  isSelected() {
    let w = this.buttonWidth/2;
    let h = this.buttonHeight/2;
    if (mouseX - width/2 > this.x - w && mouseX - width/2 < this.x + w && mouseY - height/2 > this.y - h && mouseY - height/2 < this.y + h) {
      return true;
    }
    return false;
  }
}

function preload() {
  regularFont = loadFont('fonts/JetBrainsMono-Regular.ttf');
  boldFont = loadFont('fonts/JetBrainsMono-Bold.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Sets the dark and light mode colors
  darkModeColor = color(16,18,17);
  lightModeColor = color(255,255,255);
  buttonDarkModeColor = color(35, 37, 36);
  buttonLightModeColor = color(220);

  // CSV IMPORT FILE BUTTON
  csvImport = createFileInput(loadCSVFile);
  csvImport.position(width*0.44, height*0.55); 
  csvImport.style('z-index', '10');
  
  // Sets the frame rate
  frameInterval = 1000/FRAME_RATE;

  // Set website wide font to my font I chose
  textFont(regularFont);

  // // ALL BUTTONS HAVE THEIR ORIGIN AT TOP-LEFT CORNER (0,0)
  menuButtons.push(new Button(width*0.4, height*0.6, "3D Viewer", buttonDarkModeColor, width/6, width/9, 20));
  menuButtons.push(new Button(width*0.6, height*0.6, "Dataset Viewer", buttonDarkModeColor, width/6, width/9, 20));
  darkModeToggleButton = new Button(0.97*width, 0.06*height, "Dark/Light", color(255,255,255), width/25, width/25, 15);
  tipsButton = new Button(0.97*width, 0.94*height, "Tips", color(255,255,255), width/25, width/25, 15, 4);
  backButton = new Button(0.03*width, 0.94*height, "Back", color(255,255,255), width/25, width/25, 15, 4);
  cameraButton = new Button(0.97*width, 0.18*height, `Rotate
Camera`, color(255,255,255), width/25, width/25, 15, 5);
}

// Loads the exemplar data
function loadExemplarData(fileName, strokeName) {
  // Did this after the loadcsv function, but it follows basically the exact same format
  exemplarLandmarks = [];
  exemplarFrame = 0;
  currentTipStroke = strokeName;
  
  loadStrings("examples/" + fileName, function(rows) {
    if (rows.length === 0) {
      return;
    }
    
    // For each row (frame), parse the values and add it to the exemplar landmarks array
    for (let row = 0; row < rows.length; row++) {
      let current_landmarks = [];
      let cols = rows[row].split(',');

      // Loops through each value and works in groups of 3
      for (let col = 0; col < cols.length; col+=3) {
        current_landmarks.push([
          parseFloat(cols[col]), 
          parseFloat(cols[col+1]), 
          parseFloat(cols[col+2])
        ]);
      }
      exemplarLandmarks.push(current_landmarks);
    }
  });
}

function loadCSVFile(file) {
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

    // Generate column names since pose_landmarks.csv has no header
    datasetHeaders = [];
    for (let i = 0; i < 33; i++) {
      datasetHeaders.push(`lm${i}_x`);
      datasetHeaders.push(`lm${i}_y`);
      datasetHeaders.push(`lm${i}_z`);
    }

    // Store raw rows for the table viewer
    datasetRows = [];
    for (let row = 0; row < rows.length; row++) {
      if (rows[row].trim() === "") {
        continue;
      }
      datasetRows.push(rows[row].split(','));
    }

    // Default visible columns — nose, right wrist, right elbow. WOULD WANT TO MAKE USER CHANGEABLE
    visibleCols = [0, 1, 2, 45, 46, 47, 39, 40, 41];
    state = "MAIN MENU";  

  } 
  else {
    alert("Please upload a valid CSV file.");
  }
}

// Press space to pause
function keyPressed() {
  if (key === " ") {
    playbackPaused = !playbackPaused;
  }
}

function draw() {
  updateTheme();
  background(backgroundColor);

  // MOBILE CHECK, MAKES SURE USER TURNS PHONE TO LANDSCAPE
  if (width < height) {
    drawRotatePrompt();
    return;
  }

  darkModeToggleButton.drawButton();
  tipsButton.drawButton();
  
  if (state === "IMPORT CSV") {
    importCSV();
  }
  else if (state === "MAIN MENU") {
    mainMenu();
  }
  else if (state === "3D VIEWER") {
    // orbitControl();
    cameraButton.drawButton();
    backButton.drawButton();

    // SHOWS THE FRAME COUNT
    push();
    fill(foregroundColor);
    textSize(width/50);
    text(`Frame: ${frame+1}/${landmarks.length} or ${Math.round((frame+1) / FRAME_RATE * 10) / 10}/${Math.round(landmarks.length / FRAME_RATE * 10) / 10}s`, -width/2+width/6, -height/2+50);
    pop();
    push();
    
    // MAKES THE "CAMERA" SIT HIGHER AND LOOK DOWN
    rotateX(-0.1); 

    // AUTO CAMERA 
    if (cameraEnabled) {
      let angle = frameCount * 0.005;
      rotateY(angle);
    }
    else {
      rotateY(Math.PI/3.5);
    }
  
    drawPhysicalTable();
    threeDViewer();
    pop();
  }
  else if (state === "DATASET VIEWER") {
    datasetViewer();
    backButton.drawButton();
  }
  else if (state === "TIPS") {
    tipsScreen();
  }
}

function threeDViewer() {
  scale(0.25);
  
  // DRAWS THE BASE
  push();
  rotateX(HALF_PI);
  translate(0,0,-680);
  fill(currentButtonColor);
  plane(1500); 
  pop();

  if (autoPlay && !playbackPaused & millis() > lastFrame + frameInterval) {
    lastFrame = millis();
    frame++;
    
    if (frame >= landmarks.length-1) {
      frame = 0;
    }
  }

  drawConnections(frame);
}

function drawConnections(frame) {
  // DRAWS THE SKELETON
  landmarkNodes = [];
  for (let nodeIndex = 0; nodeIndex < landmarks[frame].length; nodeIndex++) {
    landmarkNodes.push(new LandmarkNode(landmarks[frame][nodeIndex][0]-0.5, landmarks[frame][nodeIndex][1]-0.2, landmarks[frame][nodeIndex][2], nodeIndex));
  }
  for (let node of landmarkNodes) {
    for (let otherIndex of node.connections) {
      node.drawConnection(landmarkNodes[otherIndex]);
    }
  }
}

function mouseWheel(event) {
  if (state === "DATASET VIEWER") {
    // ALLOWS FOR THE SCROLLING OF THE DATASET TABLE
    tableScrollY += event.delta * 0.5;
    let totalH = datasetRows.length * rowHeight;
    let viewH = height * 0.8;
    tableScrollY = constrain(tableScrollY, 0, max(0, totalH - viewH));
  }
}

function drawTorso() {
  // Draws the torso
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

// Main Menu
function mainMenu() {
  csvImport.hide();
  fill(foregroundColor);
  textSize(width*0.03);
  text(`Next, select if you want to view the coordinates
in 3D or view it in a regular table/chart form.`, 0, height*-0.15);
  for (let button of menuButtons) {
    button.drawButton();
  }
}

// HANDLES ALL MOUSE CLICKS
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
        if (btn.buttonText === "Dataset Viewer") {
          state = "DATASET VIEWER";
        }
      }
    }
  }
  if (state === "DATASET VIEWER") {
    for (let btn of datasetTabButtons) {
      if (btn.isSelected()) {
        datasetTab = btn.buttonText;
        tableScrollY = 0;
      }
    }
  }
  if (tipsButton.isSelected()) {
    if (tipsEnabled) {
      state = previousState;
    }
    if (!tipsEnabled) {
      previousState = state;
      state = "TIPS";
    }
    tipsEnabled = !tipsEnabled;
  }
  if (state === "TIPS") {
    for (let i = 0; i < tipGridButtons.length; i++) {
      let btn = tipGridButtons[i];
      if (btn.isSelected()) {
        if (btn.buttonText === "Forehand") {
          loadExemplarData("forehand_drive.csv", "Forehand");
        }
        if (btn.buttonText === "Backhand") {
          loadExemplarData("backhand_drive.csv", "Backhand");
        }
        if (btn.buttonText === "Loop") {
          loadExemplarData("forehand_loop.csv", "Loop");
        }
        if (btn.buttonText === "Push") {
          loadExemplarData("backspin_push.csv", "Push");
        }
        if (btn.buttonText === "Serve") {
          loadExemplarData("pendulum_serve.csv", "Serve");
        }
      }
    }
  }
  if (cameraButton.isSelected()) {
    cameraEnabled = !cameraEnabled;
  }
  if (backButton.isSelected()) {
    state = "MAIN MENU";
  }
}

// DARK AND LIGHT MODE
function updateTheme() {
  if (darkModeEnabled) {
    backgroundColor = darkModeColor;
    foregroundColor = color(255);
    currentButtonColor = buttonDarkModeColor;
    darkModeToggleButton.backgroundColor = color(255);
    darkModeToggleButton.buttonTextColor = color(0);
    darkModeToggleButton.buttonText = "Light Mode";
    cameraButton.buttonTextColor = color(255);
    backButton.buttonTextColor = color(255);
  }
  else {
    backgroundColor = lightModeColor;
    foregroundColor = color(0);
    currentButtonColor = buttonLightModeColor;
    darkModeToggleButton.backgroundColor = color(0);
    darkModeToggleButton.buttonTextColor = color(255);
    darkModeToggleButton.buttonText = "Dark Mode";
    cameraButton.buttonTextColor = color(0);
    backButton.buttonTextColor = color(0);
  }

  cameraButton.backgroundColor = currentButtonColor;
  cameraButton.selectedColor = color(red(currentButtonColor)-10, green(currentButtonColor)-10, blue(currentButtonColor)-10);

  backButton.backgroundColor = currentButtonColor;
  backButton.selectedColor = color(red(currentButtonColor)-10, green(currentButtonColor)-10, blue(currentButtonColor)-10);
  

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

  for (let button of tipGridButtons) {
    button.backgroundColor = currentButtonColor;
    button.selectedColor = color(red(currentButtonColor)-10, green(currentButtonColor)-10, blue(currentButtonColor)-10);
    if (darkModeEnabled) {
      button.buttonTextColor = color(255);
    }
    else {
      button.buttonTextColor = color(0);
    }
  }

  tipsButton.backgroundColor = currentButtonColor;
  tipsButton.selectedColor = color(red(currentButtonColor)-10, green(currentButtonColor)-10, blue(currentButtonColor)-10);
  if (darkModeEnabled) {
    tipsButton.buttonTextColor = color(255);
  }
  else {
    tipsButton.buttonTextColor = color(0);
  }
}

// IMPORT CSV SCREEN
function importCSV() {
  csvImport.show();
  textSize(height*0.035);
  fill(buttonLightModeColor);
  rectMode(CENTER);
  rect(0, height*0.06, width*0.14, height*0.05, 30);
  fill(foregroundColor);
  textAlign(CENTER);
  text(`Welcome to the table tennis AI-assisted coaching web-viewer made
by Albert Wu for a CS30 SDS! If not done already, play around with the
python program, where you will be able to export a pose_landmarks.csv
file. A CSV (Comma-Separated Values) file contains the raw 3D spatial
coordinates (X, Y, Z coordinates) for all 33 human skeletal joints captured
frame-by-frame by the external MediaPipe computer vision program.Then, you
can select either to visualize in 3D or view the full dataset in a 
user-friendly way. Begin by importing the CSV file (default in github folder).`, 0, -height*0.3);
}

// DATASET VIEWER
function datasetViewer() {
  // Update button colors to match theme
  for (let btn of datasetTabButtons) {
    btn.backgroundColor = currentButtonColor;
    btn.buttonTextColor = foregroundColor;
  }

  // Position and draw tab buttons across the top
  let tabY = -height / 2 + 40;
  push();
  for (let i = 0; i < datasetTabButtons.length; i++) {
    datasetTabButtons[i].x = (i - (datasetTabButtons.length - 1) / 2) * (width / 6);
    datasetTabButtons[i].y = tabY;
    datasetTabButtons[i].drawButton();

    // Underline the active tab
    if (datasetTabButtons[i].buttonText === datasetTab) {
      stroke(color(78, 205, 196));
      strokeWeight(3);
      fill(0,0);
      let bx = datasetTabButtons[i].x;
      let bw = datasetTabButtons[i].buttonWidth / 2;
      let by = datasetTabButtons[i].y + datasetTabButtons[i].buttonHeight / 2 - 4;
      line(bx - bw + 8, by, bx + bw - 8, by);
    }
  }
  pop();

  // Show the right view
  drawDataTable();
}

function drawDataTable() {
  if (datasetRows.length === 0) { // If there is now rows, then we just return and show that there is no data
    fill(foregroundColor);
    textSize(16);
    textAlign(CENTER);
    text("No data loaded", 0, 0);
    return;
  }

  // Math to calculate where the headers go
  let colWidth = constrain(width / visibleCols.length, 60, 160);
  let startX = -width / 2 + 10;
  let headerHeight = rowHeight + 6;
  let clipTop = -height / 2 + 90 + headerHeight;

  // Header row background
  push();
  noStroke();
  fill(currentButtonColor);
  rectMode(CORNER);
  rect(-width / 2, -height / 2 + 90, width, headerHeight);
  pop();

  // Header text
  push();
  fill(foregroundColor);
  textSize(11);
  textAlign(LEFT);
  for (let i = 0; i < visibleCols.length; i++) {
    let columnIndex = visibleCols[i];
    let x = startX + i * colWidth;
    text(datasetHeaders[columnIndex] || "", x + 4, -height / 2 + 90 + headerHeight / 2 + 4);
  }
  pop();

  // Data rows
  push();
  textSize(10);
  textAlign(LEFT);
  for (let row = 0; row < datasetRows.length; row++) {
    let y = -height / 2 + 90 + headerHeight + row * rowHeight - tableScrollY;

    // Skip rows outside the area visible
    if (y + rowHeight < clipTop || y > height / 2) {
      continue;
    }

    // Alternate row colors
    noStroke();
    if (row % 2 === 0) {
      if (darkModeEnabled) {
        fill(color(30, 32, 31));
      }
      else {
        fill(color(245));
      }
    } 
    else {
      if (darkModeEnabled) {
        fill(color(22, 24, 23));
      }
      else {
        fill(color(255));
      }
    }

    rectMode(CORNER);
    rect(-width / 2, y, width, rowHeight);

    // Cell values
    fill(foregroundColor);
    for (let i = 0; i < visibleCols.length; i++) {
      let columnIndex = visibleCols[i];
      let x = startX + i * colWidth;
      let val = datasetRows[row][columnIndex] || "";
      let parsed = parseFloat(val);
      let display;
      if (isNaN(parsed)) {
        display = val;
      } 
      else {
        display = parsed.toFixed(4);
      }
      text(display, x + 4, y + rowHeight / 2 + 4);
    }
  }
  pop();

  // Scrollbar
  let totalHeight = datasetRows.length * rowHeight;
  let viewHeight = height * 0.8;
  if (totalHeight > viewHeight) {
    let barH = viewHeight / totalHeight * viewHeight;
    let barY = -height / 2 + 90 + headerHeight + tableScrollY / totalHeight * viewHeight;
    push();
    noStroke();
    fill(100);
    rectMode(CORNER);
    rect(width / 2 - 10, barY, 6, barH, 3);
    pop();
  }
}

function drawPhysicalTable() {
  // DRAWS THE TABLE SURFACE
  push();
  fill(0, 117, 255);
  translate(0, 87, 170);
  box(TABLE_WIDTH, TABLE_THICKNESS, TABLE_LENGTH);
  noFill();
  strokeWeight(1);
  stroke("white");
  translate(0, -TABLE_THICKNESS/2, 0);
  box(TABLE_WIDTH, TABLE_THICKNESS/10, TABLE_LENGTH);
  for (let widthFactor of [-4, 4]) {
    for (let heightFactor of [-4, 4]) {
      push();
      translate(TABLE_WIDTH/widthFactor, 0, TABLE_LENGTH/heightFactor);
      box(TABLE_WIDTH/2, TABLE_THICKNESS/10, TABLE_LENGTH/2);
      pop();
    }
  }

  // DRAWS THE NET
  translate(0, -TABLE_THICKNESS/2, 0);
  box(TABLE_WIDTH, NET_HEIGHT, 2);
  
  // DRAWS THE LEGS
  for (let widthFactor of [-2, 2]) {
    for (let heightFactor of [-2, 2]) {
      push();
      translate(TABLE_WIDTH/widthFactor-widthFactor, TABLE_HEIGHT/2+TABLE_THICKNESS*1.5, TABLE_LENGTH/heightFactor-heightFactor);
      fill(195, 201, 197);
      noStroke();
      box(4, TABLE_HEIGHT, 4);
      pop();
    }
  }
  pop();

}

// THE TIPS SCREEN
function tipsScreen() {
  csvImport.hide();
  push();
  rectMode(CENTER);
  noStroke();
  fill(currentButtonColor);
  rect(0, 0, width * 0.85, height * 0.9, 30);
  pop();

  textAlign(CENTER, TOP);
  textSize(width * 0.028);
  push();
  textFont(boldFont);
  if (darkModeEnabled) {
    fill(255, 76, 76);
  } 
  else {
    fill(220, 50, 50);
  }
  text("EXEMPLAR COACHING INTERFACE", 0, -height * 0.4);
  pop();

  textSize(width * 0.013);
  fill(foregroundColor);
  let subtitleText = `Select a technical stroke below to review professional coaching parameters.
Clicking a category will automatically render a pre-recorded reference model
side-by-side right next to your coaching tips.`;
  text(subtitleText, 0, -height * 0.32);

  let bWidth = width * 0.11;
  let bHeight = height * 0.05;
  let rowY = height * 0.32; 
  
  if (tipGridButtons.length === 0) {
    tipGridButtons.push(new Button(width * 0.24, rowY, "Forehand", buttonDarkModeColor, bWidth, bHeight, 10, 2));
    tipGridButtons.push(new Button(width * 0.37, rowY, "Backhand", buttonDarkModeColor, bWidth, bHeight, 10, 2));
    tipGridButtons.push(new Button(width * 0.50, rowY, "Loop",     buttonDarkModeColor, bWidth, bHeight, 10, 2));
    tipGridButtons.push(new Button(width * 0.63, rowY, "Push",     buttonDarkModeColor, bWidth, bHeight, 10, 2));
    tipGridButtons.push(new Button(width * 0.76, rowY, "Serve",    buttonDarkModeColor, bWidth, bHeight, 10, 2));
  }

  for (let i = 0; i < tipGridButtons.length; i++) {
    let btn = tipGridButtons[i];
    btn.backgroundColor = backgroundColor;
    btn.buttonTextColor = foregroundColor;
    btn.drawButton();
  }

  // DRAWS THE EXAMPLE SKELETON (NOT ALL DONE)
  drawExemplarSkeleton(-width * 0.18, height * 0.12, 0.4);

  push();
  textAlign(LEFT, TOP);
  let textX = width * 0.04;
  let textY = -height * 0.12;

  push();
  textFont(boldFont);
  textSize(width * 0.02);
  fill(foregroundColor);
  text("STROKE PROFILE: " + currentTipStroke.toUpperCase(), textX, textY);
  pop();

  textSize(width * 0.013);
  fill(foregroundColor);
  
  let dynamicTips = `Click one of the technical buttons
to view an example of the stroke.`;

  if (currentTipStroke === "Forehand") {
    dynamicTips = `- Kinetic Momentum:
  Rotate your hips backward during backswing.

- Elbow Positioning:
  Keep your elbow at around ~110°, preventing
  it from going straight and make sure you brush
  the ball.
  
- Racket Angle Orientation:
  Make sure the racket's forehand is facing at a
  diagonal towards the ground, to cancel out
  incoming velocity.`;
  } 
  
  if (currentTipStroke === "Backhand") {
    dynamicTips = `- Keep a Consistent Stance:
  Stand in a parallel fashion to the short edge
  of the table to allow for consistent hitting.

- Extending Your Elbow:
  Prioritize extending your elbow and arm, rather
  than rotating your shoulder too much.

- Acceleration Phase:
  Snap the wrist right right before and during
  contact creating maximum spin and speed.`;
  } 
  
  if (currentTipStroke === "Loop") {
    dynamicTips = `- Power Generation:  
  Drop the waist and hips to below the table
  surface, generating a powerful backswing.

- High Spin and Speed:
  Perform an aggresive upward brushing motion to
  produce a high spin and speed loop.

- Angle of Attack:
  Close the racket orientation quickly to
  counteract the high velocity tracjectories.`;
  } 
  
  if (currentTipStroke === "Push") {
    dynamicTips = `- Counteract Backspin:
  Face the backhand side of the racket to face up.

- Contact Point:
  Slice smoothly underneath the ball when it is
  in its descent phase after the bounce.

- Controlled Follow-Through:
  Push forward with a controlled elbow to absorb
  the incoming spin and use it to your advantage.`;
  } 
  
  if (currentTipStroke === "Serve") {
    dynamicTips = `- Rules Restriction:
  Toss the ball vertically at least 16cm from an
  open palm.

- Pendulum Motion:
  Keep your shoulder relaxed by using more wrist
  and elbow movement, creating a snapping motion.

- Coaching Tip:
  Practice specific contact points on the racket
  to generate unique spins with the same motion.`;
  }

  text(dynamicTips, textX, textY + height * 0.06);
  pop();
}

function drawExemplarSkeleton(xOffset, yOffset, skeletonScale) {
  if (exemplarLandmarks.length === 0) {
    push();
    translate(xOffset, yOffset);
    stroke(foregroundColor);
    noFill();
    rect(0, 0, width * 0.32, height * 0.45, 15);
    textAlign(CENTER, CENTER);
    textSize(width * 0.015);
    fill(foregroundColor);
    text(`Select a stroke to load
3D Animated Exemplar. May not be
avaliable yet though.`, 0, 0);
    pop();
    return;
  }

  if (autoPlay && !playbackPaused && millis() > lastExemplarFrame + frameInterval) {
    lastExemplarFrame = millis();
    exemplarFrame++;
    if (exemplarFrame >= exemplarLandmarks.length) {
      exemplarFrame = 0;
    }
  }

  push();
  translate(xOffset, yOffset);
  
  stroke(foregroundColor);
  strokeWeight(1);
  noFill();
  rect(0, 0, width * 0.32, height * 0.45, 15);

  scale(skeletonScale);
  
  // Draws the skeleton
  for (let nodeIndex = 0; nodeIndex < exemplarLandmarks[exemplarFrame].length; nodeIndex++) {
    let nodeX = (exemplarLandmarks[exemplarFrame][nodeIndex][0] - 0.4) * width;
    let nodeY = (exemplarLandmarks[exemplarFrame][nodeIndex][1] - 0.5) * height;
    let nodeZ = exemplarLandmarks[exemplarFrame][nodeIndex][2] * width / 3;

    for (let j = 0; j < connections[nodeIndex].length; j++) {
      let otherIndex = connections[nodeIndex][j];
      
      if (otherIndex < exemplarLandmarks[exemplarFrame].length) {
        let otherX = (exemplarLandmarks[exemplarFrame][otherIndex][0] - 0.4) * width;
        let otherY = (exemplarLandmarks[exemplarFrame][otherIndex][1] - 0.5) * height;
        let otherZ = exemplarLandmarks[exemplarFrame][otherIndex][2] * width / 3;
        
        strokeWeight(2.5);
        stroke(foregroundColor);
        line(nodeX, nodeY, -nodeZ, otherX, otherY, -otherZ);
      }
    }
  }
  pop();
}

// PORTRAIT DETECTION ON MOBILE
function drawRotatePrompt() {
  csvImport.hide();
  fill(foregroundColor);
  textAlign(CENTER, CENTER);
  textSize(width * 0.07);
  text(`Please rotate your
device to landscape`, 0, 0);
}