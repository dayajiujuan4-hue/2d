"use strict";


// ======================================================
// CANVAS
// ======================================================

const canvas =
  document.getElementById("gameCanvas");

const ctx =
  canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;


// ======================================================
// UI
// ======================================================

const areaHeader =
  document.getElementById("areaHeader");

const clockElement =
  document.getElementById("clock");

const areaBanner =
  document.getElementById("areaBanner");

const areaBannerName =
  document.getElementById("areaBannerName");

const areaBannerSub =
  document.getElementById("areaBannerSub");

const interactionHint =
  document.getElementById("interactionHint");

const interactionText =
  document.getElementById("interactionText");

const dialogueBox =
  document.getElementById("dialogueBox");

const speakerName =
  document.getElementById("speakerName");

const dialogueText =
  document.getElementById("dialogueText");

const portraitFace =
  document.getElementById("portraitFace");

const fadeLayer =
  document.getElementById("fadeLayer");


// ======================================================
// WORLD
// ======================================================

let currentMapId = "food";

let transitionLock = false;

let exitCooldown = 0;

let bannerTimer = 0;


// ======================================================
// PLAYER
// ======================================================

const player = {

  x: MAPS.food.spawn.x * TILE,

  y: MAPS.food.spawn.y * TILE,

  width: 20,

  height: 26,

  speed: 150,

  direction: "up",

  moving: false

};


// ======================================================
// CAMERA
// ======================================================

const camera = {
  x: 0,
  y: 0
};


// ======================================================
// INPUT
// ======================================================

const keys = {};


window.addEventListener(
  "keydown",
  event => {

    const key =
      event.key.toLowerCase();


    keys[key] = true;


    if (
      [
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        " "
      ].includes(key)
    ) {

      event.preventDefault();

    }


    if (
      !event.repeat &&
      (
        key === "e" ||
        key === "enter"
      )
    ) {

      if (dialogue.active) {

        advanceDialogue();

      }
      else {

        interact();

      }

    }

  }
);


window.addEventListener(
  "keyup",
  event => {

    keys[
      event.key.toLowerCase()
    ] = false;

  }
);


// ======================================================
// DIALOGUE
// ======================================================

const dialogue = {

  active: false,

  npc: null,

  index: 0

};


function startDialogue(npc) {

  dialogue.active = true;

  dialogue.npc = npc;

  dialogue.index = 0;


  speakerName.textContent =
    npc.name;


  dialogueText.textContent =
    npc.dialogue[0];


  portraitFace.textContent =
    npc.label;


  portraitFace.style.background =
    npc.color;


  dialogueBox.classList.remove(
    "hidden"
  );


  interactionHint.classList.add(
    "hidden"
  );

}


function advanceDialogue() {

  dialogue.index++;


  if (
    dialogue.index >=
    dialogue.npc.dialogue.length
  ) {

    closeDialogue();

    return;

  }


  dialogueText.textContent =
    dialogue.npc.dialogue[
      dialogue.index
    ];

}


function closeDialogue() {

  dialogue.active = false;

  dialogue.npc = null;


  dialogueBox.classList.add(
    "hidden"
  );

}


// ======================================================
// NPC SETUP
// ======================================================

for (const npc of NPCS) {

  npc.homeX = npc.x;

  npc.homeY = npc.y;

  npc.moveTimer =
    Math.random() * 2;

  npc.moveX = 0;

  npc.moveY = 0;

}


// ======================================================
// NPC HELPERS
// ======================================================

function getCurrentNPCs() {

  return NPCS.filter(
    npc =>
      npc.map === currentMapId
  );

}


function getNearbyNPC() {

  const px =
    player.x +
    player.width / 2;


  const py =
    player.y +
    player.height / 2;


  let nearest = null;

  let bestDistance = 55;


  for (
    const npc
    of getCurrentNPCs()
  ) {

    const nx =
      npc.x + 11;


    const ny =
      npc.y + 14;


    const distance =
      Math.hypot(
        nx - px,
        ny - py
      );


    if (
      distance <
      bestDistance
    ) {

      bestDistance =
        distance;

      nearest =
        npc;

    }

  }


  return nearest;

}


// ======================================================
// NPC MOVEMENT
// ======================================================

function updateNPCs(dt) {

  if (
    dialogue.active ||
    transitionLock
  ) {

    return;

  }


  for (
    const npc
    of getCurrentNPCs()
  ) {

    if (!npc.wander) {
      continue;
    }


    npc.moveTimer -= dt;


    if (
      npc.moveTimer <= 0
    ) {

      npc.moveTimer =
        1 +
        Math.random() * 2.5;


      const choice =
        Math.floor(
          Math.random() * 5
        );


      npc.moveX = 0;
      npc.moveY = 0;


      if (choice === 0) {

        npc.moveX = 1;

        npc.direction = "right";

      }


      else if (choice === 1) {

        npc.moveX = -1;

        npc.direction = "left";

      }


      else if (choice === 2) {

        npc.moveY = 1;

        npc.direction = "down";

      }


      else if (choice === 3) {

        npc.moveY = -1;

        npc.direction = "up";

      }

    }


    const speed = 18;


    const nx =
      npc.x +
      npc.moveX *
      speed *
      dt;


    const ny =
      npc.y +
      npc.moveY *
      speed *
      dt;


    const range =
      npc.range || 60;


    const tooFar =
      Math.hypot(
        nx - npc.homeX,
        ny - npc.homeY
      ) > range;


    if (tooFar) {

      npc.moveX = 0;
      npc.moveY = 0;

      continue;

    }


    const centerX =
      nx + 11;


    const centerY =
      ny + 14;


    if (
      !isSolidAtPixel(
        centerX,
        centerY
      )
    ) {

      npc.x = nx;
      npc.y = ny;

    }
    else {

      npc.moveX = 0;
      npc.moveY = 0;

    }

  }

}


