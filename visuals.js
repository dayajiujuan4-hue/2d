/* =========================================================
   武林夜市 - Visual Overhaul
   reference style:
   ・濃紺～紫灰色の夜
   ・細かな石畳
   ・中国風木造建築
   ・瓦屋根
   ・暖色の窓
   ・赤い提灯
   ・路地と広場の密度差

   ゲームロジックには触れず、描画だけを上書きする。
========================================================= */

(() => {
  "use strict";

  const V = {
    groundDark: "#242333",
    groundMid: "#2c2a3a",
    groundLight: "#353242",

    plazaDark: "#3a3541",
    plazaMid: "#46404b",
    plazaLight: "#504954",

    roadDark: "#272635",
    roadMid: "#302e3d",

    grass: "#162d29",
    water: "#172b3d",

    wall: "#201d29",
    indoor: "#4a382f",
    counter: "#563b2e",

    woodDark: "#24191d",
    wood: "#44282a",
    woodLight: "#694034",

    roofDark: "#11182b",
    roofMid: "#19223a",
    roofLight: "#25304c",

    redDark: "#772b2b",
    red: "#b83c31",
    redBright: "#dc4c35",

    goldDark: "#9b5d27",
    gold: "#e09a43",
    goldBright: "#ffc260",

    windowDark: "#66351e",
    window: "#f19a38",
    windowBright: "#ffd16b",

    treeDark: "#10231f",
    tree: "#17372f",
    treeLight: "#215044"
  };


  /* =========================================================
     Utility
  ========================================================= */

  function sx(x) {
    return Math.floor(x - camera.x);
  }

  function sy(y) {
    return Math.floor(y - camera.y);
  }

  function hash(x, y, salt = 0) {
    let n =
      Math.imul((x | 0) + salt * 17, 374761393) +
      Math.imul((y | 0) + salt * 31, 668265263);

    n = (n ^ (n >>> 13)) >>> 0;
    n = Math.imul(n, 1274126177) >>> 0;

    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }

  function rect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));
  }

  function line(x1, y1, x2, y2, color, width = 1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(Math.floor(x1) + 0.5, Math.floor(y1) + 0.5);
    ctx.lineTo(Math.floor(x2) + 0.5, Math.floor(y2) + 0.5);
    ctx.stroke();
  }

  function glow(x, y, radius, color, alpha = 0.22) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);

    g.addColorStop(0, color);
    g.addColorStop(0.22, color);
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


  /* =========================================================
     Ground
  ========================================================= */

  function drawStoneTile(px, py, tx, ty, plaza = false) {
    const r = hash(tx, ty);

    let base;

    if (plaza) {
      if (r < 0.28) base = V.plazaDark;
      else if (r < 0.74) base = V.plazaMid;
      else base = V.plazaLight;
    } else {
      if (r < 0.28) base = V.groundDark;
      else if (r < 0.78) base = V.groundMid;
      else base = V.groundLight;
    }

    rect(px, py, TILE, TILE, base);

    const seam = plaza
      ? "rgba(20,17,25,.34)"
      : "rgba(13,14,24,.36)";

    line(px, py + TILE - 1, px + TILE, py + TILE - 1, seam);
    line(px + TILE - 1, py, px + TILE - 1, py + TILE, seam);

    const offset = ty % 2 ? TILE * 0.46 : TILE * 0.16;

    line(
      px + offset,
      py,
      px + offset,
      py + 7,
      "rgba(255,255,255,.025)"
    );

    if (r > 0.82) {
      rect(
        px + 5,
        py + 5,
        TILE - 10,
        2,
        "rgba(255,255,255,.025)"
      );
    }

    if (r < 0.12) {
      rect(
        px + TILE - 7,
        py + 5,
        2,
        10,
        "rgba(12,12,20,.15)"
      );
    }
  }


  function drawRoadTile(px, py, tx, ty) {
    const r = hash(tx, ty, 11);

    rect(
      px,
      py,
      TILE,
      TILE,
      r > 0.7 ? V.roadMid : V.roadDark
    );

    line(
      px,
      py + TILE - 1,
      px + TILE,
      py + TILE - 1,
      "rgba(10,10,18,.35)"
    );

    if ((tx + ty) % 3 === 0) {
      line(
        px + TILE - 1,
        py + 6,
        px + TILE - 1,
        py + TILE - 5,
        "rgba(255,255,255,.025)"
      );
    }
  }


  function drawWaterTile(px, py, tx, ty, time) {
    rect(px, py, TILE, TILE, V.water);

    const wave =
      Math.sin(time * 0.0015 + tx * 0.8 + ty * 0.3) * 3;

    rect(
      px + 4 + wave,
      py + 8,
      15,
      2,
      "rgba(86,137,164,.17)"
    );

    rect(
      px + 13 - wave,
      py + 21,
      12,
      1,
      "rgba(108,162,185,.12)"
    );
  }


  function drawGrassTile(px, py, tx, ty) {
    rect(px, py, TILE, TILE, V.grass);

    const r = hash(tx, ty, 20);

    if (r > 0.5) {
      rect(
        px + 8,
        py + 11,
        2,
        7,
        "rgba(45,91,68,.24)"
      );

      rect(
        px + 18,
        py + 16,
        2,
        6,
        "rgba(45,91,68,.18)"
      );
    }
  }


  /* =========================================================
     MAP OVERRIDE
  ========================================================= */

  drawMap = function () {
    const map = getCurrentMap();

    const startX = Math.max(
      0,
      Math.floor(camera.x / TILE) - 1
    );

    const startY = Math.max(
      0,
      Math.floor(camera.y / TILE) - 1
    );

    const endX = Math.min(
      map.width,
      Math.ceil((camera.x + canvas.width) / TILE) + 1
    );

    const endY = Math.min(
      map.height,
      Math.ceil((camera.y + canvas.height) / TILE) + 1
    );

    const now = performance.now();

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {

        const tile = map.grid[y]?.[x];

        const px = sx(x * TILE);
        const py = sy(y * TILE);

        switch (tile) {

          case TILE_TYPES?.PLAZA:
            drawStoneTile(px, py, x, y, true);
            break;

          case TILE_TYPES?.ROAD:
            drawRoadTile(px, py, x, y);
            break;

          case TILE_TYPES?.WATER:
            drawWaterTile(px, py, x, y, now);
            break;

          case TILE_TYPES?.GRASS:
            drawGrassTile(px, py, x, y);
            break;

          case TILE_TYPES?.INDOOR:
            drawIndoorFloor(px, py, x, y);
            break;

          case TILE_TYPES?.WALL:
            drawIndoorWall(px, py, x, y);
            break;

          case TILE_TYPES?.COUNTER:
            drawCounterTile(px, py);
            break;

          default:
            drawStoneTile(px, py, x, y, false);
        }
      }
    }

    drawStreetBorders(map);
  };


  function drawIndoorFloor(px, py, tx, ty) {
    const r = hash(tx, ty, 50);

    rect(
      px,
      py,
      TILE,
      TILE,
      r > 0.5 ? "#49362e" : "#443129"
    );

    line(
      px,
      py + TILE - 1,
      px + TILE,
      py + TILE - 1,
      "rgba(20,12,10,.25)"
    );

    line(
      px + TILE / 2,
      py,
      px + TILE / 2,
      py + TILE,
      "rgba(20,12,10,.12)"
    );
  }


  function drawIndoorWall(px, py) {
    rect(px, py, TILE, TILE, "#211b20");

    rect(
      px,
      py + TILE - 7,
      TILE,
      7,
      "#37252a"
    );
  }


  function drawCounterTile(px, py) {
    rect(px, py, TILE, TILE, "#4a3028");

    rect(
      px,
      py,
      TILE,
      5,
      "#76503b"
    );

    line(
      px,
      py + TILE - 2,
      px + TILE,
      py + TILE - 2,
      "#241719"
    );
  }


  /* =========================================================
     Street border
  ========================================================= */

  function drawStreetBorders(map) {
    if (map.ambient === "indoor") return;

    const startX = Math.max(
      0,
      Math.floor(camera.x / TILE) - 1
    );

    const startY = Math.max(
      0,
      Math.floor(camera.y / TILE) - 1
    );

    const endX = Math.min(
      map.width,
      Math.ceil((camera.x + canvas.width) / TILE) + 1
    );

    const endY = Math.min(
      map.height,
      Math.ceil((camera.y + canvas.height) / TILE) + 1
    );

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {

        const t = map.grid[y]?.[x];

        if (t !== TILE_TYPES?.PLAZA) continue;

        const px = sx(x * TILE);
        const py = sy(y * TILE);

        const up = map.grid[y - 1]?.[x];
        const down = map.grid[y + 1]?.[x];

        if (up !== TILE_TYPES?.PLAZA) {
          rect(
            px,
            py,
            TILE,
            3,
            "rgba(110,82,82,.28)"
          );
        }

        if (down !== TILE_TYPES?.PLAZA) {
          rect(
            px,
            py + TILE - 3,
            TILE,
            3,
            "rgba(20,15,23,.38)"
          );
        }
      }
    }
  }


  /* =========================================================
     BUILDINGS
  ========================================================= */

  drawBuildings = function () {
    const map = getCurrentMap();

    if (!map.buildings) return;

    for (const b of map.buildings) {
      drawChineseBuilding(b);
    }
  };


  function drawChineseBuilding(b) {
    const x = sx(b.x * TILE);
    const y = sy(b.y * TILE);

    const w = b.w * TILE;
    const h = b.h * TILE;

    if (
      x > canvas.width + 100 ||
      y > canvas.height + 100 ||
      x + w < -100 ||
      y + h < -100
    ) {
      return;
    }

    const floors =
      b.type === "hotel"
        ? 3
        : h > TILE * 10
        ? 2
        : 1;

    const roofH = Math.min(36, TILE * 1.1);

    drawBuildingShadow(x, y, w, h);

    drawBuildingBody(
      x,
      y + roofH * 0.45,
      w,
      h - roofH * 0.45,
      floors
    );

    drawRoof(
      x - 7,
      y,
      w + 14,
      roofH
    );

    if (floors >= 2) {
      drawUpperFloorWindows(
        x,
        y + roofH + 10,
        w
      );

      drawHorizontalEave(
        x,
        y + h * 0.46,
        w
      );
    }

    if (floors >= 3) {
      drawUpperFloorWindows(
        x,
        y + roofH + 66,
        w
      );
    }

    drawGroundFacade(
      x,
      y,
      w,
      h,
      b
    );

    drawBuildingSign(
      x,
      y,
      w,
      h,
      b
    );
  }


  function drawBuildingShadow(x, y, w, h) {
    ctx.save();

    ctx.globalAlpha = 0.32;
    ctx.fillStyle = "#090b12";

    ctx.fillRect(
      x + 10,
      y + 13,
      w + 5,
      h + 9
    );

    ctx.restore();
  }


  function drawBuildingBody(x, y, w, h, floors) {
    rect(x, y, w, h, V.woodDark);

    rect(
      x + 6,
      y + 8,
      w - 12,
      h - 13,
      "#382327"
    );

    const columns =
      Math.max(3, Math.floor(w / 70));

    for (let i = 0; i <= columns; i++) {
      const cx =
        x + (w / columns) * i;

      rect(
        cx - 3,
        y,
        6,
        h,
        "#21171b"
      );

      rect(
        cx,
        y,
        2,
        h,
        "#56342d"
      );
    }

    for (let fy = y + 36; fy < y + h; fy += 58) {
      rect(
        x,
        fy,
        w,
        4,
        "#1a151b"
      );

      rect(
        x,
        fy + 4,
        w,
        2,
        "#56372f"
      );
    }
  }


  function drawRoof(x, y, w, h) {
    ctx.save();

    ctx.fillStyle = "#0c1221";

    ctx.beginPath();
    ctx.moveTo(x + 7, y + 3);
    ctx.lineTo(x + w - 7, y + 3);
    ctx.lineTo(x + w, y + h - 5);
    ctx.lineTo(x - 1, y + h - 5);
    ctx.closePath();
    ctx.fill();

    rect(
      x + 4,
      y + 8,
      w - 8,
      h - 12,
      V.roofMid
    );

    const tileW = 12;

    for (let xx = x + 5; xx < x + w - 5; xx += tileW) {
      line(
        xx,
        y + 8,
        xx - 2,
        y + h - 7,
        "rgba(6,8,18,.6)"
      );

      line(
        xx + 2,
        y + 8,
        xx,
        y + h - 7,
        "rgba(61,73,111,.20)"
      );
    }

    rect(
      x - 3,
      y + h - 8,
      w + 6,
      7,
      "#090e19"
    );

    rect(
      x,
      y + h - 9,
      w,
      2,
      "#283451"
    );

    // 中国建築らしい反り
    rect(
      x - 8,
      y + h - 11,
      11,
      5,
      "#0b101d"
    );

    rect(
      x + w - 3,
      y + h - 11,
      11,
      5,
      "#0b101d"
    );

    ctx.restore();
  }


  function drawHorizontalEave(x, y, w) {
    rect(
      x - 4,
      y,
      w + 8,
      11,
      "#101725"
    );

    rect(
      x,
      y + 2,
      w,
      3,
      "#28324a"
    );
  }


  function drawUpperFloorWindows(x, y, w) {
    const spacing = 72;

    for (
      let xx = x + 24;
      xx < x + w - 30;
      xx += spacing
    ) {
      drawChineseWindow(
        xx,
        y,
        31,
        28
      );
    }
  }


  function drawChineseWindow(x, y, w, h) {
    glow(
      x + w / 2,
      y + h / 2,
      35,
      "rgba(255,146,49,.9)",
      0.09
    );

    rect(
      x - 4,
      y - 4,
      w + 8,
      h + 8,
      "#1c1519"
    );

    rect(
      x,
      y,
      w,
      h,
      V.windowDark
    );

    rect(
      x + 4,
      y + 4,
      w - 8,
      h - 8,
      V.window
    );

    rect(
      x + 7,
      y + 6,
      w - 14,
      h - 12,
      V.windowBright
    );

    rect(
      x + w / 2 - 2,
      y,
      4,
      h,
      "#4a2920"
    );

    rect(
      x,
      y + h / 2 - 2,
      w,
      4,
      "#4a2920"
    );
  }


  function drawGroundFacade(x, y, w, h, b) {
    const bottom = y + h;

    const doorTileX =
      Number.isFinite(b.doorX)
        ? b.doorX * TILE - camera.x
        : x + w / 2;

    const doorX =
      Math.max(
        x + 20,
        Math.min(x + w - 48, doorTileX - 13)
      );

    // 格子窓
    for (
      let xx = x + 20;
      xx < x + w - 30;
      xx += 74
    ) {
      if (
        Math.abs(
          xx + 15 - (doorX + 15)
        ) < 45
      ) {
        continue;
      }

      drawShopWindow(
        xx,
        bottom - 64,
        38,
        39
      );
    }

    drawDoor(
      doorX,
      bottom - 61,
      34,
      61
    );

    // 石段
    rect(
      doorX - 8,
      bottom,
      50,
      7,
      "#4c4144"
    );

    rect(
      doorX - 13,
      bottom + 7,
      60,
      5,
      "#332e36"
    );
  }


  function drawShopWindow(x, y, w, h) {
    rect(
      x - 3,
      y - 3,
      w + 6,
      h + 6,
      "#1a1418"
    );

    rect(
      x,
      y,
      w,
      h,
      "#563020"
    );

    rect(
      x + 5,
      y + 5,
      w - 10,
      h - 10,
      "#bd6a2e"
    );

    rect(
      x + 8,
      y + 8,
      w - 16,
      h - 16,
      "#ffb447"
    );

    rect(
      x + w / 2 - 2,
      y + 3,
      4,
      h - 6,
      "#42251f"
    );

    rect(
      x + 3,
      y + h / 2 - 2,
      w - 6,
      4,
      "#42251f"
    );

    glow(
      x + w / 2,
      y + h / 2,
      48,
      "rgba(255,133,42,.8)",
      0.07
    );
  }


  function drawDoor(x, y, w, h) {
    rect(
      x - 5,
      y - 5,
      w + 10,
      h + 5,
      "#171217"
    );

    rect(
      x,
      y,
      w,
      h,
      "#4a291f"
    );

    rect(
      x + 5,
      y + 5,
      w - 10,
      h - 5,
      "#30201d"
    );

    line(
      x + w / 2,
      y + 4,
      x + w / 2,
      y + h,
      "#7c4930",
      2
    );

    rect(
      x + 8,
      y + 10,
      3,
      h - 19,
      "#66402e"
    );

    rect(
      x + w - 11,
      y + 10,
      3,
      h - 19,
      "#66402e"
    );

    rect(
      x + w / 2 + 5,
      y + h / 2,
      3,
      3,
      V.gold
    );

    glow(
      x + w / 2,
      y + h - 12,
      45,
      "rgba(255,131,42,.8)",
      0.08
    );
  }


  /* =========================================================
     Sign
  ========================================================= */

  function drawBuildingSign(x, y, w, h, b) {
    const text =
      b.label ||
      b.name ||
      b.title ||
      "";

    if (!text) return;

    const signW = Math.min(
      Math.max(86, text.length * 23 + 26),
      w - 30
    );

    const signH = 34;

    let signX = x + 16;
    let signY;

    if (b.type === "hotel") {
      signX = x + 18;
      signY = y + h * 0.62;
    } else {
      signX = x + w / 2 - signW / 2;
      signY = y + 36;
    }

    // shadow
    rect(
      signX + 4,
      signY + 5,
      signW,
      signH,
      "rgba(12,8,12,.55)"
    );

    rect(
      signX,
      signY,
      signW,
      signH,
      V.redDark
    );

    rect(
      signX + 3,
      signY + 3,
      signW - 6,
      signH - 6,
      V.red
    );

    rect(
      signX + 5,
      signY + 5,
      signW - 10,
      2,
      "rgba(255,176,76,.32)"
    );

    ctx.save();

    ctx.fillStyle = "#ffd08a";
    ctx.font =
      "bold 18px 'Noto Serif SC','Noto Serif JP',serif";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "#7b271b";
    ctx.shadowBlur = 3;

    ctx.fillText(
      text,
      signX + signW / 2,
      signY + signH / 2 + 1
    );

    ctx.restore();

    drawSignLantern(
      signX - 13,
      signY + 6
    );

    drawSignLantern(
      signX + signW + 5,
      signY + 6
    );
  }


  function drawSignLantern(x, y) {
    glow(
      x + 5,
      y + 8,
      30,
      "rgba(255,76,35,.9)",
      0.16
    );

    rect(
      x + 1,
      y,
      8,
      2,
      "#6b251d"
    );

    rect(
      x,
      y + 2,
      10,
      14,
      "#9f2f25"
    );

    rect(
      x + 2,
      y + 4,
      6,
      10,
      "#ff623a"
    );

    rect(
      x + 1,
      y + 16,
      8,
      2,
      "#6b251d"
    );
  }


  /* =========================================================
     STALLS
  ========================================================= */

  drawStalls = function () {
    const map = getCurrentMap();

    if (!map.stalls) return;

    for (const stall of map.stalls) {
      drawNightStall(stall);
    }
  };


  function drawNightStall(stall) {
    const x = sx(stall.x * TILE);
    const y = sy(stall.y * TILE);

    const w =
      (stall.w || 3) * TILE;

    const h =
      (stall.h || 2) * TILE;

    if (
      x > canvas.width + 60 ||
      y > canvas.height + 60 ||
      x + w < -60 ||
      y + h < -60
    ) {
      return;
    }

    // shadow
    rect(
      x + 7,
      y + 9,
      w,
      h,
      "rgba(5,6,12,.34)"
    );

    // poles
    rect(
      x + 6,
      y + 24,
      5,
      h - 12,
      "#39221e"
    );

    rect(
      x + w - 11,
      y + 24,
      5,
      h - 12,
      "#39221e"
    );

    // counter
    rect(
      x + 4,
      y + h - 25,
      w - 8,
      24,
      "#3c2823"
    );

    rect(
      x + 2,
      y + h - 27,
      w - 4,
      5,
      "#75452e"
    );

    // roof
    rect(
      x,
      y + 9,
      w,
      18,
      "#641f25"
    );

    rect(
      x + 3,
      y + 12,
      w - 6,
      12,
      "#a4342d"
    );

    // cloth strips
    const strip = 18;

    for (
      let xx = x + 4;
      xx < x + w - 5;
      xx += strip
    ) {
      rect(
        xx,
        y + 13,
        9,
        10,
        "#c24732"
      );

      rect(
        xx + 9,
        y + 13,
        9,
        10,
        "#802629"
      );
    }

    // sign
    const label =
      stall.label ||
      stall.name ||
      "";

    if (label) {
      const sw =
        Math.min(
          w - 22,
          Math.max(52, label.length * 17)
        );

      rect(
        x + w / 2 - sw / 2,
        y,
        sw,
        18,
        "#672223"
      );

      rect(
        x + w / 2 - sw / 2 + 2,
        y + 2,
        sw - 4,
        14,
        "#8c3028"
      );

      ctx.save();

      ctx.fillStyle = "#ffd17b";
      ctx.font =
        "bold 12px 'Noto Serif SC','Noto Serif JP',serif";

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText(
        label,
        x + w / 2,
        y + 9
      );

      ctx.restore();
    }

    // food / goods
    for (let i = 0; i < 4; i++) {
      const ix =
        x + 20 + i * ((w - 40) / 4);

      rect(
        ix,
        y + h - 20,
        10,
        6,
        i % 2
          ? "#d98437"
          : "#a34c2c"
      );

      rect(
        ix + 2,
        y + h - 22,
        6,
        2,
        "#f3b252"
      );
    }

    drawStallLamp(
      x + 12,
      y + 29
    );

    drawStallLamp(
      x + w - 22,
      y + 29
    );
  }


  function drawStallLamp(x, y) {
    glow(
      x + 5,
      y + 6,
      36,
      "rgba(255,106,36,.9)",
      0.14
    );

    rect(
      x,
      y,
      10,
      13,
      "#a43229"
    );

    rect(
      x + 2,
      y + 2,
      6,
      9,
      "#ff7441"
    );
  }


  /* =========================================================
     Extra street atmosphere
  ========================================================= */

  function drawLanternRow(x1, y, x2, spacing = 42) {
    const screenY = sy(y);

    const start = sx(x1);
    const end = sx(x2);

    line(
      start,
      screenY,
      end,
      screenY,
      "rgba(32,17,24,.65)"
    );

    for (
      let x = start + 15;
      x < end - 10;
      x += spacing
    ) {
      glow(
        x,
        screenY + 8,
        28,
        "rgba(255,76,37,.85)",
        0.11
      );

      rect(
        x - 4,
        screenY + 2,
        8,
        13,
        "#a42f28"
      );

      rect(
        x - 2,
        screenY + 4,
        4,
        9,
        "#ff6540"
      );

      rect(
        x - 3,
        screenY + 15,
        6,
        2,
        "#6b241f"
      );
    }
  }


  function drawStreetLamp(wx, wy) {
    const x = sx(wx);
    const y = sy(wy);

    glow(
      x,
      y,
      75,
      "rgba(255,118,44,.85)",
      0.12
    );

    rect(
      x - 2,
      y,
      5,
      43,
      "#181824"
    );

    rect(
      x - 5,
      y + 40,
      11,
      4,
      "#13141d"
    );

    rect(
      x - 9,
      y - 10,
      18,
      18,
      "#742827"
    );

    rect(
      x - 6,
      y - 7,
      12,
      12,
      "#ff6b3d"
    );

    rect(
      x - 3,
      y - 4,
      6,
      6,
      "#ffc15b"
    );
  }


  function drawAtmosphericDetails() {
    const map = getCurrentMap();

    if (map.ambient === "indoor") return;

    // 小吃街
    if (currentMapId === "food") {

      drawLanternRow(
        6 * TILE,
        15 * TILE,
        31 * TILE,
        42
      );

      drawLanternRow(
        6 * TILE,
        24 * TILE,
        31 * TILE,
        42
      );

      drawStreetLamp(
        5 * TILE,
        16 * TILE
      );

      drawStreetLamp(
        25 * TILE,
        16 * TILE
      );

      drawStreetLamp(
        5 * TILE,
        25 * TILE
      );

      drawStreetLamp(
        25 * TILE,
        25 * TILE
      );
    }

    // 雑貨街
    if (currentMapId === "market") {

      drawLanternRow(
        7 * TILE,
        16 * TILE,
        32 * TILE,
        44
      );

      drawLanternRow(
        7 * TILE,
        25 * TILE,
        32 * TILE,
        44
      );

      drawStreetLamp(
        8 * TILE,
        17 * TILE
      );

      drawStreetLamp(
        31 * TILE,
        17 * TILE
      );
    }

    // ホテル街
    if (currentMapId === "hotel") {

      drawStreetLamp(
        17 * TILE,
        12 * TILE
      );

      drawStreetLamp(
        34 * TILE,
        12 * TILE
      );

      drawStreetLamp(
        17 * TILE,
        27 * TILE
      );

      drawStreetLamp(
        34 * TILE,
        27 * TILE
      );
    }

    // 西湖
    if (currentMapId === "lake") {

      drawLanternRow(
        21 * TILE,
        12 * TILE,
        34 * TILE,
        48
      );

      drawStreetLamp(
        22 * TILE,
        17 * TILE
      );

      drawStreetLamp(
        32 * TILE,
        17 * TILE
      );

      drawStreetLamp(
        22 * TILE,
        27 * TILE
      );
    }
  }


  /* =========================================================
     TREE ENHANCEMENT
  ========================================================= */

  function drawPixelTree(wx, wy, scale = 1) {
    const x = sx(wx);
    const y = sy(wy);

    const s = scale;

    rect(
      x - 5 * s,
      y + 13 * s,
      10 * s,
      25 * s,
      "#38251f"
    );

    rect(
      x - 9 * s,
      y + 29 * s,
      18 * s,
      6 * s,
      "#4b3026"
    );

    rect(
      x - 24 * s,
      y - 10 * s,
      48 * s,
      28 * s,
      V.treeDark
    );

    rect(
      x - 18 * s,
      y - 21 * s,
      38 * s,
      24 * s,
      V.tree
    );

    rect(
      x - 9 * s,
      y - 29 * s,
      26 * s,
      19 * s,
      V.treeLight
    );

    rect(
      x - 20 * s,
      y - 5 * s,
      12 * s,
      8 * s,
      "#245143"
    );
  }


  /* =========================================================
     NIGHT LIGHTING
  ========================================================= */

  drawLighting = function () {
    const map = getCurrentMap();

    ctx.save();

    // 夜の青紫フィルター
    ctx.fillStyle =
      map.ambient === "indoor"
        ? "rgba(19,13,23,.08)"
        : "rgba(13,14,31,.16)";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.restore();

    // 街の提灯・街灯
    drawAtmosphericDetails();

    // 建物の入口に微光
    if (map.buildings) {
      for (const b of map.buildings) {

        const bx =
          b.doorX != null
            ? b.doorX * TILE - camera.x
            : b.x * TILE -
              camera.x +
              b.w * TILE / 2;

        const by =
          (b.y + b.h) * TILE -
          camera.y -
          8;

        glow(
          bx,
          by,
          62,
          "rgba(255,132,48,.9)",
          0.055
        );
      }
    }

    // 画面周辺を暗くする
    const vignette =
      ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.20,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.72
      );

    vignette.addColorStop(
      0,
      "rgba(0,0,0,0)"
    );

    vignette.addColorStop(
      0.68,
      "rgba(6,7,18,.06)"
    );

    vignette.addColorStop(
      1,
      "rgba(5,5,15,.30)"
    );

    ctx.fillStyle = vignette;

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  };


  console.log(
    "武林夜市 Visual Overhaul loaded."
  );
})();
