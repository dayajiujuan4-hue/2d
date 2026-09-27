"use strict";

const TILE = 32;

const T = {
  FLOOR: 0,
  ROAD: 1,
  BUILDING: 2,
  WALL: 3,
  TREE: 4,
  LANTERN: 5,
  DARK: 6,
  PLAZA: 7,
  DOOR: 8,
  WATER: 9,
  GRASS: 10,
  INDOOR: 11,
  COUNTER: 12
};


function createGrid(width, height, base = T.FLOOR) {

  return Array.from(
    { length: height },
    () => Array(width).fill(base)
  );

}


function fill(grid, x, y, w, h, tile) {

  for (let yy = y; yy < y + h; yy++) {

    for (let xx = x; xx < x + w; xx++) {

      if (
        yy >= 0 &&
        xx >= 0 &&
        yy < grid.length &&
        xx < grid[0].length
      ) {
        grid[yy][xx] = tile;
      }

    }

  }

}


function border(grid, tile = T.BUILDING) {

  const h = grid.length;
  const w = grid[0].length;

  for (let x = 0; x < w; x++) {
    grid[0][x] = tile;
    grid[h - 1][x] = tile;
  }

  for (let y = 0; y < h; y++) {
    grid[y][0] = tile;
    grid[y][w - 1] = tile;
  }

}


// ========================================================
// 01 武林夜市・小吃街
// ========================================================

const foodMap = createGrid(46, 32, T.FLOOR);

border(foodMap);

fill(foodMap, 17, 1, 12, 30, T.ROAD);
fill(foodMap, 2, 6, 42, 5, T.ROAD);
fill(foodMap, 2, 20, 42, 5, T.ROAD);

fill(foodMap, 2, 2, 10, 4, T.BUILDING);
fill(foodMap, 13, 2, 4, 4, T.BUILDING);

fill(foodMap, 29, 2, 6, 4, T.BUILDING);
fill(foodMap, 36, 2, 8, 4, T.BUILDING);

fill(foodMap, 2, 12, 10, 7, T.BUILDING);
fill(foodMap, 34, 12, 10, 7, T.BUILDING);

fill(foodMap, 2, 26, 10, 5, T.BUILDING);
fill(foodMap, 34, 26, 10, 5, T.BUILDING);

// 茶館のドア
foodMap[5][7] = T.DOOR;


// ========================================================
// 02 雑貨街
// ========================================================

const marketMap = createGrid(46, 32, T.FLOOR);

border(marketMap);

fill(marketMap, 17, 1, 12, 30, T.ROAD);
fill(marketMap, 2, 8, 42, 5, T.ROAD);
fill(marketMap, 2, 21, 42, 5, T.ROAD);

fill(marketMap, 2, 2, 12, 6, T.BUILDING);
fill(marketMap, 32, 2, 12, 6, T.BUILDING);

fill(marketMap, 2, 14, 9, 6, T.BUILDING);
fill(marketMap, 35, 14, 9, 6, T.BUILDING);

fill(marketMap, 2, 27, 12, 4, T.BUILDING);
fill(marketMap, 32, 27, 12, 4, T.BUILDING);


// ========================================================
// 03 ホテル街
// ========================================================

const hotelMap = createGrid(46, 32, T.ROAD);

border(hotelMap);

fill(hotelMap, 2, 2, 13, 11, T.BUILDING);
fill(hotelMap, 31, 2, 13, 11, T.BUILDING);

fill(hotelMap, 2, 19, 13, 11, T.BUILDING);
fill(hotelMap, 31, 19, 13, 11, T.BUILDING);

fill(hotelMap, 19, 1, 8, 30, T.PLAZA);

hotelMap[12][8] = T.DOOR;
hotelMap[12][37] = T.DOOR;


// ========================================================
// 04 西湖方面
// ========================================================

const westLakeMap = createGrid(46, 32, T.ROAD);

border(westLakeMap);

fill(westLakeMap, 1, 1, 13, 30, T.WATER);
fill(westLakeMap, 14, 1, 5, 30, T.GRASS);
fill(westLakeMap, 19, 1, 12, 30, T.PLAZA);

fill(westLakeMap, 33, 2, 11, 7, T.BUILDING);
fill(westLakeMap, 34, 20, 10, 10, T.BUILDING);


// ========================================================
// 05 茶館内部
// ========================================================

const teaHouseMap = createGrid(24, 18, T.INDOOR);

border(teaHouseMap, T.WALL);

fill(teaHouseMap, 3, 3, 18, 1, T.WALL);

fill(teaHouseMap, 4, 5, 6, 2, T.COUNTER);

fill(teaHouseMap, 14, 5, 5, 2, T.COUNTER);

teaHouseMap[17][12] = T.DOOR;


// ========================================================
// MAP DATA
// ========================================================

