"use strict";

const TILE = 32;


const T = {
  FLOOR: 0,
  ROAD: 1,
  BUILDING: 2,
  WALL: 3,
  PLAZA: 4,
  WATER: 5,
  GRASS: 6,
  INDOOR: 7,
  COUNTER: 8
};


// ======================================================
// GRID HELPERS
// ======================================================

function createGrid(
  width,
  height,
  base
) {

  return Array.from(
    { length: height },
    () =>
      Array(width).fill(base)
  );

}


function fill(
  grid,
  x,
  y,
  width,
  height,
  tile
) {

  for (
    let yy = y;
    yy < y + height;
    yy++
  ) {

    for (
      let xx = x;
      xx < x + width;
      xx++
    ) {

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


// ======================================================
// FOOD STREET
// ======================================================

const foodGrid =
  createGrid(
    48,
    34,
    T.FLOOR
  );


// buildings

fill(
  foodGrid,
  2,2,
  12,7,
  T.BUILDING
);

fill(
  foodGrid,
  34,2,
  12,7,
  T.BUILDING
);

fill(
  foodGrid,
  2,13,
  10,8,
  T.BUILDING
);

fill(
  foodGrid,
  36,13,
  10,8,
  T.BUILDING
);


// main street

fill(
  foodGrid,
  17,0,
  14,34,
  T.ROAD
);

fill(
  foodGrid,
  2,9,
  44,4,
  T.ROAD
);

fill(
  foodGrid,
  2,22,
  44,5,
  T.ROAD
);


// plaza

fill(
  foodGrid,
  16,15,
  16,6,
  T.PLAZA
);


// ======================================================
// MARKET
// ======================================================

const marketGrid =
  createGrid(
    48,
    34,
    T.FLOOR
  );


fill(
  marketGrid,
  2,3,
  12,7,
  T.BUILDING
);

fill(
  marketGrid,
  34,3,
  12,7,
  T.BUILDING
);

fill(
  marketGrid,
  2,16,
  10,7,
  T.BUILDING
);

fill(
  marketGrid,
  36,16,
  10,7,
  T.BUILDING
);


fill(
  marketGrid,
  17,0,
  14,34,
  T.ROAD
);


fill(
  marketGrid,
  2,11,
  44,4,
  T.ROAD
);


fill(
  marketGrid,
  2,25,
  44,5,
  T.ROAD
);


// ======================================================
// HOTEL
// ======================================================

const hotelGrid =
  createGrid(
    48,
    34,
    T.ROAD
  );


fill(
  hotelGrid,
  2,2,
  13,12,
  T.BUILDING
);

fill(
  hotelGrid,
  33,2,
  13,12,
  T.BUILDING
);

fill(
  hotelGrid,
  2,20,
  13,12,
  T.BUILDING
);

fill(
  hotelGrid,
  33,20,
  13,12,
  T.BUILDING
);


fill(
  hotelGrid,
  18,0,
  12,34,
  T.PLAZA
);


// ======================================================
// WEST LAKE
// ======================================================

const lakeGrid =
  createGrid(
    48,
    34,
    T.ROAD
  );


fill(
  lakeGrid,
  0,0,
  15,34,
  T.WATER
);


fill(
  lakeGrid,
  15,0,
  5,34,
  T.GRASS
);


fill(
  lakeGrid,
  20,0,
  12,34,
  T.PLAZA
);


fill(
  lakeGrid,
  35,3,
  11,8,
  T.BUILDING
);


fill(
  lakeGrid,
  35,22,
  11,10,
  T.BUILDING
);


// ======================================================
// TEA HOUSE
// ======================================================

const teaGrid =
  createGrid(
    26,
    20,
    T.INDOOR
  );


fill(
  teaGrid,
  0,0,
  26,1,
  T.WALL
);

fill(
  teaGrid,
  0,19,
  26,1,
  T.WALL
);

fill(
  teaGrid,
  0,0,
  1,20,
  T.WALL
);

fill(
  teaGrid,
  25,0,
  1,20,
  T.WALL
);


fill(
  teaGrid,
  3,3,
  20,1,
  T.WALL
);


fill(
  teaGrid,
  4,5,
  7,2,
  T.COUNTER
);


fill(
  teaGrid,
  15,5,
  6,2,
  T.COUNTER
);


// ======================================================
// MAP DEFINITIONS
// ======================================================

const MAPS = {


  // ----------------------------------------------------
  // FOOD STREET
  // ----------------------------------------------------

  food: {

    name:
      "武林夜市・小吃街",

    subtitle:
      "烧烤 · 小笼包 · 杭州小吃",

    ambient:
      "night",

    grid:
      foodGrid,


    spawn: {
      x:24,
      y:18
    },


    doors: [

      {
        x:7,
        y:9,

        width:1,

        label:
          "茶館に入る",

        sign:
          "茶馆",

        target:
          "tea",

        targetX:13,
        targetY:16
      }

    ],


    exits: [

      {
        x:20,
        y:31,

        width:8,
        height:2,

        direction:
          "down",

        label:
          "↓ 夜市深处・雑貨街",

        target:
          "market",

        targetX:24,
        targetY:3
      }

    ],


    stalls: [

      {
        x:13,
        y:10,

        width:3,

        sign:
          "烧烤",

        type:
          "shaokao"
      },


      {
        x:32,
        y:10,

        width:3,

        sign:
          "小笼包",

        type:
          "xiaolongbao"
      },


      {
        x:13,
        y:23,

        width:3,

        sign:
          "臭豆腐",

        type:
          "choudoufu"
      },


      {
        x:32,
        y:23,

        width:3,

        sign:
          "杭州小吃",

        type:
          "snack"
      }

    ],


    signs: [

      {
        x:3,
        y:7,

        text:
          "茶馆"
      },


      {
        x:37,
        y:7,

        text:
          "老杭州"
      },


      {
        x:3,
        y:19,

        text:
          "面馆"
      },


      {
        x:37,
        y:19,

        text:
          "夜市食堂"
      }

    ]

  },


  // ----------------------------------------------------
  // MARKET
  // ----------------------------------------------------

  market: {

    name:
      "武林夜市・雑貨街",

    subtitle:
      "饰品 · 茶饮 · 夜市杂货",

    ambient:
      "night",

    grid:
      marketGrid,


    spawn: {
      x:24,
      y:4
    },


    doors: [],


    exits: [

      {
        x:20,
        y:1,

        width:8,
        height:2,

        direction:
          "up",

        label:
          "↑ 小吃街",

        target:
          "food",

        targetX:24,
        targetY:29
      },


      {
        x:20,
        y:31,

        width:8,
        height:2,

        direction:
          "down",

        label:
          "↓ 酒店街",

        target:
          "hotel",

        targetX:24,
        targetY:4
      }

    ],


    stalls: [

      {
        x:13,
        y:12,

        width:3,

        sign:
          "奶茶",

        type:
          "milkTea"
      },


      {
        x:32,
        y:12,

        width:3,

        sign:
          "饰品",

        type:
          "jewelry"
      },


      {
        x:13,
        y:26,

        width:3,

        sign:
          "鲜果",

        type:
          "fruit"
      },


      {
        x:32,
        y:26,

        width:3,

        sign:
          "杭州文创",

        type:
          "souvenir"
      }

    ],


    signs: [

      {
        x:3,
        y:8,

        text:
          "武林百货"
      },


      {
        x:35,
        y:8,

        text:
          "杭州文创"
      }

    ]

  },


  // ----------------------------------------------------
  // HOTEL
  // ----------------------------------------------------

  hotel: {

    name:
      "武林・ホテル街",

    subtitle:
      "酒店 · 城市夜景",

    ambient:
      "city",

    grid:
      hotelGrid,


    spawn: {
      x:24,
      y:4
    },


    doors: [],


    exits: [

      {
        x:20,
        y:1,

        width:8,
        height:2,

        direction:
          "up",

        label:
          "↑ 武林夜市",

        target:
          "market",

        targetX:24,
        targetY:29
      },


      {
        x:20,
        y:31,

        width:8,
        height:2,

        direction:
          "down",

        label:
          "↓ 西湖方向",

        target:
          "lake",

        targetX:25,
        targetY:4
      }

    ],


    stalls: [],


    signs: [

      {
        x:4,
        y:12,

        text:
          "武林酒店"
      },


      {
        x:35,
        y:12,

        text:
          "杭州宾馆"
      }

    ]

  },


  // ----------------------------------------------------
  // LAKE
  // ----------------------------------------------------

  lake: {

    name:
      "西湖・湖滨",

    subtitle:
      "西湖夜色 · 湖滨步道",

    ambient:
      "lake",

    grid:
      lakeGrid,


    spawn: {
      x:25,
      y:4
    },


    doors: [],


    exits: [

      {
        x:21,
        y:1,

        width:9,
        height:2,

        direction:
          "up",

        label:
          "↑ 武林方向",

        target:
          "hotel",

        targetX:24,
        targetY:29
      }

    ],


    stalls: [],


    signs: [

      {
        x:35,
        y:10,

        text:
          "湖滨"
      }

    ]

  },


  // ----------------------------------------------------
  // TEA HOUSE
  // ----------------------------------------------------

  tea: {

    name:
      "老杭州茶館",

    subtitle:
      "一杯茶，一座城",

    ambient:
      "indoor",

    grid:
      teaGrid,


    spawn: {
      x:13,
      y:16
    },


    doors: [],


    exits: [

      {
        x:11,
        y:18,

        width:4,
        height:1,

        direction:
          "down",

        label:
          "外へ出る",

        target:
          "food",

        targetX:7,
        targetY:11
      }

    ],


    stalls: [],

    signs: []

  }

};


// ======================================================
// HELPERS
// ======================================================

function getCurrentMap() {

  return MAPS[
    currentMapId
  ];

}


function isSolidTile(tile) {

  return (
    tile === T.BUILDING ||
    tile === T.WALL ||
    tile === T.WATER ||
    tile === T.COUNTER
  );

}


function isInsideRect(
  px,
  py,
  rect
) {

  return (
    px >= rect.x*TILE &&
    px < (rect.x+rect.width)*TILE &&
    py >= rect.y*TILE &&
    py < (rect.y+rect.height)*TILE
  );

}


// ======================================================
// STALL COLLISION
// ======================================================

function isInsideStall(
  px,
  py
) {

  const map =
    getCurrentMap();


  for (
    const stall
    of map.stalls
  ) {

    if (
      px >= stall.x*TILE &&
      px <
      (
        stall.x+
        stall.width
      )*TILE &&

      py >= stall.y*TILE &&
      py <
      (
        stall.y+1
      )*TILE
    ) {

      return true;

    }

  }


  return false;

}


// ======================================================
// WORLD COLLISION
// ======================================================

function isSolidAtPixel(
  px,
  py
) {

  const map =
    getCurrentMap();


  const tx =
    Math.floor(
      px/TILE
    );


  const ty =
    Math.floor(
      py/TILE
    );


  if (
    tx < 0 ||
    ty < 0 ||
    ty >= map.grid.length ||
    tx >= map.grid[0].length
  ) {

    return true;

  }


  if (
    isSolidTile(
      map.grid[ty][tx]
    )
  ) {

    return true;

  }


  if (
    isInsideStall(
      px,
      py
    )
  ) {

    return true;

  }


  return false;

}
