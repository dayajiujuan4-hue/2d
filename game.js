"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;


// ========================================
// UI
// ========================================

const dialogueBox =
  document.getElementById("dialogueBox");

const speakerName =
  document.getElementById("speakerName");

const dialogueText =
  document.getElementById("dialogueText");

const portraitFace =
  document.getElementById("portraitFace");

const interactionHint =
  document.getElementById("interactionHint");


// ========================================
// PLAYER
// ========================================

const player = {

  x: 20 * TILE,
  y: 24 * TILE,

  width: 20,
  height: 24,

  speed: 150,

  direction: "up",

  moving: false,

  animationTime: 0

};


// ========================================
// CAMERA
// ========================================

const camera = {

  x: 0,
  y: 0

};


// ========================================
// INPUT
// ========================================

const keys = {};

window.addEventListener("keydown", event => {

  const key = event.key.toLowerCase();

  keys[key] = true;

  if (
    key === "arrowup" ||
    key === "arrowdown" ||
    key === "arrowleft" ||
    key === "arrowright" ||
    key === " "
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
      tryInteraction();
    }

  }

});


window.addEventListener("keyup", event => {

  keys[event.key.toLowerCase()] = false;

});


// ========================================
// DIALOGUE STATE
// ========================================

const dialogue = {

  active: false,

  npc: null,

  index: 0

};


function startDialogue(npc) {

  dialogue.active = true;
  dialogue.npc = npc;
  dialogue.index = 0;

  dialogueBox.classList.remove("hidden");
  interactionHint.classList.add("hidden");

  speakerName.textContent = npc.name;

  portraitFace.textContent = npc.label;
  portraitFace.style.background = npc.color;

  dialogueText.textContent =
    npc.dialogue[0];

}


function advanceDialogue() {

  if (!dialogue.active) return;

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

  dialogueBox.classList.add("hidden");

}


function tryInteraction() {

  const npc = getNearbyNPC();

  if (npc) {
    startDialogue(npc);
  }

}


// ========================================
// NPC DISTANCE
// ========================================

function getNearbyNPC() {

  const playerCenterX =
    player.x + player.width / 2;

  const playerCenterY =
    player.y + player.height / 2;

  let nearest = null;
  let nearestDistance = 55;

  for (const npc of NPCS) {

    const dx =
      npc.x + 10 - playerCenterX;

    const dy =
      npc.y + 12 - playerCenterY;

    const distance =
      Math.hypot(dx, dy);

    if (distance < nearestDistance) {

      nearestDistance = distance;
      nearest = npc;

    }

  }

  return nearest;
}


// ========================================
// COLLISION
// ========================================

function playerCollides(x, y) {

  const margin = 4;

  const left =
    x + margin;

  const right =
    x + player.width - margin;

  const top =
    y + 8;

  const bottom =
    y + player.height - 2;


  if (
    isSolidAtPixel(left, top) ||
    isSolidAtPixel(right, top) ||
    isSolidAtPixel(left, bottom) ||
    isSolidAtPixel(right, bottom)
  ) {
    return true;
  }


  for (const npc of NPCS) {

    const npcLeft =
      npc.x + 5;

    const npcRight =
      npc.x + 25;

    const npcTop =
      npc.y + 5;

    const npcBottom =
      npc.y + 29;


    if (
      right > npcLeft &&
      left < npcRight &&
      bottom > npcTop &&
      top < npcBottom
    ) {
      return true;
    }

  }

  return false;
}


// ========================================
// UPDATE PLAYER
// ========================================

function updatePlayer(dt) {

  if (dialogue.active) {

    player.moving = false;
    return;

  }

  let dx = 0;
  let dy = 0;


  if (
    keys["w"] ||
    keys["arrowup"]
  ) {

    dy -= 1;
    player.direction = "up";

  }


  if (
    keys["s"] ||
    keys["arrowdown"]
  ) {

    dy += 1;
    player.direction = "down";

  }


  if (
    keys["a"] ||
    keys["arrowleft"]
  ) {

    dx -= 1;
    player.direction = "left";

  }


  if (
    keys["d"] ||
    keys["arrowright"]
  ) {

    dx += 1;
    player.direction = "right";

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


    const moveX =
      dx * player.speed * dt;

    const moveY =
      dy * player.speed * dt;


    if (
      !playerCollides(
        player.x + moveX,
        player.y
      )
    ) {

      player.x += moveX;

    }


    if (
      !playerCollides(
        player.x,
        player.y + moveY
      )
    ) {

      player.y += moveY;

    }


    player.animationTime += dt;

  }
  else {

    player.moving = false;
    player.animationTime = 0;

  }

}


// ========================================
// CAMERA
// ========================================

