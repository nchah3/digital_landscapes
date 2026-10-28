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
  if (keyIsDown(UP_ARROW)) currentHeight = waveHeight + 14;
  if (keyIsDown(DOWN_ARROW)) currentHeight = waveHeight - 14;
  if (moonX < 0.12) moonX = 12;
  if (moonY > 0.88) moonX = 0.88;
  phase += waveSpeed;
  
  // Drawing the sky with a loop of lines and using lerpColor() technique.
  let skyTop = color(30, 25, 65);
  let skyBottom = color(185, 120, 165);
  if (night) {
    skyTop = color(5, 15, 35);
    skyBottom = color(45, 80, 115);
  }
  for (let y = 0; y < height; y += 4) {
    stroke(lerpColor(skyTop, skyBottom, map(y, 0, height, 1)));
    line(0, y, width, y);
  }
  noStroke();
  fill(240, 235, 255);
  for (let i = 0; i < 30; i++) {
    circle(starX[i] * width, starY[i] * height, 2);
  }
  
  // Drawing a glowing moon using two circles and transparency.
  push();
  fill(245, 220, 245, 25);
  circle(moonX * width, height * 0.26, 110);
  fill(250, 220, 230);
  circle(moonX * width, height * 0.26, 70);
  pop();
  
  // Drawing the ocean, then place several moving wave shapes over it.
  fill(20, 75, 105);
  rect(0, height * 0.53, width, height * 0.47);
  // EXTRA: sin() makes the water move smoothly up and down.
  // vertex() adds points to the custom shape introduced in the slides
  // https://v1.p5js.org/reference/p5/sin/
  // https://v1.p5js.org/reference/p5/vertex/
  for (let layer = 0; layer < waveLayers; layer++) {
    fill(18, 75 - layer * 12, 105 - layer * 12);
    stroke(140, 195, 215, 100);
    beginShape();
    for (let x = -10; x <= width + 10; x += 10) {
      let y = height * (0.56 + layer * 0.12);
      y += sin(x * 0.008 + phase + layer) * currentHeight;
      vertex(x, y);
    }
    vertex(width + 10, height + 10);
    vertex(-10, height + 10);
    endShape(CLOSE);
  }
  
  // One ripple grows and faddes after each note.
  if (rippleAlpha > 0) {
    noFill();
    stroke(220, 240, 255, rippleAlpha);
    ellipse(rippleX * width, height * 0.76, rippleSize, rippleSize * 0.3);
    rippleSize += 2;
    rippleAlpha -= 2;
  }
  
  noStroke();
  fill(245, 235, 255);
  textSize(32);
  text("Dreamwave", 24, 48);
  fill(6, 15, 35, 190);
  rect(12, height - 116, width - 24, 104, 10);
  fill(240, 235, 255);
  textSize(12);
  text("Click once for sound. Left stick: moon and wave height.", 24, height - 92);
  text("Bottom button: chime + ripple. right button: dusk / night.", 24, height - 70);
  text("Keys: arrows move, Space plays, N changes the sky.", 24, height - 48);
  text(controllerText, 24, height - 26);
}

// 4. CONTROLLER: this is the main extra technique needed for the pro 2.
// https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
// https://w3c.github.io/gamepad/#standard-gamepad-layout
function readController() {
  if (!navigator.getGamepads) return;
  let controllers;
  // EXTRA: try/catch handles a browser preview that blocks controller access.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
  try {
    controllers = navigator.getGamepads();
  } catch (error) {
    controllerText = "Open the prokect in its own browser tab for controller access.";
    return;
  }
  let controller = null;
  for (let i = 0; i < controllers.length; i++) {
    if (controllers[i] && controller[i].connected) {
      controller = controllers[i];
      break; // Stop searching after finding a connected controller.
    }
  }
  if (!controller || controller.mapping !== "standard") {
    controllerText = "Connect the Pro 2 in X mode on Windows and press a button.";
    wasNotePressed = false;
    wasSkyPressed = false;
    return;
  }
  controllerText = "Controller connected. Click the landscape to enable sound.";
  
  // Ignore very small stick values to reduce accidental movement.
  if (controller.axes[0] > 0.2 || controller.axes[0] < -0.2) {
    moonX += controller.axes[0] * 0.003;
  }
  if (controller.axes[1] > 0.2 || controller.axes[1] < -0.2) {
    currentHeight = waveHeight - controller.axes[1] * 14;
  }
  let notePressed = controller.buttons[0].pressed;
  let skyPressed = controller.buttons[1].pressed;
  // A new press is true now and was false on the previous frame.
  if (notePressed && !wasNotePressed) playNote();
  if (skyPressed && !wasSkyPressed) night = !night;
  wasNotePressed = notePressed;
  wasSkyPressed = skyPressed;
}

// 5. SOUND: the same button starts a ripple and plays the next note.
// https://v1.p5js.org/reference/p5.Envelope/play/
function playNote() {
  rippleX = moonX;
  rippleSize = 10;
  rippleAlpha = 180;
  if (soundReady) {
    chime.freq(notes[noteNumber]);
    envelope.play(chime, 0, 0.05);
    noteNumber = (noteNumber + 1) % 4;
  }
}

// 6. MOUSE AND KEYBOARD: familiar interaction functions from the class slides.
function mousePressed() {
  // EXTRA: a browser needs a mouse click before it can start sound.
  // https://v1.p5js.org/reference/p5/userStartAudio/
  userStartAudio();
  if (!soundReady) {
    chime.start();
    soundReady = true;
  }
}

function keyPressed(event) {
  // EXTRA: ignore keyboard auto-repeat and browser shortcuts.
  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat
  if (event && (event.repeat || event.ctrlKey || event.metaKey || event.altKey)) return;
  if (keyCode === 32) playnote();
  else if (key === "n" || key === "N") night = !night;
  else if (keyCode < 37 || keyCode > 40) return;
  return false;
}

// EXTRA: fit the canvas again when the window changes size.
// https://v1.p5js.org/reference/p5/windowResized/
// https://v1.p5js.org/reference/p5/resizeCanvas/
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}