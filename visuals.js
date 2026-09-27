"use strict";

/*
==========================================================
 杭州探索録 - 武林夜市
 VISUAL ENHANCEMENT v3

 ・地面の基本描画は game.js を維持
 ・西湖の基本描画も game.js を維持
 ・100語 / NPC / 当たり判定には触れない

 今回の強化：
 ・石畳の質感
 ・西湖の波
 ・店舗別室内床
 ・中国風建築
 ・瓦屋根
 ・木造ファサード
 ・格子窓
 ・暖色照明
 ・赤提灯
 ・縦看板
 ・店先装飾
 ・ホテル外観
 ・夜市の光
 ・内装装飾
==========================================================
*/


// ======================================================
// UTILITY
// ======================================================

function vx(wx){
  return Math.floor(wx-camera.x);
}

function vy(wy){
  return Math.floor(wy-camera.y);
}

function vrect(x,y,w,h,color){

  ctx.fillStyle=color;

  ctx.fillRect(
    Math.floor(x),
    Math.floor(y),
    Math.ceil(w),
    Math.ceil(h)
  );

}

function vline(
  x1,y1,
  x2,y2,
  color,
  width=1
){

  ctx.save();

  ctx.strokeStyle=color;
  ctx.lineWidth=width;

  ctx.beginPath();

  ctx.moveTo(
    Math.floor(x1)+.5,
    Math.floor(y1)+.5
  );

  ctx.lineTo(
    Math.floor(x2)+.5,
    Math.floor(y2)+.5
  );

  ctx.stroke();

  ctx.restore();

}

function vglow(
  x,
  y,
  radius,
  color,
  alpha=.15
){

  const g=
    ctx.createRadialGradient(
      x,y,0,
      x,y,radius
    );

  g.addColorStop(
    0,
    color
  );

  g.addColorStop(
    .35,
    color
  );

  g.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  ctx.save();

  ctx.globalAlpha=alpha;
  ctx.fillStyle=g;

  ctx.fillRect(
    x-radius,
    y-radius,
    radius*2,
    radius*2
  );

  ctx.restore();

}

function vhash(x,y,salt=0){

  let n=
    Math.imul(
      x+salt*31,
      374761393
    )+
    Math.imul(
      y+salt*17,
      668265263
    );

  n=(n^(n>>>13))>>>0;

  return n%1000/1000;

}


// ======================================================
// KEEP ORIGINAL FUNCTIONS
// ======================================================

const baseDrawMap=
  drawMap;

const baseDrawProps=
  drawProps;

const baseDraw=
  draw;


// ======================================================
// MAP DETAIL
// ======================================================

drawMap=function(time){

  /*
  まず game.js の正常な地面を描く。
  */

  baseDrawMap(time);

  /*
  その上から質感だけ追加。
  */

  drawGroundDetailLayer(time);

};


function drawGroundDetailLayer(time){

  const map=
    getCurrentMap();

  const rows=
    map.grid.length;

  const cols=
    map.grid[0].length;


  const startX=
    Math.max(
      0,
      Math.floor(camera.x/TILE)-1
    );

  const endX=
    Math.min(
      cols,
      Math.ceil(
        (camera.x+canvas.width)/TILE
      )+1
    );

  const startY=
    Math.max(
      0,
      Math.floor(camera.y/TILE)-1
    );

  const endY=
    Math.min(
      rows,
      Math.ceil(
        (camera.y+canvas.height)/TILE
      )+1
    );


  for(
    let ty=startY;
    ty<endY;
    ty++
  ){

    for(
      let tx=startX;
      tx<endX;
      tx++
    ){

      const tile=
        map.grid[ty][tx];

      const x=
        tx*TILE-camera.x;

      const y=
        ty*TILE-camera.y;


      if(
        tile===T.FLOOR ||
        tile===T.ROAD
      ){

        drawStreetStone(
          x,y,
          tx,ty,
          tile===T.ROAD
        );

      }

      else if(
        tile===T.PLAZA
      ){

        drawPlazaStone(
          x,y,
          tx,ty
        );

      }

      else if(
        tile===T.WATER
      ){

        drawWaterDetail(
          x,y,
          tx,ty,
          time
        );

      }

      else if(
        tile===T.GRASS
      ){

        drawGrassDetail(
          x,y,
          tx,ty
        );

      }

      else if(
        tile===T.INDOOR
      ){

        drawInteriorFloorDetail(
          x,y,
          tx,ty,
          map
        );

      }

      else if(
        tile===T.WALL
      ){

        drawInteriorWallDetail(
          x,y,
          tx,ty,
          map
        );

      }

      else if(
        tile===T.COUNTER
      ){

        drawCounterDetail(
          x,y
        );

      }

    }

  }

}


// ======================================================
// STREET STONE
// ======================================================

function drawStreetStone(
  x,y,
  tx,ty,
  road
){

  const r=
    vhash(tx,ty,4);


  ctx.strokeStyle=
    road
    ? "rgba(159,151,165,.09)"
    : "rgba(161,143,146,.11)";

  ctx.lineWidth=1;

  ctx.strokeRect(
    x+.5,
    y+.5,
    TILE-1,
    TILE-1
  );


  vrect(
    x+2,
    y+2,
    TILE-4,
    1,
    "rgba(255,229,209,.025)"
  );


  /*
  石の継ぎ目を少し不規則に。
  */

  if(ty%2===0){

    vline(
      x+10,
      y,
      x+10,
      y+7,
      "rgba(18,15,23,.20)"
    );

  }

  else{

    vline(
      x+22,
      y,
      x+22,
      y+7,
      "rgba(18,15,23,.20)"
    );

  }


  if(r>.82){

    vline(
      x+7,
      y+20,
      x+15,
      y+17,
      "rgba(15,12,19,.15)"
    );

  }

}


