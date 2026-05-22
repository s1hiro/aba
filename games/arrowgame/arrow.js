// State Machine Game

let targetBoxes = [];
let taskBoxes = [];
let actionsList = [];
let queuelist = [];
let health = 100;
let arrowFeedback = { display: false, state: "idle" };
let arrBtn = {
  Left: {
    stem: { x: 30, y: 33, w: 40, h: 15 },
    tri: {
      c1: { x: 30, y: 20 },
      c2: { x: 10, y: 40 },
      c3: { x: 30, y: 60 },
    },
  },
  Right: {
    stem: { x: 10, y: 33, w: 40, h: 15 },
    tri: {
      c1: { x: 50, y: 20 },
      c2: { x: 70, y: 40 },
      c3: { x: 50, y: 60 },
    },
  },
  Down: {
    stem: { x: 33, y: 10, w: 15, h: 40 },
    tri: {
      c1: { x: 20.5, y: 50 },
      c2: { x: 40, y: 70 },
      c3: { x: 58.5, y: 50 },
    },
  },
  Up: {
    stem: { x: 33, y: 30, w: 15, h: 40 },
    tri: {
      c1: { x: 20.5, y: 30 },
      c2: { x: 40, y: 10 },
      c3: { x: 60, y: 30 },
    },
  },
};
let actionToCoordsMap = {
  ArrowLeft: {
    stem: { x: 100, y: 538, w: 40, h: 15 },
    tri: {
      c1: { x: 100, y: 525 },
      c2: { x: 80, y: 545 },
      c3: { x: 100, y: 565 },
    },
  },
  ArrowRight: {
    stem: { x: 80, y: 538, w: 40, h: 15 },
    tri: {
      c1: { x: 120, y: 525 },
      c2: { x: 140, y: 545 },
      c3: { x: 120, y: 565 },
    },
  },
  ArrowDown: {
    stem: { x: 103, y: 515, w: 15, h: 40 },
    tri: {
      c1: { x: 90.5, y: 555 },
      c2: { x: 110, y: 575 },
      c3: { x: 128.5, y: 555 },
    },
  },
  ArrowUp: {
    stem: { x: 103, y: 535, w: 15, h: 40 },
    tri: {
      c1: { x: 90.5, y: 535 },
      c2: { x: 110, y: 515 },
      c3: { x: 130, y: 535 },
    },
  },
};
let start = false;
let timeElapsed = 0;
let lastTime = 0;
let mouseReleasedThisFrame = false;
let wasPressedLastFrame = false;

function setup() {
  createCanvas(780, 640);
  generateTaskBox(9);
  initActionsQueue();
  textAlign(CENTER, TOP);
}

function draw() {
  background(220);
  if (wasPressedLastFrame && !mouseIsPressed) {
    mouseReleasedThisFrame = true;
  } else {
    mouseReleasedThisFrame = false;
  }
  drawTaskBox();
  drawTargetBoxes();
  drawActions();
  drawStartBtn();
  drawHealth();

  if (start === true) {
    timeElapsed += 1 / 60;
  }

  if (millis() - lastTime >= 1000 && start == true) {
    lastTime = millis();
    if (health > 0) {
      health--;
    } else {
      start = "lose";
    }
  }

  if (arrowFeedback.display) {
    push();
    noFill();
    if (arrowFeedback.state == "correct") stroke("rgb(0,213,0)");
    if (arrowFeedback.state == "incorrect") stroke("rgb(213,0,0)");
    strokeWeight(4);
    rect(70, 505, 80); // 80 -> 70
    pop();
  }
  arrowBtn("Up", { x: 600, y: 420 });
  arrowBtn("Left", { x: 515, y: 505 });
  arrowBtn("Down", { x: 600, y: 505 });
  arrowBtn("Right", { x: 685, y: 505 });

  fsBtn({ x: 530, y: 270 });
  //mousePos();
  wasPressedLastFrame = mouseIsPressed;
}

