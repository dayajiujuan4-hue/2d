"use strict";

const NPCS = [

  {
    id: "wang",

    name: "小王",
    label: "王",

    x: 23 * TILE,
    y: 32 * TILE,

    direction: "up",

    color: "#416d91",
    hair: "#241c1b",
    skin: "#dfad85",

    behavior: "wander",

    dialogue: [

      "你好！武林夜市へようこそ。",

      "ここは杭州の中心部にある夜市だよ。",

      "食べ物だけじゃなくて、雑貨や服、アクセサリーなんかも売っている。",

      "せっかくだから、いろんな店を見ていってよ。"

    ]
  },


  {
    id: "shaokao",

    name: "烧烤屋の老板",
    label: "串",

    x: 17 * TILE,
    y: 10 * TILE,

    direction: "down",

    color: "#a54134",
    hair: "#262020",
    skin: "#dda67d",

    behavior: "static",

    dialogue: [

      "来来来！焼きたてだよ！",

      "羊肉串、牛肉串、鶏肉……好きなのを選んで！",

      "夜市は見るだけじゃもったいない。食べながら歩くのが一番だよ。"

    ]
  },


  {
    id: "student",

    name: "浙江大学の学生",
    label: "学",

    x: 27 * TILE,
    y: 18 * TILE,

    direction: "left",

    color: "#566ba0",
    hair: "#20222c",
    skin: "#e2b28b",

    behavior: "wander",

    dialogue: [

      "你好。旅行で杭州に来たの？",

      "僕は浙江大学の学生。紫金港キャンパスで勉強してるんだ。",

      "杭州は西湖だけじゃないよ。良渚、運河、南宋の歴史……。",

      "少し調べてから歩くと、街の見え方が全然違ってくる。"

    ]
  },


  {
    id: "grandpa",

    name: "杭州のおじいさん",
    label: "杭",

    x: 22 * TILE,
    y: 16 * TILE,

    direction: "right",

    color: "#697055",
    hair: "#b9b5aa",
    skin: "#d5a47d",

    behavior: "static",

    dialogue: [

      "この辺りも昔とはずいぶん変わったものだ。",

      "杭州といえば、西湖を思い浮かべる人が多いだろう。",

      "だがこの街は、かつて南宋の都・臨安だった場所でもある。",

      "今の街の下にも、長い歴史が眠っているんだよ。"

    ]
  },


  {
    id: "girl",

    name: "奶茶を持った女性",
    label: "茶",

    x: 29 * TILE,
    y: 26 * TILE,

    direction: "down",

    color: "#a55b77",
    hair: "#382527",
    skin: "#e4b18b",

    behavior: "wander",

    dialogue: [

      "この奶茶、おいしい！",

      "中国の街を歩いていると、本当に茶饮のお店が多いでしょう？",

      "昔からのお茶文化と、今の若者文化が一緒になっている感じが面白いよね。"

    ]
  },


  {
    id: "tourist",

    name: "旅行者",
    label: "旅",

    x: 25 * TILE,
    y: 25 * TILE,

    direction: "up",

    color: "#7e6091",
    hair: "#34252e",
    skin: "#dfaa82",

    behavior: "wander",

    dialogue: [

      "明日は西湖へ行くんだ。",

      "そのあと河坊街と南宋御街も歩いてみる予定。",

      "杭州って、現代的な都市のすぐ隣に昔の中国が残っているのが面白いね。"

    ]
  },


  {
    id: "child",

    name: "夜市に来た子ども",
    label: "童",

    x: 30 * TILE,
    y: 10 * TILE,

    direction: "left",

    color: "#d38b42",
    hair: "#30211d",
    skin: "#e5b18b",

    behavior: "wander",

    dialogue: [

      "あっ！小笼包！",

      "あっちには串焼きもある！",

      "お父さん、まだ帰りたくない！"

    ]
  },


  {
    id: "jewelry",

    name: "饰品店のお姉さん",
    label: "饰",

    x: 39 * TILE,
    y: 23 * TILE,

    direction: "left",

    color: "#3f7d76",
    hair: "#2b2024",
    skin: "#e0ac85",

    behavior: "static",

    dialogue: [

      "看看吧！アクセサリー、いろいろあるよ。",

      "夜市は食べ物だけじゃないの。",

      "こういう小さなお店を見て回るのも楽しいでしょう？"

    ]
  },


  {
    id: "mystery",

    name: "？？？",
    label: "？",

    x: 43 * TILE,
    y: 21 * TILE,

    direction: "left",

    color: "#40364c",
    hair: "#17141c",
    skin: "#cba17f",

    behavior: "static",

    dialogue: [

      "……観光客か。",

      "杭州について、本当に知りたいのか？",

      "有名な場所を見るだけなら、一日でもできる。",

      "だが、その土地を理解したいなら、人の話を聞くことだ。",

      "この夜市を歩いてみろ。",

      "きっと、ガイドブックとは違う杭州が見えてくる。"

    ]
  }

];