// ======================================================
// PLAZA
// ======================================================

function drawPlazaStone(
  x,y,
  tx,ty
){

  ctx.strokeStyle=
    "rgba(205,181,171,.13)";

  ctx.strokeRect(
    x+.5,
    y+.5,
    TILE-1,
    TILE-1
  );


  vrect(
    x+2,
    y+2,
    TILE-4,
    2,
    "rgba(255,225,204,.025)"
  );


  if(
    (tx+ty)%2===0
  ){

    vrect(
      x+1,
      y+1,
      TILE-2,
      TILE-2,
      "rgba(112,81,92,.025)"
    );

  }

}


// ======================================================
// WEST LAKE
// ======================================================

function drawWaterDetail(
  x,y,
  tx,ty,
  time
){

  /*
  game.js が描いた青い水を残す。
  波だけ追加。
  */

  const wave=
    Math.sin(
      time*1.7+
      tx*.72+
      ty*.38
    );


  vrect(
    x,
    y,
    TILE,
    TILE,
    (tx+ty)%2===0
      ? "rgba(36,112,139,.075)"
      : "rgba(16,74,103,.055)"
  );


  vrect(
    x+4+wave*2,
    y+9,
    14,
    1,
    "rgba(130,200,210,.20)"
  );


  vrect(
    x+14-wave,
    y+22,
    13,
    1,
    "rgba(89,164,184,.17)"
  );


  if(
    vhash(tx,ty,12)>.7
  ){

    vrect(
      x+5,
      y+28,
      9,
      1,
      "rgba(173,208,207,.09)"
    );

  }

}


// ======================================================
// GRASS
// ======================================================

function drawGrassDetail(
  x,y,
  tx,ty
){

  if(
    (tx*3+ty)%4===0
  ){

    vrect(
      x+8,
      y+12,
      2,
      6,
      "rgba(87,132,83,.20)"
    );

    vrect(
      x+12,
      y+16,
      2,
      5,
      "rgba(74,118,75,.16)"
    );

  }

}


// ======================================================
// INTERIOR FLOOR
// ======================================================

function drawInteriorFloorDetail(
  x,y,
  tx,ty,
  map
){

  const theme=
    map.theme||
    map.interiorType||
    "";


  /*
  HOTEL
  */

  if(
    theme==="hotel" ||
    currentMapId==="wulinHotel" ||
    currentMapId==="hangzhouHotel"
  ){

    vrect(
      x+1,
      y+1,
      TILE-2,
      TILE-2,
      (tx+ty)%2===0
        ? "rgba(201,181,157,.14)"
        : "rgba(90,76,76,.06)"
    );

    ctx.strokeStyle=
      "rgba(236,215,191,.10)";

    ctx.strokeRect(
      x+.5,
      y+.5,
      TILE-1,
      TILE-1
    );

    return;

  }


  /*
  CONVENIENCE
  */

  if(
    theme==="convenience" ||
    currentMapId==="convenience" ||
    currentMapId==="cityStore"
  ){

    vrect(
      x+1,
      y+1,
      TILE-2,
      TILE-2,
      (tx+ty)%2===0
        ? "rgba(180,194,188,.12)"
        : "rgba(95,119,117,.06)"
    );

    ctx.strokeStyle=
      "rgba(211,224,218,.09)";

    ctx.strokeRect(
      x+.5,
      y+.5,
      TILE-1,
      TILE-1
    );

    return;

  }


  /*
  TEA
  */

  if(
    theme==="tea" ||
    currentMapId==="tea" ||
    currentMapId==="lakeTea"
  ){

    vrect(
      x,
      y,
      TILE,
      TILE,
      "rgba(86,53,34,.10)"
    );

    vline(
      x,
      y+16,
      x+TILE,
      y+16,
      "rgba(42,24,18,.20)"
    );

    vrect(
      x+2,
      y+3,
      27,
      1,
      "rgba(229,182,112,.07)"
    );

    return;

  }


  /*
  CULTURE / GIFT
  */

  if(
    theme==="culture" ||
    currentMapId==="culture" ||
    currentMapId==="lakeGift"
  ){

    vrect(
      x,
      y,
      TILE,
      TILE,
      "rgba(92,57,40,.10)"
    );

    vline(
      x,
      y+TILE/2,
      x+TILE,
      y+TILE/2,
      "rgba(42,26,20,.20)"
    );

    return;

  }


  /*
  RESTAURANT
  */

  if(
    theme==="restaurant" ||
    theme==="noodle" ||
    currentMapId==="restaurant" ||
    currentMapId==="noodle"
  ){

    ctx.strokeStyle=
      "rgba(111,72,54,.18)";

    ctx.strokeRect(
      x+.5,
      y+.5,
      TILE-1,
      TILE-1
    );

    return;

  }


  /*
  OTHER SHOP
  */

  ctx.strokeStyle=
    "rgba(91,58,43,.16)";

  ctx.strokeRect(
    x+.5,
    y+.5,
    TILE-1,
    TILE-1
  );

}


// ======================================================
// INTERIOR WALL
// ======================================================

function drawInteriorWallDetail(
  x,y,
  tx,ty,
  map
){

  vrect(
    x+2,
    y+5,
    TILE-4,
    2,
    "rgba(183,119,74,.11)"
  );

  vrect(
    x+2,
    y+24,
    TILE-4,
    2,
    "rgba(183,119,74,.08)"
  );

  vrect(
    x+14,
    y,
    3,
    TILE,
    "rgba(26,15,14,.16)"
  );

}


