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

    dialogue:[
      "来来来！焼きたてだよ！",
      "羊肉串、牛肉串、鶏肉串。好きなのを選んで！",
      "夜市は匂いまで含めて楽しむものだよ。"
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

    dialogue:[
      "旅行で杭州に来たの？",
      "僕は浙江大学の学生。紫金港キャンパスで勉強してるんだ。",
      "杭州は西湖だけじゃないよ。",
      "良渚や南宋、それに京杭大運河も調べてみると面白いよ。"
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

    dialogue:[
      "仕事帰りに寄ったんだ。",
      "この時間になると、つい何か食べたくなるんだよね。"
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

    dialogue:[
      "この奶茶、おいしい！",
      "杭州は昔からお茶で有名だけど、今は茶饮のお店もたくさんあるよ。",
      "古い文化と新しい文化が一緒にあるのが面白いよね。"
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

    dialogue:[
      "夜市って食べ物だけじゃないんだね。",
      "スマホケースから服まで何でもあるな。"
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

    dialogue:[
      "さっき武林夜市を歩いてきたんです。",
      "あんなに賑やかだったのに、この辺りは少し静かですね。",
      "この先は西湖の方へ続いているみたいですよ。"
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

    dialogue:[
      "西湖へ行くのかい？",
      "この道をまっすぐ行けば湖滨の方だ。",
      "夜の西湖もなかなかきれいだよ。"
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

    dialogue:[
      "ようやく西湖まで来たか。",
      "さっきまでの夜市とは、ずいぶん空気が違うだろう。",
      "賑やかな街も、静かな湖も、どちらも杭州なんだよ。"
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

    dialogue:[
      "夜は涼しくて歩きやすいですね。",
      "湖の風が気持ちいいです。"
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

    dialogue:[
      "欢迎光临。まあ、座っていきなさい。",
      "杭州に来たなら、龍井茶という名前は聞いたことがあるだろう？",
      "西湖龍井は杭州を代表する緑茶だ。",
      "香りを感じて、人と話しながら飲む。そこまで含めて茶文化なんだよ。"
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

    dialogue:[
      "この店にはよく来るんだ。",
      "外はあんなに騒がしいのに、ここは静かだろう？"
    ]
  },


  // ====================================================
  // NOODLE SHOP
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

    dialogue:[
      "いらっしゃい！何にする？",
      "片儿川なら杭州らしい一杯だよ。",
      "雪菜と筍、それに肉を使った杭州の麺料理なんだ。"
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

    dialogue:[
      "ふう……うまい。",
      "夜に食べる麺って、なんでこんなにうまいんだろう。"
    ]
  },


  // ====================================================
  // CONVENIENCE STORE
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

    dialogue:[
      "欢迎光临。",
      "飲み物なら奥の棚ですよ。",
      "夜市を歩くなら、水分補給も忘れずに。"
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

    dialogue:[
      "座って座って！",
      "観光客向けじゃなくて、普通のご飯もたくさんあるよ。",
      "こういう食堂を見ると、その街の日常が分かるものさ。"
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

    dialogue:[
      "いらっしゃいませ。",
      "西湖だけでなく、良渚文化をモチーフにした商品もありますよ。",
      "この模様は玉琮をイメージしているんです。"
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

    dialogue:[
      "欢迎光临。",
      "服も雑貨もありますよ。",
      "昔ながらの店ですが、地元のお客さんも多いんです。"
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

    dialogue:[
      "看看吧！",
      "イヤリングもブレスレットもありますよ。",
      "夜市では、こういう小さなお店を探すのも楽しいでしょう？"
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

    dialogue:[
      "いらっしゃいませ！",
      "龍井茶を使ったドリンクもありますよ。",
      "伝統的なお茶も、今はいろんな飲み方があります。"
    ]
  },


  // ====================================================
  // HOTELS
  // ====================================================

  {
    map:"wulinHotel",
    name:"フロントスタッフ",
    label:"旅",

    x:14*TILE,
    y:7*TILE,

    color:"#354b6a",
    hair:"#29252a",
    skin:"#dda983",

    direction:"down",

    wander:false,

    dialogue:[
      "欢迎光临。",
      "西湖方面へは、この通りを南へ進むと便利です。",
      "武林は夜の散策にもいい場所ですよ。"
    ]
  },


  {
    map:"hangzhouHotel",
    name:"ホテルスタッフ",
    label:"旅",

    x:14*TILE,
    y:7*TILE,

    color:"#514969",
    hair:"#29252a",
    skin:"#dda983",

    direction:"down",

    wander:false,

    dialogue:[
      "こんばんは。",
      "夜市から歩いて来られたんですか？",
      "杭州の夜をゆっくり楽しんでください。"
    ]
  },


  // ====================================================
  // CITY STORE
  // ====================================================

  {
    map:"cityStore",
    name:"夜勤の店員",
    label:"店",

    x:14*TILE,
    y:5*TILE,

    color:"#48737b",
    hair:"#29252a",
    skin:"#dda983",

    direction:"down",

    wander:false,

    dialogue:[
      "いらっしゃいませ。",
      "この時間はホテルのお客さんがよく来ますね。"
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

    dialogue:[
      "いらっしゃい。",
      "ここから見る西湖も悪くないでしょう。",
      "賑やかな街を歩いたあとに飲む茶は、また違った味がするものです。"
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

    dialogue:[
      "西湖のお土産はいかがですか？",
      "風景を描いたしおりや、杭州らしい小物がありますよ。"
    ]
  }

];
