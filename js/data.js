// Vocabulary Decks for Kotoba Flip Arcade
// Each item has:
// - id: unique string
// - kana: Katakana / Hiragana / Kanji text
// - romaji: Pronunciation guide
// - meaning: Indonesian / English meaning
// - icon: emoji or arcade symbol
// - category: category key
// - furigana: optional reading if Kanji

const VOCAB_DECKS = {
  katakana: {
    id: "katakana",
    name: "Katakana N5 Essentials",
    subtitle: "KATA SERAPAN & POPULER",
    pairs: [
      { id: "k1", kana: "ウタ", romaji: "uta", meaning: "LAGU (Song)", icon: "🎵" },
      { id: "k2", kana: "ミズ", romaji: "mizu", meaning: "AIR (Water)", icon: "💧" },
      { id: "k3", kana: "ネコ", romaji: "neko", meaning: "KUCING (Cat)", icon: "🐱" },
      { id: "k4", kana: "ホン", romaji: "hon", meaning: "BUKU (Book)", icon: "📖" },
      { id: "k5", kana: "パン", romaji: "pan", meaning: "ROTI (Bread)", icon: "🍞" },
      { id: "k6", kana: "イヌ", romaji: "inu", meaning: "ANJING (Dog)", icon: "🐶" },
      { id: "k7", kana: "クルマ", romaji: "kuruma", meaning: "MOBIL (Car)", icon: "🚗" },
      { id: "k8", kana: "カメラ", romaji: "kamera", meaning: "KAMERA (Camera)", icon: "📷" },
      { id: "k9", kana: "テレビ", romaji: "terebi", meaning: "TELEVISI (TV)", icon: "📺" },
      { id: "k10", kana: "コーヒー", romaji: "koohii", meaning: "KOPI (Coffee)", icon: "☕" },
      { id: "k11", kana: "ミルク", romaji: "miruku", meaning: "SUSU (Milk)", icon: "🥛" },
      { id: "k12", kana: "ドア", romaji: "doa", meaning: "PINTU (Door)", icon: "🚪" },
      { id: "k13", kana: "バス", romaji: "basu", meaning: "BUS (Bus)", icon: "🚌" },
      { id: "k14", kana: "アイス", romaji: "aisu", meaning: "ES KRIM (Ice)", icon: "🍦" },
      { id: "k15", kana: "ゲーム", romaji: "geemu", meaning: "GAME (Game)", icon: "🎮" },
      { id: "k16", kana: "リンゴ", romaji: "ringo", meaning: "APEL (Apple)", icon: "🍎" },
      { id: "k17", kana: "サカナ", romaji: "sakana", meaning: "IKAN (Fish)", icon: "🐟" },
      { id: "k18", kana: "ハナ", romaji: "hana", meaning: "BUNGA (Flower)", icon: "🌸" }
    ]
  },
  kanji_n5: {
    id: "kanji_n5",
    name: "JLPT N5 Kanji Master",
    subtitle: "KANJI DASAR & ALAM",
    pairs: [
      { id: "n1", kana: "日", furigana: "ひ / にち", romaji: "hi / nichi", meaning: "MATAHARI / HARI (Sun)", icon: "☀️" },
      { id: "n2", kana: "月", furigana: "つき / げつ", romaji: "tsuki / getsu", meaning: "BULAN (Moon)", icon: "🌙" },
      { id: "n3", kana: "火", furigana: "ひ / か", romaji: "hi / ka", meaning: "API (Fire)", icon: "🔥" },
      { id: "n4", kana: "水", furigana: "みず / すい", romaji: "mizu / sui", meaning: "AIR (Water)", icon: "🌊" },
      { id: "n5", kana: "木", furigana: "き / もく", romaji: "ki / moku", meaning: "POHON / KAYU (Tree)", icon: "🌳" },
      { id: "n6", kana: "金", furigana: "かね / きん", romaji: "kane / kin", meaning: "EMAS / UANG (Gold)", icon: "🪙" },
      { id: "n7", kana: "土", furigana: "つち / ど", romaji: "tsuchi / do", meaning: "TANAH (Earth)", icon: "⛰️" },
      { id: "n8", kana: "山", furigana: "やま / さん", romaji: "yama / san", meaning: "GUNUNG (Mountain)", icon: "🏔️" },
      { id: "n9", kana: "川", furigana: "かわ", romaji: "kawa", meaning: "SUNGAI (River)", icon: "🏞️" },
      { id: "n10", kana: "雨", furigana: "あめ", romaji: "ame", meaning: "HUJAN (Rain)", icon: "🌧️" },
      { id: "n11", kana: "人", furigana: "ひと / じん", romaji: "hito / jin", meaning: "ORANG (Person)", icon: "👤" },
      { id: "n12", kana: "目", furigana: "め", romaji: "me", meaning: "MATA (Eye)", icon: "👁️" },
      { id: "n13", kana: "手", furigana: "て", romaji: "te", meaning: "TANGAN (Hand)", icon: "✋" },
      { id: "n14", kana: "口", furigana: "くち", romaji: "kuchi", meaning: "MULUT (Mouth)", icon: "👄" },
      { id: "n15", kana: "耳", furigana: "みみ", romaji: "mimi", meaning: "TELINGA (Ear)", icon: "👂" }
    ]
  },
  tabemono: {
    id: "tabemono",
    name: "Makanan & Minuman",
    subtitle: "KULINER & DAPUR JEPANG",
    pairs: [
      { id: "t1", kana: "すし", romaji: "sushi", meaning: "SUSHI (Sushi)", icon: "🍣" },
      { id: "t2", kana: "らーめん", romaji: "raamen", meaning: "RAMEN (Ramen)", icon: "🍜" },
      { id: "t3", kana: "ごはん", romaji: "gohan", meaning: "NASI (Rice)", icon: "🍚" },
      { id: "t4", kana: "たまご", romaji: "tamago", meaning: "TELUR (Egg)", icon: "🥚" },
      { id: "t5", kana: "おちゃ", romaji: "ocha", meaning: "TEH HIJAU (Green Tea)", icon: "🍵" },
      { id: "t6", kana: "にく", romaji: "niku", meaning: "DAGING (Meat)", icon: "🥩" },
      { id: "t7", kana: "りんご", romaji: "ringo", meaning: "APEL (Apple)", icon: "🍎" },
      { id: "t8", kana: "バナナ", romaji: "banana", meaning: "PISANG (Banana)", icon: "🍌" },
      { id: "t9", kana: "さけ", romaji: "sake", meaning: "SAKE (Japanese Wine)", icon: "🍶" },
      { id: "t10", kana: "カレー", romaji: "karee", meaning: "KARI (Curry)", icon: "🍛" },
      { id: "t11", kana: "やさい", romaji: "yasai", meaning: "SAYURAN (Vegetables)", icon: "🥦" },
      { id: "t12", kana: "みかん", romaji: "mikan", meaning: "JERUK (Mandarin)", icon: "🍊" }
    ]
  }
};

window.VOCAB_DECKS = VOCAB_DECKS;
