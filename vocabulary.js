"use strict";

const VOCABULARY = {

  // ====================================================
  // 夜市・街歩き
  // ====================================================

  tanwei: {
    word:"摊位",
    pinyin:"tānwèi",
    meaning:"露店・屋台の売り場",
    category:"夜市・街歩き",
    example:"夜市里有很多摊位。",
    exampleJa:"夜市にはたくさんの露店がある。",
    location:"武林夜市"
  },

  tanzhu: {
    word:"摊主",
    pinyin:"tānzhǔ",
    meaning:"露店・屋台の店主",
    category:"夜市・街歩き",
    example:"摊主正在招呼客人。",
    exampleJa:"屋台の店主がお客さんを呼び込んでいる。",
    location:"武林夜市"
  },

  yahe: {
    word:"吆喝",
    pinyin:"yāohe",
    meaning:"大声で呼び込みをする",
    category:"夜市・街歩き",
    example:"摊主在街边吆喝。",
    exampleJa:"店主が通りで呼び込みをしている。",
    location:"武林夜市"
  },

  paidui: {
    word:"排队",
    pinyin:"páiduì",
    meaning:"列に並ぶ",
    category:"夜市・街歩き",
    example:"大家都在排队买小吃。",
    exampleJa:"みんな屋台料理を買うために並んでいる。",
    location:"武林夜市"
  },

  saoma: {
    word:"扫码",
    pinyin:"sǎomǎ",
    meaning:"QRコードを読み取る",
    category:"夜市・街歩き",
    example:"可以扫码付款。",
    exampleJa:"QRコードを読み取って支払えます。",
    location:"武林夜市"
  },

  dabao: {
    word:"打包",
    pinyin:"dǎbāo",
    meaning:"持ち帰り用に包む",
    category:"夜市・街歩き",
    example:"吃不完可以打包。",
    exampleJa:"食べきれなければ持ち帰りにできます。",
    location:"武林夜市"
  },

  zhaopai: {
    word:"招牌",
    pinyin:"zhāopái",
    meaning:"看板／その店の名物",
    category:"夜市・街歩き",
    example:"这是他们家的招牌菜。",
    exampleJa:"これはこの店の看板料理です。",
    location:"武林夜市"
  },

  renao: {
    word:"热闹",
    pinyin:"rènao",
    meaning:"賑やかで活気がある",
    category:"夜市・街歩き",
    example:"晚上的夜市非常热闹。",
    exampleJa:"夜の夜市はとても賑やかだ。",
    location:"武林夜市"
  },


  // ====================================================
  // 食文化
  // ====================================================

  kaochuan: {
    word:"烤串",
    pinyin:"kǎochuàn",
    meaning:"串焼き",
    category:"食文化",
    example:"老板正在烤串。",
    exampleJa:"店主が串焼きを焼いている。",
    location:"武林夜市・小吃街"
  },

  yangrouchuan: {
    word:"羊肉串",
    pinyin:"yángròuchuàn",
    meaning:"羊肉の串焼き",
    category:"食文化",
    example:"我要两串羊肉串。",
    exampleJa:"羊肉串を2本ください。",
    location:"武林夜市・小吃街"
  },

  xiaolongbao: {
    word:"小笼包",
    pinyin:"xiǎolóngbāo",
    meaning:"小籠包",
    category:"食文化",
    example:"小笼包刚出锅。",
    exampleJa:"小籠包がちょうど蒸し上がった。",
    location:"武林夜市・小吃街"
  },

  shengjian: {
    word:"生煎",
    pinyin:"shēngjiān",
    meaning:"焼き小籠包",
    category:"食文化",
    example:"生煎的底很脆。",
    exampleJa:"生煎の底はとてもカリッとしている。",
    location:"武林夜市・小吃街"
  },

  chouDoufu: {
    word:"臭豆腐",
    pinyin:"chòudòufu",
    meaning:"発酵豆腐を使った軽食",
    category:"食文化",
    example:"臭豆腐闻起来很特别。",
    exampleJa:"臭豆腐は独特な匂いがする。",
    location:"武林夜市・小吃街"
  },

  xiaochi: {
    word:"小吃",
    pinyin:"xiǎochī",
    meaning:"軽食・ローカルスナック",
    category:"食文化",
    example:"杭州有很多特色小吃。",
    exampleJa:"杭州には特色ある軽食がたくさんある。",
    location:"武林夜市"
  },

  yexiao: {
    word:"夜宵",
    pinyin:"yèxiāo",
    meaning:"夜食",
    category:"食文化",
    example:"我们去吃夜宵吧。",
    exampleJa:"夜食を食べに行こう。",
    location:"武林・ホテル街"
  },

  pianerchuan: {
    word:"片儿川",
    pinyin:"piànrchuān",
    meaning:"杭州の代表的な麺料理",
    category:"食文化",
    example:"片儿川是杭州传统面食。",
    exampleJa:"片儿川は杭州の伝統的な麺料理だ。",
    location:"杭州面馆"
  },

  tang: {
    word:"汤",
    pinyin:"tāng",
    meaning:"スープ・汁物",
    category:"食文化",
    example:"这碗面的汤很鲜。",
    exampleJa:"この麺のスープはとても旨味がある。",
    location:"杭州面馆"
  },

  xiang: {
    word:"香",
    pinyin:"xiāng",
    meaning:"香りがよい／おいしそうな香り",
    category:"食文化",
    example:"烤串闻起来真香。",
    exampleJa:"串焼きが本当にいい匂いだ。",
    location:"武林夜市"
  },


  // ====================================================
  // 杭州
  // ====================================================

  xihu: {
    word:"西湖",
    pinyin:"Xī Hú",
    meaning:"杭州市中心部にある湖、西湖",
    category:"杭州",
    example:"晚上去西湖散步。",
    exampleJa:"夜、西湖へ散歩に行く。",
    location:"西湖・湖滨"
  },

  hubin: {
    word:"湖滨",
    pinyin:"húbīn",
    meaning:"湖畔・湖のほとり",
    category:"杭州",
    example:"湖滨一带晚上很漂亮。",
    exampleJa:"湖畔一帯は夜になると美しい。",
    location:"西湖・湖滨"
  },

  longjingcha: {
    word:"龙井茶",
    pinyin:"Lóngjǐngchá",
    meaning:"杭州を代表する緑茶、龍井茶",
    category:"杭州",
    example:"杭州的龙井茶很有名。",
    exampleJa:"杭州の龍井茶はとても有名だ。",
    location:"老杭州茶馆"
  },

  chaye: {
    word:"茶叶",
    pinyin:"cháyè",
    meaning:"茶葉",
    category:"杭州",
    example:"这些茶叶很香。",
    exampleJa:"この茶葉はとても香りがよい。",
    location:"老杭州茶馆"
  },

  paocha: {
    word:"泡茶",
    pinyin:"pàochá",
    meaning:"お茶を淹れる",
    category:"杭州",
    example:"老板正在给客人泡茶。",
    exampleJa:"店主がお客さんにお茶を淹れている。",
    location:"老杭州茶馆"
  },

  duanqiao: {
    word:"断桥",
    pinyin:"Duànqiáo",
    meaning:"西湖の名所・断橋",
    category:"杭州",
    example:"断桥是西湖著名景点之一。",
    exampleJa:"断橋は西湖を代表する名所の一つだ。",
    location:"西湖・湖滨"
  },

  sudi: {
    word:"苏堤",
    pinyin:"Sūdī",
    meaning:"西湖を南北に延びる堤",
    category:"杭州",
    example:"游客沿着苏堤散步。",
    exampleJa:"観光客が蘇堤を歩いている。",
    location:"西湖・湖滨"
  },

  yunhe: {
    word:"运河",
    pinyin:"yùnhé",
    meaning:"運河",
    category:"杭州",
    example:"京杭大运河经过杭州。",
    exampleJa:"京杭大運河は杭州を通っている。",
    location:"杭州文化"
  },


  // ====================================================
  // 歴史・文化
  // ====================================================

  liangzhu: {
    word:"良渚",
    pinyin:"Liángzhǔ",
    meaning:"杭州周辺で栄えた新石器時代文化に由来する地名",
    category:"歴史・文化",
    example:"良渚文化以玉器闻名。",
    exampleJa:"良渚文化は玉器で知られている。",
    location:"杭州文创"
  },

  yucong: {
    word:"玉琮",
    pinyin:"yùcóng",
    meaning:"良渚文化を代表する玉器の一種",
    category:"歴史・文化",
    example:"这里展示了玉琮的图案。",
    exampleJa:"ここには玉琮の模様が展示されている。",
    location:"杭州文创"
  },

  nansong: {
    word:"南宋",
    pinyin:"Nán Sòng",
    meaning:"1127～1279年の宋王朝後半期",
    category:"歴史・文化",
    example:"杭州曾是南宋都城。",
    exampleJa:"杭州はかつて南宋の都だった。",
    location:"杭州文化"
  },

  linan: {
    word:"临安",
    pinyin:"Lín'ān",
    meaning:"南宋期の都としての杭州の名称",
    category:"歴史・文化",
    example:"南宋时期，杭州被称为临安。",
    exampleJa:"南宋時代、杭州は臨安と呼ばれた。",
    location:"杭州文化"
  },

  wenchuang: {
    word:"文创",
    pinyin:"wénchuàng",
    meaning:"文化を題材にした創意・文化クリエイティブ",
    category:"歴史・文化",
    example:"这家店卖杭州文创产品。",
    exampleJa:"この店では杭州の文化グッズを販売している。",
    location:"杭州文创"
  },

  chaguan: {
    word:"茶馆",
    pinyin:"cháguǎn",
    meaning:"茶館・お茶を飲む店",
    category:"歴史・文化",
    example:"老街上有一家茶馆。",
    exampleJa:"古い通りに茶館が一軒ある。",
    location:"老杭州茶馆"
  },

  chaju: {
    word:"茶具",
    pinyin:"chájù",
    meaning:"茶器",
    category:"歴史・文化",
    example:"桌上摆着一套茶具。",
    exampleJa:"机の上に一式の茶器が置いてある。",
    location:"老杭州茶馆"
  },


  // ====================================================
  // 文学・表現
  // ====================================================

  shiyi: {
    word:"诗意",
    pinyin:"shīyì",
    meaning:"詩情・詩的な趣",
    category:"文学・表現",
    example:"夜晚的西湖很有诗意。",
    exampleJa:"夜の西湖には詩的な趣がある。",
    location:"西湖・湖滨"
  },

  yijing: {
    word:"意境",
    pinyin:"yìjìng",
    meaning:"作品や風景が生み出す情趣・境地",
    category:"文学・表現",
    example:"这首诗的意境很美。",
    exampleJa:"この詩の醸し出す世界はとても美しい。",
    location:"湖滨茶室"
  },

  wenren: {
    word:"文人",
    pinyin:"wénrén",
    meaning:"文人・文学や芸術をたしなむ知識人",
    category:"文学・表現",
    example:"很多文人写过西湖。",
    exampleJa:"多くの文人が西湖を題材に書いてきた。",
    location:"湖滨茶室"
  },

  shici: {
    word:"诗词",
    pinyin:"shīcí",
    meaning:"詩と詞、中国古典韻文の総称",
    category:"文学・表現",
    example:"西湖出现在很多诗词中。",
    exampleJa:"西湖は多くの詩詞に登場する。",
    location:"湖滨茶室"
  },

  fengya: {
    word:"风雅",
    pinyin:"fēngyǎ",
    meaning:"風流で上品な趣",
    category:"文学・表現",
    example:"喝茶也可以是一件风雅的事。",
    exampleJa:"茶を飲むことも風雅な営みになりうる。",
    location:"老杭州茶馆"
  },

  fengjing: {
    word:"风景",
    pinyin:"fēngjǐng",
    meaning:"風景・景色",
    category:"文学・表現",
    example:"西湖的风景很美。",
    exampleJa:"西湖の景色は美しい。",
    location:"西湖・湖滨"
  },

  huafang: {
    word:"画舫",
    pinyin:"huàfǎng",
    meaning:"装飾を施した遊覧船",
    category:"文学・表現",
    example:"湖面上有一艘画舫。",
    exampleJa:"湖面に一艘の装飾船が浮かんでいる。",
    location:"西湖・湖滨"
  }

};