// ======================================================
// COUNTER
// ======================================================

function drawCounterDetail(
  x,y
){

  vrect(
    x+2,
    y+3,
    TILE-4,
    2,
    "rgba(236,177,99,.11)"
  );

  vrect(
    x+2,
    y+17,
    TILE-4,
    2,
    "rgba(45,26,18,.17)"
  );

}


// ======================================================
// BUILDINGS
// ======================================================

/*
 ここからが今回の本命。

 game.js の単純な建物描画を
 高密度の中国風建築へ置き換えます。

 地面には触れません。
*/

drawBuildings=function(){

  const map=
    getCurrentMap();

  if(
    !map.buildings ||
    map.buildings.length===0
  ){
    return;
  }


  for(
    const building of
    map.buildings
  ){

    drawEnhancedBuilding(
      building
    );

  }

};


function drawEnhancedBuilding(b){

  const x=
    b.x*TILE-camera.x;

  const y=
    b.y*TILE-camera.y;

  const w=
    b.w*TILE;

  const h=
    b.h*TILE;


  if(
    x>canvas.width+100 ||
    y>canvas.height+100 ||
    x+w<-100 ||
    y+h<-100
  ){
    return;
  }


  if(
    b.type==="hotel"
  ){

    drawHotelBuilding(
      b,x,y,w,h
    );

    return;

  }


  drawTraditionalShop(
    b,x,y,w,h
  );

}


// ======================================================
// TRADITIONAL SHOP
// ======================================================

function drawTraditionalShop(
  b,x,y,w,h
){

  /*
  SHADOW
  */

  vrect(
    x+11,
    y+15,
    w,
    h+3,
    "rgba(3,4,10,.38)"
  );


  /*
  BODY
  */

  vrect(
    x+5,
    y+28,
    w-10,
    h-28,
    "#24191c"
  );


  vrect(
    x+10,
    y+34,
    w-20,
    h-40,
    b.color||"#49312d"
  );


  /*
  UPPER WOOD
  */

  vrect(
    x+9,
    y+39,
    w-18,
    5,
    "#211518"
  );


  /*
  WOODEN POSTS
  */

  const postSpacing=64;

  for(
    let px=x+15;
    px<x+w-10;
    px+=postSpacing
  ){

    vrect(
      px,
      y+32,
      6,
      h-32,
      "#211518"
    );

    vrect(
      px+3,
      y+33,
      2,
      h-35,
      "rgba(125,72,50,.55)"
    );

  }


  /*
  ROOF
  */

  drawChineseRoof(
    x-12,
    y+5,
    w+24,
    35
  );


  /*
  SECOND EAVE
  */

  if(
    h>=9*TILE
  ){

    drawSmallEave(
      x-4,
      y+112,
      w+8
    );

  }


  /*
  WINDOWS
  */

  drawBuildingWindows(
    x,
    y,
    w,
    h,
    b
  );


  /*
  GROUND SHOP FRONT
  */

  drawShopFront(
    x,
    y,
    w,
    h,
    b
  );


  /*
  SIGN
  */

  drawMainBuildingSign(
    x,
    y,
    w,
    b
  );


  /*
  VERTICAL SIGN
  */

  drawBuildingVerticalSign(
    x,
    y,
    w,
    b
  );


  /*
  SMALL DECORATION
  */

  drawBuildingPlants(
    x,
    y,
    w,
    h
  );

}


// ======================================================
// CHINESE ROOF
// ======================================================

function drawChineseRoof(
  x,y,w,h
){

  ctx.save();


  /*
  黒い屋根シルエット
  */

  ctx.fillStyle=
    "#0d1220";

  ctx.beginPath();

  ctx.moveTo(
    x+12,
    y+4
  );

  ctx.lineTo(
    x+w-12,
    y+4
  );

  ctx.lineTo(
    x+w+3,
    y+h-8
  );

  ctx.lineTo(
    x-3,
    y+h-8
  );

  ctx.closePath();

  ctx.fill();


  /*
  瓦面
  */

  vrect(
    x+7,
    y+9,
    w-14,
    h-18,
    "#1b2438"
  );


  /*
  瓦筋
  */

  for(
    let px=x+10;
    px<x+w-8;
    px+=13
  ){

    vline(
      px,
      y+9,
      px-2,
      y+h-10,
      "#0b101c"
    );

    vline(
      px+2,
      y+9,
      px,
      y+h-10,
      "rgba(83,98,143,.20)"
    );

  }


  /*
  RIDGE
  */

  vrect(
    x+13,
    y+3,
    w-26,
    5,
    "#101727"
  );

  vrect(
    x+16,
    y+3,
    w-32,
    1,
    "#39445e"
  );


  /*
  EAVES
  */

  vrect(
    x-5,
    y+h-11,
    w+10,
    8,
    "#090e19"
  );

  vrect(
    x,
    y+h-11,
    w,
    2,
    "#313c58"
  );


  /*
  反り上がった軒先
  */

  vrect(
    x-11,
    y+h-15,
    17,
    5,
    "#0a101c"
  );

  vrect(
    x+w-6,
    y+h-15,
    17,
    5,
    "#0a101c"
  );


  /*
  軒下の赤い梁
  */

  for(
    let px=x+10;
    px<x+w-8;
    px+=24
  ){

    vrect(
      px,
      y+h-8,
      14,
      3,
      "#5f2928"
    );

  }


  ctx.restore();

}


// ======================================================
// SMALL EAVE
// ======================================================

