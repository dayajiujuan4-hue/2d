"use strict";

/*
==========================================================
 杭州探索録
 VISUAL ENHANCEMENT LAYER

 Ver. 安定版

 IMPORTANT
 ---------------------------------------------------------
 このファイルでは game.js の drawMap() を上書きしません。

 game.js が持っている

 ・地面
 ・西湖
 ・室内床
 ・壁
 ・カウンター

 の基本描画をそのまま利用し、
 その「上」に質感だけを追加します。

 これにより、

 ・地面が黒くなる
 ・西湖が消える
 ・室内が黒くなる

 といった問題を防ぎます。
==========================================================
*/


// ======================================================
// ORIGINAL DRAW
// ======================================================

const originalDraw =
  draw;


// ======================================================
// MAIN DRAW WRAPPER
// ======================================================

draw = function(time){

  /*
  --------------------------------------------------------
  まず game.js の描画を完全に実行
  --------------------------------------------------------
  */

  originalDraw(time);


  /*
  --------------------------------------------------------
  そのあと、ごく軽い画面効果だけを追加
  --------------------------------------------------------
  */

  drawScreenAtmosphere(time);

};



// ======================================================
// MAP DETAIL
// ======================================================

/*
 game.js の drawMap() を直接上書きすると
 他のシステムとの整合性が崩れやすいため、

 drawMap の直後に追加処理を入れる方式にします。
*/

const originalDrawMap =
  drawMap;


drawMap = function(time){

  /*
  game.js 本来のタイルを描画
  */

  originalDrawMap(time);


  /*
  タイルの上に模様を追加
  */

  drawGroundDetails(time);

};



// ======================================================
// GROUND DETAILS
// ======================================================

function drawGroundDetails(time){

  const map =
    getCurrentMap();


  const rows =
    map.grid.length;


  const cols =
    map.grid[0].length;


  /*
  カメラに映る範囲だけ描画します。
  */

  const startX =
    Math.max(
      0,
      Math.floor(camera.x / TILE) - 1
    );


  const endX =
    Math.min(
      cols,
      Math.ceil(
        (camera.x + canvas.width) / TILE
      ) + 1
    );


  const startY =
    Math.max(
      0,
      Math.floor(camera.y / TILE) - 1
    );


  const endY =
    Math.min(
      rows,
      Math.ceil(
        (camera.y + canvas.height) / TILE
      ) + 1
    );



  for(
    let y=startY;
    y<endY;
    y++
  ){

    for(
      let x=startX;
      x<endX;
      x++
    ){

      const tile =
        map.grid[y][x];


      const sx =
        Math.floor(
          x*TILE-camera.x
        );


      const sy =
        Math.floor(
          y*TILE-camera.y
        );


      // ================================================
      // FLOOR
      // ================================================

      if(tile===T.FLOOR){

        drawDarkStone(
          sx,
          sy,
          x,
          y,
          false
        );

      }


      // ================================================
      // ROAD
      // ================================================

      else if(tile===T.ROAD){

        drawDarkStone(
          sx,
          sy,
          x,
          y,
          true
        );

      }


      // ================================================
      // PLAZA
      // ================================================

      else if(tile===T.PLAZA){

        drawPlazaStone(
          sx,
          sy,
          x,
          y
        );

      }


      // ================================================
      // WATER
      // ================================================

      else if(tile===T.WATER){

        drawWaterTile(
          sx,
          sy,
          x,
          y,
          time
        );

      }


      // ================================================
      // GRASS
      // ================================================

      else if(tile===T.GRASS){

        drawGrassTile(
          sx,
          sy,
          x,
          y
        );

      }


      // ================================================
      // INDOOR
      // ================================================

      else if(tile===T.INDOOR){

        drawInteriorFloor(
          sx,
          sy,
          x,
          y,
          map
        );

      }


      // ================================================
      // WALL
      // ================================================

      else if(tile===T.WALL){

        drawInteriorWall(
          sx,
          sy,
          x,
          y,
          map
        );

      }


      // ================================================
      // COUNTER
      // ================================================

      else if(tile===T.COUNTER){

        drawCounterTexture(
          sx,
          sy,
          x,
          y
        );

      }

    }

  }

}