function updateCamera() {

  const targetX =
    player.x -
    canvas.width / 2;

  const targetY =
    player.y -
    canvas.height / 2;


  camera.x +=
    (targetX - camera.x) * 0.08;

  camera.y +=
    (targetY - camera.y) * 0.08;


  const maxX =
    MAP_WIDTH * TILE -
    canvas.width;

  const maxY =
    MAP_HEIGHT * TILE -
    canvas.height;


  camera.x =
    Math.max(
      0,
      Math.min(
        camera.x,
        maxX
      )
    );


  camera.y =
    Math.max(
      0,
      Math.min(
        camera.y,
        maxY
      )
    );

}


// ========================================
// DRAW TILE
// ========================================

function drawTile(
  tile,
  screenX,
  screenY,
  mapX,
  mapY
) {

  switch (tile) {

    // ------------------------------
    // 石畳
    // ------------------------------

    case 0:

      ctx.fillStyle = "#39333c";
      ctx.fillRect(
        screenX,
        screenY,
        TILE,
        TILE
      );

      ctx.strokeStyle = "#49414b";
      ctx.lineWidth = 1;

      ctx.beginPath();

      ctx.moveTo(
        screenX,
        screenY + 16
      );

      ctx.lineTo(
        screenX + TILE,
        screenY + 16
      );

      ctx.moveTo(
        screenX + 16,
        screenY
      );

      ctx.lineTo(
        screenX + 16,
        screenY + TILE
      );

      ctx.stroke();

      break;


    // ------------------------------
    // メイン道路
    // ------------------------------

    case 1:

      ctx.fillStyle = "#403942";

      ctx.fillRect(
        screenX,
        screenY,
        TILE,
        TILE
      );


      ctx.fillStyle = "#49414a";

      ctx.fillRect(
        screenX + 2,
        screenY + 7,
        13,
        7
      );

      ctx.fillRect(
        screenX + 18,
        screenY + 18,
        12,
        7
      );

      break;


    // ------------------------------
    // 建物
    // ------------------------------

    case 2:

      drawBuildingTile(
        screenX,
        screenY,
        mapX,
        mapY
      );

      break;


    // ------------------------------
    // 屋台
    // ------------------------------

    case 3:

      drawGround(
        screenX,
        screenY
      );

      drawStall(
        screenX,
        screenY
      );

      break;


    // ------------------------------
    // 木
    // ------------------------------

    case 4:

      drawGround(
        screenX,
        screenY
      );

      drawTree(
        screenX,
        screenY
      );

      break;


    // ------------------------------
    // 提灯
    // ------------------------------

    case 5:

      drawGround(
        screenX,
        screenY
      );

      drawLanternPost(
        screenX,
        screenY
      );

      break;


    // ------------------------------
    // 路地
    // ------------------------------

    case 6:

      ctx.fillStyle = "#27242a";

      ctx.fillRect(
        screenX,
        screenY,
        TILE,
        TILE
      );

      break;


    // ------------------------------
    // 広場
    // ------------------------------

    case 7:

      ctx.fillStyle = "#51454a";

      ctx.fillRect(
        screenX,
        screenY,
        TILE,
        TILE
      );


      ctx.fillStyle = "#5b4c50";

      ctx.fillRect(
        screenX + 3,
        screenY + 3,
        12,
        12
      );

      ctx.fillRect(
        screenX + 18,
        screenY + 18,
        11,
        11
      );

      break;

  }

}


// ========================================
// GROUND
// ========================================

function drawGround(x, y) {

  ctx.fillStyle = "#39333c";

  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );

}


// ========================================
// BUILDINGS
// ========================================

function drawBuildingTile(
  x,
  y,
  mapX,
  mapY
) {

  ctx.fillStyle = "#241d25";

  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  // レンガ

  ctx.fillStyle = "#332630";

  ctx.fillRect(
    x + 2,
    y + 3,
    28,
    12
  );


  ctx.fillStyle = "#4a3237";

  ctx.fillRect(
    x + 4,
    y + 19,
    24,
    11
  );


  // 時々ネオン窓

  if (
    (mapX + mapY) % 3 === 0
  ) {

    ctx.fillStyle = "#d39452";

    ctx.fillRect(
      x + 9,
      y + 8,
      14,
      8
    );


    ctx.fillStyle = "#6e342d";

    ctx.fillRect(
      x + 10,
      y + 9,
      12,
      2
    );

  }

}


// ========================================
// STALL
// ========================================