function drawSmallEave(
  x,y,w
){

  vrect(
    x,
    y,
    w,
    10,
    "#101624"
  );

  vrect(
    x-5,
    y+8,
    w+10,
    5,
    "#090e18"
  );

  vrect(
    x+5,
    y+1,
    w-10,
    2,
    "#303b56"
  );

}


// ======================================================
// BUILDING WINDOWS
// ======================================================

function drawBuildingWindows(
  x,y,w,h,b
){

  /*
  高い建物なら2列。
  */

  const rows=
    h>=10*TILE
      ? 2
      : 1;


  for(
    let row=0;
    row<rows;
    row++
  ){

    const wy=
      y+
      75+
      row*66;


    /*
    一階入口と被る高さなら描かない
    */

    if(
      wy>y+h-80
    ){
      continue;
    }


    for(
      let wx=x+31;
      wx<x+w-42;
      wx+=67
    ){

      drawLatticeWindow(
        wx,
        wy,
        31,
        29
      );

    }

  }

}


// ======================================================
// LATTICE WINDOW
// ======================================================

function drawLatticeWindow(
  x,y,w,h
){

  /*
  窓から漏れる光
  */

  vglow(
    x+w/2,
    y+h/2,
    38,
    "rgba(255,154,55,.95)",
    .07
  );


  /*
  FRAME
  */

  vrect(
    x-4,
    y-4,
    w+8,
    h+8,
    "#171217"
  );


  /*
  WINDOW
  */

  vrect(
    x,
    y,
    w,
    h,
    "#754326"
  );


  vrect(
    x+4,
    y+4,
    w-8,
    h-8,
    "#d57b31"
  );


  vrect(
    x+7,
    y+7,
    w-14,
    h-14,
    "#ffbd55"
  );


  /*
  LATTICE
  */

  vrect(
    x+w/2-2,
    y+2,
    4,
    h-4,
    "#482720"
  );


  vrect(
    x+2,
    y+h/2-2,
    w-4,
    4,
    "#482720"
  );


  /*
  細格子
  */

  vrect(
    x+w*.25-1,
    y+3,
    2,
    h-6,
    "rgba(72,37,31,.72)"
  );


  vrect(
    x+w*.75-1,
    y+3,
    2,
    h-6,
    "rgba(72,37,31,.72)"
  );

}


// ======================================================
// SHOP FRONT
// ======================================================

function drawShopFront(
  x,y,w,h,b
){

  const bottom=
    y+h;


  const doorCenter=
    b.doorX*TILE-
    camera.x+
    TILE/2;


  const doorX=
    Math.max(
      x+20,
      Math.min(
        x+w-55,
        doorCenter-18
      )
    );


  /*
  STOREFRONT WINDOWS
  */

  for(
    let wx=x+22;
    wx<x+w-40;
    wx+=70
  ){

    if(
      Math.abs(
        wx+18-
        (doorX+18)
      )<50
    ){
      continue;
    }


    drawStoreWindow(
      wx,
      bottom-65,
      39,
      40
    );

  }


  /*
  DOOR
  */

  drawEnhancedDoor(
    doorX,
    bottom-63,
    37,
    63
  );


  /*
  STONE STEP
  */

  vrect(
    doorX-9,
    bottom,
    55,
    6,
    "#554b4e"
  );

  vrect(
    doorX-14,
    bottom+6,
    65,
    5,
    "#37333b"
  );


  /*
  LANTERNS BESIDE DOOR
  */

  drawFacadeLantern(
    doorX-15,
    bottom-54
  );

  drawFacadeLantern(
    doorX+43,
    bottom-54
  );

}


// ======================================================
// STOREFRONT WINDOW
// ======================================================

function drawStoreWindow(
  x,y,w,h
){

  vglow(
    x+w/2,
    y+h/2,
    52,
    "rgba(255,135,43,.95)",
    .055
  );


  vrect(
    x-3,
    y-3,
    w+6,
    h+6,
    "#181216"
  );


  vrect(
    x,
    y,
    w,
    h,
    "#65371f"
  );


  vrect(
    x+5,
    y+5,
    w-10,
    h-10,
    "#ce722d"
  );


  vrect(
    x+8,
    y+8,
    w-16,
    h-16,
    "#ffb44a"
  );


  /*
  LATTICE
  */

  vrect(
    x+w/2-2,
    y+3,
    4,
    h-6,
    "#47261f"
  );

  vrect(
    x+3,
    y+h/2-2,
    w-6,
    4,
    "#47261f"
  );


  /*
  店内の棚シルエット
  */

  vrect(
    x+6,
    y+h-12,
    w-12,
    5,
    "rgba(69,36,26,.45)"
  );

}


// ======================================================
// DOOR
// ======================================================

function drawEnhancedDoor(
  x,y,w,h
){

  vglow(
    x+w/2,
    y+h-12,
    48,
    "rgba(255,138,45,.9)",
    .065
  );


  vrect(
    x-5,
    y-5,
    w+10,
    h+5,
    "#171116"
  );


  vrect(
    x,
    y,
    w,
    h,
    "#4d2a22"
  );


  vrect(
    x+5,
    y+5,
    w-10,
    h-5,
    "#31201d"
  );


  /*
  DOUBLE DOOR
  */

  vrect(
    x+w/2-2,
    y+5,
    4,
    h-5,
    "#78472f"
  );


  /*
  WOOD PANELS
  */

  for(
    let py=y+10;
    py<y+h-10;
    py+=18
  ){

    vrect(
      x+8,
      py,
      8,
      12,
      "#5d3829"
    );

    vrect(
      x+w-16,
      py,
      8,
      12,
      "#5d3829"
    );

  }


  /*
  HANDLES
  */

  vrect(
    x+w/2-7,
    y+h/2,
    3,
    3,
    "#d9a048"
  );

  vrect(
    x+w/2+4,
    y+h/2,
    3,
    3,
    "#d9a048"
  );

}


