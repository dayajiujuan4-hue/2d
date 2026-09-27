"use strict";

const TILE = 32;

const MAP_WIDTH = 52;
const MAP_HEIGHT = 38;


/*
0 = 石畳
1 = 大通り
2 = 建物
3 = 屋台
4 = 木
5 = 提灯柱
6 = 暗い路地
7 = 広場
8 = 店舗入口
9 = 装飾
*/


const gameMap = [];

for (let y = 0; y < MAP_HEIGHT; y++) {

  const row = [];

  for (let x = 0; x < MAP_WIDTH; x++) {

    let tile = 0;

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


// ==========================================
// 大通り
// ==========================================

fillRect(20, 1, 12, 36, 1);


// 横方向の道

fillRect(6, 8, 40, 4, 1);
fillRect(5, 19, 42, 4, 1);
fillRect(7, 30, 38, 4, 1);


// ==========================================
// 中央広場
// ==========================================

fillRect(16, 14, 20, 5, 7);


// ==========================================
// 左側建物
// ==========================================

fillRect(2, 2, 8, 5, 2);
fillRect(12, 2, 6, 5, 2);

fillRect(2, 12, 7, 6, 2);
fillRect(11, 13, 5, 5, 2);

fillRect(2, 24, 8, 5, 2);
fillRect(12, 25, 6, 4, 2);

fillRect(2, 34, 9, 3, 2);
fillRect(13, 34, 5, 3, 2);


// ==========================================
// 右側建物
// ==========================================

fillRect(34, 2, 7, 5, 2);
fillRect(43, 2, 7, 5, 2);

fillRect(37, 12, 6, 6, 2);
fillRect(45, 13, 5, 5, 2);

fillRect(36, 24, 7, 5, 2);
fillRect(45, 24, 5, 5, 2);

fillRect(35, 34, 6, 3, 2);
fillRect(43, 34, 7, 3, 2);


// ==========================================
// 裏路地
// ==========================================

fillRect(10, 12, 1, 6, 6);
fillRect(43, 12, 2, 6, 6);

fillRect(10, 24, 2, 5, 6);
fillRect(43, 24, 2, 5, 6);


// ==========================================
// 店舗入口
// ==========================================

const entrances = [

  [7,6],
  [14,6],
  [36,6],
  [47,6],

  [6,17],
  [14,17],
  [39,17],
  [47,17],

  [7,28],
  [15,28],
  [39,28],
  [47,28]

];

for (const [x,y] of entrances) {
  gameMap[y][x] = 8;
}


// ==========================================
// 屋台
// ==========================================

const stalls = [

  {
    x: 17,
    y: 9,
    type: "shaokao",
    sign: "烧烤"
  },

  {
    x: 15,
    y: 10,
    type: "choudoufu",
    sign: "臭豆腐"
  },

  {
    x: 34,
    y: 9,
    type: "xiaolongbao",
    sign: "小笼包"
  },

  {
    x: 36,
    y: 10,
    type: "milkTea",
    sign: "奶茶"
  },


  {
    x: 13,
    y: 20,
    type: "fruit",
    sign: "鲜果"
  },

  {
    x: 15,
    y: 22,
    type: "shaokao",
    sign: "烤串"
  },

  {
    x: 36,
    y: 20,
    type: "snack",
    sign: "杭州小吃"
  },

  {
    x: 38,
    y: 22,
    type: "jewelry",
    sign: "饰品"
  },


  {
    x: 16,
    y: 31,
    type: "milkTea",
    sign: "茶饮"
  },

  {
    x: 34,
    y: 31,
    type: "fruit",
    sign: "水果"
  }

];


for (const stall of stalls) {

  gameMap[stall.y][stall.x] = 3;

}


// ==========================================
// 木
// ==========================================

const trees = [

  [11,4],
  [19,5],
  [32,5],
  [42,5],

  [10,20],
  [42,20],

  [11,31],
  [41,31],

  [19,35],
  [32,35]

];

for (const [x,y] of trees) {

  gameMap[y][x] = 4;

}


// ==========================================
// 提灯
// ==========================================

const lanternPosts = [

  [19,7],
  [32,7],

  [19,12],
  [32,12],

  [19,18],
  [32,18],

  [19,23],
  [32,23],

  [19,29],
  [32,29],

  [19,34],
  [32,34]

];

for (const [x,y] of lanternPosts) {

  gameMap[y][x] = 5;

}


// ==========================================
// 横断提灯
// ==========================================

const lanternStrings = [

  { y: 8, x1: 20, x2: 31 },

  { y: 14, x1: 20, x2: 31 },

  { y: 19, x1: 20, x2: 31 },

  { y: 25, x1: 20, x2: 31 },

  { y: 31, x1: 20, x2: 31 }

];


// ==========================================
// 建物看板
// ==========================================

const buildingSigns = [

  {
    x: 3,
    y: 5,
    text: "杭州小吃",
    color: "#b64135"
  },

  {
    x: 12,
    y: 5,
    text: "便利店",
    color: "#34625b"
  },

  {
    x: 34,
    y: 5,
    text: "茶馆",
    color: "#87682f"
  },

  {
    x: 44,
    y: 5,
    text: "武林百货",
    color: "#8f343f"
  },

  {
    x: 2,
    y: 16,
    text: "老杭州",
    color: "#79492f"
  },

  {
    x: 37,
    y: 16,
    text: "夜市食堂",
    color: "#9b3f34"
  },

  {
    x: 2,
    y: 27,
    text: "面馆",
    color: "#8c6330"
  },

  {
    x: 45,
    y: 27,
    text: "文创商店",
    color: "#3c5971"
  }

];


// ==========================================
// 小物
// ==========================================

const decorations = [

  {
    type: "bike",
    x: 9 * TILE,
    y: 9 * TILE
  },

  {
    type: "bike",
    x: 42 * TILE,
    y: 10 * TILE
  },

  {
    type: "scooter",
    x: 12 * TILE,
    y: 21 * TILE
  },

  {
    type: "trash",
    x: 18 * TILE,
    y: 16 * TILE
  },

  {
    type: "trash",
    x: 33 * TILE,
    y: 16 * TILE
  },

  {
    type: "table",
    x: 23 * TILE,
    y: 16 * TILE
  },

  {
    type: "table",
    x: 28 * TILE,
    y: 16 * TILE
  }

];


// ==========================================
// エリア
// ==========================================

const AREAS = [

  {
    name: "夜市入口",
    minY: 29 * TILE
  },

  {
    name: "雑貨・茶飲エリア",
    minY: 23 * TILE
  },

  {
    name: "武林夜市 中央広場",
    minY: 13 * TILE
  },

  {
    name: "杭州小吃街",
    minY: 0
  }

];


function getAreaName(y) {

  for (const area of AREAS) {

    if (y >= area.minY) {
      return area.name;
    }

  }

  return "武林夜市";

}


// ==========================================
// COLLISION
// ==========================================

function isSolidTile(tile) {

  return (
    tile === 2 ||
    tile === 3 ||
    tile === 4 ||
    tile === 5
  );

}


function isSolidAtPixel(px, py) {

  const tx =
    Math.floor(px / TILE);

  const ty =
    Math.floor(py / TILE);


  if (
    tx < 0 ||
    ty < 0 ||
    tx >= MAP_WIDTH ||
    ty >= MAP_HEIGHT
  ) {
    return true;
  }


  return isSolidTile(
    gameMap[ty][tx]
  );

}
