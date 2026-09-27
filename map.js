"use strict";

const TILE = 32;

const T = {
  FLOOR:0,
  ROAD:1,
  PLAZA:2,
  WATER:3,
  GRASS:4,
  INDOOR:5,
  WALL:6,
  COUNTER:7
};


// ======================================================
// HELPERS
// ======================================================

function createGrid(
  width,
  height,
  base
) {

  return Array.from(
    {length:height},
    () => Array(width).fill(base)
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
    let yy=y;
    yy<y+height;
    yy++
  ) {

    for (
      let xx=x;
      xx<x+width;
      xx++
    ) {

      if (
        yy>=0 &&
        xx>=0 &&
        yy<grid.length &&
        xx<grid[0].length
      ) {

        grid[yy][xx]=tile;

      }

    }

  }

}


// ======================================================
// OUTDOOR GRIDS
// ======================================================

const foodGrid =
  createGrid(52,38,T.FLOOR);

fill(foodGrid,15,0,22,38,T.ROAD);
fill(foodGrid,0,10,52,5,T.ROAD);
fill(foodGrid,0,25,52,5,T.ROAD);
fill(foodGrid,17,16,18,7,T.PLAZA);


const marketGrid =
  createGrid(52,38,T.FLOOR);

fill(marketGrid,15,0,22,38,T.ROAD);
fill(marketGrid,0,11,52,5,T.ROAD);
fill(marketGrid,0,26,52,5,T.ROAD);


const hotelGrid =
  createGrid(52,38,T.ROAD);

fill(hotelGrid,18,0,16,38,T.PLAZA);


const lakeGrid =
  createGrid(52,38,T.ROAD);

fill(lakeGrid,0,0,16,38,T.WATER);
fill(lakeGrid,16,0,5,38,T.GRASS);
fill(lakeGrid,21,0,14,38,T.PLAZA);


// ======================================================
// INTERIORS
// ======================================================

function createInteriorGrid(
  type
) {

  const grid =
    createGrid(
      28,
      20,
      T.INDOOR
    );


  fill(grid,0,0,28,1,T.WALL);
  fill(grid,0,19,28,1,T.WALL);
  fill(grid,0,0,1,20,T.WALL);
  fill(grid,27,0,1,20,T.WALL);


  if (
    type === "restaurant"
  ) {

    fill(
      grid,
      3,4,
      10,2,
      T.COUNTER
    );

  }


  if (
    type === "shop"
  ) {

    fill(
      grid,
      4,5,
      3,9,
      T.COUNTER
    );


    fill(
      grid,
      20,5,
      3,9,
      T.COUNTER
    );

  }


  if (
    type === "hotel"
  ) {

    fill(
      grid,
      5,4,
      18,2,
      T.COUNTER
    );

  }


  return grid;

}


// ======================================================
// BUILDINGS
// ======================================================

const foodBuildings = [

  {
    x:2,y:2,w:11,h:8,
    name:"老杭州茶馆",
    type:"traditional",
    doorX:8,
    target:"tea",
    color:"#674137"
  },

  {
    x:39,y:2,w:11,h:8,
    name:"杭州面馆",
    type:"noodle",
    doorX:44,
    target:"noodle",
    color:"#765042"
  },

  {
    x:2,y:16,w:11,h:9,
    name:"便利店",
    type:"convenience",
    doorX:8,
    target:"convenience",
    color:"#42666b"
  },

  {
    x:39,y:16,w:11,h:9,
    name:"夜市食堂",
    type:"restaurant",
    doorX:44,
    target:"restaurant",
    color:"#744039"
  }

];


const marketBuildings = [

  {
    x:2,y:2,w:11,h:9,
    name:"武林百货",
    type:"department",
    doorX:8,
    target:"department",
    color:"#51485e"
  },

  {
    x:39,y:2,w:11,h:9,
    name:"杭州文创",
    type:"culture",
    doorX:44,
    target:"culture",
    color:"#584b6e"
  },

  {
    x:2,y:17,w:11,h:9,
    name:"饰品店",
    type:"accessory",
    doorX:8,
    target:"accessory",
    color:"#61485e"
  },

  {
    x:39,y:17,w:11,h:9,
    name:"茶饮店",
    type:"drink",
    doorX:44,
    target:"drink",
    color:"#41635c"
  }

];