// ======================================================
// DOORS
// ======================================================

function getNearbyDoor() {

  const map =
    getCurrentMap();


  const px =
    player.x +
    player.width / 2;


  const py =
    player.y +
    player.height / 2;


  for (
    const door
    of map.doors
  ) {

    const centerX =
      (
        door.x +
        door.width / 2
      ) * TILE;


    const centerY =
      (
        door.y +
        .5
      ) * TILE;


    const distance =
      Math.hypot(
        centerX - px,
        centerY - py
      );


    if (
      distance < 55
    ) {

      return door;

    }

  }


  return null;

}


// ======================================================
// INTERACTION
// ======================================================

function interact() {

  const npc =
    getNearbyNPC();


  if (npc) {

    startDialogue(npc);

    return;

  }


  const door =
    getNearbyDoor();


  if (door) {

    changeMap(
      door.target,
      door.targetX,
      door.targetY
    );

  }

}


// ======================================================
// EXIT
// ======================================================

function getActiveExit() {

  if (
    exitCooldown > 0
  ) {

    return null;

  }


  const map =
    getCurrentMap();


  const px =
    player.x +
    player.width / 2;


  const py =
    player.y +
    player.height / 2;


  for (
    const exit
    of map.exits
  ) {

    if (
      isInsideRect(
        px,
        py,
        exit
      )
    ) {

      return exit;

    }

  }


  return null;

}


function checkExitZones() {

  if (
    transitionLock ||
    dialogue.active ||
    exitCooldown > 0
  ) {

    return;

  }


  const exit =
    getActiveExit();


  if (!exit) {
    return;
  }


  changeMap(
    exit.target,
    exit.targetX,
    exit.targetY
  );

}


// ======================================================
// MAP CHANGE
// ======================================================

function changeMap(
  target,
  targetX,
  targetY
) {

  if (transitionLock) {
    return;
  }


  transitionLock = true;


  fadeLayer.classList.add(
    "active"
  );


  setTimeout(
    () => {

      currentMapId =
        target;


      player.x =
        targetX * TILE;


      player.y =
        targetY * TILE;


      player.moving =
        false;


      exitCooldown =
        .9;


      camera.x =
        player.x -
        canvas.width / 2;


      camera.y =
        player.y -
        canvas.height / 2;


      clampCamera();

      showAreaBanner();


      setTimeout(
        () => {

          fadeLayer.classList.remove(
            "active"
          );


          setTimeout(
            () => {

              transitionLock =
                false;

            },
            320
          );

        },
        150
      );

    },
    320
  );

}


// ======================================================
// PLAYER COLLISION
// ======================================================

function playerCollides(
  x,
  y
) {

  const left =
    x + 4;


  const right =
    x +
    player.width - 4;


  const top =
    y + 7;


  const bottom =
    y +
    player.height - 2;


  if (
    isSolidAtPixel(left, top) ||
    isSolidAtPixel(right, top) ||
    isSolidAtPixel(left, bottom) ||
    isSolidAtPixel(right, bottom)
  ) {

    return true;

  }


  for (
    const npc
    of getCurrentNPCs()
  ) {

    const nl =
      npc.x + 4;


    const nr =
      npc.x + 27;


    const nt =
      npc.y + 5;


    const nb =
      npc.y + 29;


    if (
      right > nl &&
      left < nr &&
      bottom > nt &&
      top < nb
    ) {

      return true;

    }

  }


  return false;

}


// ======================================================
// PLAYER
// ======================================================

function updatePlayer(dt) {

  if (
    exitCooldown > 0
  ) {

    exitCooldown -= dt;

  }


  if (
    dialogue.active ||
    transitionLock
  ) {

    player.moving = false;

    return;

  }


  let dx = 0;

  let dy = 0;


  if (
    keys["w"] ||
    keys["arrowup"]
  ) {

    dy--;

    player.direction =
      "up";

  }


  if (
    keys["s"] ||
    keys["arrowdown"]
  ) {

    dy++;

    player.direction =
      "down";

  }


  if (
    keys["a"] ||
    keys["arrowleft"]
  ) {

    dx--;

    player.direction =
      "left";

  }


  if (
    keys["d"] ||
    keys["arrowright"]
  ) {

    dx++;

    player.direction =
      "right";

  }


  if (
    dx !== 0 ||
    dy !== 0
  ) {

    player.moving = true;


    const length =
      Math.hypot(dx, dy);


    dx /= length;

    dy /= length;


    const mx =
      dx *
      player.speed *
      dt;


    const my =
      dy *
      player.speed *
      dt;


    if (
      !playerCollides(
        player.x + mx,
        player.y
      )
    ) {

      player.x += mx;

    }


    if (
      !playerCollides(
        player.x,
        player.y + my
      )
    ) {

      player.y += my;

    }

  }
  else {

    player.moving = false;

  }


  checkExitZones();

}


// ======================================================
// CAMERA
// ======================================================

function clampCamera() {

  const map =
    getCurrentMap();


  const width =
    map.grid[0].length *
    TILE;


  const height =
    map.grid.length *
    TILE;


  camera.x =
    Math.max(
      0,
      Math.min(
        camera.x,
        Math.max(
          0,
          width -
          canvas.width
        )
      )
    );


  camera.y =
    Math.max(
      0,
      Math.min(
        camera.y,
        Math.max(
          0,
          height -
          canvas.height
        )
      )
    );

}


function updateCamera() {

  const targetX =
    player.x -
    canvas.width / 2;


  const targetY =
    player.y -
    canvas.height / 2;


  camera.x +=
    (
      targetX -
      camera.x
    ) * .09;


  camera.y +=
    (
      targetY -
      camera.y
    ) * .09;


  clampCamera();

}


// ======================================================
// FLOOR
// ======================================================

