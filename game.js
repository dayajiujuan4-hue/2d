"use strict";

const canvas =
  document.getElementById("gameCanvas");

const ctx =
  canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;


// ========================================================
// UI
// ========================================================

const areaHeader =
  document.getElementById("areaHeader");

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

const clockElement =
  document.getElementById("clock");


// ========================================================
// WORLD
// ========================================================

let currentMapId = "food";

let transitionLock = false;

let bannerTimer = 0;


// ========================================================
// PLAYER
// ========================================================

const player = {

  x: MAPS.food.spawn.x,
  y: MAPS.food.spawn.y,

  width: 20,
  height: 25,

  speed: 145,

  direction: "up",

  moving: false,

  animationTime: 0

};


// ========================================================
// CAMERA
// ========================================================

const camera = {
  x: 0,
  y: 0
};


// ========================================================
// INPUT
// ========================================================

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


// ========================================================
// DIALOGUE
// ========================================================

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


// ========================================================
// NPC
// ========================================================

function getCurrentNPCs() {

  return NPCS.filter(
    npc =>
      npc.map === currentMapId
  );

}


function getNearbyNPC() {

  let nearest = null;

  let distanceBest = 58;


  const px =
    player.x +
    player.width / 2;

  const py =
    player.y +
    player.height / 2;


  for (
    const npc
    of getCurrentNPCs()
  ) {

    const dx =
      npc.x + 11 - px;

    const dy =
      npc.y + 13 - py;


    const distance =
      Math.hypot(dx,dy);


    if (
      distance <
      distanceBest
    ) {

      distanceBest =
        distance;

      nearest = npc;

    }

  }


  return nearest;

}


// ========================================================
// PORTALS
// ========================================================

function getNearbyPortal() {

  const map =
    getCurrentMap();


  const px =
    player.x +
    player.width / 2;

  const py =
    player.y +
    player.height / 2;


  const tx =
    Math.floor(px / TILE);

  const ty =
    Math.floor(py / TILE);


  for (
    const portal
    of map.portals
  ) {

    if (
      portal.x === undefined
    ) {
      continue;
    }


    const distance =
      Math.hypot(
        portal.x - tx,
        portal.y - ty
      );


    if (
      distance <= 1.4
    ) {
      return portal;
    }

  }


  return null;

}


function interact() {

  const npc =
    getNearbyNPC();


  if (npc) {

    startDialogue(npc);

    return;
  }


  const portal =
    getNearbyPortal();


  if (portal) {

    changeMap(
      portal.target,
      portal.targetX,
      portal.targetY
    );

  }

}


// ========================================================
// MAP TRANSITION
// ========================================================

function changeMap(
  target,
  targetX,
  targetY
) {

  if (transitionLock)
    return;


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
              transitionLock = false;
            },
            330
          );

        },
        180
      );

    },
    330
  );

}


// ========================================================
// EDGE TRANSITIONS
// ========================================================

function checkEdgeTransition() {

  if (
    transitionLock ||
    dialogue.active
  ) {
    return;
  }


  const map =
    getCurrentMap();


  const mapWidth =
    map.grid[0].length *
    TILE;


  const mapHeight =
    map.grid.length *
    TILE;


  for (
    const portal
    of map.portals
  ) {

    if (!portal.edge)
      continue;


    if (
      portal.edge === "bottom" &&
      player.y >
      mapHeight -
      TILE * 1.4
    ) {

      changeMap(
        portal.target,
        portal.targetX,
        portal.targetY
      );

      return;
    }


    if (
      portal.edge === "top" &&
      player.y <
      TILE * 1.15
    ) {

      changeMap(
        portal.target,
        portal.targetX,
        portal.targetY
      );

      return;
    }


    if (
      portal.edge === "left" &&
      player.x <
      TILE * 1.15
    ) {

      changeMap(
        portal.target,
        portal.targetX,
        portal.targetY
      );

      return;
    }


    if (
      portal.edge === "right" &&
      player.x >
      mapWidth -
      TILE * 1.4
    ) {

      changeMap(
        portal.target,
        portal.targetX,
        portal.targetY
      );

      return;
    }

  }

}