const MAPS = {

  food: {

    id: "food",

    name: "武林夜市・小吃街",
    subtitle: "烧烤 · 小笼包 · 杭州小吃",

    grid: foodMap,

    ambient: "night",

    spawn: {
      x: 23 * TILE,
      y: 27 * TILE
    },

    stalls: [

      {
        x: 13,
        y: 8,
        w: 2,
        sign: "烧烤",
        type: "shaokao"
      },

      {
        x: 31,
        y: 8,
        w: 2,
        sign: "小笼包",
        type: "xiaolongbao"
      },

      {
        x: 13,
        y: 22,
        w: 2,
        sign: "臭豆腐",
        type: "choudoufu"
      },

      {
        x: 31,
        y: 22,
        w: 2,
        sign: "杭州小吃",
        type: "snack"
      }

    ],

    signs: [

      {
        x: 3,
        y: 4,
        text: "茶馆"
      },

      {
        x: 36,
        y: 4,
        text: "老杭州"
      },

      {
        x: 3,
        y: 17,
        text: "面馆"
      },

      {
        x: 35,
        y: 17,
        text: "夜市食堂"
      }

    ],

    portals: [

      {
        x: 7,
        y: 5,
        target: "tea",
        targetX: 12,
        targetY: 15,
        label: "茶館に入る"
      },

      {
        edge: "bottom",
        target: "market",
        targetX: 23,
        targetY: 2
      }

    ]

  },


  market: {

    id: "market",

    name: "武林夜市・雑貨街",
    subtitle: "饰品 · 茶饮 · 夜市杂货",

    grid: marketMap,

    ambient: "night",

    spawn: {
      x: 23 * TILE,
      y: 3 * TILE
    },

    stalls: [

      {
        x: 13,
        y: 10,
        w: 2,
        sign: "奶茶",
        type: "milkTea"
      },

      {
        x: 31,
        y: 10,
        w: 2,
        sign: "饰品",
        type: "jewelry"
      },

      {
        x: 13,
        y: 23,
        w: 2,
        sign: "鲜果",
        type: "fruit"
      },

      {
        x: 31,
        y: 23,
        w: 2,
        sign: "文创",
        type: "souvenir"
      }

    ],

    signs: [

      {
        x: 3,
        y: 6,
        text: "武林百货"
      },

      {
        x: 33,
        y: 6,
        text: "杭州文创"
      }

    ],

    portals: [

      {
        edge: "top",
        target: "food",
        targetX: 23,
        targetY: 29
      },

      {
        edge: "bottom",
        target: "hotel",
        targetX: 23,
        targetY: 2
      }

    ]

  },


  hotel: {

    id: "hotel",

    name: "武林・ホテル街",
    subtitle: "城市夜景 · 酒店 · 街道",

    grid: hotelMap,

    ambient: "city",

    spawn: {
      x: 23 * TILE,
      y: 3 * TILE
    },

    stalls: [],

    signs: [

      {
        x: 4,
        y: 10,
        text: "武林酒店"
      },

      {
        x: 33,
        y: 10,
        text: "杭州宾馆"
      }

    ],

    portals: [

      {
        edge: "top",
        target: "market",
        targetX: 23,
        targetY: 29
      },

      {
        edge: "bottom",
        target: "lake",
        targetX: 24,
        targetY: 2
      }

    ]

  },


  lake: {

    id: "lake",

    name: "西湖・湖滨",
    subtitle: "西湖夜色 · 湖滨步道",

    grid: westLakeMap,

    ambient: "lake",

    spawn: {
      x: 24 * TILE,
      y: 3 * TILE
    },

    stalls: [],

    signs: [

      {
        x: 34,
        y: 7,
        text: "湖滨"
      }

    ],

    portals: [

      {
        edge: "top",
        target: "hotel",
        targetX: 23,
        targetY: 29
      }

    ]

  },


  tea: {

    id: "tea",

    name: "老杭州茶館",
    subtitle: "一杯茶，一座城",

    grid: teaHouseMap,

    ambient: "indoor",

    spawn: {
      x: 12 * TILE,
      y: 15 * TILE
    },

    stalls: [],

    signs: [],

    portals: [

      {
        x: 12,
        y: 17,
        target: "food",
        targetX: 7,
        targetY: 7,
        label: "外へ出る"
      }

    ]

  }

};


// ========================================================
// COLLISION
// ========================================================

function getCurrentMap() {
  return MAPS[currentMapId];
}


function isSolidTile(tile) {

  return (
    tile === T.BUILDING ||
    tile === T.WALL ||
    tile === T.TREE ||
    tile === T.LANTERN ||
    tile === T.WATER ||
    tile === T.COUNTER
  );

}


function isSolidAtPixel(px, py) {

  const map = getCurrentMap();

  const tx = Math.floor(px / TILE);
  const ty = Math.floor(py / TILE);

  if (
    tx < 0 ||
    ty < 0 ||
    ty >= map.grid.length ||
    tx >= map.grid[0].length
  ) {
    return true;
  }

  return isSolidTile(
    map.grid[ty][tx]
  );

}
