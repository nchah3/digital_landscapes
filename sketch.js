// DREAMWAVE: a relaxing ocean landscape played with an 8bitDo Pro 2.
// course sources: Introto_p5js.pdf, slides 6-51.
// Uses variables, arrays, loops, if/else, shapes, map(), and mouse/keyboard input.
// EXTRA labels idenitfy techniques beyond the examples used in slides
// AI used: Gemini provided sources to code that doesn't fall under the lecture slides from official p5js libraries. And also help assisted in my mistakes when I drafted this code myself.

// 1. VARIABLES: changing the numbers during the live performance
let waveLayers = 3;
let waveHeight = 20;
let waveSpeed = 0.01;
let phase = 0;
let moonX = 0.72; // A fraction of the width: 0.5 means the center.
let currentHeight = 20;
let night = false;
let starX = [], starY = [];
let rippleX = 0, rippleSize = 0, rippleAlpha = 0;
let wasNotePressed = false, wasSkyPressed = false;
let controllerText = "Connect the controller, then press a button.";
let soundReady = false;
let chime, envelope;
let notes = [261.63, 293.66, 392, 440]; // Four gentle musical notes.
let noteNumber = 0;

// 2. SETUP: this runs only once.
function setup() {
  // EXTRA: windowWidth and windowHeight fit the canvas to the browser.
  // https://v1.p5js.org/reference/p5/windowWidth/
  // https://v1.p5js.org/reference/p5/windowHeight/
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  for (let i = 0; i < 30; i++) {
    starX[i] = random(0, 1);
    starY[i] = random(0.08, 0.42);
  }
  // EXTRA: an oscillator makes a tone; an envelope makes it fade gently.
  // https://v1.p5js.org/reference/p5.sound/p5.Oscillator/
  // https://v1.p5js.org/reference/p5.sound/p5.Envelope/
  // https://v1.p5js.org/reference/p5.Envelope/setADSR/
  // https://v1.p5js.org/reference/p5.Envelope/setRange/
  chime = new p5.Oscillator("sine");
  chime.amp(0);
  envelope = new p5.Envelope();
  envelope.setADSR(0.05, 0.2, 0.1, 1.8);
  envelope.setRange(0.12, 0);
}

// 3. DRAW: updating the controls, then drawing the landscape again.
function draw() {
  currentHeight = waveHeight;
  readController();
  if (keyIsDown(LEFT_ARROW)) moonX -= 0.003;
  if (keyIsDown(RIGHT_ARROW)) moonX += 0.003;
}