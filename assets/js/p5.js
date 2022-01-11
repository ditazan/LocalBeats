let totalPts = 300;
let steps = totalPts + 1;

var canvas;
var w = (windowWidth);
var h = (windowHeight);

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  resizeCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  stroke(255);
  frameRate(15);
}

function draw() {
  background(0);
  let rand = 0;
  for (let i = 1; i < steps; i++) {
    point((width / steps) * i, height / 2 + random(-rand, rand));
    rand += random(-40, 40);
  }
}