// ========================================================
// COLLISION
// ========================================================

function playerCollides(x,y) {

  const left =
    x + 4;

  const right =
    x +
    player.width -
    4;

  const top =
    y + 7;

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


  for (
    const npc
    of getCurrentNPCs()
  ) {

    const npcLeft =
      npc.x + 4;

    const npcRight =
      npc.x + 27;

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


// ========================================================
// PLAYER UPDATE
// ========================================================

function updatePlayer(dt) {

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

    player.direction = "up";

  }


  if (
    keys["s"] ||
    keys["arrowdown"]
  ) {

    dy++;

    player.direction = "down";

  }


  if (
    keys["a"] ||
    keys["arrowleft"]
  ) {

    dx--;

    player.direction = "left";

  }


  if (
    keys["d"] ||
    keys["arrowright"]
  ) {

    dx++;

    player.direction = "right";

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


    player.animationTime += dt;

  }
  else {

    player.moving = false;

  }


  checkEdgeTransition();

}


// ========================================================
// CAMERA
// ========================================================

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
    (targetX-camera.x) *
    .09;


  camera.y +=
    (targetY-camera.y) *
    .09;


  clampCamera();

}


// ========================================================
// BASIC TILE DRAWING
// ========================================================

function drawFloor(x,y) {

  ctx.fillStyle =
    "#39343c";

  ctx.fillRect(
    x,y,TILE,TILE
  );


  ctx.fillStyle =
    "#443e46";

  ctx.fillRect(
    x+2,y+3,
    13,11
  );


  ctx.fillRect(
    x+17,y+17,
    13,12
  );


  ctx.fillStyle =
    "#302c33";

  ctx.fillRect(
    x,y+15,
    TILE,1
  );

}


function drawRoad(x,y) {

  ctx.fillStyle =
    "#302e35";

  ctx.fillRect(
    x,y,TILE,TILE
  );


  ctx.fillStyle =
    "#39373e";

  ctx.fillRect(
    x+2,y+4,
    14,10
  );


  ctx.fillRect(
    x+18,y+18,
    12,10
  );

}


function drawPlaza(x,y) {

  ctx.fillStyle =
    "#4c474b";

  ctx.fillRect(
    x,y,TILE,TILE
  );


  ctx.fillStyle =
    "#595257";

  ctx.fillRect(
    x+2,y+2,
    28,13
  );


  ctx.fillStyle =
    "#403c41";

  ctx.fillRect(
    x,y+15,
    TILE,2
  );

}


// ========================================================
// BUILDING
// ========================================================

function drawBuilding(
  x,
  y,
  mx,
  my
) {

  ctx.fillStyle =
    "#211a21";

  ctx.fillRect(
    x,y,TILE,TILE
  );


  ctx.fillStyle =
    "#392931";

  ctx.fillRect(
    x+1,
    y+2,
    30,
    29
  );


  if (
    (mx+my)%3 === 0
  ) {

    ctx.fillStyle =
      "#5e4439";

    ctx.fillRect(
      x+7,
      y+6,
      18,
      11
    );


    ctx.fillStyle =
      "#c98a4b";

    ctx.fillRect(
      x+9,
      y+8,
      14,
      7
    );


    ctx.fillStyle =
      "#4b2927";

    ctx.fillRect(
      x+15,
      y+8,
      2,
      7
    );

  }

}


// ========================================================
// DOOR
// ========================================================

function drawDoor(x,y) {

  drawFloor(x,y);


  ctx.fillStyle =
    "#2a1b1b";

  ctx.fillRect(
    x+4,
    y,
    24,
    31
  );


  ctx.fillStyle =
    "#764c32";

  ctx.fillRect(
    x+7,
    y+3,
    18,
    28
  );


  ctx.fillStyle =
    "#241718";

  ctx.fillRect(
    x+10,
    y+6,
    12,
    25
  );


  ctx.fillStyle =
    "#e1a650";

  ctx.fillRect(
    x+19,
    y+17,
    2,
    2
  );

}