const hotelBuildings = [

  {
    x:2,y:3,w:14,h:14,
    name:"武林大酒店",
    type:"hotel",
    doorX:10,
    target:"wulinHotel",
    color:"#343c4c"
  },

  {
    x:36,y:3,w:14,h:14,
    name:"杭州宾馆",
    type:"hotel",
    doorX:43,
    target:"hangzhouHotel",
    color:"#3f384b"
  },

  {
    x:3,y:24,w:12,h:10,
    name:"城市便利店",
    type:"convenience",
    doorX:9,
    target:"cityStore",
    color:"#3f6268"
  }

];


const lakeBuildings = [

  {
    x:38,y:4,w:11,h:9,
    name:"湖滨茶室",
    type:"traditional",
    doorX:43,
    target:"lakeTea",
    color:"#56483c"
  },

  {
    x:38,y:23,w:11,h:10,
    name:"西湖礼物",
    type:"culture",
    doorX:43,
    target:"lakeGift",
    color:"#465968"
  }

];


// ======================================================
// MAIN MAPS
// ======================================================

const MAPS = {

  food: {

    name:"武林夜市・小吃街",

    subtitle:
      "灯笼 · 小吃 · 老店 · 夜市",

    ambient:"night",

    grid:foodGrid,

    spawn:{x:26,y:19},

    buildings:
      foodBuildings,

    exits:[
      {
        x:22,y:35,
        width:8,height:2,
        label:"↓ 夜市深处・雑貨街",
        target:"market",
        targetX:26,
        targetY:4
      }
    ],

    stalls:[
      {x:14,y:11,width:3,sign:"烧烤",type:"shaokao"},
      {x:35,y:11,width:3,sign:"小笼包",type:"xiaolongbao"},
      {x:14,y:14,width:3,sign:"葱包桧",type:"snack"},
      {x:35,y:14,width:3,sign:"生煎",type:"xiaolongbao"},
      {x:14,y:23,width:3,sign:"臭豆腐",type:"snack"},
      {x:35,y:23,width:3,sign:"杭州小吃",type:"snack"},
      {x:14,y:26,width:3,sign:"烤鱿鱼",type:"shaokao"},
      {x:35,y:26,width:3,sign:"炸鸡",type:"fried"},
      {x:5,y:27,width:3,sign:"冰粉",type:"drink"},
      {x:44,y:27,width:3,sign:"鲜果",type:"fruit"},
      {x:18,y:31,width:3,sign:"烤串",type:"shaokao"},
      {x:31,y:31,width:3,sign:"饮料",type:"drink"}
    ],

    props:[
      {type:"table",x:20,y:12},
      {type:"table",x:25,y:12},
      {type:"table",x:30,y:12},
      {type:"scooter",x:17,y:20},
      {type:"bike",x:34,y:20},
      {type:"trash",x:18,y:27}
    ],

    interactables:[
      {
        x:16,y:12,
        label:"烧烤の屋台を調べる",
        word:"tanwei"
      },
      {
        x:37,y:12,
        label:"行列を見る",
        word:"paidui"
      },
      {
        x:20,y:31,
        label:"屋台の看板を見る",
        word:"zhaopai"
      }
    ]

  },


  market: {

    name:"武林夜市・雑貨街",

    subtitle:
      "文创 · 饰品 · 手机壳 · 玩具",

    ambient:"night",

    grid:marketGrid,

    spawn:{x:26,y:4},

    buildings:
      marketBuildings,

    exits:[

      {
        x:22,y:1,
        width:8,height:2,
        label:"↑ 小吃街",
        target:"food",
        targetX:26,
        targetY:33
      },

      {
        x:22,y:35,
        width:8,height:2,
        label:"↓ 酒店街",
        target:"hotel",
        targetX:26,
        targetY:4
      }

    ],

    stalls:[
      {x:14,y:12,width:3,sign:"手机壳",type:"phone"},
      {x:35,y:12,width:3,sign:"饰品",type:"goods"},
      {x:14,y:15,width:3,sign:"服装",type:"goods"},
      {x:35,y:15,width:3,sign:"包包",type:"goods"},
      {x:14,y:25,width:3,sign:"杭州文创",type:"goods"},
      {x:35,y:25,width:3,sign:"玩具",type:"goods"},
      {x:14,y:28,width:3,sign:"手工艺",type:"goods"},
      {x:35,y:28,width:3,sign:"鲜花",type:"flower"},
      {x:5,y:28,width:3,sign:"奶茶",type:"drink"},
      {x:44,y:28,width:3,sign:"鲜果",type:"fruit"}
    ],

    props:[
      {type:"clothes",x:18,y:18},
      {type:"clothes",x:33,y:18},
      {type:"bench",x:21,y:20},
      {type:"bench",x:29,y:20}
    ],

    interactables:[
      {
        x:16,y:13,
        label:"店主を見る",
        word:"tanzhu"
      },
      {
        x:37,y:13,
        label:"支払い表示を見る",
        word:"saoma"
      },
      {
        x:16,y:26,
        label:"文創屋台を見る",
        word:"wenchuang"
      }
    ]

  },


  hotel: {

    name:"武林・ホテル街",

    subtitle:
      "酒店 · 出租车 · 城市夜景",

    ambient:"city",

    grid:hotelGrid,

    spawn:{x:26,y:4},

    buildings:
      hotelBuildings,

    exits:[

      {
        x:22,y:1,
        width:8,height:2,
        label:"↑ 武林夜市",
        target:"market",
        targetX:26,
        targetY:33
      },

      {
        x:22,y:35,
        width:8,height:2,
        label:"↓ 西湖方向",
        target:"lake",
        targetX:27,
        targetY:4
      }

    ],

    stalls:[
      {x:37,y:29,width:3,sign:"夜宵",type:"shaokao"},
      {x:42,y:29,width:3,sign:"咖啡",type:"drink"}
    ],

    props:[
      {type:"streetlight",x:17,y:7},
      {type:"streetlight",x:34,y:7},
      {type:"taxi",x:20,y:13},
      {type:"car",x:28,y:24},
      {type:"tree",x:17,y:27},
      {type:"tree",x:34,y:27}
    ],

    interactables:[
      {
        x:38,y:30,
        label:"夜食の屋台を見る",
        word:"yexiao"
      }
    ]

  },


  lake: {

    name:"西湖・湖滨",

    subtitle:
      "湖水 · 柳 · 茶室 · 夜景",

    ambient:"lake",

    grid:lakeGrid,

    spawn:{x:27,y:4},

    buildings:
      lakeBuildings,

    exits:[
      {
        x:23,y:1,
        width:9,height:2,
        label:"↑ 武林方向",
        target:"hotel",
        targetX:26,
        targetY:33
      }
    ],

    stalls:[
      {x:35,y:16,width:3,sign:"糖葫芦",type:"fruit"},
      {x:35,y:19,width:3,sign:"纪念品",type:"goods"}
    ],

    props:[
      {type:"bench",x:22,y:8},
      {type:"bench",x:29,y:13},
      {type:"bench",x:23,y:23},
      {type:"bench",x:29,y:30}
    ],

    interactables:[
      {
        x:21,y:15,
        label:"西湖を眺める",
        word:"xihu"
      },
      {
        x:21,y:22,
        label:"湖畔を眺める",
        word:"hubin"
      },
      {
        x:21,y:29,
        label:"湖上の船を見る",
        word:"huafang"
      }
    ]

  }

};