// ======================================================
// DARK STONE
// ======================================================

function drawDarkStone(
  x,
  y,
  tileX,
  tileY,
  road
){

  /*
  game.js の地面色を残したまま
  石の境界線だけ追加。
  */


  ctx.strokeStyle =
    road
    ? "rgba(135,128,142,.11)"
    : "rgba(137,117,120,.12)";


  ctx.lineWidth=1;


  ctx.strokeRect(
    x+.5,
    y+.5,
    TILE-1,
    TILE-1
  );


  /*
  石材のハイライト
  */

  ctx.fillStyle =
    road
    ? "rgba(255,236,214,.018)"
    : "rgba(255,222,192,.022)";


  ctx.fillRect(
    x+2,
    y+2,
    TILE-4,
    2
  );


  /*
  ランダム風の傷。
  Math.random()は使わず座標から決定。
  */

  const seed =
    (
      tileX*17+
      tileY*31
    )%5;


  if(seed===0){

    ctx.fillStyle =
      "rgba(10,7,12,.12)";


    ctx.fillRect(
      x+8,
      y+18,
      10,
      1
    );

  }


  if(seed===2){

    ctx.fillStyle =
      "rgba(180,150,140,.06)";


    ctx.fillRect(
      x+19,
      y+9,
      6,
      1
    );

  }

}



// ======================================================
// PLAZA
// ======================================================

function drawPlazaStone(
  x,
  y,
  tileX,
  tileY
){

  /*
  参考画像の中央広場に近い
  やや明るい大型石畳。
  */


  ctx.strokeStyle =
    "rgba(198,174,166,.13)";


  ctx.lineWidth=1;


  ctx.strokeRect(
    x+.5,
    y+.5,
    TILE-1,
    TILE-1
  );


  ctx.fillStyle =
    "rgba(255,226,203,.025)";


  ctx.fillRect(
    x+2,
    y+2,
    TILE-4,
    2
  );


  /*
  交互に微妙な色差
  */

  if(
    (tileX+tileY)%2===0
  ){

    ctx.fillStyle =
      "rgba(122,91,96,.035)";


    ctx.fillRect(
      x+1,
      y+1,
      TILE-2,
      TILE-2
    );

  }

}



// ======================================================
// WEST LAKE WATER
// ======================================================

function drawWaterTile(
  x,
  y,
  tileX,
  tileY,
  time
){

  /*
  元の #12364b の水面は消しません。
  その上に波だけを描きます。
  */


  const wave =
    Math.sin(
      time*1.7+
      tileX*.7+
      tileY*.45
    );


  /*
  水面の薄い色差
  */

  ctx.fillStyle =
    (
      (tileX+tileY)%2===0
    )
    ? "rgba(32,102,124,.10)"
    : "rgba(14,72,98,.08)";


  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  /*
  波紋1
  */

  ctx.fillStyle =
    "rgba(119,186,196,.20)";


  ctx.fillRect(
    x+4,
    y+9+wave*2,
    15,
    1
  );


  /*
  波紋2
  */

  ctx.fillStyle =
    "rgba(84,155,173,.17)";


  ctx.fillRect(
    x+14,
    y+22-wave,
    14,
    1
  );


  /*
  暗い水の筋
  */

  ctx.fillStyle =
    "rgba(3,25,45,.16)";


  ctx.fillRect(
    x+2,
    y+28,
    19,
    1
  );

}



// ======================================================
// GRASS
// ======================================================

