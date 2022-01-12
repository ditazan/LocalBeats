let totalPts = 300;
let steps = totalPts + 1;

var canvas;
var w = (window.innerWidth + window.outerWidth);
var h = (window.innerHeight+window.outerWidth);

function setup() {
  resizeCanvas(w, h);
  canvas = createCanvas(windowWidth, window.outerHeight);
  
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  stroke(255);
  frameRate(15);

 $(".submit").click(function(){
   resetSketch();
  });

}

function resetSketch(){
  resizeCanvas(w, h);
  console.log("clack");
}

function draw() {
  background(0);
  let rand = 0;
  for (let i = 1; i < steps; i++) {
    point((width / steps) * i, height / 2 + random(-rand, rand));
    rand += random(-40, 40);
  }
}