// ======================================================
// ADD INTERIOR
// ======================================================

function addInterior(
  id,
  name,
  subtitle,
  type,
  returnMap,
  returnX,
  returnY,
  theme
) {

  MAPS[id] = {

    name,
    subtitle,

    ambient:"indoor",

    interiorType:type,

    theme,

    grid:
      createInteriorGrid(type),

    spawn:{
      x:14,
      y:16
    },

    buildings:[],

    stalls:[],

    props:[],

    interactables:[],

    exits:[
      {
        x:12,
        y:18,
        width:4,
        height:1,
        label:"外へ出る",
        target:returnMap,
        targetX:returnX,
        targetY:returnY
      }
    ]

  };

}


// ======================================================
// INTERIOR MAPS
// ======================================================

addInterior(
  "tea",
  "老杭州茶馆",
  "茶葉と木の香りが漂う茶館",
  "restaurant",
  "food",
  8,11,
  "tea"
);

addInterior(
  "noodle",
  "杭州面馆",
  "湯気と食器の音に包まれた面館",
  "restaurant",
  "food",
  44,11,
  "noodle"
);

addInterior(
  "convenience",
  "便利店",
  "夜市の明るいコンビニ",
  "shop",
  "food",
  8,27,
  "convenience"
);

addInterior(
  "restaurant",
  "夜市食堂",
  "地元客で賑わう食堂",
  "restaurant",
  "food",
  44,27,
  "restaurant"
);

addInterior(
  "department",
  "武林百货",
  "衣類や雑貨が並ぶ百貨店",
  "shop",
  "market",
  8,13,
  "department"
);

addInterior(
  "culture",
  "杭州文创",
  "杭州文化を形にした小さな店",
  "shop",
  "market",
  44,13,
  "culture"
);

addInterior(
  "accessory",
  "饰品店",
  "小さな装飾品が並ぶ店",
  "shop",
  "market",
  8,28,
  "accessory"
);

