"use strict";

const NPCS = [

  // ====================================================
  // FOOD STREET
  // ====================================================

  {
    map:"food",

    name:"烧烤屋の老板",
    label:"串",

    x:16*TILE,
    y:11*TILE,

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

    x:24*TILE,
    y:17*TILE,

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

    x:28*TILE,
    y:16*TILE,

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

    name:"杭州のおじいさん",
    label:"杭",

    x:21*TILE,
    y:20*TILE,

    color:"#697055",
    hair:"#b9b5aa",
    skin:"#d5a47d",

    direction:"right",

    wander:false,

    dialogue:[
      "この辺りも夜になると賑やかだね。",
      "杭州というと西湖ばかり有名だが、街を歩くのも面白いものだ。",
      "南へ行けば、また少し雰囲気が変わってくるよ。"
    ]
  },


  {
    map:"food",

    name:"友達と来た女性",
    label:"客",

    x:19*TILE,
    y:25*TILE,

    color:"#9a5572",
    hair:"#342229",
    skin:"#e1ad86",

    direction:"down",

    wander:true,

    range:80,

    dialogue:[
      "何食べようかな。",
      "臭豆腐も気になるけど、ちょっと勇気がいるね。",
      "でも夜市に来たら色々試したくなる！"
    ]
  },


  {
    map:"food",

    name:"仕事帰りの男性",
    label:"客",

    x:27*TILE,
    y:27*TILE,

    color:"#4d6275",
    hair:"#272126",
    skin:"#d8a57f",

    direction:"up",

    wander:true,

    range:65,

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

    name:"饰品店のお姉さん",
    label:"饰",

    x:36*TILE,
    y:14*TILE,

    color:"#3f7d76",
    hair:"#2b2024",
    skin:"#e0ac85",

    direction:"left",

    wander:false,

    dialogue:[
      "看看吧！アクセサリー、いろいろあるよ。",
      "夜市は食べ物だけじゃないの。",
      "こういう小さなお店を見て歩くのも楽しいでしょう？"
    ]
  },


  {
    map:"market",

    name:"奶茶を持った女性",
    label:"茶",

    x:21*TILE,
    y:19*TILE,

    color:"#a55b77",
    hair:"#382527",
    skin:"#e4b18b",

    direction:"down",

    wander:true,

    range:75,

    dialogue:[
      "この奶茶、おいしい！",
      "杭州は昔からお茶で有名だけど、今は茶饮のお店もたくさんあるよ。",
      "古い文化と新しい文化が一緒にあるのが面白いよね。"
    ]
  },


  {
    map:"market",

    name:"スマホケースを見る青年",
    label:"客",

    x:24*TILE,
    y:13*TILE,

    color:"#6a5d89",
    hair:"#24212c",
    skin:"#dda983",

    direction:"left",

    wander:false,

    dialogue:[
      "種類がすごいな……。",
      "こういう夜市って、思わぬ物が売ってるから面白いよね。"
    ]
  },


  {
    map:"market",

    name:"買い物中の女性",
    label:"客",

    x:27*TILE,
    y:26*TILE,

    color:"#8e6268",
    hair:"#39282b",
    skin:"#dfaa84",

    direction:"right",

    wander:true,

    range:80,

    dialogue:[
      "杭州らしいお土産を探してるの。",
      "西湖とか良渚をモチーフにしたものが欲しいな。"
    ]
  },


  // ====================================================
  // HOTEL
  // ====================================================

  {
    map:"hotel",

    name:"ホテルの宿泊客",
    label:"旅",

    x:21*TILE,
    y:16*TILE,

    color:"#76628e",
    hair:"#31242c",
    skin:"#dbaa83",

    direction:"right",

    wander:true,

    range:60,

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

    x:27*TILE,
    y:23*TILE,

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
  // WEST LAKE
  // ====================================================

  {
    map:"lake",

    name:"湖畔のおじいさん",
    label:"湖",

    x:25*TILE,
    y:16*TILE,

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

    name:"西湖を眺める旅行者",
    label:"旅",

    x:22*TILE,
    y:23*TILE,

    color:"#655d8a",
    hair:"#30252c",
    skin:"#dfaa82",

    direction:"left",

    wander:false,

    dialogue:[
      "夜の西湖って静かですね。",
      "昼間にも来てみたいな。",
      "同じ場所でも時間が違うと、全然違って見えそうです。"
    ]
  },


  {
    map:"lake",

    name:"散歩中の女性",
    label:"歩",

    x:28*TILE,
    y:9*TILE,

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
    y:9*TILE,

    color:"#72503c",
    hair:"#2c221f",
    skin:"#d9a77f",

    direction:"down",

    wander:false,

    dialogue:[
      "欢迎光临。まあ、座っていきなさい。",
      "杭州に来たなら、龍井茶という名前は聞いたことがあるだろう？",
      "西湖龍井は杭州を代表する緑茶だ。",
      "だが茶は、知識だけ覚えても面白くない。",
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
      "外はあんなに騒がしいのに、ここは静かだろう？",
      "こういう場所も杭州の夜の一部だと思うよ。"
    ]
  }

];