// ======================================================
// MAIN SIGN
// ======================================================

function drawMainBuildingSign(
  x,y,w,b
){

  const text=
    b.name||"店";


  const signW=
    Math.min(
      w-40,
      Math.max(
        86,
        text.length*22+28
      )
    );


  const sx=
    x+w/2-signW/2;


  const sy=
    y+41;


  vrect(
    sx+4,
    sy+5,
    signW,
    33,
    "rgba(8,6,10,.45)"
  );


  vrect(
    sx,
    sy,
    signW,
    33,
    "#682323"
  );


  vrect(
    sx+3,
    sy+3,
    signW-6,
    27,
    "#a4382e"
  );


  /*
  GOLD BORDER
  */

  ctx.strokeStyle=
    "rgba(225,162,77,.40)";

  ctx.strokeRect(
    sx+5.5,
    sy+5.5,
    signW-11,
    22
  );


  ctx.save();

  ctx.fillStyle=
    "#ffd68a";

  ctx.font=
    "bold 16px serif";

  ctx.textAlign=
    "center";

  ctx.textBaseline=
    "middle";

  ctx.shadowColor=
    "#3a1010";

  ctx.shadowBlur=2;


  ctx.fillText(
    text,
    sx+signW/2,
    sy+17
  );

  ctx.restore();

}


// ======================================================
// VERTICAL SIGN
// ======================================================

function drawBuildingVerticalSign(
  x,y,w,b
){

  if(
    w<8*TILE
  ){
    return;
  }


  const text=
    b.name||"店";


  const sx=
    x+w-34;


  const sy=
    y+79;


  const sh=
    Math.min(
      94,
      Math.max(
        60,
        text.length*19
      )
    );


  /*
  BRACKET
  */

  vrect(
    sx-10,
    sy+6,
    11,
    3,
    "#21181c"
  );


  /*
  SIGN
  */

  vrect(
    sx,
    sy,
    25,
    sh,
    "#581f21"
  );


  vrect(
    sx+3,
    sy+3,
    19,
    sh-6,
    "#913028"
  );


  ctx.save();

  ctx.fillStyle=
    "#f3ce79";

  ctx.font=
    "bold 12px serif";

  ctx.textAlign=
    "center";


  const chars=
    [...text].slice(0,5);


  chars.forEach(
    (char,index)=>{

      ctx.fillText(
        char,
        sx+12,
        sy+18+
        index*16
      );

    }
  );

  ctx.restore();

}


// ======================================================
// FACADE LANTERN
// ======================================================

function drawFacadeLantern(
  x,y
){

  vglow(
    x+6,
    y+9,
    29,
    "rgba(255,78,36,.95)",
    .12
  );


  vrect(
    x+2,
    y,
    8,
    2,
    "#5f211d"
  );


  vrect(
    x,
    y+2,
    12,
    15,
    "#9f3029"
  );


  vrect(
    x+2,
    y+4,
    8,
    11,
    "#ef5839"
  );


  vrect(
    x+4,
    y+5,
    4,
    9,
    "#ff8b48"
  );


  vrect(
    x+2,
    y+17,
    8,
    2,
    "#5f211d"
  );


  vrect(
    x+5,
    y+19,
    2,
    5,
    "#a7392d"
  );

}


// ======================================================
// BUILDING PLANTS
// ======================================================

function drawBuildingPlants(
  x,y,w,h
){

  if(
    w<8*TILE
  ){
    return;
  }


  const bottom=
    y+h;


  drawPotPlant(
    x+19,
    bottom-28
  );


  drawPotPlant(
    x+w-31,
    bottom-28
  );

}


function drawPotPlant(
  x,y
){

  vrect(
    x+6,
    y+15,
    13,
    11,
    "#75412d"
  );


  vrect(
    x+8,
    y+12,
    9,
    4,
    "#965637"
  );


  vrect(
    x+11,
    y+1,
    3,
    13,
    "#24442f"
  );


  vrect(
    x+4,
    y+3,
    8,
    6,
    "#315a3c"
  );


  vrect(
    x+13,
    y,
    8,
    7,
    "#3b6846"
  );

}


// ======================================================
// HOTEL
// ======================================================