function drawFloor(x, y) {

  ctx.fillStyle =
    "#39343c";


  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  ctx.fillStyle =
    "#454048";


  ctx.fillRect(
    x + 2,
    y + 3,
    13,
    11
  );


  ctx.fillRect(
    x + 17,
    y + 17,
    13,
    12
  );


  ctx.fillStyle =
    "#302c33";


  ctx.fillRect(
    x,
    y + 15,
    TILE,
    1
  );

}


function drawRoad(x, y) {

  ctx.fillStyle =
    "#302e35";


  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  ctx.fillStyle =
    "#3c3941";


  ctx.fillRect(
    x + 2,
    y + 4,
    14,
    10
  );


  ctx.fillRect(
    x + 18,
    y + 18,
    12,
    10
  );

}


function drawPlaza(x, y) {

  ctx.fillStyle =
    "#4b464b";


  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  ctx.fillStyle =
    "#575157";


  ctx.fillRect(
    x + 2,
    y + 2,
    28,
    13
  );


  ctx.fillStyle =
    "#3d393e";


  ctx.fillRect(
    x,
    y + 15,
    TILE,
    2
  );

}


// ======================================================
// BUILDING
// ======================================================

function drawBuilding(
  x,
  y,
  mx,
  my
) {

  let wallColor =
    "#392931";


  if (
    currentMapId ===
    "hotel"
  ) {

    wallColor =
      "#252b35";

  }


  ctx.fillStyle =
    "#18151b";


  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  ctx.fillStyle =
    wallColor;


  ctx.fillRect(
    x + 1,
    y + 1,
    30,
    30
  );


  // windows

  if (
    (mx + my) % 2 === 0
  ) {

    ctx.fillStyle =
      currentMapId === "hotel"
      ? "#d9a75d"
      : "#c98548";


    ctx.fillRect(
      x + 7,
      y + 6,
      18,
      11
    );


    ctx.fillStyle =
      "#322a2b";


    ctx.fillRect(
      x + 15,
      y + 6,
      2,
      11
    );


    ctx.fillRect(
      x + 7,
      y + 11,
      18,
      2
    );

  }

}


// ======================================================
// WATER
// ======================================================

function drawWater(
  x,
  y,
  time
) {

  ctx.fillStyle =
    "#142f43";


  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  const wave =
    Math.sin(
      time * 2 +
      x * .04 +
      y * .03
    ) * 3;


  ctx.fillStyle =
    "#28556d";


  ctx.fillRect(
    x + 4 + wave,
    y + 9,
    15,
    2
  );


  ctx.fillStyle =
    "#397187";


  ctx.fillRect(
    x + 13 - wave,
    y + 22,
    14,
    2
  );

}


// ======================================================
// GRASS
// ======================================================

function drawGrass(x, y) {

  ctx.fillStyle =
    "#263d31";


  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  ctx.fillStyle =
    "#365743";


  ctx.fillRect(
    x + 6,
    y + 7,
    2,
    6
  );


  ctx.fillRect(
    x + 22,
    y + 19,
    2,
    7
  );

}


// ======================================================
// INDOOR
// ======================================================

function drawIndoor(
  x,
  y,
  mx,
  my
) {

  ctx.fillStyle =
    "#74533b";


  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  ctx.fillStyle =
    "#845f42";


  ctx.fillRect(
    x,
    y + 2,
    TILE,
    12
  );


  ctx.fillStyle =
    "#5e422f";


  ctx.fillRect(
    x,
    y + 15,
    TILE,
    2
  );


  if (
    (mx + my) % 2 === 0
  ) {

    ctx.fillStyle =
      "#916849";


    ctx.fillRect(
      x + 3,
      y + 3,
      12,
      9
    );

  }

}


function drawWall(x, y) {

  ctx.fillStyle =
    "#37251f";


  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  ctx.fillStyle =
    "#57392a";


  ctx.fillRect(
    x + 1,
    y + 2,
    30,
    28
  );


  ctx.fillStyle =
    "#7a5133";


  ctx.fillRect(
    x,
    y + 25,
    TILE,
    5
  );

}


function drawCounter(x, y) {

  drawIndoor(
    x,
    y,
    0,
    0
  );


  ctx.fillStyle =
    "#4a3024";


  ctx.fillRect(
    x + 2,
    y + 7,
    28,
    21
  );


  ctx.fillStyle =
    "#91613d";


  ctx.fillRect(
    x,
    y + 5,
    TILE,
    7
  );

}


// ======================================================
// MAP
// ======================================================

function drawMap(time) {

  const map =
    getCurrentMap();


  for (
    let y = 0;
    y < map.grid.length;
    y++
  ) {

    for (
      let x = 0;
      x < map.grid[0].length;
      x++
    ) {

      const sx =
        Math.floor(
          x * TILE -
          camera.x
        );


      const sy =
        Math.floor(
          y * TILE -
          camera.y
        );


      if (
        sx < -TILE ||
        sy < -TILE ||
        sx > canvas.width ||
        sy > canvas.height
      ) {

        continue;

      }


      const tile =
        map.grid[y][x];


      switch (tile) {

        case T.FLOOR:

          drawFloor(sx, sy);

          break;


        case T.ROAD:

          drawRoad(sx, sy);

          break;


        case T.PLAZA:

          drawPlaza(sx, sy);

          break;


        case T.BUILDING:

          drawBuilding(
            sx,
            sy,
            x,
            y
          );

          break;


        case T.WATER:

          drawWater(
            sx,
            sy,
            time
          );

          break;


        case T.GRASS:

          drawGrass(
            sx,
            sy
          );

          break;


        case T.INDOOR:

          drawIndoor(
            sx,
            sy,
            x,
            y
          );

          break;


        case T.WALL:

          drawWall(
            sx,
            sy
          );

          break;


        case T.COUNTER:

          drawCounter(
            sx,
            sy
          );

          break;

      }

    }

  }

}