// ========================================================
// WATER
// ========================================================

function drawWater(x,y,time) {

  ctx.fillStyle =
    "#162f42";

  ctx.fillRect(
    x,y,TILE,TILE
  );


  const wave =
    Math.floor(
      Math.sin(
        time*2 +
        x*.04 +
        y*.03
      ) * 3
    );


  ctx.fillStyle =
    "#285269";

  ctx.fillRect(
    x+4+wave,
    y+9,
    15,
    2
  );


  ctx.fillStyle =
    "#396b7d";

  ctx.fillRect(
    x+13-wave,
    y+22,
    14,
    2
  );

}


// ========================================================
// GRASS
// ========================================================

function drawGrass(x,y) {

  ctx.fillStyle =
    "#263d31";

  ctx.fillRect(
    x,y,TILE,TILE
  );


  ctx.fillStyle =
    "#365743";

  ctx.fillRect(
    x+6,
    y+7,
    2,
    6
  );


  ctx.fillRect(
    x+22,
    y+19,
    2,
    7
  );

}


// ========================================================
// INDOOR
// ========================================================

function drawIndoor(x,y,mx,my) {

  ctx.fillStyle =
    "#74533b";

  ctx.fillRect(
    x,y,TILE,TILE
  );


  ctx.fillStyle =
    "#845f42";

  ctx.fillRect(
    x,
    y+2,
    TILE,
    12
  );


  ctx.fillStyle =
    "#5e422f";

  ctx.fillRect(
    x,
    y+15,
    TILE,
    2
  );


  if (
    (mx+my)%2===0
  ) {

    ctx.fillStyle =
      "#916849";

    ctx.fillRect(
      x+3,
      y+3,
      12,
      9
    );

  }

}


function drawWall(x,y) {

  ctx.fillStyle =
    "#37251f";

  ctx.fillRect(
    x,y,TILE,TILE
  );


  ctx.fillStyle =
    "#57392a";

  ctx.fillRect(
    x+1,
    y+2,
    30,
    28
  );


  ctx.fillStyle =
    "#7a5133";

  ctx.fillRect(
    x,
    y+25,
    TILE,
    5
  );

}


function drawCounter(x,y) {

  drawIndoor(x,y,0,0);


  ctx.fillStyle =
    "#4a3024";

  ctx.fillRect(
    x+2,
    y+7,
    28,
    21
  );


  ctx.fillStyle =
    "#91613d";

  ctx.fillRect(
    x,
    y+5,
    TILE,
    7
  );

}


// ========================================================
// TILE
// ========================================================

function drawTile(
  tile,
  x,
  y,
  mx,
  my,
  time
) {

  switch(tile) {

    case T.FLOOR:
      drawFloor(x,y);
      break;

    case T.ROAD:
      drawRoad(x,y);
      break;

    case T.BUILDING:
      drawBuilding(
        x,y,mx,my
      );
      break;

    case T.WALL:
      drawWall(x,y);
      break;

    case T.PLAZA:
      drawPlaza(x,y);
      break;

    case T.DOOR:
      drawDoor(x,y);
      break;

    case T.WATER:
      drawWater(
        x,y,time
      );
      break;

    case T.GRASS:
      drawGrass(x,y);
      break;

    case T.INDOOR:
      drawIndoor(
        x,y,mx,my
      );
      break;

    case T.COUNTER:
      drawCounter(x,y);
      break;

    default:
      drawFloor(x,y);

  }

}


// ========================================================
// MAP
// ========================================================

