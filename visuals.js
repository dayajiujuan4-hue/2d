"use strict";

/* =========================================================
   武林夜市 VISUAL OVERHAUL v2

   現在の map.js の
   T.FLOOR / T.ROAD / T.PLAZA / T.WATER /
   T.GRASS / T.INDOOR / T.WALL / T.COUNTER
   に完全対応。

   ・夜市の紫灰色石畳
   ・大判石畳の広場
   ・西湖の水面
   ・湖面反射
   ・湖岸
   ・店舗別内装
   ・中国風木造建築
   ・瓦屋根
   ・暖色窓
   ・提灯
========================================================= */

(() => {

  /* =====================================================
     基本
  ===================================================== */

  function SX(wx) {
    return Math.floor(wx - camera.x);
  }

  function SY(wy) {
    return Math.floor(wy - camera.y);
  }

  function fillRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(
      Math.floor(x),
      Math.floor(y),
      Math.ceil(w),
      Math.ceil(h)
    );
  }

  function strokeLine(x1, y1, x2, y2, color, width = 1) {
    ctx.save();

    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(
      Math.floor(x1) + 0.5,
      Math.floor(y1) + 0.5
    );
    ctx.lineTo(
      Math.floor(x2) + 0.5,
      Math.floor(y2) + 0.5
    );
    ctx.stroke();

    ctx.restore();
  }

  function hash(x, y, salt = 0) {

    let n =
      Math.imul((x | 0) + salt * 31, 374761393) +
      Math.imul((y | 0) + salt * 17, 668265263);

    n = (n ^ (n >>> 13)) >>> 0;
    n = Math.imul(n, 1274126177) >>> 0;

    return (
      ((n ^ (n >>> 16)) >>> 0) /
      4294967295
    );
  }

  function glow(x, y, radius, color, alpha = 0.2) {

    const g =
      ctx.createRadialGradient(
        x, y, 0,
        x, y, radius
      );

    g.addColorStop(0, color);
    g.addColorStop(0.25, color);
    g.addColorStop(1, "rgba(0,0,0,0)");

    ctx.save();

    ctx.globalAlpha = alpha;
    ctx.fillStyle = g;

    ctx.fillRect(
      x - radius,
      y - radius,
      radius * 2,
      radius * 2
    );

    ctx.restore();
  }


  /* =====================================================
     FLOOR
  ===================================================== */

  function drawFloorTile(px, py, tx, ty) {

    const r = hash(tx, ty, 1);

    let color = "#302d3a";

    if (r < 0.22) color = "#292735";
    else if (r < 0.52) color = "#302d3a";
    else if (r < 0.80) color = "#35313f";
    else color = "#3a3543";

    fillRect(
      px,
      py,
      TILE,
      TILE,
      color
    );

    // 石畳の横目地
    strokeLine(
      px,
      py + TILE - 1,
      px + TILE,
      py + TILE - 1,
      "rgba(13,12,22,.42)"
    );

    // 縦目地
    const offset =
      ty % 2 === 0
        ? TILE * 0.30
        : TILE * 0.68;

    strokeLine(
      px + offset,
      py,
      px + offset,
      py + 8,
      "rgba(14,13,22,.28)"
    );

    // 上側ハイライト
    strokeLine(
      px + 2,
      py + 2,
      px + TILE - 3,
      py + 2,
      "rgba(255,255,255,.025)"
    );

    // 時々石に傷
    if (r > 0.88) {

      strokeLine(
        px + 7,
        py + 18,
        px + 15,
        py + 15,
        "rgba(12,11,18,.20)"
      );

      strokeLine(
        px + 15,
        py + 15,
        px + 19,
        py + 20,
        "rgba(12,11,18,.20)"
      );
    }
  }


  /* =====================================================
     ROAD
  ===================================================== */

  function drawRoadTile(px, py, tx, ty) {

    const r = hash(tx, ty, 2);

    let color;

    if (r < 0.30) color = "#282735";
    else if (r < 0.72) color = "#2d2b39";
    else color = "#32303e";

    fillRect(
      px,
      py,
      TILE,
      TILE,
      color
    );

    strokeLine(
      px,
      py + TILE - 1,
      px + TILE,
      py + TILE - 1,
      "rgba(10,10,18,.32)"
    );

    if ((tx + ty) % 2 === 0) {

      strokeLine(
        px + TILE - 1,
        py + 7,
        px + TILE - 1,
        py + TILE - 6,
        "rgba(10,10,18,.20)"
      );
    }

    if (r > 0.86) {

      fillRect(
        px + 6,
        py + 7,
        18,
        2,
        "rgba(255,255,255,.018)"
      );
    }
  }


  /* =====================================================
     PLAZA

     参考画像中央の大判石畳
  ===================================================== */

  function drawPlazaTile(px, py, tx, ty) {

    const r = hash(tx, ty, 3);

    let color;

    if (r < 0.20) color = "#403a46";
    else if (r < 0.52) color = "#46404c";
    else if (r < 0.82) color = "#4b4551";
    else color = "#514a56";

    fillRect(
      px,
      py,
      TILE,
      TILE,
      color
    );

    strokeLine(
      px,
      py + TILE - 1,
      px + TILE,
      py + TILE - 1,
      "rgba(21,17,26,.46)"
    );

    strokeLine(
      px + TILE - 1,
      py,
      px + TILE - 1,
      py + TILE,
      "rgba(21,17,26,.40)"
    );

    // 石の内側に微妙な明暗
    strokeLine(
      px + 2,
      py + 2,
      px + TILE - 3,
      py + 2,
      "rgba(255,255,255,.035)"
    );

    strokeLine(
      px + 2,
      py + TILE - 3,
      px + TILE - 3,
      py + TILE - 3,
      "rgba(10,8,15,.08)"
    );
  }


  /* =====================================================
     GRASS
  ===================================================== */

  function drawGrassTile(px, py, tx, ty) {

    const r = hash(tx, ty, 4);

    let color =
      r > 0.55
        ? "#18332e"
        : "#142c28";

    fillRect(
      px,
      py,
      TILE,
      TILE,
      color
    );

    if (r > 0.28) {

      fillRect(
        px + 8,
        py + 11,
        2,
        7,
        "#275044"
      );

      fillRect(
        px + 10,
        py + 8,
        2,
        5,
        "#20483d"
      );
    }

    if (r > 0.63) {

      fillRect(
        px + 21,
        py + 19,
        2,
        6,
        "#2a5748"
      );

      fillRect(
        px + 18,
        py + 17,
        2,
        5,
        "#21473d"
      );
    }
  }


  /* =====================================================
     WEST LAKE WATER
  ===================================================== */

  function drawWaterTile(px, py, tx, ty, time) {

    const r = hash(tx, ty, 5);

    let base;

    if (r < 0.30) base = "#153148";
    else if (r < 0.65) base = "#17374f";
    else base = "#1a3c55";

    fillRect(
      px,
      py,
      TILE,
      TILE,
      base
    );

    // 水面の縦方向グラデーション風
    fillRect(
      px,
      py,
      TILE,
      5,
      "rgba(74,126,154,.045)"
    );

    fillRect(
      px,
      py + TILE - 6,
      TILE,
      6,
      "rgba(4,18,30,.10)"
    );

    const wave1 =
      Math.sin(
        time * 0.0015 +
        tx * 0.9 +
        ty * 0.4
      );

    const wave2 =
      Math.sin(
        time * 0.0010 +
        tx * 0.55 -
        ty * 0.7
      );

    const wx1 =
      px + 4 + wave1 * 3;

    const wx2 =
      px + 11 + wave2 * 3;

    strokeLine(
      wx1,
      py + 9,
      wx1 + 13,
      py + 9,
      "rgba(104,176,201,.23)"
    );

    strokeLine(
      wx2,
      py + 21,
      wx2 + 12,
      py + 21,
      "rgba(95,158,188,.18)"
    );

    if (r > 0.60) {

      strokeLine(
        px + 3,
        py + 28,
        px + 10,
        py + 28,
        "rgba(126,189,208,.11)"
      );
    }
  }


  /* =====================================================
     湖岸

     T.WATER と陸地の境界を描く
  ===================================================== */

  function drawLakeShore(map) {

    if (currentMapId !== "lake") {
      return;
    }

    const shoreWorldX = 16 * TILE;

    const x =
      Math.floor(
        shoreWorldX -
        camera.x
      );

    if (
      x < -30 ||
      x > canvas.width + 30
    ) {
      return;
    }

    // 湖岸の影
    fillRect(
      x - 5,
      0,
      5,
      canvas.height,
      "rgba(5,14,23,.40)"
    );

    // 石積み
    fillRect(
      x,
      0,
      7,
      canvas.height,
      "#4b4a4c"
    );

    fillRect(
      x + 7,
      0,
      3,
      canvas.height,
      "#292b31"
    );

    // 石積みの区切り
    const offset =
      -camera.y % TILE;

    for (
      let y = offset;
      y < canvas.height;
      y += TILE
    ) {

      strokeLine(
        x,
        y,
        x + 8,
        y,
        "rgba(20,20,24,.50)"
      );
    }

    // 水際の反射
    fillRect(
      x - 3,
      0,
      2,
      canvas.height,
      "rgba(107,173,194,.18)"
    );
  }


  /* =====================================================
     INTERIOR FLOOR
  ===================================================== */

  function getInteriorTheme() {

    const map = getCurrentMap();

    return (
      map.theme ||
      map.interiorType ||
      "default"
    );
  }


  function drawIndoorTile(px, py, tx, ty) {

    const theme =
      getInteriorTheme();

    const r =
      hash(tx, ty, 20);

    switch (theme) {

      /* -------------------------
         茶館
      ------------------------- */

      case "tea":
      case "lakeTea": {

        const c =
          r > 0.50
            ? "#594337"
            : "#503b31";

        fillRect(
          px,
          py,
          TILE,
          TILE,
          c
        );

        // 木板
        strokeLine(
          px,
          py + TILE - 1,
          px + TILE,
          py + TILE - 1,
          "rgba(33,20,17,.42)"
        );

        strokeLine(
          px + TILE / 2,
          py,
          px + TILE / 2,
          py + TILE,
          "rgba(42,26,20,.17)"
        );

        strokeLine(
          px + 2,
          py + 3,
          px + TILE - 2,
          py + 3,
          "rgba(255,210,155,.025)"
        );

        break;
      }


      /* -------------------------
         麺館・食堂
      ------------------------- */

      case "noodle":
      case "restaurant": {

        const c =
          r > 0.50
            ? "#5b4a43"
            : "#52423c";

        fillRect(
          px,
          py,
          TILE,
          TILE,
          c
        );

        strokeLine(
          px,
          py + TILE - 1,
          px + TILE,
          py + TILE - 1,
          "rgba(30,24,24,.38)"
        );

        strokeLine(
          px + TILE - 1,
          py,
          px + TILE - 1,
          py + TILE,
          "rgba(30,24,24,.34)"
        );

        break;
      }


      /* -------------------------
         コンビニ
      ------------------------- */

      case "convenience": {

        const c =
          (tx + ty) % 2 === 0
            ? "#697076"
            : "#62696f";

        fillRect(
          px,
          py,
          TILE,
          TILE,
          c
        );

        strokeLine(
          px,
          py + TILE - 1,
          px + TILE,
          py + TILE - 1,
          "rgba(31,37,42,.32)"
        );

        strokeLine(
          px + TILE - 1,
          py,
          px + TILE - 1,
          py + TILE,
          "rgba(31,37,42,.32)"
        );

        break;
      }


      /* -------------------------
         百貨店
      ------------------------- */

      case "department": {

        const c =
          (tx + ty) % 2
            ? "#665d68"
            : "#706773";

        fillRect(
          px,
          py,
          TILE,
          TILE,
          c
        );

        strokeLine(
          px,
          py + TILE - 1,
          px + TILE,
          py + TILE - 1,
          "rgba(30,27,33,.28)"
        );

        break;
      }


      /* -------------------------
         文創
      ------------------------- */

      case "culture": {

        const c =
          r > 0.5
            ? "#55443d"
            : "#4e3e39";

        fillRect(
          px,
          py,
          TILE,
          TILE,
          c
        );

        strokeLine(
          px,
          py + TILE - 1,
          px + TILE,
          py + TILE - 1,
          "rgba(28,18,18,.30)"
        );

        break;
      }


      /* -------------------------
         アクセサリー
      ------------------------- */

      case "accessory": {

        const c =
          (tx + ty) % 2
            ? "#5b505d"
            : "#625663";

        fillRect(
          px,
          py,
          TILE,
          TILE,
          c
        );

        strokeLine(
          px,
          py + TILE - 1,
          px + TILE,
          py + TILE - 1,
          "rgba(28,22,30,.28)"
        );

        break;
      }


      /* -------------------------
         茶飲店
      ------------------------- */

      case "drink": {

        const c =
          (tx + ty) % 2
            ? "#49605b"
            : "#506862";

        fillRect(
          px,
          py,
          TILE,
          TILE,
          c
        );

        strokeLine(
          px,
          py + TILE - 1,
          px + TILE,
          py + TILE - 1,
          "rgba(22,35,31,.32)"
        );

        break;
      }


      /* -------------------------
         HOTEL
      ------------------------- */

      case "hotel": {

        const checker =
          (tx + ty) % 2;

        const c =
          checker
            ? "#5e5961"
            : "#716b72";

        fillRect(
          px,
          py,
          TILE,
          TILE,
          c
        );

        strokeLine(
          px,
          py + TILE - 1,
          px + TILE,
          py + TILE - 1,
          "rgba(27,25,30,.32)"
        );

        strokeLine(
          px + TILE - 1,
          py,
          px + TILE - 1,
          py + TILE,
          "rgba(27,25,30,.28)"
        );

        // 大理石風
        if (r > 0.77) {

          strokeLine(
            px + 5,
            py + 9,
            px + 17,
            py + 13,
            "rgba(255,255,255,.055)"
          );
        }

        break;
      }


      default: {

        fillRect(
          px,
          py,
          TILE,
          TILE,
          "#514139"
        );

        strokeLine(
          px,
          py + TILE - 1,
          px + TILE,
          py + TILE - 1,
          "rgba(25,18,18,.30)"
        );
      }
    }
  }


  /* =====================================================
     INTERIOR WALL
  ===================================================== */

  function drawWallTile(px, py, tx, ty) {

    const theme =
      getInteriorTheme();

    let base = "#31252a";
    let trim = "#5d4036";

    if (theme === "hotel") {
      base = "#34323b";
      trim = "#716152";
    }

    if (
      theme === "convenience"
    ) {
      base = "#41484d";
      trim = "#718087";
    }

    if (
      theme === "drink"
    ) {
      base = "#29413d";
      trim = "#547168";
    }

    if (
      theme === "culture"
    ) {
      base = "#35292a";
      trim = "#725346";
    }

    fillRect(
      px,
      py,
      TILE,
      TILE,
      base
    );

    fillRect(
      px,
      py + TILE - 8,
      TILE,
      8,
      trim
    );

    strokeLine(
      px,
      py + TILE - 9,
      px + TILE,
      py + TILE - 9,
      "rgba(14,10,12,.45)"
    );

    if ((tx + ty) % 2 === 0) {

      fillRect(
        px + 5,
        py + 6,
        TILE - 10,
        2,
        "rgba(255,255,255,.025)"
      );
    }
  }


  /* =====================================================
     COUNTER
  ===================================================== */

  function drawCounterTile(px, py) {

    fillRect(
      px,
      py,
      TILE,
      TILE,
      "#50342c"
    );

    fillRect(
      px,
      py,
      TILE,
      6,
      "#856047"
    );

    fillRect(
      px + 4,
      py + 8,
      TILE - 8,
      TILE - 12,
      "#493027"
    );

    strokeLine(
      px + TILE - 1,
      py + 7,
      px + TILE - 1,
      py + TILE,
      "rgba(24,15,14,.42)"
    );
  }


  /* =====================================================
     MAP DRAW OVERRIDE
  ===================================================== */

  drawMap = function () {

    const map =
      getCurrentMap();

    const startX =
      Math.max(
        0,
        Math.floor(camera.x / TILE) - 1
      );

    const startY =
      Math.max(
        0,
        Math.floor(camera.y / TILE) - 1
      );

    const endX =
      Math.min(
        map.grid[0].length,
        Math.ceil(
          (camera.x + canvas.width) /
          TILE
        ) + 1
      );

    const endY =
      Math.min(
        map.grid.length,
        Math.ceil(
          (camera.y + canvas.height) /
          TILE
        ) + 1
      );

    const time =
      performance.now();

    // 念のため背景色
    fillRect(
      0,
      0,
      canvas.width,
      canvas.height,
      "#272532"
    );

    for (
      let ty = startY;
      ty < endY;
      ty++
    ) {

      for (
        let tx = startX;
        tx < endX;
        tx++
      ) {

        const tile =
          map.grid[ty][tx];

        const px =
          SX(tx * TILE);

        const py =
          SY(ty * TILE);


        if (tile === T.FLOOR) {

          drawFloorTile(
            px,
            py,
            tx,
            ty
          );

        }

        else if (
          tile === T.ROAD
        ) {

          drawRoadTile(
            px,
            py,
            tx,
            ty
          );

        }

        else if (
          tile === T.PLAZA
        ) {

          drawPlazaTile(
            px,
            py,
            tx,
            ty
          );

        }

        else if (
          tile === T.WATER
        ) {

          drawWaterTile(
            px,
            py,
            tx,
            ty,
            time
          );

        }

        else if (
          tile === T.GRASS
        ) {

          drawGrassTile(
            px,
            py,
            tx,
            ty
          );

        }

        else if (
          tile === T.INDOOR
        ) {

          drawIndoorTile(
            px,
            py,
            tx,
            ty
          );

        }

        else if (
          tile === T.WALL
        ) {

          drawWallTile(
            px,
            py,
            tx,
            ty
          );

        }

        else if (
          tile === T.COUNTER
        ) {

          drawCounterTile(
            px,
            py
          );

        }

        else {

          // 未知のタイルでも黒くしない
          drawFloorTile(
            px,
            py,
            tx,
            ty
          );
        }
      }
    }

    drawLakeShore(map);
  };


  /* =====================================================
     BUILDINGS
  ===================================================== */

  drawBuildings = function () {

    const map =
      getCurrentMap();

    if (!map.buildings) {
      return;
    }

    for (
      const building of map.buildings
    ) {

      drawBuilding(
        building
      );
    }
  };


  function drawBuilding(b) {

    const x =
      SX(b.x * TILE);

    const y =
      SY(b.y * TILE);

    const w =
      b.w * TILE;

    const h =
      b.h * TILE;

    if (
      x > canvas.width + 80 ||
      y > canvas.height + 80 ||
      x + w < -80 ||
      y + h < -80
    ) {
      return;
    }

    const hotel =
      b.type === "hotel";

    const floors =
      hotel
        ? 3
        : (
            b.h >= 9
              ? 2
              : 1
          );

    // 影
    fillRect(
      x + 10,
      y + 13,
      w,
      h,
      "rgba(5,6,13,.40)"
    );

    // 本体
    fillRect(
      x,
      y + 18,
      w,
      h - 18,
      "#261a1e"
    );

    fillRect(
      x + 7,
      y + 24,
      w - 14,
      h - 30,
      b.color || "#49302d"
    );

    // 木柱
    const colCount =
      Math.max(
        3,
        Math.floor(w / 75)
      );

    for (
      let i = 0;
      i <= colCount;
      i++
    ) {

      const cx =
        x +
        (w / colCount) *
        i;

      fillRect(
        cx - 3,
        y + 20,
        6,
        h - 20,
        "#211519"
      );

      fillRect(
        cx,
        y + 20,
        2,
        h - 20,
        "#704332"
      );
    }

    // 屋根
    drawRoof(
      x - 8,
      y,
      w + 16,
      35
    );

    // 上階
    if (floors >= 2) {

      const windowY =
        y + 52;

      drawWindowRow(
        x,
        windowY,
        w
      );

      drawEave(
        x - 4,
        y + h * 0.48,
        w + 8
      );
    }

    if (floors >= 3) {

      drawWindowRow(
        x,
        y + 105,
        w
      );
    }

    // 一階
    drawGroundFloor(
      b,
      x,
      y,
      w,
      h
    );

    // 看板
    drawBuildingSign(
      b,
      x,
      y,
      w,
      h
    );
  }


  function drawRoof(x, y, w, h) {

    ctx.save();

    ctx.fillStyle =
      "#0d1322";

    ctx.beginPath();

    ctx.moveTo(
      x + 9,
      y + 3
    );

    ctx.lineTo(
      x + w - 9,
      y + 3
    );

    ctx.lineTo(
      x + w + 2,
      y + h - 7
    );

    ctx.lineTo(
      x - 2,
      y + h - 7
    );

    ctx.closePath();

    ctx.fill();

    fillRect(
      x + 5,
      y + 8,
      w - 10,
      h - 16,
      "#18213a"
    );

    // 瓦
    for (
      let xx = x + 7;
      xx < x + w - 7;
      xx += 13
    ) {

      strokeLine(
        xx,
        y + 8,
        xx - 2,
        y + h - 9,
        "#090e1b"
      );

      strokeLine(
        xx + 2,
        y + 8,
        xx,
        y + h - 9,
        "rgba(74,88,132,.20)"
      );
    }

    // 軒
    fillRect(
      x - 5,
      y + h - 10,
      w + 10,
      8,
      "#090e19"
    );

    fillRect(
      x,
      y + h - 10,
      w,
      2,
      "#2b3653"
    );

    // 反り
    fillRect(
      x - 10,
      y + h - 13,
      14,
      5,
      "#0a101d"
    );

    fillRect(
      x + w - 4,
      y + h - 13,
      14,
      5,
      "#0a101d"
    );

    ctx.restore();
  }


  function drawEave(
    x,
    y,
    w
  ) {

    fillRect(
      x,
      y,
      w,
      11,
      "#0e1524"
    );

    fillRect(
      x + 4,
      y + 2,
      w - 8,
      2,
      "#2b3650"
    );
  }


  function drawWindowRow(
    x,
    y,
    w
  ) {

    const spacing = 70;

    for (
      let wx = x + 25;
      wx < x + w - 35;
      wx += spacing
    ) {

      drawWindow(
        wx,
        y,
        32,
        29
      );
    }
  }


  function drawWindow(
    x,
    y,
    w,
    h
  ) {

    glow(
      x + w / 2,
      y + h / 2,
      37,
      "rgba(255,151,54,.95)",
      0.09
    );

    fillRect(
      x - 4,
      y - 4,
      w + 8,
      h + 8,
      "#1a1318"
    );

    fillRect(
      x,
      y,
      w,
      h,
      "#60371f"
    );

    fillRect(
      x + 5,
      y + 5,
      w - 10,
      h - 10,
      "#e78c35"
    );

    fillRect(
      x + 8,
      y + 7,
      w - 16,
      h - 14,
      "#ffc45b"
    );

    fillRect(
      x + w / 2 - 2,
      y,
      4,
      h,
      "#4b2b22"
    );

    fillRect(
      x,
      y + h / 2 - 2,
      w,
      4,
      "#4b2b22"
    );
  }


  function drawGroundFloor(
    b,
    x,
    y,
    w,
    h
  ) {

    const bottom =
      y + h;

    const doorCenter =
      b.doorX * TILE -
      camera.x +
      TILE / 2;

    const doorX =
      Math.max(
        x + 18,
        Math.min(
          x + w - 50,
          doorCenter - 18
        )
      );

    for (
      let wx = x + 20;
      wx < x + w - 35;
      wx += 69
    ) {

      if (
        Math.abs(
          wx + 18 -
          (doorX + 18)
        ) < 47
      ) {
        continue;
      }

      drawShopWindow(
        wx,
        bottom - 64,
        38,
        39
      );
    }

    drawDoor(
      doorX,
      bottom - 61,
      36,
      61
    );

    // 玄関の石段
    fillRect(
      doorX - 8,
      bottom,
      52,
      7,
      "#50474b"
    );

    fillRect(
      doorX - 13,
      bottom + 7,
      62,
      5,
      "#35313a"
    );
  }


  function drawShopWindow(
    x,
    y,
    w,
    h
  ) {

    fillRect(
      x - 3,
      y - 3,
      w + 6,
      h + 6,
      "#1a1317"
    );

    fillRect(
      x,
      y,
      w,
      h,
      "#63351f"
    );

    fillRect(
      x + 5,
      y + 5,
      w - 10,
      h - 10,
      "#c86d2e"
    );

    fillRect(
      x + 8,
      y + 8,
      w - 16,
      h - 16,
      "#ffb44b"
    );

    fillRect(
      x + w / 2 - 2,
      y + 3,
      4,
      h - 6,
      "#45261f"
    );

    fillRect(
      x + 3,
      y + h / 2 - 2,
      w - 6,
      4,
      "#45261f"
    );

    glow(
      x + w / 2,
      y + h / 2,
      45,
      "rgba(255,134,46,.9)",
      0.065
    );
  }


  function drawDoor(
    x,
    y,
    w,
    h
  ) {

    fillRect(
      x - 5,
      y - 5,
      w + 10,
      h + 5,
      "#181217"
    );

    fillRect(
      x,
      y,
      w,
      h,
      "#4c2b22"
    );

    fillRect(
      x + 5,
      y + 5,
      w - 10,
      h - 5,
      "#31211e"
    );

    fillRect(
      x + w / 2 - 2,
      y + 5,
      4,
      h - 5,
      "#774630"
    );

    fillRect(
      x + 8,
      y + 10,
      3,
      h - 18,
      "#67402f"
    );

    fillRect(
      x + w - 11,
      y + 10,
      3,
      h - 18,
      "#67402f"
    );

    fillRect(
      x + w / 2 + 5,
      y + h / 2,
      3,
      3,
      "#e5a247"
    );

    glow(
      x + w / 2,
      y + h - 10,
      42,
      "rgba(255,139,47,.9)",
      0.075
    );
  }


  /* =====================================================
     BUILDING SIGN
  ===================================================== */

  function drawBuildingSign(
    b,
    x,
    y,
    w,
    h
  ) {

    const text =
      b.name || "";

    if (!text) return;

    const signW =
      Math.min(
        w - 30,
        Math.max(
          88,
          text.length * 22 + 26
        )
      );

    const signH = 34;

    let signX =
      x + w / 2 -
      signW / 2;

    let signY =
      y + 36;

    if (
      b.type === "hotel" ||
      h > TILE * 10
    ) {

      signX =
        x + 18;

      signY =
        y + h * 0.60;
    }

    fillRect(
      signX + 4,
      signY + 5,
      signW,
      signH,
      "rgba(10,7,10,.50)"
    );

    fillRect(
      signX,
      signY,
      signW,
      signH,
      "#742725"
    );

    fillRect(
      signX + 3,
      signY + 3,
      signW - 6,
      signH - 6,
      "#a8382e"
    );

    fillRect(
      signX + 5,
      signY + 5,
      signW - 10,
      2,
      "rgba(255,193,94,.26)"
    );

    ctx.save();

    ctx.fillStyle =
      "#ffd08a";

    ctx.font =
      "bold 17px serif";

    ctx.textAlign =
      "center";

    ctx.textBaseline =
      "middle";

    ctx.fillText(
      text,
      signX + signW / 2,
      signY + signH / 2 + 1
    );

    ctx.restore();

    drawSmallLantern(
      signX - 12,
      signY + 7
    );

    drawSmallLantern(
      signX + signW + 4,
      signY + 7
    );
  }


  function drawSmallLantern(
    x,
    y
  ) {

    glow(
      x + 5,
      y + 7,
      27,
      "rgba(255,75,35,.9)",
      0.14
    );

    fillRect(
      x + 1,
      y,
      8,
      2,
      "#65221d"
    );

    fillRect(
      x,
      y + 2,
      10,
      14,
      "#9f3028"
    );

    fillRect(
      x + 2,
      y + 4,
      6,
      10,
      "#ff6840"
    );

    fillRect(
      x + 1,
      y + 16,
      8,
      2,
      "#65221d"
    );
  }


  /* =====================================================
     STALL

     map.js は width / sign を使っているので
     そこへ完全対応
  ===================================================== */

  drawStalls = function () {

    const map =
      getCurrentMap();

    if (!map.stalls) {
      return;
    }

    for (
      const stall of map.stalls
    ) {

      drawStall(
        stall
      );
    }
  };


  function drawStall(stall) {

    const x =
      SX(stall.x * TILE);

    const y =
      SY(stall.y * TILE);

    const w =
      (stall.width || 3) *
      TILE;

    const h =
      58;

    if (
      x > canvas.width + 60 ||
      y > canvas.height + 60 ||
      x + w < -60 ||
      y + h < -60
    ) {
      return;
    }

    // 影
    fillRect(
      x + 7,
      y + 10,
      w,
      h,
      "rgba(4,5,11,.35)"
    );

    // 支柱
    fillRect(
      x + 6,
      y + 22,
      5,
      38,
      "#38231f"
    );

    fillRect(
      x + w - 11,
      y + 22,
      5,
      38,
      "#38231f"
    );

    // 台
    fillRect(
      x + 4,
      y + 37,
      w - 8,
      22,
      "#402923"
    );

    fillRect(
      x + 2,
      y + 35,
      w - 4,
      5,
      "#815035"
    );

    // 屋根
    fillRect(
      x,
      y + 8,
      w,
      17,
      "#6c2225"
    );

    for (
      let xx = x + 3;
      xx < x + w - 5;
      xx += 18
    ) {

      fillRect(
        xx,
        y + 11,
        9,
        11,
        "#c14332"
      );

      fillRect(
        xx + 9,
        y + 11,
        9,
        11,
        "#85272a"
      );
    }

    // 看板
    const label =
      stall.sign || "";

    if (label) {

      const sw =
        Math.min(
          w - 20,
          Math.max(
            50,
            label.length * 17
          )
        );

      fillRect(
        x + w / 2 - sw / 2,
        y - 4,
        sw,
        18,
        "#682222"
      );

      fillRect(
        x + w / 2 - sw / 2 + 2,
        y - 2,
        sw - 4,
        14,
        "#953128"
      );

      ctx.save();

      ctx.fillStyle =
        "#ffd17b";

      ctx.font =
        "bold 12px serif";

      ctx.textAlign =
        "center";

      ctx.textBaseline =
        "middle";

      ctx.fillText(
        label,
        x + w / 2,
        y + 5
      );

      ctx.restore();
    }

    // 商品
    for (
      let i = 0;
      i < 4;
      i++
    ) {

      const ix =
        x +
        18 +
        i *
        ((w - 36) / 4);

      fillRect(
        ix,
        y + 43,
        10,
        7,
        i % 2
          ? "#d98b3d"
          : "#a54e2d"
      );

      fillRect(
        ix + 2,
        y + 41,
        6,
        2,
        "#f5b65b"
      );
    }

    drawSmallLantern(
      x + 10,
      y + 24
    );

    drawSmallLantern(
      x + w - 20,
      y + 24
    );
  }


  /* =====================================================
     LANTERN ROWS

     map.js の lanternRows をそのまま使用
  ===================================================== */

  function drawMapLanternRows() {

    const map =
      getCurrentMap();

    if (
      !map.lanternRows ||
      map.lanternRows.length === 0
    ) {
      return;
    }

    for (
      const row of map.lanternRows
    ) {

      const y =
        SY(row.y * TILE);

      const x1 =
        SX(row.start * TILE);

      const x2 =
        SX(row.end * TILE);

      strokeLine(
        x1,
        y,
        x2,
        y,
        "rgba(23,13,20,.72)"
      );

      for (
        let x = x1 + 14;
        x < x2 - 8;
        x += 43
      ) {

        glow(
          x,
          y + 7,
          27,
          "rgba(255,75,35,.9)",
          0.105
        );

        fillRect(
          x - 4,
          y + 2,
          8,
          13,
          "#9e3028"
        );

        fillRect(
          x - 2,
          y + 4,
          4,
          9,
          "#ff6941"
        );

        fillRect(
          x - 3,
          y + 15,
          6,
          2,
          "#63211d"
        );
      }
    }
  }


  /* =====================================================
     LAKE REFLECTION

     西湖をただの青面にしない
  ===================================================== */

  function drawLakeReflections() {

    if (
      currentMapId !== "lake"
    ) {
      return;
    }

    const time =
      performance.now();

    ctx.save();

    ctx.globalAlpha =
      0.20;

    for (
      let wy = 4 * TILE;
      wy < 35 * TILE;
      wy += 54
    ) {

      const y =
        SY(wy);

      const wobble =
        Math.sin(
          time * 0.0012 +
          wy * 0.02
        ) * 6;

      const x =
        SX(2 * TILE) +
        wobble;

      fillRect(
        x,
        y,
        64,
        2,
        "rgba(218,162,84,.25)"
      );

      fillRect(
        x + 14,
        y + 6,
        39,
        1,
        "rgba(224,177,96,.20)"
      );

      fillRect(
        x - 8,
        y + 12,
        79,
        1,
        "rgba(123,178,196,.20)"
      );
    }

    ctx.restore();
  }


  /* =====================================================
     LIGHTING
  ===================================================== */

  drawLighting = function () {

    const map =
      getCurrentMap();

    ctx.save();

    // 完全な黒ではなく青紫の夜
    if (
      map.ambient === "indoor"
    ) {

      ctx.fillStyle =
        "rgba(22,13,19,.035)";

    } else if (
      map.ambient === "lake"
    ) {

      ctx.fillStyle =
        "rgba(8,18,34,.075)";

    } else {

      ctx.fillStyle =
        "rgba(12,11,29,.085)";
    }

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.restore();

    // 提灯
    drawMapLanternRows();

    // 西湖反射
    drawLakeReflections();

    // 建物入口の光
    if (
      map.buildings
    ) {

      for (
        const b of map.buildings
      ) {

        const x =
          b.doorX * TILE -
          camera.x +
          TILE / 2;

        const y =
          (b.y + b.h) *
          TILE -
          camera.y -
          7;

        glow(
          x,
          y,
          58,
          "rgba(255,137,47,.9)",
          0.05
        );
      }
    }

    // 軽いビネット
    const vignette =
      ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.18,

        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.72
      );

    vignette.addColorStop(
      0,
      "rgba(0,0,0,0)"
    );

    vignette.addColorStop(
      0.70,
      "rgba(3,4,12,.025)"
    );

    vignette.addColorStop(
      1,
      "rgba(3,4,12,.20)"
    );

    ctx.fillStyle =
      vignette;

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  };


  console.log(
    "武林夜市 Visual Overhaul v2 loaded"
  );

})();