// ======================================================
// DOORS
// ======================================================

function drawDoors() {

  const map =
    getCurrentMap();


  for (
    const door
    of map.doors
  ) {

    const x =
      door.x * TILE -
      camera.x;


    const y =
      door.y * TILE -
      camera.y;


    const width =
      door.width * TILE;


    ctx.fillStyle =
      "#251719";


    ctx.fillRect(
      x - 3,
      y - 9,
      width + 6,
      TILE + 10
    );


    ctx.fillStyle =
      "#75452d";


    ctx.fillRect(
      x,
      y - 5,
      width,
      TILE + 5
    );


    ctx.fillStyle =
      "#3d2521";


    ctx.fillRect(
      x + 5,
      y,
      width - 10,
      13
    );


    ctx.fillRect(
      x + 5,
      y + 17,
      width - 10,
      12
    );


    ctx.fillStyle =
      "#e3b45e";


    ctx.fillRect(
      x + width - 8,
      y + 15,
      3,
      3
    );

  }

}


// ======================================================
// LANTERNS
// ======================================================

function drawLanternStrings(time) {

  const map =
    getCurrentMap();


  for (
    const string
    of map.lanternStrings
  ) {

    const x1 =
      string.x1 * TILE -
      camera.x;


    const x2 =
      string.x2 * TILE -
      camera.x;


    const y =
      string.y * TILE -
      camera.y;


    ctx.strokeStyle =
      "#241c1c";


    ctx.lineWidth = 2;


    ctx.beginPath();

    ctx.moveTo(
      x1,
      y
    );


    ctx.quadraticCurveTo(
      (x1 + x2) / 2,
      y + 13,
      x2,
      y
    );


    ctx.stroke();


    const count = 7;


    for (
      let i = 0;
      i < count;
      i++
    ) {

      const t =
        i / (count - 1);


      const lx =
        x1 +
        (x2 - x1) * t;


      const curve =
        Math.sin(
          t * Math.PI
        ) * 13;


      const sway =
        Math.sin(
          time * 2 +
          i
        ) * 1.5;


      const ly =
        y +
        curve +
        sway;


      drawLantern(
        lx,
        ly
      );

    }

  }

}


