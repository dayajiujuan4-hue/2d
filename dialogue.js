"use strict";

const NPCS = [

  // ====================================================
  // FOOD STREET
  // ====================================================

  {
    map:"food",
    name:"烧烤屋の老板",
    label:"串",

    x:18*TILE,
    y:12*TILE,

    color:"#a54134",
    hair:"#241b1b",
    skin:"#dda67d",

    direction:"down",

    wander:false,

    rewards:[
      "yangrouchuan",
      "kaochuan"
    ],

    dialogue:[
      "来来来！刚烤好的羊肉串！",
      "焼きたての羊肉串だよ。一本どうだい？",
      "夜市では、こういう烤串を食べながら歩くのも楽しいよ。"
    ]
  },


  {
    map:"food",
    name:"浙江大学の学生",
    label:"学",

    x:25*TILE,
    y:18*TILE,

    color:"#566ba0",
    hair:"#20222c",
    skin:"#e2b28b",

    direction:"left",

    wander:true,
    range:70,

    rewards:[
      "wenchuang"
    ],

    dialogue:[
      "旅行で杭州に来たの？",
      "僕は浙江大学の学生。",
      "杭州は西湖だけじゃないよ。良渚や南宋の歴史も面白い。",
      "最近はそういう文化を使った文创商品もよく見るね。"
    ]
  },


  {
    map:"food",
    name:"夜市に来た子ども",
    label:"童",

    x:29*TILE,
    y:20*TILE,

    color:"#d38b42",
    hair:"#30211d",
    skin:"#e5b18b",

    direction:"left",

    wander:true,
    range:60,

    rewards:[
      "xiaolongbao"
    ],

    dialogue:[
      "小笼包だ！",
      "あっちには串焼きもある！",
      "まだ帰りたくない！"
    ]
  },


  {
    map:"food",
    name:"仕事帰りの男性",
    label:"客",

    x:24*TILE,
    y:28*TILE,

    color:"#4d6275",
    hair:"#272126",
    skin:"#d8a57f",

    direction:"up",

    wander:true,
    range:70,

    rewards:[
      "yexiao"
    ],

    dialogue:[
      "仕事帰りに寄ったんだ。",
      "この時間になると、夜宵が食べたくなるんだよね。",
      "ちょっと食べるだけのつもりが、つい長居しちゃうよ。"
    ]
  },


  // ====================================================
  // MARKET
  // ====================================================

  {
    map:"market",
    name:"奶茶を持った女性",
    label:"茶",

    x:22*TILE,
    y:20*TILE,

    color:"#a55b77",
    hair:"#382527",
    skin:"#e4b18b",

    direction:"down",

    wander:true,
    range:70,

    rewards:[
      "renao"
    ],

    dialogue:[
      "この奶茶、おいしい！",
      "夜市って本当に热闹だよね。",
      "古い店も新しい店も一緒にあるのが面白い。"
    ]
  },


  {
    map:"market",
    name:"買い物中の青年",
    label:"客",

    x:29*TILE,
    y:19*TILE,

    color:"#5c6c8d",
    hair:"#25222b",
    skin:"#dda983",

    direction:"left",

    wander:true,
    range:70,

    rewards:[
      "saoma"
    ],

    dialogue:[
      "スマホケースを買ったところなんだ。",
      "今は扫码ですぐ支払えるから便利だね。",
      "現金を出す場面もずいぶん減ったなあ。"
    ]
  },


  // ====================================================
  // HOTEL
  // ====================================================

  {
    map:"hotel",
    name:"ホテルの宿泊客",
    label:"旅",

    x:23*TILE,
    y:18*TILE,

    color:"#76628e",
    hair:"#31242c",
    skin:"#dbaa83",

    direction:"right",

    wander:true,
    range:65,

    rewards:[
      "hubin"
    ],

    dialogue:[
      "さっき武林夜市を歩いてきたんです。",
      "この先は湖滨、西湖のほとりへ続いているみたいですよ。",
      "夜市とは雰囲気がずいぶん違いそうですね。"
    ]
  },


  {
    map:"hotel",
    name:"タクシーを待つ男性",
    label:"客",

    x:29*TILE,
    y:26*TILE,

    color:"#4b6374",
    hair:"#242127",
    skin:"#d7a67e",

    direction:"left",

    wander:false,

    rewards:[
      "xihu"
    ],

    dialogue:[
      "西湖へ行くのかい？",
      "この道をまっすぐ行けば着くよ。",
      "夜の西湖もなかなかきれいだ。"
    ]
  },


  // ====================================================
  // LAKE
  // ====================================================

  {
    map:"lake",
    name:"湖畔のおじいさん",
    label:"湖",

    x:27*TILE,
    y:17*TILE,

    color:"#63705b",
    hair:"#b9b5aa",
    skin:"#d5a47d",

    direction:"left",

    wander:false,

    rewards:[
      "shiyi",
      "wenren"
    ],

    dialogue:[
      "ようやく西湖まで来たか。",
      "夜の湖には独特の诗意があるだろう。",
      "昔から多くの文人が、この風景を言葉にしてきたんだ。",
      "賑やかな街も静かな湖も、どちらも杭州なんだよ。"
    ]
  },


  {
    map:"lake",
    name:"散歩中の女性",
    label:"歩",

    x:30*TILE,
    y:10*TILE,

    color:"#865e71",
    hair:"#33242b",
    skin:"#dfaa83",

    direction:"down",

    wander:true,
    range:90,

    rewards:[
      "fengjing"
    ],

    dialogue:[
      "夜は涼しくて歩きやすいですね。",
      "西湖の风景を見ながら歩くのが好きなんです。",
      "湖の風も気持ちいいですよ。"
    ]
  },


  // ====================================================
  // TEA HOUSE
  // ====================================================

  {
    map:"tea",
    name:"茶館の老板",
    label:"茶",

    x:8*TILE,
    y:8*TILE,

    color:"#72503c",
    hair:"#2c221f",
    skin:"#d9a77f",

    direction:"down",

    wander:false,

    rewards:[
      "longjingcha",
      "paocha"
    ],

    dialogue:[
      "欢迎光临。まあ、座っていきなさい。",
      "杭州に来たなら、龙井茶という名前は聞いたことがあるだろう？",
      "茶叶を見て、香りを感じて、ゆっくり泡茶する。",
      "急いで飲むものじゃないんだよ。"
    ]
  },


  {
    map:"tea",
    name:"茶館の常連客",
    label:"客",

    x:18*TILE,
    y:11*TILE,

    color:"#58684c",
    hair:"#34302a",
    skin:"#d3a27b",

    direction:"left",

    wander:false,

    rewards:[
      "fengya"
    ],

    dialogue:[
      "この店にはよく来るんだ。",
      "外はあんなに騒がしいのに、ここは静かだろう？",
      "昔の人なら、こういう時間を风雅と言ったのかもしれないね。"
    ]
  },


  // ====================================================
  // NOODLE
  // ====================================================

  {
    map:"noodle",
    name:"面館の老板",
    label:"麺",

    x:8*TILE,
    y:8*TILE,

    color:"#8b4c37",
    hair:"#2d2421",
    skin:"#dca77e",

    direction:"down",

    wander:false,

    rewards:[
      "pianerchuan",
      "tang"
    ],

    dialogue:[
      "いらっしゃい！何にする？",
      "杭州に来たなら片儿川を食べてみるといい。",
      "雪菜や筍、肉などを使う杭州の伝統的な麺料理だよ。",
      "汤まで飲んでいって！"
    ]
  },


  {
    map:"noodle",
    name:"麺を食べる客",
    label:"客",

    x:17*TILE,
    y:12*TILE,

    color:"#526985",
    hair:"#28232a",
    skin:"#dda983",

    direction:"left",

    wander:false,

    rewards:[
      "xiang"
    ],

    dialogue:[
      "ふう……うまい。",
      "厨房からいい匂いがするだろう？",
      "中国語ならこういうとき、真香！って言いたくなるね。"
    ]
  },


  // ====================================================
  // CONVENIENCE
  // ====================================================

  {
    map:"convenience",
    name:"便利店の店員",
    label:"店",

    x:14*TILE,
    y:4*TILE,

    color:"#477783",
    hair:"#29252a",
    skin:"#dda983",

    direction:"down",

    wander:false,

    rewards:[
      "dabao"
    ],

    dialogue:[
      "欢迎光临。",
      "夜市で食べきれなかった料理は打包して持ち帰る人も多いですね。",
      "飲み物なら奥の棚ですよ。"
    ]
  },


  // ====================================================
  // RESTAURANT
  // ====================================================

  {
    map:"restaurant",
    name:"食堂のおばさん",
    label:"食",

    x:9*TILE,
    y:8*TILE,

    color:"#8d4d43",
    hair:"#3b2927",
    skin:"#daa47d",

    direction:"down",

    wander:false,

    rewards:[
      "xiaochi",
      "zhaopai"
    ],

    dialogue:[
      "座って座って！",
      "うちの招牌は地元の料理だよ。",
      "小吃だけじゃなくて、普通の家庭料理も食べていきな。",
      "食堂を見ると、その街の日常が分かるものさ。"
    ]
  },


  // ====================================================
  // CULTURE SHOP
  // ====================================================

  {
    map:"culture",
    name:"文創店の店員",
    label:"文",

    x:14*TILE,
    y:5*TILE,

    color:"#65547e",
    hair:"#302630",
    skin:"#dfab85",

    direction:"down",

    wander:false,

    rewards:[
      "liangzhu",
      "yucong"
    ],

    dialogue:[
      "いらっしゃいませ。",
      "こちらは良渚文化をモチーフにした商品です。",
      "この独特な形は玉琮をイメージしているんですよ。",
      "杭州には西湖以外にも、とても古い文化があります。"
    ]
  },


  // ====================================================
  // DEPARTMENT
  // ====================================================

  {
    map:"department",
    name:"百貨店の店員",
    label:"店",

    x:14*TILE,
    y:5*TILE,

    color:"#6a5577",
    hair:"#322831",
    skin:"#dfaa84",

    direction:"down",

    wander:false,

    rewards:[
      "tanzhu"
    ],

    dialogue:[
      "欢迎光临。",
      "夜市には摊主が一人で切り盛りしている小さな店も多いですね。",
      "百貨店とはまた違った買い物の楽しさがあります。"
    ]
  },


  // ====================================================
  // ACCESSORY
  // ====================================================

  {
    map:"accessory",
    name:"饰品店のお姉さん",
    label:"饰",

    x:14*TILE,
    y:5*TILE,

    color:"#3f7d76",
    hair:"#2b2024",
    skin:"#e0ac85",

    direction:"down",

    wander:false,

    rewards:[
      "paidui"
    ],

    dialogue:[
      "看看吧！",
      "人気の商品が出ると、お店の前に排队ができることもあるんですよ。",
      "小さなお店を一つずつ見るのも夜市の楽しみですね。"
    ]
  },


  // ====================================================
  // DRINK
  // ====================================================

  {
    map:"drink",
    name:"茶飲店の店員",
    label:"茶",

    x:14*TILE,
    y:5*TILE,

    color:"#4f7869",
    hair:"#29242a",
    skin:"#dfaa84",

    direction:"down",

    wander:false,

    rewards:[
      "chaye"
    ],

    dialogue:[
      "いらっしゃいませ！",
      "茶叶を使ったドリンクもありますよ。",
      "伝統的なお茶も、今はいろんな飲み方があります。"
    ]
  },


  // ====================================================
  // LAKE TEA
  // ====================================================

  {
    map:"lakeTea",
    name:"湖滨茶室の主人",
    label:"茶",

    x:14*TILE,
    y:7*TILE,

    color:"#5d6045",
    hair:"#342a26",
    skin:"#d7a37c",

    direction:"down",

    wander:false,

    rewards:[
      "yijing",
      "shici"
    ],

    dialogue:[
      "いらっしゃい。",
      "窓から西湖を見てごらん。",
      "中国の诗词では、風景そのものだけでなく、その意境も大切にされる。",
      "同じ湖でも、見る人によって感じるものは違うんだ。"
    ]
  },


  // ====================================================
  // LAKE GIFT
  // ====================================================

  {
    map:"lakeGift",
    name:"土産店の店員",
    label:"礼",

    x:14*TILE,
    y:6*TILE,

    color:"#536b78",
    hair:"#30282c",
    skin:"#dda983",

    direction:"down",

    wander:false,

    rewards:[
      "duanqiao",
      "sudi"
    ],

    dialogue:[
      "西湖のお土産はいかがですか？",
      "こちらは断桥、こっちは苏堤を描いたしおりです。",
      "景色を知ってから見ると、お土産も少し面白くなるでしょう？"
    ]
  }

];