function fsBtn(base) {
  let size = 80;
  fill("rgb(197,197,197)");
  rect(base.x, base.y, size);
  textSize(40);
  fill("black");
  text("fs", base.x + 40, base.y + 20);

  if (mouseReleasedThisFrame) {
    if (
      mouseX > base.x &&
      mouseX < base.x + size &&
      mouseY > base.y &&
      mouseY < base.y + size
    ) {
      let fs = fullscreen();
      fullscreen(!fs);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

document.ontouchmove = function(event) {
    event.preventDefault();
};

function arrowBtn(direction, base) {
  let bgSize = 80;
  let currOffset = arrBtn[direction];
  let stem = currOffset.stem;
  let tri = currOffset.tri;

  //bg
  fill("gray");
  rect(base.x, base.y, bgSize);

  fill("black");
  rect(base.x + stem.x, base.y + stem.y, stem.w, stem.h);
  triangle(
    base.x + tri.c1.x,
    base.y + tri.c1.y,
    base.x + tri.c2.x,
    base.y + tri.c2.y,
    base.x + tri.c3.x,
    base.y + tri.c3.y
  );

  if (mouseReleasedThisFrame) {
    if (
      mouseX > base.x &&
      mouseX < base.x + bgSize &&
      mouseY > base.y &&
      mouseY < base.y + bgSize
    ) {
      handleArrowInput("Arrow" + direction);
    }
  }
}

function drawHealth() {
  push();
  strokeWeight(3);
  fill("rgb(242,77,77)");
  rect(68, 80, 445, 30); // 78 -> 68
  strokeWeight(0);
  fill("rgb(86,242,77)");
  rect(69.5, 81.7, 4.42 * health, 26.9); // 79.5 -> 69.5
  pop();
}

function generateTaskBox(num = 1) {
  for (let i = 0; i < num; i++) {
    let col = [
      random(10, 250).toFixed(0),
      random(10, 250).toFixed(0),
      random(10, 250).toFixed(0),
    ];
    let task = {
      color: col,
      complete: false,
      actions: generateActions(col),
    };

    taskBoxes.push(task);
  }
}

function generateActions(col) {
  let currList = [];
  let length = random(3, 20);
  const actions = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  for (let i = 0; i < length - 1; i++) {
    currList.push([random(actions), col]);
  }
  currList.push([random(actions), col, 1]);
  return currList;
}

function getNextActiveTask() {
  for (let task of taskBoxes) {
    if (!task.complete) return task;
  }
  return null;
}

function drawStartBtn() {
  push();
  noStroke();
  fill("black");
  textSize(20);
  text(`Time: ${timeElapsed.toFixed(2)}s`, 575, 130); // 585 -> 575
  pop();

  push();
  if (!start) {
    fill("rgb(96,241,96)");
  } else if (start === true) {
    fill("rgb(241,237,96)");
  } else if (typeof start != boolean) {
    fill("gray");
  }
  strokeWeight(3);
  rect(525, 20, 145, 40);

  noStroke();
  fill("black");
  textSize(30);
  if (!start) {
    text("Start", 595, 25); // 605 -> 595
  } else {
    text("Pause", 597.5, 25); // 607.5 -> 597.5
  }
  pop();
  if (!getNextActiveTask()) {
    start = "fin";
  }
}

function drawActions() {
  if (start == "lose") {
    return;
  }
  for (let i = 0; i < actionsList.length; i++) {
    let currAction = actionsList[i][0];
    const currMapped = actionToCoordsMap[currAction];
    const currStem = currMapped.stem;
    const currTri = currMapped.tri;

    //bounding box
    let task = actionsList[i];
    fill(`rgb(${task[1].join(",")})`);
    strokeWeight(4);
    rect(70 + i * 90, 505, 80);
    // spacing --- 1 box = 80, 90 spacing so 10 px apart

    //stem + head = arrow
    strokeWeight(0);
    fill("rgb(51,51,51)");
    rect(currStem.x + i * 90, currStem.y, currStem.w, currStem.h);
    triangle(
      currTri.c1.x + i * 90,
      currTri.c1.y,
      currTri.c2.x + i * 90,
      currTri.c2.y,
      currTri.c3.x + i * 90,
      currTri.c3.y
    );
  }
}

function mousePos() {
  fill(color(255, 255, 255, 190));
  strokeWeight(0);
  let rectOffset = { x: 10, y: -32 };
  let textOffset = { x: 72.5, y: -32 };

  if (mouseX < 72.5) {
    rectOffset.x = 10;
    textOffset.x = 72.5;
  } else if (mouseX > width - 135) {
    rectOffset.x = -135;
    textOffset.x = -72.5;
  }

  if (mouseY < height - 50) {
    rectOffset.y = 32;
    textOffset.y = 32;
  }

  rect(mouseX + rectOffset.x, mouseY + rectOffset.y, 125, 20);
  fill("Black");
  stroke("black");
  textSize(20);
  text(
    "x: " + mouseX + " y: " + mouseY,
    mouseX + textOffset.x,
    mouseY + textOffset.y
  );
}

function drawTargetBoxes() {
  let settings = { origin: { x: 70, y: 20 }, size: 40, spacing: 10 }; // 80 -> 70
  strokeWeight(4);
  for (let [i, task] of taskBoxes.entries()) {
    noFill();
    if (task.complete) fill(`rgb(${join(task.color, ",")})`);
    rect(
      settings.origin.x + (settings.size + settings.spacing) * i,
      settings.origin.y,
      settings.size
    );
  }
}

function drawTaskBox() {
  let nextTask = getNextActiveTask();
  if (nextTask && start != "lose") {
    strokeWeight(4);
    fill(`rgb(${join(nextTask.color, ",")})`);
    rect(70, 130, 440, 360); // 80 -> 70
  }
  if (start == "fin") {
    push();
    textSize(60);
    noStroke();
    fill("black");
    text(
      `Nice! You finished in ${timeElapsed.toFixed(2)} seconds!`,
      70,
      130,
      440
    );
    pop();
  }
  if (start == "lose") {
    push();
    textSize(60);
    noStroke();
    fill("black");
    text(
      `Dang, you lost too much health. Better luck next time!`,
      70,
      130,
      440
    );
    pop();
  }
}

function initActionsQueue() {
  let allActions = [];
  for (let task of taskBoxes) {
    allActions = allActions.concat(task.actions);
  }
  actionsList = allActions.slice(0, 5);
  queuelist = allActions.slice(5);
}

function startBtn() {
  if (
    (mouseX >= 525) & (mouseX <= 525 + 145) && // 535 -> 525
    mouseY >= 20 &&
    mouseY <= 60 &&
    start != "fin"
  ) {
    start = !start;
  }
}

function timerButton() {
  if (
    mouseX > 525 &&
    mouseX < 670 &&
    mouseY > 20 &&
    mouseY < 60 &&
    typeof start == "boolean"
  ) {
    start = !start;
  }
}

function mousePressed() {
  timerButton();
}

function updateActionsQueue() {
  actionsList.shift();
  let next = queuelist.shift();
  if (next !== undefined) {
    actionsList.push(next);
  }
}

function handleArrowInput(arrowKey) {
  const acceptedActions = Object.keys(actionToCoordsMap);
  if (!acceptedActions.includes(arrowKey)) return;

  if (typeof start === "boolean" && !start) start = true;
  if (start !== true) return;

  if (arrowKey == actionsList[0][0]) {
    arrowFeedback = { display: true, state: "correct" };
    setTimeout(() => (arrowFeedback = { display: false, state: "idle" }), 100);
    updateActionsQueue();
  } else {
    arrowFeedback = { display: true, state: "incorrect" };
    setTimeout(() => (arrowFeedback = { display: false, state: "idle" }), 100);
    health = health > 3 ? health - 3 : 0;
  }
}

function taskFinish(action) {
  for (let task of taskBoxes) {
    if (action[1] == task.color) {
      task.complete = true;
    }
  }
}

function keyPressed() {
  if (!getNextActiveTask()) {
    console.log("no actions left");
  }

  const acceptedActions = Object.keys(actionToCoordsMap);
  if (acceptedActions.includes(key)) {
    if (typeof start === "boolean" && !start) {
      start = true;
    }
    if (start === true) {
      if (actionsList[0] == undefined) return;
      let nextAction = actionsList[0][0];
      if (key == nextAction) {
        //correct feedback
        arrowFeedback.display = true;
        arrowFeedback.state = "correct";
        setTimeout(() => {
          arrowFeedback.display = false;
          arrowFeedback.state = "idle";
        }, 100);
        console.log(actionsList[0]);
        if (actionsList[0].length == 3) {
          taskFinish(actionsList[0]);
        }

        updateActionsQueue();
      } else {
        //incorrect feedback
        arrowFeedback.display = true;
        arrowFeedback.state = "incorrect";
        setTimeout(() => {
          arrowFeedback.display = false;
          arrowFeedback.state = "idle";
        }, 100);
        if (health > 3) {
          health -= 3;
        } else {
          health = 0;
          drawTaskBox();
        }
      }
    }
  }
}