function drawLantern(
  x,
  y
) {

  ctx.fillStyle =
    "rgba(255,120,55,.10)";


  ctx.beginPath();

  ctx.arc(
    x,
    y + 7,
    13,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.fillStyle =
    "#7c2525";


  ctx.fillRect(
    x - 4,
    y,
    8,
    13
  );


  ctx.fillStyle =
    "#d84a32";


  ctx.fillRect(
    x - 5,
    y + 3,
    10,
    7
  );


  ctx.fillStyle =
    "#ffb44e";


  ctx.fillRect(
    x - 2,
    y + 4,
    4,
    5
  );


  ctx.fillStyle =
    "#c99a45";


  ctx.fillRect(
    x - 3,
    y - 2,
    6,
    2
  );


  ctx.fillRect(
    x - 3,
    y + 12,
    6,
    2
  );

}


// ======================================================
// STALLS
// ======================================================

function drawStalls(time) {

  const map =
    getCurrentMap();


  for (
    const stall
    of map.stalls
  ) {

    const x =
      stall.x * TILE -
      camera.x;


    const y =
      stall.y * TILE -
      camera.y;


    const width =
      stall.width * TILE;


    ctx.fillStyle =
      "rgba(0,0,0,.35)";


    ctx.fillRect(
      x + 3,
      y + 27,
      width - 6,
      8
    );


    ctx.fillStyle =
      "#543529";


    ctx.fillRect(
      x + 4,
      y + 13,
      5,
      22
    );


    ctx.fillRect(
      x + width - 9,
      y + 13,
      5,
      22
    );


    ctx.fillStyle =
      "#a73e35";


    ctx.fillRect(
      x,
      y,
      width,
      14
    );


    for (
      let i = 0;
      i < width;
      i += 16
    ) {

      ctx.fillStyle =
        i % 32 === 0
        ? "#d25344"
        : "#e4b15e";


      ctx.fillRect(
        x + i,
        y + 13,
        16,
        6
      );

    }


    ctx.fillStyle =
      "#351717";


    ctx.fillRect(
      x + 10,
      y + 2,
      width - 20,
      11
    );


    ctx.fillStyle =
      "#ffd478";


    ctx.font =
      "bold 12px sans-serif";


    ctx.textAlign =
      "center";


    ctx.fillText(
      stall.sign,
      x + width / 2,
      y + 12
    );


    ctx.fillStyle =
      "#71462e";


    ctx.fillRect(
      x + 5,
      y + 27,
      width - 10,
      10
    );


    drawStallContents(
      stall,
      x,
      y,
      width,
      time
    );

  }

}


// ======================================================
// STALL CONTENT
// ======================================================

function drawStallContents(
  stall,
  x,
  y,
  width,
  time
) {

  if (
    stall.type ===
    "shaokao"
  ) {

    ctx.fillStyle =
      "#241918";


    ctx.fillRect(
      x + 15,
      y + 21,
      width - 30,
      6
    );


    for (
      let i = 18;
      i < width - 18;
      i += 10
    ) {

      ctx.fillStyle =
        "#d1783d";


      ctx.fillRect(
        x + i,
        y + 20,
        6,
        3
      );


      ctx.fillStyle =
        "#d9b068";


      ctx.fillRect(
        x + i + 2,
        y + 17,
        1,
        10
      );

    }


    drawSteam(
      x + width / 2,
      y + 19,
      time
    );

  }


  else if (
    stall.type ===
    "xiaolongbao"
  ) {

    ctx.fillStyle =
      "#a97845";


    ctx.fillRect(
      x + 14,
      y + 20,
      width - 28,
      7
    );


    ctx.fillStyle =
      "#e6ce9c";


    for (
      let i = 18;
      i < width - 18;
      i += 12
    ) {

      ctx.fillRect(
        x + i,
        y + 18,
        7,
        6
      );

    }


    drawSteam(
      x + width / 2,
      y + 18,
      time
    );

  }


  else if (
    stall.type ===
    "milkTea"
  ) {

    for (
      let i = 0;
      i < 5;
      i++
    ) {

      ctx.fillStyle =
        i % 2 === 0
        ? "#d6aa73"
        : "#b87f63";


      ctx.fillRect(
        x + 17 + i * 13,
        y + 19,
        8,
        9
      );


      ctx.fillStyle =
        "#f0dfc3";


      ctx.fillRect(
        x + 18 + i * 13,
        y + 17,
        6,
        2
      );

    }

  }


  else if (
    stall.type ===
    "fruit"
  ) {

    const colors = [
      "#c94e42",
      "#e4a448",
      "#6c9a50",
      "#d96f88"
    ];


    for (
      let i = 0;
      i < 10;
      i++
    ) {

      ctx.fillStyle =
        colors[
          i % colors.length
        ];


      ctx.fillRect(
        x + 14 + i * 7,
        y + 20 + (i % 2) * 3,
        6,
        6
      );

    }

  }


  else if (
    stall.type ===
    "phone"
  ) {

    for (
      let i = 0;
      i < 8;
      i++
    ) {

      ctx.fillStyle =
        [
          "#d85d62",
          "#5b78a2",
          "#d5b052",
          "#725e91"
        ][i % 4];


      ctx.fillRect(
        x + 13 + i * 9,
        y + 18,
        6,
        10
      );

    }

  }


  else {

    for (
      let i = 0;
      i < 8;
      i++
    ) {

      ctx.fillStyle =
        i % 2 === 0
        ? "#d8b15e"
        : "#b56a74";


      ctx.fillRect(
        x + 15 + i * 9,
        y + 21,
        5,
        5
      );

    }

  }

}


function drawSteam(
  x,
  y,
  time
) {

  const offset =
    (time * 12) % 14;


  ctx.fillStyle =
    "rgba(240,230,215,.5)";


  ctx.fillRect(
    x - 10,
    y - offset,
    2,
    5
  );


  ctx.fillRect(
    x,
    y - 6 - offset * .7,
    2,
    5
  );


  ctx.fillRect(
    x + 10,
    y - 2 - offset * .9,
    2,
    4
  );

}


// ======================================================
// SIGNS
// ======================================================

function drawSigns() {

  const map =
    getCurrentMap();


  for (
    const sign
    of map.signs
  ) {

    const x =
      sign.x * TILE -
      camera.x;


    const y =
      sign.y * TILE -
      camera.y;


    const width =
      Math.max(
        70,
        sign.text.length * 20
      );


    ctx.fillStyle =
      "#4c1d1d";


    ctx.fillRect(
      x - 3,
      y - 3,
      width + 6,
      31
    );


    ctx.fillStyle =
      currentMapId === "market"
      ? "#63315f"
      : "#9a372f";


    ctx.fillRect(
      x,
      y,
      width,
      25
    );


    ctx.fillStyle =
      "#ffe09a";


    ctx.font =
      "bold 14px sans-serif";


    ctx.textAlign =
      "center";


    ctx.fillText(
      sign.text,
      x + width / 2,
      y + 18
    );

  }

}


// ======================================================
// PROPS
// ======================================================

function drawProps(time) {

  const map =
    getCurrentMap();


  for (
    const prop
    of map.props
  ) {

    const x =
      prop.x * TILE -
      camera.x;


    const y =
      prop.y * TILE -
      camera.y;


    drawProp(
      prop.type,
      x,
      y,
      time
    );

  }

}


function drawProp(
  type,
  x,
  y,
  time
) {

  if (
    type === "table"
  ) {

    ctx.fillStyle =
      "#70462e";


    ctx.fillRect(
      x + 3,
      y + 10,
      26,
      12
    );


    ctx.fillStyle =
      "#98613b";


    ctx.fillRect(
      x + 1,
      y + 8,
      30,
      7
    );

  }


  else if (
    type === "chair"
  ) {

    ctx.fillStyle =
      "#77482e";


    ctx.fillRect(
      x + 9,
      y + 9,
      14,
      13
    );


    ctx.fillRect(
      x + 9,
      y + 21,
      3,
      8
    );


    ctx.fillRect(
      x + 20,
      y + 21,
      3,
      8
    );

  }


  else if (
    type === "bike"
  ) {

    ctx.strokeStyle =
      "#b8a58c";


    ctx.lineWidth = 2;


    ctx.beginPath();

    ctx.arc(
      x + 8,
      y + 22,
      6,
      0,
      Math.PI * 2
    );


    ctx.arc(
      x + 24,
      y + 22,
      6,
      0,
      Math.PI * 2
    );


    ctx.moveTo(
      x + 8,
      y + 22
    );


    ctx.lineTo(
      x + 15,
      y + 12
    );


    ctx.lineTo(
      x + 24,
      y + 22
    );


    ctx.lineTo(
      x + 12,
      y + 21
    );


    ctx.lineTo(
      x + 19,
      y + 16
    );


    ctx.stroke();

  }


  else if (
    type === "scooter"
  ) {

    ctx.fillStyle =
      "#30333c";


    ctx.fillRect(
      x + 8,
      y + 14,
      17,
      10
    );


    ctx.fillStyle =
      "#8d3436";


    ctx.fillRect(
      x + 10,
      y + 9,
      11,
      11
    );


    ctx.fillStyle =
      "#16171b";


    ctx.fillRect(
      x + 7,
      y + 23,
      6,
      5
    );


    ctx.fillRect(
      x + 22,
      y + 23,
      6,
      5
    );

  }


  else if (
    type === "trash"
  ) {

    ctx.fillStyle =
      "#38494b";


    ctx.fillRect(
      x + 8,
      y + 7,
      16,
      22
    );


    ctx.fillStyle =
      "#657475";


    ctx.fillRect(
      x + 6,
      y + 5,
      20,
      5
    );

  }


  else if (
    type === "plant"
  ) {

    ctx.fillStyle =
      "#825136";


    ctx.fillRect(
      x + 10,
      y + 20,
      13,
      10
    );


    ctx.fillStyle =
      "#376044";


    ctx.fillRect(
      x + 14,
      y + 7,
      5,
      15
    );


    ctx.fillRect(
      x + 7,
      y + 11,
      10,
      5
    );


    ctx.fillRect(
      x + 17,
      y + 12,
      10,
      5
    );

  }


  else if (
    type === "ac"
  ) {

    ctx.fillStyle =
      "#b5aaa0";


    ctx.fillRect(
      x + 4,
      y + 8,
      25,
      16
    );


    ctx.fillStyle =
      "#5d5b5b";


    ctx.fillRect(
      x + 8,
      y + 12,
      10,
      8
    );


    ctx.fillStyle =
      "#7b7470";


    ctx.fillRect(
      x + 21,
      y + 11,
      4,
      10
    );

  }


  else if (
    type === "menu"
  ) {

    ctx.fillStyle =
      "#36231d";


    ctx.fillRect(
      x + 7,
      y + 3,
      18,
      28
    );


    ctx.fillStyle =
      "#e4c590";


    ctx.fillRect(
      x + 9,
      y + 5,
      14,
      20
    );


    ctx.fillStyle =
      "#74322d";


    ctx.fillRect(
      x + 12,
      y + 8,
      8,
      2
    );


    ctx.fillRect(
      x + 12,
      y + 13,
      8,
      2
    );


    ctx.fillRect(
      x + 12,
      y + 18,
      8,
      2
    );

  }


  else if (
    type === "bench"
  ) {

    ctx.fillStyle =
      "#70452d";


    ctx.fillRect(
      x + 3,
      y + 10,
      27,
      5
    );


    ctx.fillRect(
      x + 3,
      y + 18,
      27,
      5
    );


    ctx.fillStyle =
      "#312a28";


    ctx.fillRect(
      x + 6,
      y + 22,
      3,
      7
    );


    ctx.fillRect(
      x + 24,
      y + 22,
      3,
      7
    );

  }


  else if (
    type === "clothes"
  ) {

    ctx.fillStyle =
      "#4b3a36";


    ctx.fillRect(
      x + 5,
      y + 5,
      3,
      25
    );


    ctx.fillRect(
      x + 25,
      y + 5,
      3,
      25
    );


    ctx.fillRect(
      x + 5,
      y + 5,
      23,
      3
    );


    const colors = [
      "#9b4b5b",
      "#486b88",
      "#b58645"
    ];


    for (
      let i = 0;
      i < 3;
      i++
    ) {

      ctx.fillStyle =
        colors[i];


      ctx.fillRect(
        x + 8 + i * 6,
        y + 10,
        5,
        12
      );

    }

  }


  else if (
    type === "streetlight"
  ) {

    ctx.fillStyle =
      "#29282c";


    ctx.fillRect(
      x + 15,
      y + 8,
      3,
      23
    );


    ctx.fillStyle =
      "rgba(255,208,113,.15)";


    ctx.beginPath();

    ctx.arc(
      x + 16,
      y + 7,
      13,
      0,
      Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
      "#f4c76b";


    ctx.fillRect(
      x + 11,
      y + 3,
      11,
      8
    );

  }


  else if (
    type === "tree"
  ) {

    ctx.fillStyle =
      "#493427";


    ctx.fillRect(
      x + 14,
      y + 15,
      5,
      17
    );


    ctx.fillStyle =
      "#29483a";


    ctx.fillRect(
      x + 4,
      y + 3,
      25,
      18
    );


    ctx.fillStyle =
      "#355d48";


    ctx.fillRect(
      x + 9,
      y,
      16,
      12
    );

  }


  else if (
    type === "taxi" ||
    type === "car"
  ) {

    ctx.fillStyle =
      type === "taxi"
      ? "#c99a39"
      : "#3b4b64";


    ctx.fillRect(
      x,
      y + 11,
      54,
      16
    );


    ctx.fillRect(
      x + 12,
      y + 5,
      29,
      11
    );


    ctx.fillStyle =
      "#20242c";


    ctx.fillRect(
      x + 16,
      y + 7,
      10,
      7
    );


    ctx.fillRect(
      x + 28,
      y + 7,
      9,
      7
    );


    ctx.fillStyle =
      "#151519";


    ctx.fillRect(
      x + 7,
      y + 24,
      10,
      7
    );


    ctx.fillRect(
      x + 39,
      y + 24,
      10,
      7
    );

  }


  else if (
    type === "signpost"
  ) {

    ctx.fillStyle =
      "#323136";


    ctx.fillRect(
      x + 15,
      y + 7,
      3,
      25
    );


    ctx.fillStyle =
      "#355d75";


    ctx.fillRect(
      x + 3,
      y + 4,
      28,
      9
    );


    ctx.fillStyle =
      "#e9e4d9";


    ctx.font =
      "7px sans-serif";


    ctx.textAlign =
      "center";


    ctx.fillText(
      "西湖 →",
      x + 17,
      y + 11
    );

  }


  else if (
    type === "teaTable"
  ) {

    ctx.fillStyle =
      "#4c3024";


    ctx.fillRect(
      x - 5,
      y + 9,
      40,
      12
    );


    ctx.fillStyle =
      "#795035";


    ctx.fillRect(
      x - 2,
      y + 6,
      34,
      9
    );


    ctx.fillStyle =
      "#cab46f";


    ctx.fillRect(
      x + 12,
      y + 1,
      8,
      6
    );


    ctx.fillRect(
      x + 19,
      y + 3,
      4,
      2
    );

  }


  else if (
    type === "shelf"
  ) {

    ctx.fillStyle =
      "#4d3024";


    ctx.fillRect(
      x + 3,
      y,
      26,
      31
    );


    ctx.fillStyle =
      "#8a5b3a";


    ctx.fillRect(
      x + 5,
      y + 3,
      22,
      4
    );


    ctx.fillRect(
      x + 5,
      y + 14,
      22,
      4
    );


    ctx.fillRect(
      x + 5,
      y + 25,
      22,
      4
    );


    ctx.fillStyle =
      "#c6a55f";


    ctx.fillRect(
      x + 8,
      y + 8,
      5,
      6
    );


    ctx.fillRect(
      x + 17,
      y + 8,
      6,
      6
    );


    ctx.fillRect(
      x + 10,
      y + 19,
      6,
      6
    );

  }

}


// ======================================================
// EXIT
// ======================================================

function drawExits(time) {

  const map =
    getCurrentMap();


  for (
    const exit
    of map.exits
  ) {

    const x =
      exit.x * TILE -
      camera.x;


    const y =
      exit.y * TILE -
      camera.y;


    const width =
      exit.width * TILE;


    const height =
      exit.height * TILE;


    const pulse =
      .10 +
      Math.sin(time * 3) *
      .025;


    ctx.fillStyle =
      `rgba(224,174,82,${pulse})`;


    ctx.fillRect(
      x,
      y,
      width,
      height
    );


    const signWidth =
      Math.min(
        width - 20,
        180
      );


    const signX =
      x +
      width / 2 -
      signWidth / 2;


    const signY =
      y +
      height / 2 -
      13;


    ctx.fillStyle =
      "#37261d";


    ctx.fillRect(
      signX - 3,
      signY - 3,
      signWidth + 6,
      28
    );


    ctx.fillStyle =
      "#7d5233";


    ctx.fillRect(
      signX,
      signY,
      signWidth,
      22
    );


    ctx.fillStyle =
      "#f4d08a";


    ctx.font =
      "bold 12px sans-serif";


    ctx.textAlign =
      "center";


    ctx.fillText(
      exit.label,
      signX + signWidth / 2,
      signY + 15
    );

  }

}


// ======================================================
// WEST LAKE DETAILS
// ======================================================

function drawLakeDetails(time) {

  if (
    currentMapId !== "lake"
  ) {

    return;

  }


  // willow trees

  for (
    let i = 0;
    i < 7;
    i++
  ) {

    const x =
      17 * TILE -
      camera.x;


    const y =
      (4 + i * 4) *
      TILE -
      camera.y;


    ctx.fillStyle =
      "#3d2d23";


    ctx.fillRect(
      x,
      y,
      5,
      30
    );


    ctx.fillStyle =
      "#285039";


    ctx.fillRect(
      x - 15,
      y - 10,
      33,
      14
    );


    const sway =
      Math.sin(
        time * 1.5 +
        i
      ) * 3;


    ctx.fillStyle =
      "#396448";


    ctx.fillRect(
      x - 10 + sway,
      y + 2,
      3,
      29
    );


    ctx.fillRect(
      x + 9 + sway,
      y,
      3,
      25
    );

  }


  // distant reflected lights

  for (
    let i = 0;
    i < 8;
    i++
  ) {

    const x =
      (3 + i) *
      TILE -
      camera.x;


    const y =
      13 *
      TILE -
      camera.y;


    const height =
      10 +
      Math.sin(
        time * 2 + i
      ) * 5;


    ctx.fillStyle =
      "rgba(244,190,93,.42)";


    ctx.fillRect(
      x,
      y,
      3,
      height
    );

  }


  // boat

  const boatX =
    7 * TILE -
    camera.x +
    Math.sin(time * .5) * 15;


  const boatY =
    22 * TILE -
    camera.y;


  ctx.fillStyle =
    "#3c261f";


  ctx.fillRect(
    boatX,
    boatY,
    42,
    8
  );


  ctx.fillStyle =
    "#7e382b";


  ctx.fillRect(
    boatX + 8,
    boatY - 10,
    25,
    11
  );


  ctx.fillStyle =
    "#e3b35e";


  ctx.fillRect(
    boatX + 12,
    boatY - 7,
    5,
    5
  );


  ctx.fillRect(
    boatX + 24,
    boatY - 7,
    5,
    5
  );

}


// ======================================================
// TEA HOUSE DECOR
// ======================================================

function drawTeaHouseDecor() {

  if (
    currentMapId !== "tea"
  ) {

    return;

  }


  const sx =
    13 * TILE -
    camera.x;


  const sy =
    3 * TILE -
    camera.y;


  ctx.fillStyle =
    "#dfcda3";


  ctx.fillRect(
    sx - 16,
    sy + 2,
    32,
    49
  );


  ctx.fillStyle =
    "#392b21";


  ctx.font =
    "20px serif";


  ctx.textAlign =
    "center";


  ctx.fillText(
    "茶",
    sx,
    sy + 32
  );


  // hanging lanterns

  drawLantern(
    5 * TILE -
    camera.x,
    4 * TILE -
    camera.y
  );


  drawLantern(
    21 * TILE -
    camera.x,
    4 * TILE -
    camera.y
  );

}


// ======================================================
// CHARACTER
// ======================================================

function drawPerson(
  x,
  y,
  data,
  moving,
  time
) {

  const step =
    moving &&
    Math.sin(time * 11) > 0
    ? 1
    : -1;


  ctx.fillStyle =
    "rgba(0,0,0,.35)";


  ctx.fillRect(
    x + 3,
    y + 24,
    16,
    4
  );


  ctx.fillStyle =
    "#292630";


  ctx.fillRect(
    x + 5,
    y + 19 + step,
    5,
    7
  );


  ctx.fillRect(
    x + 12,
    y + 19 - step,
    5,
    7
  );


  ctx.fillStyle =
    data.color;


  ctx.fillRect(
    x + 3,
    y + 9,
    16,
    12
  );


  ctx.fillStyle =
    data.skin;


  ctx.fillRect(
    x + 1,
    y + 11,
    3,
    8
  );


  ctx.fillRect(
    x + 19,
    y + 11,
    3,
    8
  );


  ctx.fillRect(
    x + 5,
    y + 2,
    12,
    9
  );


  ctx.fillStyle =
    data.hair;


  ctx.fillRect(
    x + 4,
    y,
    14,
    5
  );


  ctx.fillRect(
    x + 4,
    y + 3,
    3,
    5
  );


  ctx.fillStyle =
    "#251d1d";


  if (
    data.direction === "down"
  ) {

    ctx.fillRect(
      x + 8,
      y + 6,
      2,
      2
    );


    ctx.fillRect(
      x + 14,
      y + 6,
      2,
      2
    );

  }


  else if (
    data.direction === "left"
  ) {

    ctx.fillRect(
      x + 6,
      y + 6,
      2,
      2
    );

  }


  else if (
    data.direction === "right"
  ) {

    ctx.fillRect(
      x + 15,
      y + 6,
      2,
      2
    );

  }

}


// ======================================================
// ENTITIES
// ======================================================

function drawEntities(time) {

  const entities = [];


  for (
    const npc
    of getCurrentNPCs()
  ) {

    entities.push({

      y: npc.y,

      draw: () => {

        const moving =
          npc.wander &&
          (
            npc.moveX !== 0 ||
            npc.moveY !== 0
          );


        drawPerson(

          Math.floor(
            npc.x -
            camera.x +
            5
          ),

          Math.floor(
            npc.y -
            camera.y +
            3
          ),

          npc,

          moving,

          time
        );

      }

    });

  }


  entities.push({

    y: player.y,

    draw: () => {

      drawPerson(

        Math.floor(
          player.x -
          camera.x
        ),

        Math.floor(
          player.y -
          camera.y
        ),

        {
          color:"#355f7d",

          hair:"#211b20",

          skin:"#e1ae87",

          direction:
            player.direction
        },

        player.moving,

        time
      );

    }

  });


  entities.sort(
    (a,b) =>
      a.y - b.y
  );


  for (
    const entity
    of entities
  ) {

    entity.draw();

  }

}


// ======================================================
// LIGHTING
// ======================================================

function drawLighting() {

  const ambient =
    getCurrentMap()
      .ambient;


  if (
    ambient === "indoor"
  ) {

    ctx.fillStyle =
      "rgba(88,42,10,.06)";

  }


  else if (
    ambient === "lake"
  ) {

    ctx.fillStyle =
      "rgba(4,20,43,.18)";

  }


  else if (
    ambient === "city"
  ) {

    ctx.fillStyle =
      "rgba(13,13,32,.13)";

  }


  else {

    ctx.fillStyle =
      "rgba(15,8,31,.15)";

  }


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}


// ======================================================
// AREA BANNER
// ======================================================

function showAreaBanner() {

  const map =
    getCurrentMap();


  areaHeader.textContent =
    map.name;


  areaBannerName.textContent =
    map.name;


  areaBannerSub.textContent =
    map.subtitle;


  areaBanner.classList.remove(
    "hidden"
  );


  bannerTimer =
    2.5;

}


function updateBanner(dt) {

  if (
    bannerTimer <= 0
  ) {

    return;

  }


  bannerTimer -= dt;


  if (
    bannerTimer <= 0
  ) {

    areaBanner.classList.add(
      "hidden"
    );

  }

}


// ======================================================
// INTERACTION HINT
// ======================================================

function updateInteractionHint() {

  if (
    dialogue.active ||
    transitionLock
  ) {

    interactionHint.classList.add(
      "hidden"
    );

    return;

  }


  const npc =
    getNearbyNPC();


  if (npc) {

    interactionText.textContent =
      "話す";


    interactionHint.classList.remove(
      "hidden"
    );


    return;

  }


  const door =
    getNearbyDoor();


  if (door) {

    interactionText.textContent =
      door.label;


    interactionHint.classList.remove(
      "hidden"
    );


    return;

  }


  interactionHint.classList.add(
    "hidden"
  );

}


// ======================================================
// CLOCK
// ======================================================

let fakeMinutes =
  19 * 60 + 42;


function updateClock(dt) {

  fakeMinutes +=
    dt * .15;


  const total =
    Math.floor(
      fakeMinutes
    );


  const hour =
    Math.floor(
      total / 60
    ) % 24;


  const minute =
    total % 60;


  clockElement.textContent =
    `${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}`;

}


// ======================================================
// DRAW
// ======================================================

function draw(time) {

  ctx.fillStyle =
    "#100d14";


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  drawMap(time);

  drawLakeDetails(time);

  drawTeaHouseDecor();

  drawDoors();

  drawLanternStrings(time);

  drawStalls(time);

  drawSigns();

  drawProps(time);

  drawExits(time);

  drawEntities(time);

  drawLighting();

}


// ======================================================
// LOOP
// ======================================================

let previousTime =
  performance.now();


function gameLoop(now) {

  let dt =
    (
      now -
      previousTime
    ) / 1000;


  previousTime =
    now;


  dt =
    Math.min(
      dt,
      .05
    );


  const time =
    now / 1000;


  updatePlayer(dt);

  updateNPCs(dt);

  updateCamera();

  updateBanner(dt);

  updateInteractionHint();

  updateClock(dt);

  draw(time);


  requestAnimationFrame(
    gameLoop
  );

}


// ======================================================
// START
// ======================================================

showAreaBanner();

updateCamera();

requestAnimationFrame(
  gameLoop
);