addInterior(
  "drink",
  "茶饮店",
  "現代的な杭州の茶飲店",
  "shop",
  "market",
  44,28,
  "drink"
);

addInterior(
  "wulinHotel",
  "武林大酒店・ロビー",
  "武林の夜を望むホテル",
  "hotel",
  "hotel",
  10,19,
  "hotel"
);

addInterior(
  "hangzhouHotel",
  "杭州宾馆・ロビー",
  "落ち着いたホテルロビー",
  "hotel",
  "hotel",
  43,19,
  "hotel"
);

addInterior(
  "cityStore",
  "城市便利店",
  "ホテル街の24時間店舗",
  "shop",
  "hotel",
  9,35,
  "convenience"
);

addInterior(
  "lakeTea",
  "湖滨茶室",
  "窓の向こうに西湖を望む茶室",
  "restaurant",
  "lake",
  43,15,
  "lakeTea"
);

addInterior(
  "lakeGift",
  "西湖礼物",
  "西湖を題材にした品々が並ぶ",
  "shop",
  "lake",
  43,34,
  "culture"
);


// ======================================================
// UNIQUE INTERIORS
// ======================================================

// 茶館

MAPS.tea.props = [
  {type:"teaTable",x:8,y:11},
  {type:"teaTable",x:17,y:12},
  {type:"teaShelf",x:3,y:8},
  {type:"teaShelf",x:23,y:8},
  {type:"scroll",x:14,y:2},
  {type:"plant",x:24,y:4}
];

MAPS.tea.interactables = [

  {
    x:8,y:11,
    label:"茶器を調べる",
    word:"chaju"
  },

  {
    x:3,y:8,
    label:"茶葉を見る",
    word:"chaye"
  },

  {
    x:14,y:3,
    label:"茶館の額を見る",
    word:"chaguan"
  }

];


// 面館

MAPS.noodle.props = [
  {type:"noodleTable",x:8,y:11},
  {type:"noodleTable",x:17,y:11},
  {type:"steamPot",x:4,y:7},
  {type:"steamPot",x:8,y:7},
  {type:"menuBoard",x:18,y:3},
  {type:"condiments",x:13,y:12}
];

MAPS.noodle.interactables = [

  {
    x:18,y:4,
    label:"メニューを見る",
    word:"pianerchuan"
  },

  {
    x:5,y:7,
    label:"鍋を覗く",
    word:"tang"
  },

  {
    x:13,y:12,
    label:"料理の香りを感じる",
    word:"xiang"
  }

];


// コンビニ

MAPS.convenience.props = [
  {type:"fridge",x:9,y:5},
  {type:"fridge",x:14,y:5},
  {type:"shopShelf",x:9,y:11},
  {type:"shopShelf",x:15,y:11},
  {type:"cashier",x:18,y:4}
];

MAPS.convenience.interactables = [

  {
    x:18,y:5,
    label:"レジを見る",
    word:"saoma"
  },

  {
    x:10,y:12,
    label:"持ち帰り袋を見る",
    word:"dabao"
  }

];


// 食堂

MAPS.restaurant.props = [
  {type:"diningTable",x:7,y:11},
  {type:"diningTable",x:14,y:11},
  {type:"diningTable",x:21,y:11},
  {type:"menuBoard",x:18,y:3},
  {type:"steamPot",x:5,y:7}
];

MAPS.restaurant.interactables = [

  {
    x:18,y:4,
    label:"おすすめ料理を見る",
    word:"zhaopai"
  },

  {
    x:7,y:11,
    label:"料理を見る",
    word:"xiaochi"
  }

];


// 百貨店

MAPS.department.props = [
  {type:"clothesRack",x:9,y:7},
  {type:"clothesRack",x:15,y:7},
  {type:"display",x:12,y:12},
  {type:"display",x:17,y:12},
  {type:"mirror",x:14,y:3}
];

MAPS.department.interactables = [

  {
    x:12,y:12,
    label:"売り場を見る",
    word:"tanwei"
  }

];


// 文創店

MAPS.culture.props = [
  {type:"jadeDisplay",x:9,y:8},
  {type:"jadeDisplay",x:18,y:8},
  {type:"cultureShelf",x:13,y:13},
  {type:"poster",x:14,y:3}
];

MAPS.culture.interactables = [

  {
    x:9,y:8,
    label:"良渚グッズを見る",
    word:"liangzhu"
  },

  {
    x:18,y:8,
    label:"玉器モチーフを見る",
    word:"yucong"
  },

  {
    x:13,y:13,
    label:"文創商品を見る",
    word:"wenchuang"
  }

];


// 饰品店

