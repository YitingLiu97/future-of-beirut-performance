//creating a webcam sketch with Leibniz Formula for Pi 

// in solidraity with Beirut, this is a performance for Resilience 2032 on Aug. 22nd 2 PM ET
// Performer/Musician/Coder: Yiting Liu 
// Contact: Instagram DM @yliu.designs

//Leibniz Formula for Pi tutorial: https://thecodingtrain.com/CodingChallenges/140-leibniz-formula-pi.html
// creating visuals and music - frequency 

let pi = 4;
let history = [];
let iterations = 0;
let spacing = 2;
let polySynth;
let minY = 2;
let maxY = 4;
let x, y;
let historySize;

//read the sound file and change different elements - thickness of the lines

// use webcam to decide the position of the lines and gradient of the background 

let song;
let cnv;
let fft, spectrum, waveform;

function preload() {
  song = loadSound('future of beirut.mp3');
}

function setup() {
  cnv = createCanvas(400, 400);

  let playBtn = createButton('Play');
  playBtn.mousePressed(playsound);
  historySize = createSlider(20, 100, 30, 2);
  createDiv('size').child(historySize);

  fft = new p5.FFT();
  song.amp(0.2);

}

function playsound() {
  if (song.isPlaying()) {
    // .isPlaying() returns a boolean
    song.stop();
    background(255, 0, 0);
  } else {
    song.play();
    background(0, 255, 0);
  }
}

function draw() {
  spectrum = fft.analyze();

  // console.log(spectrum,'spectrum');

  let bgCl;
  for (let i = 0; i < spectrum.length; i++) {
    bgCl = map(spectrum[i], 0, 1023, 0, 255);
    console.log(bgCl);

  }

  translate(width / 2, height / 2);
  // background('#ffc922');
  background(bgCl);
  let den = iterations * 2 + 3;
  if (iterations % 2 == 0) {
    pi -= (4 / den);
  } else {
    pi += (4 / den);
  }
  stroke(255);
  strokeWeight(iterations / den * pi)
  noFill();

  let r, a;


  if (history.length > historySize.value()) {

    // history.shift();
    history.splice(history[historySize.value()]);

  } else {
    history.push(pi);

  }

  rotate(a);

  beginShape();
  for (let i = 0; i < historySize.value(); i++) {

    r = i * spacing;
    a = map(history[i], minY, maxY, 360, 0);
    x = r * cos(a);
    y = r * sin(a);

    vertex(x, y);

  }

  // playSynth(a);

  endShape();


  noStroke()
  // fill(bgCl, 0, 0);
  circle(x, y, x);
  iterations++;

}