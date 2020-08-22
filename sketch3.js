// use posenet to use webcam to perform - simliar to body instruments 

// posenet_webcam_music_visual
// ITP CAMP 2020
// Yiting Liu 
// 008
// 06/25/2020 

// combined with polar perlin noise
// color: https://www.schemecolor.com/dreamy-pastels.php
// freq: https://pages.mtu.edu/~suits/notefreqs.html


// polar

let video;
let poseNet;
let poses = [];
let noseX, noseY, leftWristX, leftWristY, rightWristX, rightWristY;

let noiseSound, env, freqHigh, freqLow;
let zoff = 0;
let zoffVal, zoffValS, noiseMax, noiseMaxS, aVal, aValS, delayVal, rangeS, delayS;
// let monoSynth, polySynth, delay, check;

//for polysynth and monosynth
let velocity, time, dur;

let song, cnv;

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

function myCheckedEvent() {
    if (this.checked()) {
        clear();
    } else {
        //do nothing 
    }
}
function modelReady() {
    console.log('Model Loaded');
}
function setup () {

    cnv = createCanvas(windowWidth / 2, windowWidth * 9 / 16 / 2);
    let playBtn = createButton('Play');
    playBtn.mousePressed(playsound);

    video = createCapture(VIDEO);
    video.size(width, height);
    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', function (results) {
        poses = results;
    });

    // video.hide();

    //increment of the perlin noise
    let angleDiv = createDiv('angle');
    angleDiv.style('inline');
    aValS = createSlider(0.01, 0.3, 0.01, 0.01);
    angleDiv.child(aValS);

    //size of the circle
    let rangeDiv = createDiv('size');
    rangeDiv.style('inline');
    rangeS = createSlider(width / 6, width, width / 2, width / 10);
    rangeDiv.child(rangeS);





}



    let rVal, gVal, bVal;

function draw() {

    background('rgba(255,200,200, 0.25)');

    noFill();
    drawPoints();

    range = rangeS.value()

    freqLow = 220;
    freqHigh = 660;
    push();

    adaptPoint(noseX, noseY,range);
    pop();

    push();
    col = fill(255, 0, 0);
    range = range / 3;

    if (noseY > leftWristY) {
        env.play(noiseSound);
        adaptPoint(leftWristX, leftWristY, range);

    }
    pop();


    push();
    range = video.width / 60;
    adaptPoint(rightWristX, rightWristY,  range);
    pop();

}

function adaptPoint(x, y, range) {
    if (x != null && y != null) {
        translate(x, y);
        rVal = map(x, 0, video.width, 0, 255);
        gVal = map(y, 0, video.height, 0, 255);
        bVal = (rVal + gVal) / rVal;
        col = stroke(gVal - 20, bVal, rVal);
        drawPolarPerlinNoise(x, y, col, range);
    }
}

//nose and hands
function drawPoints() {

    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];

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

        }
    }
}


function drawPolarPerlinNoise(centerX, centerY, col, range) {
    // aVal = aValS.value();
    // noiseMax = noiseMaxS.value();
    // zoffVal = zoffValS.value();

    zoffVal=0.02;
    noiseMax=0.2

    zoff=0.1;
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