function drawHotelBuilding(
  b,x,y,w,h
){

  /*
  SHADOW
  */

  vrect(
    x+13,
    y+16,
    w,
    h+3,
    "rgba(2,4,10,.42)"
  );


  /*
  BODY
  */

  vrect(
    x+6,
    y+15,
    w-12,
    h-15,
    "#252b37"
  );


  vrect(
    x+12,
    y+21,
    w-24,
    h-29,
    b.color||"#343c4c"
  );


  /*
  ROOF / CORNICE
  */

  vrect(
    x,
    y+7,
    w,
    14,
    "#151c29"
  );


  vrect(
    x-5,
    y+18,
    w+10,
    6,
    "#101621"
  );


  vrect(
    x+8,
    y+9,
    w-16,
    2,
    "#49566b"
  );


  /*
  HOTEL WINDOWS
  */

  for(
    let wy=y+43;
    wy<y+h-84;
    wy+=48
  ){

    for(
      let wx=x+29;
      wx<x+w-39;
      wx+=58
    ){

      drawHotelWindow(
        wx,
        wy
      );

    }

  }


  /*
  ENTRANCE
  */

  const doorCenter=
    b.doorX*TILE-
    camera.x+
    TILE/2;


  const entranceX=
    Math.max(
      x+30,
      Math.min(
        x+w-105,
        doorCenter-50
      )
    );


  /*
  CANOPY
  */

  vrect(
    entranceX-8,
    y+h-82,
    116,
    8,
    "#111824"
  );


  vrect(
    entranceX,
    y+h-74,
    100,
    6,
    "#6b4d37"
  );


  /*
  GLASS ENTRANCE
  */

  vrect(
    entranceX+18,
    y+h-66,
    64,
    66,
    "#17191f"
  );


  vrect(
    entranceX+23,
    y+h-61,
    26,
    56,
    "#79533c"
  );


  vrect(
    entranceX+51,
    y+h-61,
    26,
    56,
    "#79533c"
  );


  vrect(
    entranceX+27,
    y+h-57,
    18,
    49,
    "#b87942"
  );


  vrect(
    entranceX+55,
    y+h-57,
    18,
    49,
    "#b87942"
  );


  vglow(
    entranceX+50,
    y+h-30,
    72,
    "rgba(255,150,67,.85)",
    .065
  );


  /*
  HOTEL SIGN
  */

  const sign=
    b.name||"酒店";


  vrect(
    x+22,
    y+29,
    Math.min(
      w-44,
      sign.length*22+30
    ),
    31,
    "#1a1b22"
  );


  ctx.save();

  ctx.fillStyle=
    "#e8c27a";

  ctx.font=
    "bold 16px serif";

  ctx.textAlign=
    "left";

  ctx.fillText(
    sign,
    x+34,
    y+50
  );

  ctx.restore();


  /*
  PLANTS
  */

  drawPotPlant(
    entranceX-5,
    y+h-28
  );


  drawPotPlant(
    entranceX+86,
    y+h-28
  );

}


function drawHotelWindow(
  x,y
){

  vrect(
    x-3,
    y-3,
    30,
    27,
    "#171c25"
  );


  vrect(
    x,
    y,
    24,
    21,
    "#77583d"
  );


  /*
  一部の窓だけ強く点灯。
  */

  const lit=
    (
      Math.floor(x+y)
      %3
    )!==0;


  vrect(
    x+4,
    y+4,
    16,
    13,
    lit
      ? "#d99b50"
      : "#38434c"
  );


  vrect(
    x+11,
    y+2,
    2,
    17,
    "#2a2525"
  );

}


// ======================================================
// ENHANCED LANTERN ROWS
// ======================================================

drawLanternRows=function(time){

  const rows=
    getCurrentMap()
    .lanternRows||[];


  for(
    const row of rows
  ){

    const y=
      row.y*TILE-
      camera.y;


    const start=
      row.start*TILE-
      camera.x;


    const end=
      row.end*TILE-
      camera.x;


    /*
    WIRE
    */

    vline(
      start,
      y,
      end,
      y+4,
      "rgba(34,19,25,.82)",
      2
    );


    /*
    LANTERNS
    */

    for(
      let x=start+25;
      x<end;
      x+=52
    ){

      const sway=
        Math.sin(
          time*2+
          x*.02
        )*1.2;


      vglow(
        x,
        y+14,
        31,
        "rgba(255,82,36,.9)",
        .10
      );


      /*
      TOP
      */

      vrect(
        x-5+sway,
        y+4,
        10,
        2,
        "#63221d"
      );


      /*
      BODY
      */

      vrect(
        x-7+sway,
        y+6,
        14,
        16,
        "#9f3129"
      );


      vrect(
        x-4+sway,
        y+8,
        8,
        12,
        "#ed5b39"
      );


      vrect(
        x-2+sway,
        y+9,
        4,
        10,
        "#ff9b50"
      );


      /*
      BOTTOM
      */

      vrect(
        x-5+sway,
        y+22,
        10,
        2,
        "#68231e"
      );


      vrect(
        x-1+sway,
        y+24,
        2,
        5,
        "#9f3328"
      );

    }

  }

};


// ======================================================
// ENHANCED STALLS
// ======================================================

drawStalls=function(time){

  const map=
    getCurrentMap();


  for(
    const stall of
    map.stalls
  ){

    const x=
      stall.x*TILE-
      camera.x;


    const y=
      stall.y*TILE-
      camera.y;


    const width=
      stall.width*TILE;


    drawEnhancedStall(
      stall,
      x,y,
      width,
      time
    );

  }

};