function drawStall(x, y) {

  // 柱

  ctx.fillStyle = "#56382c";

  ctx.fillRect(
    x + 4,
    y + 11,
    3,
    19
  );

  ctx.fillRect(
    x + 25,
    y + 11,
    3,
    19
  );


  // 赤い屋根

  ctx.fillStyle = "#a73c36";

  ctx.fillRect(
    x + 2,
    y + 5,
    28,
    8
  );


  ctx.fillStyle = "#d9a75c";

  ctx.fillRect(
    x + 4,
    y + 13,
    24,
    3
  );


  // 台

  ctx.fillStyle = "#714c32";

  ctx.fillRect(
    x + 5,
    y + 22,
    22,
    8
  );


  // 灯り

  ctx.fillStyle = "#f0c36a";

  ctx.fillRect(
    x + 9,
    y + 17,
    4,
    4
  );

  ctx.fillRect(
    x + 19,
    y + 17,
    4,
    4
  );

}


// ========================================
// TREE
// ========================================

function drawTree(x, y) {

  ctx.fillStyle = "#453427";

  ctx.fillRect(
    x + 14,
    y + 18,
    5,
    13
  );


  ctx.fillStyle = "#17382d";

  ctx.fillRect(
    x + 6,
    y + 5,
    20,
    17
  );


  ctx.fillStyle = "#24523c";

  ctx.fillRect(
    x + 10,
    y + 2,
    13,
    7
  );


  ctx.fillStyle = "#31634a";

  ctx.fillRect(
    x + 7,
    y + 8,
    7,
    6
  );

}


// ========================================
// LANTERN POST
// ========================================

function drawLanternPost(x, y) {

  ctx.fillStyle = "#33251e";

  ctx.fillRect(
    x + 15,
    y + 8,
    3,
    23
  );


  // glow

  ctx.fillStyle =
    "rgba(238,111,55,0.20)";

  ctx.fillRect(
    x + 7,
    y,
    18,
    18
  );


  ctx.fillStyle = "#c94a36";

  ctx.fillRect(
    x + 10,
    y + 3,
    13,
    11
  );


  ctx.fillStyle = "#ffca6a";

  ctx.fillRect(
    x + 13,
    y + 5,
    7,
    7
  );

}


// ========================================
// MAP
// ========================================

function drawMap() {

  const startX =
    Math.floor(camera.x / TILE);

  const startY =
    Math.floor(camera.y / TILE);


  const endX =
    Math.ceil(
      (camera.x + canvas.width) /
      TILE
    );

  const endY =
    Math.ceil(
      (camera.y + canvas.height) /
      TILE
    );


  for (
    let y = startY;
    y <= endY;
    y++
  ) {

    for (
      let x = startX;
      x <= endX;
      x++
    ) {

      if (
        x < 0 ||
        y < 0 ||
        x >= MAP_WIDTH ||
        y >= MAP_HEIGHT
      ) {
        continue;
      }


      const screenX =
        Math.floor(
          x * TILE -
          camera.x
        );

      const screenY =
        Math.floor(
          y * TILE -
          camera.y
        );


      drawTile(
        gameMap[y][x],
        screenX,
        screenY,
        x,
        y
      );

    }

  }

}


// ========================================
// NPC
// ========================================

function drawNPC(npc) {

  const x =
    Math.floor(
      npc.x -
      camera.x +
      6
    );

  const y =
    Math.floor(
      npc.y -
      camera.y +
      4
    );


  // shadow

  ctx.fillStyle =
    "rgba(0,0,0,0.35)";

  ctx.fillRect(
    x + 3,
    y + 23,
    14,
    4
  );


  // legs

  ctx.fillStyle = "#28232b";

  ctx.fillRect(
    x + 5,
    y + 18,
    4,
    7
  );

  ctx.fillRect(
    x + 12,
    y + 18,
    4,
    7
  );


  // body

  ctx.fillStyle = npc.color;

  ctx.fillRect(
    x + 3,
    y + 9,
    15,
    12
  );


  // face

  ctx.fillStyle = "#e1b08a";

  ctx.fillRect(
    x + 5,
    y + 2,
    11,
    9
  );


  // hair

  ctx.fillStyle = "#30252a";

  ctx.fillRect(
    x + 4,
    y,
    13,
    4
  );


  // eyes

  ctx.fillStyle = "#2b2020";

  ctx.fillRect(
    x + 7,
    y + 6,
    2,
    2
  );

  ctx.fillRect(
    x + 13,
    y + 6,
    2,
    2
  );

}


// ========================================
// PLAYER
// ========================================