// ======================================================
// CATEGORY ORDER
// ======================================================

const VOCAB_CATEGORIES = [
  "すべて",
  "夜市・街歩き",
  "食文化",
  "杭州",
  "歴史・文化",
  "文学・表現"
];


// ======================================================
// SAVE SYSTEM
// ======================================================

const VOCAB_SAVE_KEY =
  "hangzhouExplorerVocabularyV1";


function loadVocabularyCollection() {

  try {

    const raw =
      localStorage.getItem(
        VOCAB_SAVE_KEY
      );


    if (!raw) {
      return [];
    }


    const data =
      JSON.parse(raw);


    if (
      !Array.isArray(data)
    ) {
      return [];
    }


    return data.filter(
      id => VOCABULARY[id]
    );

  }
  catch (error) {

    console.warn(
      "単語データを読み込めませんでした。",
      error
    );

    return [];

  }

}


let collectedVocabulary =
  loadVocabularyCollection();


function saveVocabularyCollection() {

  localStorage.setItem(
    VOCAB_SAVE_KEY,
    JSON.stringify(
      collectedVocabulary
    )
  );

}


function hasVocabulary(id) {

  return collectedVocabulary.includes(
    id
  );

}


function collectVocabulary(id) {

  if (
    !VOCABULARY[id]
  ) {

    console.warn(
      "Unknown vocabulary:",
      id
    );

    return false;

  }


  if (
    hasVocabulary(id)
  ) {

    return false;

  }


  collectedVocabulary.push(
    id
  );


  saveVocabularyCollection();


  return true;

}


function getVocabularyCount() {

  return Object.keys(
    VOCABULARY
  ).length;

}
