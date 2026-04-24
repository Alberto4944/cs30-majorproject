// Click and drag the mouse to view the scene from different angles.
let viewer;

function setup() {
  createCanvas(windowWidth, windowHeight);
  viewer = createGraphics(500, 500, WEBGL);
}

function draw() {
  viewer.background(200);

  // Enable orbiting with the mouse.
  viewer.orbitControl();

  // Draw the box.
  drawPoint(0.638852, 0.671197, 0.129959);
  drawPoint(0.634599, 0.536441, -0.06984);

  drawTitles();
}

function drawPoint(x,y,z) {
  viewer.fill("black");
  viewer.translate(x*width,y*height,z*width);
  viewer.sphere(50);
}

function drawTitles() {
  textSize(100);
  text("Table Tennis Dashboard", width/2, 100,100);
}