function drawGrassTile(
  x,
  y,
  tileX,
  tileY
){

  ctx.fillStyle =
    "rgba(86,118,75,.10)";


  if(
    (tileX*3+tileY)%4===0
  ){

    ctx.fillRect(
      x+8,
      y+11,
      2,
      6
    );


    ctx.fillRect(
      x+12,
      y+16,
      2,
      5
    );

  }


  ctx.strokeStyle =
    "rgba(20,47,33,.18)";


  ctx.strokeRect(
    x+.5,
    y+.5,
    TILE-1,
    TILE-1
  );

}



// ======================================================
// INTERIOR FLOOR
// ======================================================

function drawInteriorFloor(
  x,
  y,
  tileX,
  tileY,
  map
){

  /*
  店舗テーマによって床模様を変える。
  元の茶色い室内床をベースにします。
  */


  const theme =
    map.theme ||
    map.interiorType ||
    "";


  // ----------------------------------------------------
  // HOTEL
  // ----------------------------------------------------

  if(
    theme==="hotel" ||
    currentMapId==="wulinHotel" ||
    currentMapId==="hangzhouHotel"
  ){

    /*
    石・大理石風
    */

    ctx.fillStyle =
      (
        (tileX+tileY)%2===0
      )
      ? "rgba(209,185,151,.14)"
      : "rgba(96,70,64,.08)";


    ctx.fillRect(
      x+1,
      y+1,
      TILE-2,
      TILE-2
    );


    ctx.strokeStyle =
      "rgba(244,215,180,.12)";


    ctx.strokeRect(
      x+.5,
      y+.5,
      TILE-1,
      TILE-1
    );


    return;

  }



  // ----------------------------------------------------
  // CONVENIENCE
  // ----------------------------------------------------

  if(
    theme==="convenience" ||
    currentMapId==="convenience" ||
    currentMapId==="cityStore"
  ){

    ctx.fillStyle =
      (
        (tileX+tileY)%2===0
      )
      ? "rgba(188,197,185,.13)"
      : "rgba(118,137,132,.07)";


    ctx.fillRect(
      x+1,
      y+1,
      TILE-2,
      TILE-2
    );


    ctx.strokeStyle =
      "rgba(220,228,214,.10)";


    ctx.strokeRect(
      x+.5,
      y+.5,
      TILE-1,
      TILE-1
    );


    return;

  }



  // ----------------------------------------------------
  // CULTURE / GIFT
  // ----------------------------------------------------

  if(
    theme==="culture" ||
    currentMapId==="culture" ||
    currentMapId==="lakeGift"
  ){

    /*
    木床
    */

    ctx.fillStyle =
      "rgba(103,61,37,.14)";


    ctx.fillRect(
      x,
      y,
      TILE,
      TILE
    );


    ctx.strokeStyle =
      "rgba(49,28,20,.20)";


    ctx.beginPath();

    ctx.moveTo(
      x,
      y+TILE/2
    );

    ctx.lineTo(
      x+TILE,
      y+TILE/2
    );

    ctx.stroke();


    ctx.fillStyle =
      "rgba(220,171,105,.08)";


    ctx.fillRect(
      x+2,
      y+2,
      TILE-4,
      1
    );


    return;

  }



  // ----------------------------------------------------
  // TEA
  // ----------------------------------------------------

  if(
    theme==="tea" ||
    currentMapId==="tea" ||
    currentMapId==="lakeTea"
  ){

    ctx.fillStyle =
      "rgba(88,56,36,.12)";


    ctx.fillRect(
      x,
      y,
      TILE,
      TILE
    );


    /*
    木板の継ぎ目
    */

    ctx.strokeStyle =
      "rgba(42,25,18,.22)";


    ctx.beginPath();

    ctx.moveTo(
      x,
      y+16
    );

    ctx.lineTo(
      x+32,
      y+16
    );

    ctx.stroke();


    ctx.fillStyle =
      "rgba(220,173,102,.07)";


    ctx.fillRect(
      x+2,
      y+3,
      27,
      1
    );


    return;

  }



  // ----------------------------------------------------
  // RESTAURANT / NOODLE
  // ----------------------------------------------------

  if(
    theme==="restaurant" ||
    theme==="noodle" ||
    currentMapId==="restaurant" ||
    currentMapId==="noodle"
  ){

    ctx.strokeStyle =
      "rgba(105,65,49,.20)";


    ctx.strokeRect(
      x+.5,
      y+.5,
      TILE-1,
      TILE-1
    );


    ctx.fillStyle =
      (
        (tileX+tileY)%2===0
      )
      ? "rgba(119,72,48,.09)"
      : "rgba(255,204,138,.025)";


    ctx.fillRect(
      x+1,
      y+1,
      TILE-2,
      TILE-2
    );


    return;

  }



  // ----------------------------------------------------
  // DEFAULT INTERIOR
  // ----------------------------------------------------

  ctx.strokeStyle =
    "rgba(77,47,35,.20)";


  ctx.strokeRect(
    x+.5,
    y+.5,
    TILE-1,
    TILE-1
  );


  ctx.fillStyle =
    "rgba(221,170,108,.035)";


  ctx.fillRect(
    x+2,
    y+2,
    TILE-4,
    2
  );

}



