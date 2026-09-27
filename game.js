"use strict";


// ======================================================
// CANVAS
// ======================================================

const canvas =
  document.getElementById(
    "gameCanvas"
  );

const ctx =
  canvas.getContext("2d");

ctx.imageSmoothingEnabled =
  false;


// ======================================================
// UI
// ======================================================

const areaHeader =
  document.getElementById(
    "areaHeader"
  );

const clockElement =
  document.getElementById(
    "clock"
  );

const areaBanner =
  document.getElementById(
    "areaBanner"
  );

const areaBannerName =
  document.getElementById(
    "areaBannerName"
  );

const areaBannerSub =
  document.getElementById(
    "areaBannerSub"
  );

const interactionHint =
  document.getElementById(
    "interactionHint"
  );

const interactionText =
  document.getElementById(
    "interactionText"
  );

const dialogueBox =
  document.getElementById(
    "dialogueBox"
  );

const speakerName =
  document.getElementById(
    "speakerName"
  );

const dialogueText =
  document.getElementById(
    "dialogueText"
  );

const portraitFace =
  document.getElementById(
    "portraitFace"
  );

const fadeLayer =
  document.getElementById(
    "fadeLayer"
  );


// ======================================================
// WORLD
// ======================================================

let currentMapId =
  "food";

let transitionLock =
  false;

let exitCooldown =
  0;

let bannerTimer =
  0;


// ======================================================
// PLAYER
// ======================================================

const player = {

  x:
    MAPS.food.spawn.x *
    TILE,

  y:
    MAPS.food.spawn.y *
    TILE,

  width:20,
  height:26,

  speed:150,

  direction:"up",

  moving:false

};


// ======================================================
// CAMERA
// ======================================================