function drawMap(time) {

  const map =
    getCurrentMap();


  for (
    let y=0;
    y<map.grid.length;
    y++
  ) {

    for (
      let x=0;
      x<map.grid[0].length;
      x++
    ) {

      const sx =
        Math.floor(
          x*TILE -
          camera.x
        );


      const sy =
        Math.floor(
          y*TILE -
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


      drawTile(
        map.grid[y][x],
        sx,
        sy,
        x,
        y,
        time
      );

    }

  }

}


// ========================================================
// LARGE STALLS
// ========================================================

function drawStalls(time) {

  const map =
    getCurrentMap();


  for (
    const stall
    of map.stalls
  ) {

    const x =
      stall.x*TILE -
      camera.x;


    const y =
      stall.y*TILE -
      camera.y;


    const width =
      stall.w*TILE;


    // shadow

    ctx.fillStyle =
      "rgba(0,0,0,.35)";

    ctx.fillRect(
      x+3,
      y+25,
      width-6,
      9
    );


    // posts

    ctx.fillStyle =
      "#553529";

    ctx.fillRect(
      x+4,
      y+12,
      4,
      22
    );


    ctx.fillRect(
      x+width-8,
      y+12,
      4,
      22
    );


    // roof

    ctx.fillStyle =
      "#a43c33";

    ctx.fillRect(
      x,
      y+2,
      width,
      12
    );


    // striped awning

    for (
      let i=0;
      i<width;
      i+=16
    ) {

      ctx.fillStyle =
        i%32===0
          ? "#c64a3d"
          : "#e4b15e";


      ctx.fillRect(
        x+i,
        y+12,
        16,
        5
      );

    }


    // sign board

    ctx.fillStyle =
      "#371817";

    ctx.fillRect(
      x+8,
      y+3,
      width-16,
      10
    );


    ctx.fillStyle =
      "#ffd476";

    ctx.font =
      "bold 10px sans-serif";

    ctx.textAlign =
      "center";


    ctx.fillText(
      stall.sign,
      x+width/2,
      y+12
    );


    // counter

    ctx.fillStyle =
      "#70452e";

    ctx.fillRect(
      x+5,
      y+25,
      width-10,
      10
    );


    drawStallFood(
      stall,
      x,
      y,
      width,
      time
    );

  }

}


function drawStallFood(
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
      "#cf733b";


    for (
      let i=12;
      i<width-10;
      i+=9
    ) {

      ctx.fillRect(
        x+i,
        y+21,
        5,
        3
      );

    }


    drawSteam(
      x+width/2,
      y+21,
      time
    );

  }


  else if (
    stall.type ===
    "xiaolongbao"
  ) {

    ctx.fillStyle =
      "#b8864d";

    ctx.fillRect(
      x+13,
      y+18,
      17,
      7
    );

    ctx.fillRect(
      x+34,
      y+17,
      17,
      8
    );


    ctx.fillStyle =
      "#ead1a0";

    for (
      let i=0;
      i<5;
      i++
    ) {

      ctx.fillRect(
        x+15+i*8,
        y+18,
        5,
        4
      );

    }


    drawSteam(
      x+width/2,
      y+18,
      time
    );

  }


  else if (
    stall.type ===
    "milkTea"
  ) {

    for (
      let i=0;
      i<4;
      i++
    ) {

      ctx.fillStyle =
        i%2===0
          ? "#d5a66d"
          : "#b88062";


      ctx.fillRect(
        x+13+i*11,
        y+18,
        7,
        8
      );


      ctx.fillStyle =
        "#eee1c7";


      ctx.fillRect(
        x+14+i*11,
        y+16,
        5,
        2
      );

    }

  }


  else if (
    stall.type ===
    "fruit"
  ) {

    const colors = [
      "#c84e42",
      "#e5a646",
      "#6e9a50",
      "#d36f8a"
    ];


    for (
      let i=0;
      i<8;
      i++
    ) {

      ctx.fillStyle =
        colors[
          i%colors.length
        ];


      ctx.fillRect(
        x+10+i*6,
        y+19+(i%2)*3,
        5,
        5
      );

    }

  }


  else if (
    stall.type ===
    "jewelry" ||
    stall.type ===
    "souvenir"
  ) {

    ctx.fillStyle =
      "#d9bd68";


    for (
      let i=0;
      i<6;
      i++
    ) {

      ctx.fillRect(
        x+12+i*8,
        y+20,
        4,
        4
      );

    }

  }


  else {

    ctx.fillStyle =
      "#d88a49";

    for (
      let i=0;
      i<5;
      i++
    ) {

      ctx.fillRect(
        x+14+i*9,
        y+20,
        6,
        4
      );

    }


    drawSteam(
      x+width/2,
      y+19,
      time
    );

  }

}