// ======================================================
// INTERIOR WALL
// ======================================================

function drawInteriorWall(
  x,
  y,
  tileX,
  tileY,
  map
){

  /*
  壁の色そのものは game.js に任せる。
  木組みだけ追加。
  */


  ctx.fillStyle =
    "rgba(161,103,65,.12)";


  ctx.fillRect(
    x+2,
    y+5,
    TILE-4,
    2
  );


  ctx.fillRect(
    x+2,
    y+24,
    TILE-4,
    2
  );


  ctx.fillStyle =
    "rgba(24,14,13,.18)";


  ctx.fillRect(
    x+14,
    y,
    3,
    TILE
  );

}



// ======================================================
// COUNTER
// ======================================================

function drawCounterTexture(
  x,
  y
){

  ctx.fillStyle =
    "rgba(225,165,92,.10)";


  ctx.fillRect(
    x+2,
    y+3,
    TILE-4,
    2
  );


  ctx.fillStyle =
    "rgba(45,25,17,.18)";


  ctx.fillRect(
    x+2,
    y+16,
    TILE-4,
    2
  );


  ctx.strokeStyle =
    "rgba(35,21,16,.22)";


  ctx.strokeRect(
    x+.5,
    y+.5,
    TILE-1,
    TILE-1
  );

}



// ======================================================
// WATER EDGE
// ======================================================

/*
 西湖と陸地の境界を少し分かりやすくする。
*/

const originalDrawProps =
  drawProps;


drawProps = function(){

  drawWaterEdge();

  originalDrawProps();

};



function drawWaterEdge(){

  const map =
    getCurrentMap();


  if(map.ambient!=="lake"){
    return;
  }


  const rows =
    map.grid.length;


  const cols =
    map.grid[0].length;


  ctx.fillStyle =
    "rgba(181,169,132,.22)";


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
        map.grid[y][x] !==
        T.WATER
      ){
        continue;
      }


      /*
      右側が陸地なら護岸を描画
      */

      if(
        x+1<cols &&
        map.grid[y][x+1] !==
        T.WATER
      ){

        const sx =
          (x+1)*TILE-
          camera.x;


        const sy =
          y*TILE-
          camera.y;


        ctx.fillRect(
          sx-3,
          sy,
          3,
          TILE
        );

      }

    }

  }

}



// ======================================================
// SCREEN ATMOSPHERE
// ======================================================

function drawScreenAtmosphere(time){

  /*
  画面全体を黒くする処理は絶対に行いません。

  ごく薄い暖色だけを足します。
  */


  const map =
    getCurrentMap();


  if(map.ambient==="indoor"){

    ctx.fillStyle =
      "rgba(255,153,72,.012)";

  }

  else if(map.ambient==="lake"){

    ctx.fillStyle =
      "rgba(25,76,102,.012)";

  }

  else{

    ctx.fillStyle =
      "rgba(255,115,52,.009)";

  }


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}