const camera = {
  x:0,
  y:0
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

      if (
        dialogue.active
      ) {

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

  active:false,

  npc:null,

  index:0

};


function startDialogue(npc) {

  dialogue.active =
    true;

  dialogue.npc =
    npc;

  dialogue.index =
    0;


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

  dialogue.active =
    false;

  dialogue.npc =
    null;


  dialogueBox.classList.add(
    "hidden"
  );

}


// ======================================================
// CURRENT NPCS
// ======================================================

function getCurrentNPCs() {

  return NPCS.filter(
    npc =>
      npc.map ===
      currentMapId
  );

}


// ======================================================
// NEARBY NPC
// ======================================================

function getNearbyNPC() {

  const px =
    player.x +
    player.width/2;

  const py =
    player.y +
    player.height/2;


  let nearest =
    null;

  let bestDistance =
    55;


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
        nx-px,
        ny-py
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
// DOORS
// ======================================================

function getNearbyDoor() {

  const map =
    getCurrentMap();


  const px =
    player.x +
    player.width/2;

  const py =
    player.y +
    player.height/2;


  for (
    const door
    of map.doors
  ) {

    const centerX =
      (
        door.x +
        door.width/2
      ) * TILE;


    const centerY =
      (
        door.y +
        0.5
      ) * TILE;


    const distance =
      Math.hypot(
        centerX-px,
        centerY-py
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
// EXIT ZONES
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
    player.width/2;


  const py =
    player.y +
    player.height/2;


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


  if (!exit)
    return;


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

  if (
    transitionLock
  ) {
    return;
  }


  transitionLock =
    true;


  fadeLayer.classList.add(
    "active"
  );


  setTimeout(
    () => {

      currentMapId =
        target;


      player.x =
        targetX*TILE;

      player.y =
        targetY*TILE;


      player.moving =
        false;


      exitCooldown =
        0.9;


      camera.x =
        player.x -
        canvas.width/2;


      camera.y =
        player.y -
        canvas.height/2;


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
// COLLISION
// ======================================================

function playerCollides(
  x,
  y
) {

  const left =
    x+4;

  const right =
    x+
    player.width-4;

  const top =
    y+7;

  const bottom =
    y+
    player.height-2;


  if (
    isSolidAtPixel(
      left,
      top
    ) ||

    isSolidAtPixel(
      right,
      top
    ) ||

    isSolidAtPixel(
      left,
      bottom
    ) ||

    isSolidAtPixel(
      right,
      bottom
    )
  ) {

    return true;

  }


  for (
    const npc
    of getCurrentNPCs()
  ) {

    const nl =
      npc.x+4;

    const nr =
      npc.x+27;

    const nt =
      npc.y+5;

    const nb =
      npc.y+29;


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
// PLAYER UPDATE
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

    player.moving =
      false;

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

    player.moving =
      true;


    const length =
      Math.hypot(
        dx,
        dy
      );


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
        player.x+mx,
        player.y
      )
    ) {

      player.x +=
        mx;

    }


    if (
      !playerCollides(
        player.x,
        player.y+my
      )
    ) {

      player.y +=
        my;

    }

  }
  else {

    player.moving =
      false;

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
    canvas.width/2;


  const targetY =
    player.y -
    canvas.height/2;


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
// TILE DRAWING
// ======================================================

function drawFloor(
  x,
  y
) {

  ctx.fillStyle =
    "#39343c";

  ctx.fillRect(
    x,y,TILE,TILE
  );


  ctx.fillStyle =
    "#454048";

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

}


function drawRoad(
  x,
  y
) {

  ctx.fillStyle =
    "#302e35";

  ctx.fillRect(
    x,y,TILE,TILE
  );


  ctx.fillStyle =
    "#3c3941";

  ctx.fillRect(
    x+2,
    y+4,
    14,
    10
  );


  ctx.fillRect(
    x+18,
    y+18,
    12,
    10
  );

}


function drawPlaza(
  x,
  y
) {

  ctx.fillStyle =
    "#4b464b";

  ctx.fillRect(
    x,y,TILE,TILE
  );


  ctx.fillStyle =
    "#575157";

  ctx.fillRect(
    x+2,
    y+2,
    28,
    13
  );


  ctx.fillStyle =
    "#3d393e";

  ctx.fillRect(
    x,
    y+15,
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
    (mx+my)%3===0
  ) {

    ctx.fillStyle =
      "#60463a";

    ctx.fillRect(
      x+7,
      y+6,
      18,
      11
    );


    ctx.fillStyle =
      "#d0904d";

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
    x,y,TILE,TILE
  );


  const wave =
    Math.sin(
      time*2 +
      x*.04 +
      y*.03
    )*3;


  ctx.fillStyle =
    "#28556d";

  ctx.fillRect(
    x+4+wave,
    y+9,
    15,
    2
  );


  ctx.fillStyle =
    "#397187";

  ctx.fillRect(
    x+13-wave,
    y+22,
    14,
    2
  );

}


// ======================================================
// GRASS
// ======================================================

function drawGrass(
  x,
  y
) {

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


function drawWall(
  x,
  y
) {

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


function drawCounter(
  x,
  y
) {

  drawIndoor(
    x,y,0,0
  );


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


// ======================================================
// MAP DRAW
// ======================================================

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
        sx >
        canvas.width ||
        sy >
        canvas.height
      ) {

        continue;

      }


      const tile =
        map.grid[y][x];


      if (
        tile === T.FLOOR
      ) {

        drawFloor(
          sx,
          sy
        );

      }


      else if (
        tile === T.ROAD
      ) {

        drawRoad(
          sx,
          sy
        );

      }


      else if (
        tile === T.PLAZA
      ) {

        drawPlaza(
          sx,
          sy
        );

      }


      else if (
        tile === T.BUILDING
      ) {

        drawBuilding(
          sx,
          sy,
          x,
          y
        );

      }


      else if (
        tile === T.WATER
      ) {

        drawWater(
          sx,
          sy,
          time
        );

      }


      else if (
        tile === T.GRASS
      ) {

        drawGrass(
          sx,
          sy
        );

      }


      else if (
        tile === T.INDOOR
      ) {

        drawIndoor(
          sx,
          sy,
          x,
          y
        );

      }


      else if (
        tile === T.WALL
      ) {

        drawWall(
          sx,
          sy
        );

      }


      else if (
        tile === T.COUNTER
      ) {

        drawCounter(
          sx,
          sy
        );

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
      door.x*TILE -
      camera.x;


    const y =
      door.y*TILE -
      camera.y;


    const width =
      door.width*TILE;


    // frame

    ctx.fillStyle =
      "#251719";


    ctx.fillRect(
      x-3,
      y-9,
      width+6,
      TILE+10
    );


    // door

    ctx.fillStyle =
      "#75452d";


    ctx.fillRect(
      x,
      y-5,
      width,
      TILE+5
    );


    // panels

    ctx.fillStyle =
      "#3d2521";


    ctx.fillRect(
      x+5,
      y,
      width-10,
      13
    );


    ctx.fillRect(
      x+5,
      y+17,
      width-10,
      12
    );


    // knob

    ctx.fillStyle =
      "#e3b45e";


    ctx.fillRect(
      x+width-8,
      y+15,
      3,
      3
    );

  }

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
      stall.x*TILE -
      camera.x;


    const y =
      stall.y*TILE -
      camera.y;


    const width =
      stall.width*TILE;


    // shadow

    ctx.fillStyle =
      "rgba(0,0,0,.35)";


    ctx.fillRect(
      x+3,
      y+27,
      width-6,
      8
    );


    // posts

    ctx.fillStyle =
      "#543529";


    ctx.fillRect(
      x+4,
      y+13,
      5,
      22
    );


    ctx.fillRect(
      x+width-9,
      y+13,
      5,
      22
    );


    // roof

    ctx.fillStyle =
      "#a73e35";


    ctx.fillRect(
      x,
      y,
      width,
      14
    );


    // awning

    for (
      let i=0;
      i<width;
      i+=16
    ) {

      ctx.fillStyle =
        i%32===0
        ? "#d25344"
        : "#e4b15e";


      ctx.fillRect(
        x+i,
        y+13,
        16,
        6
      );

    }


    // sign

    ctx.fillStyle =
      "#351717";


    ctx.fillRect(
      x+10,
      y+2,
      width-20,
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
      x+width/2,
      y+12
    );


    // counter

    ctx.fillStyle =
      "#71462e";


    ctx.fillRect(
      x+5,
      y+27,
      width-10,
      10
    );


    drawFood(
      stall,
      x,
      y,
      width,
      time
    );

  }

}


// ======================================================
// FOOD
// ======================================================

function drawFood(
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

    for (
      let i=12;
      i<width-12;
      i+=10
    ) {

      ctx.fillStyle =
        "#d1783d";


      ctx.fillRect(
        x+i,
        y+22,
        6,
        3
      );


      ctx.fillStyle =
        "#9c4c2d";


      ctx.fillRect(
        x+i+2,
        y+20,
        2,
        2
      );

    }


    drawSteam(
      x+width/2,
      y+20,
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
      x+14,
      y+20,
      width-28,
      6
    );


    ctx.fillStyle =
      "#e6ce9c";


    for (
      let i=18;
      i<width-18;
      i+=12
    ) {

      ctx.fillRect(
        x+i,
        y+18,
        7,
        6
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
      i<5;
      i++
    ) {

      ctx.fillStyle =
        i%2===0
        ? "#d6aa73"
        : "#b87f63";


      ctx.fillRect(
        x+17+i*13,
        y+19,
        8,
        9
      );


      ctx.fillStyle =
        "#f0dfc3";


      ctx.fillRect(
        x+18+i*13,
        y+17,
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
      let i=0;
      i<10;
      i++
    ) {

      ctx.fillStyle =
        colors[
          i%colors.length
        ];


      ctx.fillRect(
        x+14+i*7,
        y+20+(i%2)*3,
        6,
        6
      );

    }

  }


  else {

    ctx.fillStyle =
      "#d8b15e";


    for (
      let i=0;
      i<8;
      i++
    ) {

      ctx.fillRect(
        x+15+i*9,
        y+21,
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
    (
      time*12
    )%14;


  ctx.fillStyle =
    "rgba(240,230,215,.5)";


  ctx.fillRect(
    x-10,
    y-offset,
    2,
    5
  );


  ctx.fillRect(
    x,
    y-6-offset*.7,
    2,
    5
  );


  ctx.fillRect(
    x+10,
    y-2-offset*.9,
    2,
    4
  );

}


// ======================================================
// BUILDING SIGNS
// ======================================================

function drawSigns() {

  const map =
    getCurrentMap();


  for (
    const sign
    of map.signs
  ) {

    const x =
      sign.x*TILE -
      camera.x;


    const y =
      sign.y*TILE -
      camera.y;


    const width =
      Math.max(
        70,
        sign.text.length*20
      );


    ctx.fillStyle =
      "#8b382f";


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
      x+width/2,
      y+18
    );

  }

}


// ======================================================
// EXIT ZONES
// ======================================================

function drawExits(
  time
) {

  const map =
    getCurrentMap();


  for (
    const exit
    of map.exits
  ) {

    const x =
      exit.x*TILE -
      camera.x;


    const y =
      exit.y*TILE -
      camera.y;


    const width =
      exit.width*TILE;


    const height =
      exit.height*TILE;


    // glowing ground marker

    const pulse =
      .11 +
      Math.sin(time*3) *
      .025;


    ctx.fillStyle =
      `rgba(224,174,82,${pulse})`;


    ctx.fillRect(
      x,
      y,
      width,
      height
    );


    // wooden sign

    const signWidth =
      Math.min(
        width-20,
        170
      );


    const signX =
      x +
      width/2 -
      signWidth/2;


    const signY =
      y +
      height/2 -
      13;


    ctx.fillStyle =
      "#37261d";


    ctx.fillRect(
      signX-3,
      signY-3,
      signWidth+6,
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
      signX+
      signWidth/2,
      signY+15
    );

  }

}


// ======================================================
// TEA HOUSE DETAILS
// ======================================================

function drawTeaHouseDetails() {

  if (
    currentMapId !==
    "tea"
  ) {

    return;

  }


  // scroll

  const sx =
    13*TILE -
    camera.x;


  const sy =
    3*TILE -
    camera.y;


  ctx.fillStyle =
    "#dfcda3";


  ctx.fillRect(
    sx-16,
    sy+2,
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
    sy+32
  );


  drawTeaTable(
    9*TILE-
    camera.x,

    12*TILE-
    camera.y
  );


  drawTeaTable(
    18*TILE-
    camera.x,

    13*TILE-
    camera.y
  );

}


function drawTeaTable(
  x,
  y
) {

  ctx.fillStyle =
    "#4c3024";


  ctx.fillRect(
    x-20,
    y-5,
    40,
    12
  );


  ctx.fillStyle =
    "#795035";


  ctx.fillRect(
    x-17,
    y-8,
    34,
    9
  );


  // teapot

  ctx.fillStyle =
    "#cab46f";


  ctx.fillRect(
    x-4,
    y-13,
    8,
    6
  );


  ctx.fillRect(
    x+4,
    y-11,
    4,
    2
  );

}


// ======================================================
// WEST LAKE DETAILS
// ======================================================

function drawLakeDetails(
  time
) {

  if (
    currentMapId !==
    "lake"
  ) {

    return;

  }


  for (
    let i=0;
    i<7;
    i++
  ) {

    const x =
      17*TILE -
      camera.x;


    const y =
      (4+i*4)*TILE -
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
      x-15,
      y-10,
      33,
      14
    );


    const sway =
      Math.sin(
        time*1.5+i
      )*3;


    ctx.fillStyle =
      "#396448";


    ctx.fillRect(
      x-10+sway,
      y+2,
      3,
      29
    );


    ctx.fillRect(
      x+9+sway,
      y,
      3,
      25
    );

  }

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
    Math.sin(time*11)>0
    ? 1
    : -1;


  // shadow

  ctx.fillStyle =
    "rgba(0,0,0,.35)";


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


  // eyes

  ctx.fillStyle =
    "#251d1d";


  if (
    data.direction ===
    "down"
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
    data.direction ===
    "left"
  ) {

    ctx.fillRect(
      x+6,
      y+6,
      2,
      2
    );

  }


  if (
    data.direction ===
    "right"
  ) {

    ctx.fillRect(
      x+15,
      y+6,
      2,
      2
    );

  }

}


// ======================================================
// ENTITIES
// ======================================================

function drawEntities(
  time
) {

  const entities = [];


  for (
    const npc
    of getCurrentNPCs()
  ) {

    entities.push({

      y:
        npc.y,

      draw:
        () =>
          drawPerson(

            Math.floor(
              npc.x-
              camera.x+5
            ),

            Math.floor(
              npc.y-
              camera.y+3
            ),

            npc,

            false,

            time
          )

    });

  }


  entities.push({

    y:
      player.y,

    draw:
      () =>
        drawPerson(

          Math.floor(
            player.x-
            camera.x
          ),

          Math.floor(
            player.y-
            camera.y
          ),

          {
            color:
              "#355f7d",

            hair:
              "#211b20",

            skin:
              "#e1ae87",

            direction:
              player.direction
          },

          player.moving,

          time
        )

  });


  entities.sort(
    (a,b) =>
      a.y-b.y
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
    ambient ===
    "indoor"
  ) {

    ctx.fillStyle =
      "rgba(88,42,10,.07)";

  }


  else if (
    ambient ===
    "lake"
  ) {

    ctx.fillStyle =
      "rgba(4,20,43,.18)";

  }


  else if (
    ambient ===
    "city"
  ) {

    ctx.fillStyle =
      "rgba(13,13,32,.13)";

  }


  else {

    ctx.fillStyle =
      "rgba(15,8,31,.16)";

  }


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}


// ======================================================
// UI
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


  bannerTimer -=
    dt;


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

  drawTeaHouseDetails();

  drawDoors();

  drawStalls(time);

  drawSigns();

  drawExits(time);

  drawEntities(time);

  drawLighting();

}


// ======================================================
// GAME LOOP
// ======================================================

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