function drawPlayer() {

  const x =
    Math.floor(
      player.x -
      camera.x
    );

  const y =
    Math.floor(
      player.y -
      camera.y
    );


  let bob = 0;


  if (player.moving) {

    bob =
      Math.sin(
        player.animationTime * 15
      ) > 0
        ? 1
        : 0;

  }


  // shadow

  ctx.fillStyle =
    "rgba(0,0,0,0.4)";

  ctx.fillRect(
    x + 3,
    y + 21,
    14,
    4
  );


  // legs

  ctx.fillStyle = "#242331";

  ctx.fillRect(
    x + 4,
    y + 17 + bob,
    5,
    7
  );

  ctx.fillRect(
    x + 12,
    y + 17 - bob,
    5,
    7
  );


  // jacket

  ctx.fillStyle = "#355b77";

  ctx.fillRect(
    x + 3,
    y + 9,
    15,
    11
  );


  // shirt

  ctx.fillStyle = "#d7c3a4";

  ctx.fillRect(
    x + 9,
    y + 10,
    4,
    8
  );


  // face

  ctx.fillStyle = "#e3b38f";

  ctx.fillRect(
    x + 5,
    y + 2,
    11,
    9
  );


  // hair

  ctx.fillStyle = "#231d22";

  ctx.fillRect(
    x + 4,
    y,
    13,
    4
  );


  ctx.fillRect(
    x + 4,
    y + 3,
    3,
    5
  );


  // direction indication

  ctx.fillStyle = "#2a2020";


  if (
    player.direction === "down"
  ) {

    ctx.fillRect(
      x + 7,
      y + 6,
      2,
      2
    );

    ctx.fillRect(
      x + 13,
      y + 6,
      2,
      2
    );

  }


  if (
    player.direction === "left"
  ) {

    ctx.fillRect(
      x + 6,
      y + 6,
      2,
      2
    );

  }


  if (
    player.direction === "right"
  ) {

    ctx.fillRect(
      x + 14,
      y + 6,
      2,
      2
    );

  }

}


// ========================================
// NIGHT LIGHTING
// ========================================

function drawNightOverlay() {

  ctx.fillStyle =
    "rgba(16,12,35,0.17)";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}


// ========================================
// SIGN
// ========================================

function drawTitleSign() {

  const worldX =
    20 * TILE;

  const worldY =
    7 * TILE;


  const x =
    worldX -
    camera.x;

  const y =
    worldY -
    camera.y;


  if (
    x < -150 ||
    x > canvas.width + 150 ||
    y < -80 ||
    y > canvas.height + 80
  ) {
    return;
  }


  ctx.save();


  ctx.fillStyle =
    "rgba(20,10,15,0.88)";

  ctx.fillRect(
    x - 78,
    y - 25,
    156,
    30
  );


  ctx.strokeStyle = "#a94135";
  ctx.lineWidth = 2;

  ctx.strokeRect(
    x - 78,
    y - 25,
    156,
    30
  );


  ctx.fillStyle = "#f0c56f";

  ctx.font =
    "bold 17px serif";

  ctx.textAlign = "center";

  ctx.fillText(
    "武 林 夜 市",
    x,
    y - 4
  );


  ctx.restore();

}


// ========================================
// HUD HINT
// ========================================

function updateInteractionHint() {

  if (dialogue.active) {

    interactionHint.classList.add(
      "hidden"
    );

    return;

  }


  const npc =
    getNearbyNPC();


  if (npc) {

    interactionHint.classList.remove(
      "hidden"
    );

  }
  else {

    interactionHint.classList.add(
      "hidden"
    );

  }

}


// ========================================
// DRAW
// ========================================

function draw() {

  ctx.fillStyle = "#111018";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  drawMap();

  drawTitleSign();


  /*
    Y座標順に描画すると
    RPGらしい前後関係になる
  */

  const entities = [

    ...NPCS.map(
      npc => ({
        y: npc.y,
        draw: () =>
          drawNPC(npc)
      })
    ),

    {
      y: player.y,
      draw: drawPlayer
    }

  ];


  entities.sort(
    (a, b) =>
      a.y - b.y
  );


  for (
    const entity of entities
  ) {

    entity.draw();

  }


  drawNightOverlay();

}


// ========================================
// CLOCK
// ========================================

const clockElement =
  document.getElementById("clock");

let fakeMinutes =
  19 * 60 + 42;


function updateClock(dt) {

  fakeMinutes +=
    dt * 0.25;


  const total =
    Math.floor(fakeMinutes);


  const hours =
    Math.floor(
      total / 60
    ) % 24;


  const minutes =
    total % 60;


  clockElement.textContent =
    `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

}


// ========================================
// GAME LOOP
// ========================================

let previousTime =
  performance.now();


function gameLoop(currentTime) {

  let dt =
    (currentTime - previousTime) /
    1000;


  previousTime =
    currentTime;


  // タブ復帰時などの暴走防止

  dt =
    Math.min(
      dt,
      0.05
    );


  updatePlayer(dt);

  updateCamera();

  updateInteractionHint();

  updateClock(dt);

  draw();


  requestAnimationFrame(
    gameLoop
  );

}


// ========================================
// START
// ========================================

updateCamera();

requestAnimationFrame(
  gameLoop
);