function drawEnhancedStall(
  stall,
  x,y,
  width,
  time
){

  /*
  SHADOW
  */

  vrect(
    x+7,
    y+9,
    width,
    38,
    "rgba(3,4,10,.35)"
  );


  /*
  POLES
  */

  vrect(
    x+5,
    y+12,
    5,
    33,
    "#40261f"
  );


  vrect(
    x+width-10,
    y+12,
    5,
    33,
    "#40261f"
  );


  /*
  ROOF
  */

  vrect(
    x,
    y,
    width,
    15,
    "#9c362f"
  );


  /*
  AWNING
  */

  for(
    let px=0;
    px<width;
    px+=16
  ){

    vrect(
      x+px,
      y+14,
      16,
      7,
      px%32===0
        ? "#cf4b3c"
        : "#d7a34f"
    );

  }


  /*
  SIGN BOARD
  */

  vrect(
    x+8,
    y+2,
    width-16,
    12,
    "#321717"
  );


  ctx.save();

  ctx.fillStyle=
    "#ffd779";

  ctx.font=
    "bold 12px sans-serif";

  ctx.textAlign=
    "center";


  ctx.fillText(
    stall.sign||"夜市",
    x+width/2,
    y+12
  );

  ctx.restore();


  /*
  WARM LIGHT
  */

  vglow(
    x+width/2,
    y+29,
    55,
    "rgba(255,135,49,.9)",
    .045
  );


  /*
  COUNTER
  */

  vrect(
    x+5,
    y+29,
    width-10,
    12,
    "#74482e"
  );


  vrect(
    x+7,
    y+30,
    width-14,
    2,
    "#ad7444"
  );


  /*
  GOODS
  */

  const type=
    stall.type||"food";


  if(
    type==="drink"
  ){

    for(
      let i=0;
      i<4;
      i++
    ){

      vrect(
        x+18+i*16,
        y+23,
        8,
        8,
        i%2===0
          ? "#d58c4a"
          : "#8d6a45"
      );

    }

  }

  else if(
    type==="fruit"
  ){

    for(
      let i=0;
      i<5;
      i++
    ){

      vrect(
        x+13+i*15,
        y+24+(i%2)*2,
        9,
        7,
        i%2===0
          ? "#b95835"
          : "#c58d3d"
      );

    }

  }

  else{

    for(
      let i=0;
      i<5;
      i++
    ){

      vrect(
        x+13+i*15,
        y+25,
        10,
        5,
        i%2===0
          ? "#c26936"
          : "#e19b45"
      );

    }

  }


  /*
  LANTERNS
  */

  drawFacadeLantern(
    x+10,
    y+20
  );


  drawFacadeLantern(
    x+width-22,
    y+20
  );


  /*
  STEAM
  */

  if(
    type==="shaokao" ||
    type==="food"
  ){

    drawEnhancedSteam(
      x+width/2,
      y+24,
      time
    );

  }

}


// ======================================================
// STEAM
// ======================================================

function drawEnhancedSteam(
  x,y,time
){

  const offset=
    (time*12)%17;


  ctx.save();

  ctx.globalAlpha=.55;


  vrect(
    x-10,
    y-offset,
    2,
    5,
    "rgba(240,230,215,.70)"
  );


  vrect(
    x,
    y-6-offset*.7,
    2,
    6,
    "rgba(240,230,215,.65)"
  );


  vrect(
    x+9,
    y-2-offset*.9,
    2,
    5,
    "rgba(240,230,215,.55)"
  );


  ctx.restore();

}


// ======================================================
// PROP EXTRA LAYER
// ======================================================

drawProps=function(){

  /*
  西湖の護岸を先に。
  */

  drawLakeEdge();


  /*
  game.js の全小物を残す。
  */

  baseDrawProps();


  /*
  その後、室内と街に追加装飾。
  */

  drawExtraEnvironment();

};


// ======================================================
// LAKE EDGE
// ======================================================

function drawLakeEdge(){

  const map=
    getCurrentMap();


  if(
    map.ambient!=="lake"
  ){
    return;
  }


  const rows=
    map.grid.length;

  const cols=
    map.grid[0].length;


  for(
    let y=0;
    y<rows;
    y++
  ){

    for(
      let x=0;
      x<cols;
      x++
    ){

      if(
        map.grid[y][x]!==
        T.WATER
      ){
        continue;
      }


      if(
        x+1<cols &&
        map.grid[y][x+1]!==
        T.WATER
      ){

        const sx=
          (x+1)*TILE-
          camera.x;


        const sy=
          y*TILE-
          camera.y;


        vrect(
          sx-4,
          sy,
          4,
          TILE,
          "#57555a"
        );


        vrect(
          sx-2,
          sy,
          2,
          TILE,
          "rgba(186,174,139,.32)"
        );


        vline(
          sx-4,
          sy,
          sx,
          sy,
          "rgba(22,22,28,.35)"
        );

      }

    }

  }

}


// ======================================================
// EXTRA ENVIRONMENT
// ======================================================

function drawExtraEnvironment(){

  const map=
    getCurrentMap();


  /*
  OUTDOOR
  */

  if(
    map.ambient!=="indoor"
  ){

    drawOutdoorExtra();

    return;

  }


  /*
  INDOOR
  */

  drawInteriorExtra(
    map
  );

}


// ======================================================
// OUTDOOR EXTRA
// ======================================================

function drawOutdoorExtra(){

  /*
  小吃街の中央広場。
  既存の当たり判定には影響しない
  描画だけの小物。
  */

  if(
    currentMapId==="food"
  ){

    drawGroundPaperLantern(
      20*TILE,
      19*TILE
    );


    drawGroundPaperLantern(
      32*TILE,
      19*TILE
    );


    drawTinyPlanter(
      18*TILE,
      17*TILE
    );


    drawTinyPlanter(
      34*TILE,
      17*TILE
    );

  }


  /*
  雑貨街
  */

  if(
    currentMapId==="market"
  ){

    drawGroundPaperLantern(
      20*TILE,
      20*TILE
    );


    drawGroundPaperLantern(
      32*TILE,
      20*TILE
    );

  }


  /*
  HOTEL
  */

  if(
    currentMapId==="hotel"
  ){

    drawTinyPlanter(
      18*TILE,
      10*TILE
    );


    drawTinyPlanter(
      33*TILE,
      10*TILE
    );

  }

}


// ======================================================
// SMALL STREET LANTERN
// ======================================================

function drawGroundPaperLantern(
  wx,wy
){

  const x=
    wx-camera.x;

  const y=
    wy-camera.y;


  vglow(
    x+8,
    y+10,
    30,
    "rgba(255,97,42,.9)",
    .09
  );


  vrect(
    x+4,
    y+2,
    9,
    17,
    "#a3352d"
  );


  vrect(
    x+6,
    y+5,
    5,
    11,
    "#f16c40"
  );


  vrect(
    x+7,
    y+19,
    2,
    8,
    "#38231f"
  );

}


