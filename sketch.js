// Click and drag the mouse to view the scene from different angles.
let viewer;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // viewer = createGraphics(500, 500, WEBGL);
}

function draw() {
  background(200);

  // Enable orbiting with the mouse.
  orbitControl();

  // Draw the box.
  drawPoint(0.638852, 0.671197, 0.129959);
  drawPoint(0.634599, 0.536441, -0.06984);
}

function drawPoint(x,y,z) {
  fill("black");
  translate(x*width,y*height,z*width);
  sphere(50);
}
