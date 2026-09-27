"use strict";

const TILE = 32;

const MAP_WIDTH = 40;
const MAP_HEIGHT = 28;

/*
  タイル

  0 = 石畳
  1 = 道路
  2 = 建物
  3 = 屋台
  4 = 木
  5 = 提灯柱
  6 = 路地
  7 = 装飾床
*/

const gameMap = [];


// ==============================
// 基本マップ生成
// ==============================

for (let y = 0; y < MAP_HEIGHT; y++) {

  const row = [];

  for (let x = 0; x < MAP_WIDTH; x++) {

    let tile = 0;

    // 外周
    if (
      x === 0 ||
      y === 0 ||
      x === MAP_WIDTH - 1 ||
      y === MAP_HEIGHT - 1
    ) {
      tile = 2;
    }

    row.push(tile);
  }

  gameMap.push(row);
}


// ==============================
// 建物を置く
// ==============================

function fillRect(x, y, w, h, tile) {

  for (let yy = y; yy < y + h; yy++) {

    for (let xx = x; xx < x + w; xx++) {

      if (
        xx >= 0 &&
        yy >= 0 &&
        xx < MAP_WIDTH &&
        yy < MAP_HEIGHT
      ) {
        gameMap[yy][xx] = tile;
      }

    }
  }
}


// 左側店舗

fillRect(2, 2, 6, 6, 2);
fillRect(2, 11, 5, 5, 2);
fillRect(2, 20, 7, 6, 2);


// 右側店舗

fillRect(32, 2, 6, 7, 2);
fillRect(34, 12, 4, 5, 2);
fillRect(31, 20, 7, 6, 2);


// 奥の店舗

fillRect(12, 2, 5, 4, 2);
fillRect(22, 2, 6, 4, 2);


// ==============================
// メインストリート
// ==============================

fillRect(15, 6, 10, 21, 1);


// 横道

fillRect(7, 8, 27, 3, 1);
fillRect(7, 17, 27, 3, 1);


// 中央広場

fillRect(13, 12, 14, 5, 7);


// ==============================
// 屋台
// ==============================

const stalls = [

  { x: 10, y: 7 },
  { x: 12, y: 7 },

  { x: 27, y: 7 },
  { x: 29, y: 7 },

  { x: 9, y: 13 },
  { x: 9, y: 15 },

  { x: 29, y: 13 },
  { x: 29, y: 15 },

  { x: 10, y: 21 },
  { x: 12, y: 21 },

  { x: 27, y: 21 },
  { x: 29, y: 21 }

];

for (const stall of stalls) {
  gameMap[stall.y][stall.x] = 3;
}


// ==============================
// 木
// ==============================

const trees = [

  [9, 4],
  [10, 4],

  [29, 4],
  [30, 4],

  [8, 18],
  [30, 18],

  [11, 25],
  [28, 25]

];

for (const [x, y] of trees) {
  gameMap[y][x] = 4;
}


// ==============================
// 提灯柱
// ==============================

const lanternPosts = [

  [14, 7],
  [25, 7],

  [14, 11],
  [25, 11],

  [14, 17],
  [25, 17],

  [14, 21],
  [25, 21],

  [17, 6],
  [22, 6],

  [17, 25],
  [22, 25]

];

for (const [x, y] of lanternPosts) {
  gameMap[y][x] = 5;
}


// ==============================
// 当たり判定
// ==============================

function isSolidTile(tile) {

  return (
    tile === 2 ||
    tile === 3 ||
    tile === 4 ||
    tile === 5
  );
}


function isSolidAtPixel(px, py) {

  const tx = Math.floor(px / TILE);
  const ty = Math.floor(py / TILE);

  if (
    tx < 0 ||
    ty < 0 ||
    tx >= MAP_WIDTH ||
    ty >= MAP_HEIGHT
  ) {
    return true;
  }

  return isSolidTile(gameMap[ty][tx]);
}