function drawSteam(
  x,
  y,
  time
) {

  const offset =
    (time*13)%13;


  ctx.fillStyle =
    "rgba(235,225,210,.48)";


  ctx.fillRect(
    x-8,
    y-5-offset,
    2,
    5
  );


  ctx.fillRect(
    x+2,
    y-10-offset*.6,
    2,
    5
  );


  ctx.fillRect(
    x+10,
    y-4-offset*.8,
    2,
    4
  );

}


// ========================================================
// SIGNS
// ========================================================

function drawSigns(time) {

  const map =
    getCurrentMap();


  for (
    let i=0;
    i<map.signs.length;
    i++
  ) {

    const sign =
      map.signs[i];


    const x =
      sign.x*TILE -
      camera.x;


    const y =
      sign.y*TILE -
      camera.y;


    const flicker =
      Math.sin(
        time*3+i
      ) > -.93;


    const width =
      Math.max(
        64,
        sign.text.length*19
      );


    ctx.fillStyle =
      flicker
        ? "#87362f"
        : "#493331";


    ctx.fillRect(
      x,
      y,
      width,
      24
    );


    ctx.fillStyle =
      flicker
        ? "#ffe09a"
        : "#887762";


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


// ========================================================
// WEST LAKE DETAILS
// ========================================================

function drawLakeDetails(time) {

  if (
    currentMapId !== "lake"
  ) {
    return;
  }


  // 柳

  for (
    let i=0;
    i<7;
    i++
  ) {

    const x =
      16*TILE -
      camera.x;


    const y =
      (3+i*4)*TILE -
      camera.y;


    ctx.fillStyle =
      "#3c2c23";

    ctx.fillRect(
      x,
      y,
      5,
      29
    );


    ctx.fillStyle =
      "#274b36";

    ctx.fillRect(
      x-13,
      y-8,
      30,
      13
    );


    ctx.fillStyle =
      "#356143";


    const sway =
      Math.sin(
        time*1.5+i
      )*3;


    ctx.fillRect(
      x-10+sway,
      y+3,
      3,
      27
    );


    ctx.fillRect(
      x+7+sway,
      y+1,
      3,
      23
    );

  }


  // 湖面の遠い光

  for (
    let i=0;
    i<8;
    i++
  ) {

    const x =
      (3+i)*TILE -
      camera.x;


    const y =
      12*TILE -
      camera.y;


    ctx.fillStyle =
      "rgba(239,190,102,.45)";


    ctx.fillRect(
      x,
      y,
      3,
      12+
      Math.sin(time+i)*4
    );

  }

}


// ========================================================
// TEA HOUSE DETAILS
// ========================================================

function drawTeaHouseDetails() {

  if (
    currentMapId !== "tea"
  ) {
    return;
  }


  // 掛け軸

  const x =
    12*TILE -
    camera.x;


  const y =
    3*TILE -
    camera.y;


  ctx.fillStyle =
    "#d9c79d";

  ctx.fillRect(
    x-15,
    y+2,
    30,
    47
  );


  ctx.fillStyle =
    "#35291f";

  ctx.font =
    "18px serif";

  ctx.textAlign =
    "center";

  ctx.fillText(
    "茶",
    x,
    y+31
  );


  // 丸テーブル

  drawTeaTable(
    8*TILE-camera.x,
    11*TILE-camera.y
  );


  drawTeaTable(
    17*TILE-camera.x,
    12*TILE-camera.y
  );

}


function drawTeaTable(x,y) {

  ctx.fillStyle =
    "#4c3024";

  ctx.fillRect(
    x-18,
    y-6,
    36,
    13
  );


  ctx.fillStyle =
    "#795035";

  ctx.fillRect(
    x-15,
    y-8,
    30,
    10
  );


  ctx.fillStyle =
    "#c9b16d";

  ctx.fillRect(
    x-3,
    y-12,
    6,
    5
  );

}


// ========================================================
// CHARACTER
// ========================================================

function drawPerson(
  x,
  y,
  data,
  moving,
  time
) {

  const step =
    moving &&
    Math.sin(time*11)>0
      ? 1
      : 0;


  ctx.fillStyle =
    "rgba(0,0,0,.35)";

  ctx.fillRect(
    x+3,
    y+24,
    16,
    4
  );


  ctx.fillStyle =
    "#282630";

  ctx.fillRect(
    x+5,
    y+19+step,
    5,
    7
  );


  ctx.fillRect(
    x+12,
    y+19-step,
    5,
    7
  );


  ctx.fillStyle =
    data.color;

  ctx.fillRect(
    x+3,
    y+9,
    16,
    12
  );


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


  ctx.fillRect(
    x+5,
    y+2,
    12,
    9
  );


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


  ctx.fillStyle =
    "#251d1d";


  if (
    data.direction === "down"
  ) {

    ctx.fillRect(
      x+8,
      y+6,
      2,
      2
    );


    ctx.fillRect(
      x+14,
      y+6,
      2,
      2
    );

  }


  if (
    data.direction === "left"
  ) {

    ctx.fillRect(
      x+6,
      y+6,
      2,
      2
    );

  }


  if (
    data.direction === "right"
  ) {

    ctx.fillRect(
      x+15,
      y+6,
      2,
      2
    );

  }

}


// ========================================================
// ENTITIES
// ========================================================

function drawEntities(time) {

  const entities = [];


  for (
    const npc
    of getCurrentNPCs()
  ) {

    entities.push({

      y: npc.y,

      draw: () => {

        drawPerson(
          Math.floor(
            npc.x-camera.x+5
          ),

          Math.floor(
            npc.y-camera.y+3
          ),

          npc,

          false,

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

    }

  });


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

}


// ========================================================
// LIGHTING
// ========================================================

function drawLighting() {

  const map =
    getCurrentMap();


  if (
    map.ambient ===
    "indoor"
  ) {

    ctx.fillStyle =
      "rgba(61,31,10,.08)";

  }

  else if (
    map.ambient ===
    "lake"
  ) {

    ctx.fillStyle =
      "rgba(5,22,43,.20)";

  }

  else if (
    map.ambient ===
    "city"
  ) {

    ctx.fillStyle =
      "rgba(13,13,32,.14)";

  }

  else {

    ctx.fillStyle =
      "rgba(15,8,31,.17)";

  }


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}


// ========================================================
// UI UPDATE
// ========================================================

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


  bannerTimer = 2.7;

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


  const portal =
    getNearbyPortal();


  if (portal) {

    interactionText.textContent =
      portal.label ||
      "移動する";


    interactionHint.classList.remove(
      "hidden"
    );

    return;
  }


  interactionHint.classList.add(
    "hidden"
  );

}


// ========================================================
// CLOCK
// ========================================================

let fakeMinutes =
  19*60+42;


function updateClock(dt) {

  fakeMinutes +=
    dt*.15;


  const total =
    Math.floor(
      fakeMinutes
    );


  const hour =
    Math.floor(
      total/60
    )%24;


  const minute =
    total%60;


  clockElement.textContent =
    `${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}`;

}


// ========================================================
// DRAW
// ========================================================

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

  drawTeaHouseDetails();

  drawStalls(time);

  drawSigns(time);

  drawEntities(time);

  drawLighting();

}


// ========================================================
// GAME LOOP
// ========================================================

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

  updateCamera();

  updateBanner(dt);

  updateInteractionHint();

  updateClock(dt);

  draw(time);


  requestAnimationFrame(
    gameLoop
  );

}


// ========================================================
// START
// ========================================================

showAreaBanner();

updateCamera();

requestAnimationFrame(
  gameLoop
);