// ======================================================
// TINY PLANTER
// ======================================================

function drawTinyPlanter(
  wx,wy
){

  const x=
    wx-camera.x;

  const y=
    wy-camera.y;


  vrect(
    x+6,
    y+18,
    18,
    10,
    "#594238"
  );


  vrect(
    x+8,
    y+15,
    14,
    4,
    "#755547"
  );


  vrect(
    x+14,
    y+3,
    3,
    13,
    "#21402f"
  );


  vrect(
    x+7,
    y+5,
    9,
    7,
    "#2d5740"
  );


  vrect(
    x+16,
    y+2,
    9,
    8,
    "#356348"
  );

}


// ======================================================
// INTERIOR EXTRA
// ======================================================

function drawInteriorExtra(
  map
){

  /*
  これらは描画だけ。
  当たり判定には影響しません。
  */


  if(
    currentMapId==="tea" ||
    currentMapId==="lakeTea"
  ){

    /*
    木製の梁
    */

    drawInteriorBeam(
      5*TILE,
      3*TILE,
      18*TILE
    );


    /*
    暖色ランプ
    */

    drawInteriorLamp(
      9*TILE,
      5*TILE
    );


    drawInteriorLamp(
      19*TILE,
      5*TILE
    );

  }


  else if(
    currentMapId==="noodle"
  ){

    drawInteriorLamp(
      8*TILE,
      6*TILE
    );


    drawInteriorLamp(
      18*TILE,
      6*TILE
    );

  }


  else if(
    currentMapId==="restaurant"
  ){

    drawInteriorLamp(
      8*TILE,
      6*TILE
    );


    drawInteriorLamp(
      14*TILE,
      6*TILE
    );


    drawInteriorLamp(
      20*TILE,
      6*TILE
    );

  }


  else if(
    currentMapId==="wulinHotel" ||
    currentMapId==="hangzhouHotel"
  ){

    drawHotelRug();


    drawInteriorLamp(
      9*TILE,
      8*TILE
    );


    drawInteriorLamp(
      19*TILE,
      8*TILE
    );

  }


  else if(
    currentMapId==="culture" ||
    currentMapId==="lakeGift"
  ){

    drawGalleryLight(
      9*TILE,
      5*TILE
    );


    drawGalleryLight(
      18*TILE,
      5*TILE
    );

  }


  else if(
    currentMapId==="drink"
  ){

    drawDrinkShopLight();

  }

}


// ======================================================
// INTERIOR BEAM
// ======================================================

function drawInteriorBeam(
  wx,wy,width
){

  const x=
    wx-camera.x;

  const y=
    wy-camera.y;


  vrect(
    x,
    y,
    width,
    6,
    "#38231d"
  );


  vrect(
    x,
    y+6,
    width,
    2,
    "#704531"
  );

}


// ======================================================
// INTERIOR LAMP
// ======================================================

function drawInteriorLamp(
  wx,wy
){

  const x=
    wx-camera.x;

  const y=
    wy-camera.y;


  vline(
    x,
    y-10,
    x,
    y,
    "#39251f"
  );


  vglow(
    x,
    y+8,
    50,
    "rgba(255,161,73,.95)",
    .055
  );


  vrect(
    x-7,
    y,
    14,
    14,
    "#9b432d"
  );


  vrect(
    x-4,
    y+3,
    8,
    8,
    "#f0a34e"
  );

}


// ======================================================
// HOTEL RUG
// ======================================================

function drawHotelRug(){

  const x=
    10*TILE-
    camera.x;

  const y=
    12*TILE-
    camera.y;


  vrect(
    x,
    y,
    8*TILE,
    3*TILE,
    "rgba(86,35,36,.32)"
  );


  ctx.strokeStyle=
    "rgba(203,157,92,.24)";

  ctx.lineWidth=2;


  ctx.strokeRect(
    x+6,
    y+6,
    8*TILE-12,
    3*TILE-12
  );

}


// ======================================================
// GALLERY LIGHT
// ======================================================

function drawGalleryLight(
  wx,wy
){

  const x=
    wx-camera.x;

  const y=
    wy-camera.y;


  vrect(
    x-7,
    y,
    14,
    4,
    "#302b29"
  );


  vglow(
    x,
    y+24,
    55,
    "rgba(255,211,153,.85)",
    .035
  );

}


// ======================================================
// DRINK SHOP LIGHT
// ======================================================

function drawDrinkShopLight(){

  const x=
    7*TILE-
    camera.x;

  const y=
    3*TILE-
    camera.y;


  vrect(
    x,
    y,
    14*TILE,
    3,
    "rgba(91,205,188,.35)"
  );


  vglow(
    x+7*TILE,
    y+10,
    140,
    "rgba(72,188,170,.75)",
    .025
  );

}


// ======================================================
// FINAL SCREEN ATMOSPHERE
// ======================================================

draw=function(time){

  /*
  game.js 本体を完全に実行。
  */

  baseDraw(time);


  /*
  最後にごく軽い色調補正。

  黒いオーバーレイは使わない。
  */

  const map=
    getCurrentMap();


  if(
    map.ambient==="indoor"
  ){

    ctx.fillStyle=
      "rgba(255,157,82,.010)";

  }

  else if(
    map.ambient==="lake"
  ){

    ctx.fillStyle=
      "rgba(43,93,120,.010)";

  }

  else{

    ctx.fillStyle=
      "rgba(255,109,54,.008)";

  }


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

};


console.log(
  "杭州探索録 Visual Enhancement v3 loaded"
);