MAPS.accessory.props = [
  {type:"jewelry",x:9,y:8},
  {type:"jewelry",x:18,y:8},
  {type:"mirror",x:14,y:3}
];

MAPS.accessory.interactables = [

  {
    x:9,y:8,
    label:"商品を見る",
    word:"zhaopai"
  }

];


// 茶飲店

MAPS.drink.props = [
  {type:"drinkCounter",x:10,y:8},
  {type:"drinkCounter",x:18,y:8},
  {type:"teaCanister",x:14,y:12},
  {type:"neonSign",x:14,y:3}
];

MAPS.drink.interactables = [

  {
    x:14,y:12,
    label:"茶葉の缶を見る",
    word:"chaye"
  },

  {
    x:10,y:8,
    label:"ドリンク作りを見る",
    word:"paocha"
  }

];


// ホテル

MAPS.wulinHotel.props = [
  {type:"hotelDesk",x:14,y:7},
  {type:"hotelSofa",x:8,y:12},
  {type:"hotelSofa",x:19,y:12},
  {type:"luggage",x:5,y:14},
  {type:"plant",x:24,y:5},
  {type:"chandelier",x:14,y:2}
];

MAPS.hangzhouHotel.props = [
  {type:"hotelDesk",x:14,y:7},
  {type:"hotelSofa",x:8,y:12},
  {type:"hotelSofa",x:19,y:12},
  {type:"luggage",x:22,y:15},
  {type:"plant",x:3,y:5},
  {type:"chandelier",x:14,y:2}
];


// 湖滨茶室

MAPS.lakeTea.props = [
  {type:"windowLake",x:5,y:3},
  {type:"windowLake",x:21,y:3},
  {type:"teaTable",x:8,y:11},
  {type:"teaTable",x:18,y:11},
  {type:"scroll",x:14,y:3},
  {type:"plant",x:24,y:6}
];

MAPS.lakeTea.interactables = [

  {
    x:5,y:4,
    label:"窓から西湖を見る",
    word:"yijing"
  },

  {
    x:14,y:4,
    label:"掛け軸を読む",
    word:"shici"
  },

  {
    x:18,y:11,
    label:"茶卓を見る",
    word:"fengya"
  }

];


// 西湖土産店

MAPS.lakeGift.props = [
  {type:"postcard",x:8,y:8},
  {type:"postcard",x:19,y:8},
  {type:"cultureShelf",x:13,y:13},
  {type:"poster",x:14,y:3}
];

MAPS.lakeGift.interactables = [

  {
    x:8,y:8,
    label:"断橋の絵葉書を見る",
    word:"duanqiao"
  },

  {
    x:19,y:8,
    label:"蘇堤の絵葉書を見る",
    word:"sudi"
  }

];


// ======================================================
// HELPERS
// ======================================================

function getCurrentMap() {
  return MAPS[currentMapId];
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


function isInsideBuilding(
  px,
  py
) {

  const map =
    getCurrentMap();


  if (!map.buildings) {
    return false;
  }


  for (
    const building
    of map.buildings
  ) {

    const left =
      building.x*TILE;

    const right =
      (building.x+building.w)*TILE;

    const top =
      building.y*TILE;

    const bottom =
      (building.y+building.h)*TILE;


    const doorLeft =
      building.doorX*TILE;

    const doorRight =
      doorLeft+TILE;

    const doorTop =
      bottom-TILE*1.2;


    if (
      px>=doorLeft &&
      px<=doorRight &&
      py>=doorTop &&
      py<=bottom+3
    ) {

      continue;

    }


    if (
      px>=left &&
      px<right &&
      py>=top &&
      py<bottom
    ) {

      return true;

    }

  }


  return false;

}


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
      px>=stall.x*TILE &&
      px<(stall.x+stall.width)*TILE &&
      py>=stall.y*TILE &&
      py<(stall.y+1.15)*TILE
    ) {

      return true;

    }

  }


  return false;

}


function isSolidAtPixel(
  px,
  py
) {

  const map =
    getCurrentMap();


  const tx =
    Math.floor(px/TILE);

  const ty =
    Math.floor(py/TILE);


  if (
    tx<0 ||
    ty<0 ||
    ty>=map.grid.length ||
    tx>=map.grid[0].length
  ) {

    return true;

  }


  const tile =
    map.grid[ty][tx];


  if (
    tile===T.WALL ||
    tile===T.WATER ||
    tile===T.COUNTER
  ) {

    return true;

  }


  if (
    isInsideBuilding(px,py)
  ) {

    return true;

  }


  if (
    isInsideStall(px,py)
  ) {

    return true;

  }


  return false;

}
