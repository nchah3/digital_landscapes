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
  // https://
}