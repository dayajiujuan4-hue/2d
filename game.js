"use strict";

const canvas =
  document.getElementById("gameCanvas");

const ctx =
  canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;


// =====================================
// UI
// =====================================

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

const areaHeader =
  document.getElementById("areaHeader");

const areaBanner =
  document.getElementById("areaBanner");

const areaBannerName =
  document.getElementById("areaBannerName");

const clockElement =
  document.getElementById("clock");


// =====================================
// PLAYER
// =====================================

const player = {

  x: 26 * TILE,
  y: 35 * TILE,

  width: 20,
  height: 25,

  speed: 145,

  direction: "up",

  moving: false,

  animationTime: 0

};


// =====================================
// CAMERA
// =====================================

const camera = {
  x: 0,
  y: 0
};


// =====================================
// INPUT
// =====================================

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
        tryInteraction();
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


// =====================================
// DIALOGUE
// =====================================

const dialogue = {

  active: false,
  npc: null,
  index: 0

};


function startDialogue(npc) {

  dialogue.active = true;

  dialogue.npc = npc;

  dialogue.index = 0;


  dialogueBox.classList.remove(
    "hidden"
  );


  interactionHint.classList.add(
    "hidden"
  );


  speakerName.textContent =
    npc.name;


  portraitFace.textContent =
    npc.label;


  portraitFace.style.background =
    npc.color;


  dialogueText.textContent =
    npc.dialogue[0];

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


// =====================================
// NPC INTERACTION
// =====================================

function getNearbyNPC() {

  const px =
    player.x +
    player.width / 2;

  const py =
    player.y +
    player.height / 2;


  let nearest = null;

  let nearestDistance = 58;


  for (const npc of NPCS) {

    const dx =
      npc.x + 10 - px;

    const dy =
      npc.y + 12 - py;


    const distance =
      Math.hypot(dx,dy);


    if (
      distance <
      nearestDistance
    ) {

      nearest = npc;

      nearestDistance =
        distance;

    }

  }


  return nearest;

}


function tryInteraction() {

  const npc =
    getNearbyNPC();


  if (npc) {
    startDialogue(npc);
  }

}


// =====================================
// COLLISION
// =====================================

function playerCollides(x,y) {

  const left =
    x + 4;

  const right =
    x +
    player.width -
    4;

  const top =
    y + 8;

  const bottom =
    y +
    player.height -
    2;


  if (
    isSolidAtPixel(left,top) ||
    isSolidAtPixel(right,top) ||
    isSolidAtPixel(left,bottom) ||
    isSolidAtPixel(right,bottom)
  ) {
    return true;
  }


  for (const npc of NPCS) {

    const npcLeft =
      npc.x + 5;

    const npcRight =
      npc.x + 26;

    const npcTop =
      npc.y + 6;

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


// =====================================
// PLAYER UPDATE
// =====================================

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
      Math.hypot(dx,dy);


    dx /= length;
    dy /= length;


    const moveX =
      dx *
      player.speed *
      dt;

    const moveY =
      dy *
      player.speed *
      dt;


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

  }

}


// =====================================
// WANDERING NPCS
// =====================================

for (const npc of NPCS) {

  npc.homeX = npc.x;
  npc.homeY = npc.y;

  npc.walkTimer =
    Math.random() * 3;

  npc.walkDX = 0;
  npc.walkDY = 0;

}


function updateNPCs(dt) {

  if (dialogue.active) {
    return;
  }


  for (const npc of NPCS) {

    if (
      npc.behavior !==
      "wander"
    ) {
      continue;
    }


    npc.walkTimer -= dt;


    if (
      npc.walkTimer <= 0
    ) {

      npc.walkTimer =
        1.5 +
        Math.random() * 3;


      const choices = [

        [0,0],
        [0,0],

        [1,0],
        [-1,0],

        [0,1],
        [0,-1]

      ];


      const choice =
        choices[
          Math.floor(
            Math.random() *
            choices.length
          )
        ];


      npc.walkDX =
        choice[0];

      npc.walkDY =
        choice[1];


      if (npc.walkDX > 0)
        npc.direction = "right";

      if (npc.walkDX < 0)
        npc.direction = "left";

      if (npc.walkDY > 0)
        npc.direction = "down";

      if (npc.walkDY < 0)
        npc.direction = "up";

    }


    const speed = 18;


    const newX =
      npc.x +
      npc.walkDX *
      speed *
      dt;

    const newY =
      npc.y +
      npc.walkDY *
      speed *
      dt;


    const distanceHome =
      Math.hypot(
        newX - npc.homeX,
        newY - npc.homeY
      );


    if (
      distanceHome < 65 &&
      !isSolidAtPixel(
        newX + 16,
        newY + 24
      )
    ) {

      npc.x = newX;
      npc.y = newY;

    }
    else {

      npc.walkDX = 0;
      npc.walkDY = 0;

    }

  }

}


// =====================================
// CAMERA
// =====================================

function updateCamera() {

  const targetX =
    player.x -
    canvas.width / 2;

  const targetY =
    player.y -
    canvas.height / 2;


  camera.x +=
    (targetX-camera.x) *
    .085;

  camera.y +=
    (targetY-camera.y) *
    .085;


  camera.x =
    Math.max(
      0,
      Math.min(
        camera.x,
        MAP_WIDTH*TILE -
        canvas.width
      )
    );


  camera.y =
    Math.max(
      0,
      Math.min(
        camera.y,
        MAP_HEIGHT*TILE -
        canvas.height
      )
    );

}


// =====================================
// GROUND
// =====================================

function drawStone(x,y,variant=0) {

  ctx.fillStyle =
    variant === 7
      ? "#51464c"
      : "#39343c";


  ctx.fillRect(
    x,y,TILE,TILE
  );


  ctx.fillStyle =
    variant === 7
      ? "#5d5055"
      : "#443e46";


  ctx.fillRect(
    x+2,
    y+3,
    13,
    11
  );


  ctx.fillRect(
    x+17,
    y+17,
    13,
    12
  );


  ctx.fillStyle =
    "#302c33";


  ctx.fillRect(
    x,
    y+15,
    TILE,
    1
  );


  ctx.fillRect(
    x+16,
    y,
    1,
    15
  );

}


// =====================================
// BUILDING
// =====================================

function drawBuilding(x,y,mx,my) {

  ctx.fillStyle =
    "#201a22";

  ctx.fillRect(
    x,y,TILE,TILE
  );


  ctx.fillStyle =
    "#33262e";

  ctx.fillRect(
    x+1,
    y+2,
    30,
    29
  );


  ctx.fillStyle =
    "#432e34";

  ctx.fillRect(
    x+2,
    y+19,
    28,
    11
  );


  if (
    (mx+my)%3 === 0
  ) {

    ctx.fillStyle =
      "#6e4b3a";

    ctx.fillRect(
      x+8,
      y+6,
      16,
      10
    );


    ctx.fillStyle =
      "#d79a51";

    ctx.fillRect(
      x+10,
      y+8,
      12,
      6
    );


    ctx.fillStyle =
      "#4b2a29";

    ctx.fillRect(
      x+15,
      y+8,
      2,
      6
    );

  }

}


// =====================================
// ENTRANCE
// =====================================

function drawEntrance(x,y) {

  drawStone(x,y);


  ctx.fillStyle =
    "#251b20";

  ctx.fillRect(
    x+5,
    y,
    22,
    31
  );


  ctx.fillStyle =
    "#714b35";

  ctx.fillRect(
    x+7,
    y+3,
    18,
    28
  );


  ctx.fillStyle =
    "#1e1718";

  ctx.fillRect(
    x+10,
    y+7,
    12,
    24
  );


  ctx.fillStyle =
    "#e5a951";

  ctx.fillRect(
    x+20,
    y+17,
    2,
    2
  );

}


// =====================================
// STALL
// =====================================

function getStallAt(mx,my) {

  return stalls.find(
    s =>
      s.x === mx &&
      s.y === my
  );

}


function drawStall(
  x,
  y,
  stall,
  time
) {

  drawStone(x,y);


  // 支柱

  ctx.fillStyle =
    "#57392b";

  ctx.fillRect(
    x+3,
    y+11,
    3,
    20
  );

  ctx.fillRect(
    x+26,
    y+11,
    3,
    20
  );


  // 屋根

  ctx.fillStyle =
    "#9e3932";

  ctx.fillRect(
    x+1,
    y+4,
    30,
    9
  );


  ctx.fillStyle =
    "#d6a250";

  ctx.fillRect(
    x+3,
    y+12,
    26,
    3
  );


  // カウンター

  ctx.fillStyle =
    "#69442e";

  ctx.fillRect(
    x+4,
    y+23,
    24,
    8
  );


  // 看板

  ctx.fillStyle =
    "#401c1b";

  ctx.fillRect(
    x+5,
    y+5,
    22,
    8
  );


  ctx.fillStyle =
    "#ffd177";

  ctx.font =
    "bold 7px sans-serif";

  ctx.textAlign =
    "center";

  ctx.fillText(
    stall.sign,
    x+16,
    y+12
  );


  drawFood(
    x,
    y,
    stall.type
  );


  // 湯気

  if (
    [
      "shaokao",
      "xiaolongbao",
      "choudoufu",
      "snack"
    ].includes(stall.type)
  ) {

    drawSteam(
      x+16,
      y+20,
      time
    );

  }

}


// =====================================
// FOOD
// =====================================

function drawFood(x,y,type) {

  if (
    type === "shaokao"
  ) {

    ctx.fillStyle =
      "#d07a3f";

    for (
      let i=0;
      i<4;
      i++
    ) {

      ctx.fillRect(
        x+7+i*5,
        y+20,
        3,
        2
      );

    }

  }


  if (
    type === "xiaolongbao"
  ) {

    ctx.fillStyle =
      "#e7cf9d";

    for (
      let i=0;
      i<3;
      i++
    ) {

      ctx.fillRect(
        x+8+i*6,
        y+19,
        5,
        4
      );

    }

  }


  if (
    type === "fruit"
  ) {

    ctx.fillStyle =
      "#b7463e";

    ctx.fillRect(
      x+7,
      y+19,
      5,
      5
    );


    ctx.fillStyle =
      "#d99b3d";

    ctx.fillRect(
      x+14,
      y+18,
      5,
      5
    );


    ctx.fillStyle =
      "#71934a";

    ctx.fillRect(
      x+21,
      y+19,
      5,
      5
    );

  }


  if (
    type === "milkTea"
  ) {

    ctx.fillStyle =
      "#d7b57c";

    ctx.fillRect(
      x+10,
      y+17,
      5,
      7
    );

    ctx.fillRect(
      x+19,
      y+17,
      5,
      7
    );


    ctx.fillStyle =
      "#eadcc0";

    ctx.fillRect(
      x+11,
      y+16,
      3,
      1
    );

    ctx.fillRect(
      x+20,
      y+16,
      3,
      1
    );

  }


  if (
    type === "jewelry"
  ) {

    ctx.fillStyle =
      "#d5b35e";

    ctx.fillRect(
      x+8,
      y+20,
      3,
      3
    );

    ctx.fillRect(
      x+15,
      y+19,
      3,
      3
    );

    ctx.fillRect(
      x+22,
      y+20,
      3,
      3
    );

  }

}


// =====================================
// STEAM
// =====================================

function drawSteam(x,y,time) {

  const offset =
    Math.floor(
      (time*12)%10
    );


  ctx.fillStyle =
    "rgba(230,220,205,.5)";


  ctx.fillRect(
    x-5,
    y-8-offset,
    2,
    4
  );


  ctx.fillRect(
    x+3,
    y-4-offset,
    2,
    4
  );

}


// =====================================
// TREE
// =====================================

function drawTree(x,y) {

  drawStone(x,y);


  ctx.fillStyle =
    "#493426";

  ctx.fillRect(
    x+14,
    y+17,
    5,
    14
  );


  ctx.fillStyle =
    "#17382b";

  ctx.fillRect(
    x+5,
    y+5,
    22,
    17
  );


  ctx.fillStyle =
    "#23513b";

  ctx.fillRect(
    x+9,
    y+1,
    14,
    10
  );


  ctx.fillStyle =
    "#31664a";

  ctx.fillRect(
    x+7,
    y+8,
    8,
    7
  );

}


// =====================================
// LANTERN POST
// =====================================

function drawLanternPost(
  x,
  y,
  time
) {

  drawStone(x,y);


  ctx.fillStyle =
    "#35251d";

  ctx.fillRect(
    x+15,
    y+7,
    3,
    24
  );


  const pulse =
    .14 +
    Math.sin(time*3) *
    .03;


  ctx.fillStyle =
    `rgba(255,112,45,${pulse})`;


  ctx.fillRect(
    x+5,
    y,
    23,
    21
  );


  ctx.fillStyle =
    "#b83d32";

  ctx.fillRect(
    x+9,
    y+2,
    15,
    13
  );


  ctx.fillStyle =
    "#ffc665";

  ctx.fillRect(
    x+12,
    y+5,
    9,
    7
  );

}


// =====================================
// TILE
// =====================================

function drawTile(
  tile,
  x,
  y,
  mx,
  my,
  time
) {

  if (tile === 0)
    drawStone(x,y);

  if (tile === 1) {

    ctx.fillStyle =
      "#343039";

    ctx.fillRect(
      x,y,TILE,TILE
    );


    ctx.fillStyle =
      "#3e3942";

    ctx.fillRect(
      x+2,
      y+5,
      14,
      9
    );


    ctx.fillRect(
      x+18,
      y+18,
      12,
      9
    );

  }


  if (tile === 2)
    drawBuilding(
      x,y,mx,my
    );


  if (tile === 3) {

    const stall =
      getStallAt(mx,my);

    drawStall(
      x,
      y,
      stall || {
        sign:"小吃",
        type:"snack"
      },
      time
    );

  }


  if (tile === 4)
    drawTree(x,y);


  if (tile === 5)
    drawLanternPost(
      x,y,time
    );


  if (tile === 6) {

    ctx.fillStyle =
      "#272329";

    ctx.fillRect(
      x,y,TILE,TILE
    );

  }


  if (tile === 7)
    drawStone(x,y,7);


  if (tile === 8)
    drawEntrance(x,y);

}


// =====================================
// MAP
// =====================================

function drawMap(time) {

  const startX =
    Math.floor(
      camera.x/TILE
    );

  const startY =
    Math.floor(
      camera.y/TILE
    );


  const endX =
    Math.ceil(
      (
        camera.x+
        canvas.width
      )/TILE
    );

  const endY =
    Math.ceil(
      (
        camera.y+
        canvas.height
      )/TILE
    );


  for (
    let y=startY;
    y<=endY;
    y++
  ) {

    for (
      let x=startX;
      x<=endX;
      x++
    ) {

      if (
        x<0 ||
        y<0 ||
        x>=MAP_WIDTH ||
        y>=MAP_HEIGHT
      ) {
        continue;
      }


      drawTile(
        gameMap[y][x],

        Math.floor(
          x*TILE-camera.x
        ),

        Math.floor(
          y*TILE-camera.y
        ),

        x,
        y,
        time
      );

    }

  }

}


// =====================================
// BUILDING SIGNS
// =====================================

function drawBuildingSigns(time) {

  for (
    let i=0;
    i<buildingSigns.length;
    i++
  ) {

    const sign =
      buildingSigns[i];


    const x =
      sign.x*TILE -
      camera.x;

    const y =
      sign.y*TILE -
      camera.y;


    const flicker =
      Math.sin(
        time*3+i
      ) > -.92;


    ctx.fillStyle =
      flicker
        ? sign.color
        : "#4b3434";


    const width =
      Math.max(
        60,
        sign.text.length*18
      );


    ctx.fillRect(
      x,
      y,
      width,
      23
    );


    ctx.fillStyle =
      flicker
        ? "#ffe0a0"
        : "#89765e";


    ctx.font =
      "bold 14px sans-serif";


    ctx.textAlign =
      "center";


    ctx.fillText(
      sign.text,
      x+width/2,
      y+17
    );

  }

}


// =====================================
// LANTERN STRINGS
// =====================================

function drawLanternStrings(time) {

  for (
    const line
    of lanternStrings
  ) {

    const y =
      line.y*TILE -
      camera.y;


    const x1 =
      line.x1*TILE -
      camera.x;


    const x2 =
      line.x2*TILE -
      camera.x;


    ctx.strokeStyle =
      "#39231f";


    ctx.lineWidth = 2;


    ctx.beginPath();

    ctx.moveTo(x1,y);

    ctx.lineTo(x2,y);

    ctx.stroke();


    for (
      let x=x1+20;
      x<x2;
      x+=42
    ) {

      const sway =
        Math.sin(
          time*2+x*.02
        );


      ctx.fillStyle =
        "rgba(255,95,42,.12)";


      ctx.fillRect(
        x-7+sway,
        y-2,
        15,
        18
      );


      ctx.fillStyle =
        "#b93d32";


      ctx.fillRect(
        x-4+sway,
        y,
        9,
        11
      );


      ctx.fillStyle =
        "#ffc25d";


      ctx.fillRect(
        x-2+sway,
        y+2,
        5,
        6
      );

    }

  }

}


// =====================================
// DECORATIONS
// =====================================

function drawDecorations() {

  for (
    const d
    of decorations
  ) {

    const x =
      d.x-camera.x;

    const y =
      d.y-camera.y;


    if (d.type==="bike") {

      ctx.strokeStyle =
        "#8c8b86";

      ctx.lineWidth=2;


      ctx.beginPath();

      ctx.arc(
        x+7,y+22,
        6,0,Math.PI*2
      );

      ctx.arc(
        x+23,y+22,
        6,0,Math.PI*2
      );

      ctx.moveTo(
        x+7,y+22
      );

      ctx.lineTo(
        x+15,y+12
      );

      ctx.lineTo(
        x+23,y+22
      );

      ctx.stroke();

    }


    if (
      d.type==="scooter"
    ) {

      ctx.fillStyle =
        "#724e55";

      ctx.fillRect(
        x+7,y+12,
        17,9
      );

      ctx.fillStyle =
        "#29282c";

      ctx.fillRect(
        x+6,y+21,
        6,5
      );

      ctx.fillRect(
        x+22,y+21,
        6,5
      );

    }


    if (
      d.type==="trash"
    ) {

      ctx.fillStyle =
        "#3c5450";

      ctx.fillRect(
        x+8,y+8,
        16,22
      );

      ctx.fillStyle =
        "#263b38";

      ctx.fillRect(
        x+6,y+6,
        20,4
      );

    }


    if (
      d.type==="table"
    ) {

      ctx.fillStyle =
        "#744d32";

      ctx.fillRect(
        x+6,y+12,
        20,8
      );

      ctx.fillRect(
        x+9,y+20,
        3,10
      );

      ctx.fillRect(
        x+21,y+20,
        3,10
      );

    }

  }

}


// =====================================
// NPC
// =====================================

function drawPerson(
  x,
  y,
  data,
  moving=false,
  time=0
) {

  const step =
    moving
      ? (
        Math.sin(time*10)>0
          ? 1
          : -1
      )
      : 0;


  // shadow

  ctx.fillStyle =
    "rgba(0,0,0,.38)";

  ctx.fillRect(
    x+3,
    y+24,
    16,
    4
  );


  // legs

  ctx.fillStyle =
    "#292630";

  ctx.fillRect(
    x+5,
    y+18+step,
    5,
    7
  );

  ctx.fillRect(
    x+12,
    y+18-step,
    5,
    7
  );


  // body

  ctx.fillStyle =
    data.color;

  ctx.fillRect(
    x+3,
    y+9,
    16,
    12
  );


  // arms

  ctx.fillStyle =
    data.skin;

  ctx.fillRect(
    x+1,
    y+11,
    3,
    8
  );

  ctx.fillRect(
    x+19,
    y+11,
    3,
    8
  );


  // head

  ctx.fillStyle =
    data.skin;

  ctx.fillRect(
    x+5,
    y+2,
    12,
    9
  );


  // hair

  ctx.fillStyle =
    data.hair;

  ctx.fillRect(
    x+4,
    y,
    14,
    5
  );


  ctx.fillRect(
    x+4,
    y+3,
    3,
    5
  );


  // face direction

  ctx.fillStyle =
    "#2a2020";


  if (
    data.direction==="down"
  ) {

    ctx.fillRect(
      x+8,y+6,2,2
    );

    ctx.fillRect(
      x+14,y+6,2,2
    );

  }


  if (
    data.direction==="left"
  ) {

    ctx.fillRect(
      x+6,y+6,2,2
    );

  }


  if (
    data.direction==="right"
  ) {

    ctx.fillRect(
      x+15,y+6,2,2
    );

  }

}


function drawNPC(npc,time) {

  const moving =
    npc.walkDX !== 0 ||
    npc.walkDY !== 0;


  drawPerson(

    Math.floor(
      npc.x-camera.x+5
    ),

    Math.floor(
      npc.y-camera.y+3
    ),

    npc,

    moving,

    time

  );

}


// =====================================
// PLAYER
// =====================================

function drawPlayer(time) {

  drawPerson(

    Math.floor(
      player.x-camera.x
    ),

    Math.floor(
      player.y-camera.y
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


  // バッグ

  const x =
    Math.floor(
      player.x-camera.x
    );

  const y =
    Math.floor(
      player.y-camera.y
    );


  ctx.fillStyle =
    "#704932";


  if (
    player.direction !==
    "up"
  ) {

    ctx.fillRect(
      x+16,
      y+12,
      4,
      8
    );

  }

}


// =====================================
// ENTRANCE ARCH
// =====================================

function drawEntranceArch() {

  const worldX =
    26*TILE;

  const worldY =
    34*TILE;


  const x =
    worldX-camera.x;

  const y =
    worldY-camera.y;


  if (
    x < -200 ||
    x > canvas.width+200 ||
    y < -100 ||
    y > canvas.height+100
  ) {
    return;
  }


  ctx.fillStyle =
    "#4a2925";

  ctx.fillRect(
    x-110,
    y,
    7,
    70
  );

  ctx.fillRect(
    x+103,
    y,
    7,
    70
  );


  ctx.fillStyle =
    "#8e332d";

  ctx.fillRect(
    x-118,
    y-9,
    236,
    25
  );


  ctx.fillStyle =
    "#351c1b";

  ctx.fillRect(
    x-75,
    y-6,
    150,
    22
  );


  ctx.fillStyle =
    "#f2c36c";

  ctx.font =
    "bold 18px serif";

  ctx.textAlign =
    "center";

  ctx.fillText(
    "武 林 夜 市",
    x,
    y+10
  );

}


// =====================================
// NIGHT FILTER
// =====================================

function drawNightOverlay() {

  ctx.fillStyle =
    "rgba(14,10,32,.14)";


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}


// =====================================
// AREA
// =====================================

let currentArea = "";

let bannerTimer = 0;


function updateArea(dt) {

  const newArea =
    getAreaName(
      player.y
    );


  if (
    newArea !==
    currentArea
  ) {

    currentArea =
      newArea;


    areaHeader.textContent =
      newArea;


    areaBannerName.textContent =
      newArea;


    areaBanner.classList.remove(
      "hidden"
    );


    bannerTimer = 2.5;

  }


  if (
    bannerTimer > 0
  ) {

    bannerTimer -= dt;


    if (
      bannerTimer <= 0
    ) {

      areaBanner.classList.add(
        "hidden"
      );

    }

  }

}


// =====================================
// INTERACTION HINT
// =====================================

function updateInteractionHint() {

  if (dialogue.active) {

    interactionHint.classList.add(
      "hidden"
    );

    return;
  }


  const npc =
    getNearbyNPC();


  interactionHint.classList.toggle(
    "hidden",
    !npc
  );

}


// =====================================
// CLOCK
// =====================================

let fakeMinutes =
  19*60+42;


function updateClock(dt) {

  fakeMinutes +=
    dt*.18;


  const total =
    Math.floor(
      fakeMinutes
    );


  const h =
    Math.floor(
      total/60
    )%24;


  const m =
    total%60;


  clockElement.textContent =
    `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;

}


// =====================================
// DRAW
// =====================================

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


  drawBuildingSigns(time);

  drawDecorations();

  drawEntranceArch();

  drawLanternStrings(time);


  // NPCとプレイヤーを
  // Y座標で並び替える

  const entities = [

    ...NPCS.map(
      npc => ({
        y:npc.y,
        draw:() =>
          drawNPC(npc,time)
      })
    ),

    {
      y:player.y,

      draw:() =>
        drawPlayer(time)
    }

  ];


  entities.sort(
    (a,b)=>
      a.y-b.y
  );


  for (
    const entity
    of entities
  ) {

    entity.draw();

  }


  drawNightOverlay();

}


// =====================================
// LOOP
// =====================================

let previousTime =
  performance.now();


function gameLoop(now) {

  let dt =
    (
      now-
      previousTime
    )/1000;


  previousTime =
    now;


  dt =
    Math.min(
      dt,
      .05
    );


  const time =
    now/1000;


  updatePlayer(dt);

  updateNPCs(dt);

  updateCamera();

  updateArea(dt);

  updateInteractionHint();

  updateClock(dt);

  draw(time);


  requestAnimationFrame(
    gameLoop
  );

}


// =====================================
// START
// =====================================

updateCamera();

requestAnimationFrame(
  gameLoop
);
