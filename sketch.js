let video;
let poseNet;
let poses = [];
let song, fft, spectrum, waveform, cnv, freqHigh, freqLow;
let noseX, noseY, leftWristX, leftWristY, rightWristX, rightWristY, rightHipX, rightHipY;
let zoffVal = 0.2;


function setup() {
  cnv = createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  poseNet = ml5.poseNet(video, modelReady);

  poseNet.on('pose', function (results) {
    poses = results;
  
  });
  // video.hide();

  let playBtn = createButton('Play');
  playBtn.mousePressed(playsound);


  fft = new p5.FFT();
  song.amp(0.2);

}

function modelReady() {
  console.log('Model Loaded');
}

function preload() {
  song = loadSound('future of beirut.mp3');
}

function playsound() {
  if (song.isPlaying()) {

    song.stop();
  } else {
    song.play();

  }
}

function draw() {

  // image(video, 0, 0, width, height);
  background('rgba(173,216,230, 0.2)');

  spectrum = fft.analyze();
  freqLow = min(spectrum);
  freqHigh = max(spectrum);

  drawKeypoints();
  drawPolarPerlinNoise(freqHigh, freqLow, noseX, noseY);
  drawPolarPerlinNoise(freqHigh*2, freqLow, leftWristX, leftWristY);
  drawPolarPerlinNoise(freqHigh/2, freqLow, rightWristX, rightWristY);


}

function drawKeypoints() {

  for (let i = 0; i < poses.length; i++) {

    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];

      //draw interactive shapes - lines and bubbles 
      //background color is within the blue range 

      if (keypoint.score > 0.2 && keypoint.part == "nose") {
        noseX = keypoint.position.x;
        noseY = keypoint.position.y;
      }


      if (keypoint.score > 0.2 && keypoint.part == "leftWrist") {
        leftWristX = keypoint.position.x;
        leftWristY = keypoint.position.y;
      }

      if (keypoint.score > 0.2 && keypoint.part == "rightWrist") {

        rightWristX = keypoint.position.x;
        rightWristY = keypoint.position.y;
      }


      if (keypoint.score > 0.2 && keypoint.part == "rightHip") {

        rightHipX = keypoint.position.x;
        rightHipY = keypoint.position.y;
      }




    }
  }
}


function drawPolarPerlinNoise(freqHigh, freqLow, centerX, centerY) {

  aVal =( freqHigh-freqLow)/1024;
  console.log(aVal);
    noiseMax = 50;
  zoffVal = 0.01;
  zoff = 0.1;
  range = freqHigh - freqLow;

  let xoff, yoff;

  stroke(255);
  strokeWeight(0.5);
  translate(centerX, centerY);

  noFill();

  beginShape();
  for (let a = 0; a < TWO_PI; a += aVal) {

    xoff = map(cos(a), -1, 1, 0, noiseMax);
    yoff = map(sin(a), -1, 1, 0, noiseMax);

    let r = map(noise(xoff, yoff, zoff), 0, 1, 0, range);
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);

  }
  endShape(CLOSE);
  zoff += zoffVal;
}