function setup() {
    var myCanvas = createCanvas(600, 600);
    myCanvas.parent(visual);
      fill(0);
      stroke(255);
      background(0,0,0,0);
    }
    
    
    function draw() {
      for(n = 0; n<height; n+=height/20){
      beginShape();
      curveVertex(0,n)
      for (i = 0; i < width; i+=width/20) {
        var d = dist(i,n,width/2,n)
        curveVertex(i,n-noise(n+i*0.08)*(width/2-d))
      }
      curveVertex(width,n)
      curveVertex(width,n)
      endShape();
      }
    }