const vocabularyData = [
  // --- JLPT N5 ---
  {
    id: "n5_1",
    kanji: "日本語",
    kana: "にほんご",
    romaji: "nihongo",
    vietnamese: "Tiếng Nhật",
    example: "日本語を勉強しています。",
    example_meaning: "Tôi đang học tiếng Nhật.",
    level: "N5",
    category: "Chung"
  },
  {
    id: "n5_2",
    kanji: "先生",
    kana: "せんせい",
    romaji: "sensei",
    vietnamese: "Thầy cô giáo, Bác sĩ",
    example: "日本語の先生はとても親切です。",
    example_meaning: "Giáo viên tiếng Nhật rất thân thiện.",
    level: "N5",
    category: "Con người"
  },
  {
    id: "n5_3",
    kanji: "学生",
    kana: "がくせい",
    romaji: "gakusei",
    vietnamese: "Học sinh, Sinh viên",
    example: "私はハノイ大学の学生です。",
    example_meaning: "Tôi là sinh viên trường Đại học Hà Nội.",
    level: "N5",
    category: "Con người"
  },
  {
    id: "n5_4",
    kanji: "友達",
    kana: "ともだち",
    romaji: "tomodachi",
    vietnamese: "Bạn bè",
    example: "週末に友達と遊びました。",
    example_meaning: "Tôi đã đi chơi với bạn bè vào cuối tuần.",
    level: "N5",
    category: "Con người"
  },
  {
    id: "n5_5",
    kanji: "食べる",
    kana: "たべる",
    romaji: "taberu",
    vietnamese: "Ăn",
    example: "朝ご飯にパンを食べます。",
    example_meaning: "Tôi ăn bánh mì vào bữa sáng.",
    level: "N5",
    category: "Hành động"
  },
  {
    id: "n5_6",
    kanji: "飲む",
    kana: "のむ",
    romaji: "nomu",
    vietnamese: "Uống",
    example: "毎朝、お茶を飲みます。",
    example_meaning: "Mỗi sáng tôi đều uống trà.",
    level: "N5",
    category: "Hành động"
  },
  {
    id: "n5_7",
    kanji: "行く",
    kana: "いく",
    romaji: "iku",
    vietnamese: "Đi",
    example: "明日、スーパーに行きます。",
    example_meaning: "Ngày mai tôi sẽ đi siêu thị.",
    level: "N5",
    category: "Hành động"
  },
  {
    id: "n5_8",
    kanji: "本",
    kana: "ほん",
    romaji: "hon",
    vietnamese: "Sách",
    example: "図書館で本を借りました。",
    example_meaning: "Tôi đã mượn sách ở thư viện.",
    level: "N5",
    category: "Đồ vật"
  },
  {
    id: "n5_9",
    kanji: "車",
    kana: "くるま",
    romaji: "kuruma",
    vietnamese: "Xe ô tô",
    example: "新しい車を買いたいです。",
    example_meaning: "Tôi muốn mua một chiếc xe ô tô mới.",
    level: "N5",
    category: "Đồ vật"
  },
  {
    id: "n5_10",
    kanji: "水",
    kana: "みず",
    romaji: "mizu",
    vietnamese: "Nước",
    example: "冷たい水を一杯ください。",
    example_meaning: "Cho tôi xin một ly nước lạnh.",
    level: "N5",
    category: "Ăn uống"
  },
  {
    id: "n5_11",
    kanji: "電話",
    kana: "でんわ",
    romaji: "denwa",
    vietnamese: "Điện thoại",
    example: "友達から電話がありました。",
    example_meaning: "Đã có cuộc điện thoại gọi đến từ bạn tôi.",
    level: "N5",
    category: "Đồ vật"
  },
  {
    id: "n5_12",
    kanji: "家族",
    kana: "かぞく",
    romaji: "kazoku",
    vietnamese: "Gia đình",
    example: "私の家族は４人です。",
    example_meaning: "Gia đình tôi có 4 người.",
    level: "N5",
    category: "Gia đình"
  },
  {
    id: "n5_13",
    kanji: "美味しい",
    kana: "おいしい",
    romaji: "oishii",
    vietnamese: "Ngon (món ăn)",
    example: "この寿司はとても美味しいです。",
    example_meaning: "Món sushi này rất ngon.",
    level: "N5",
    category: "Tính từ"
  },
  {
    id: "n5_14",
    kanji: "大きい",
    kana: "おおきい",
    romaji: "ookii",
    vietnamese: "To, Lớn",
    example: "あの公園はとても大きいです。",
    example_meaning: "Công viên kia rất lớn.",
    level: "N5",
    category: "Tính từ"
  },
  {
    id: "n5_15",
    kanji: "時計",
    kana: "とけい",
    romaji: "tokei",
    vietnamese: "Đồng hồ",
    example: "新しい時計を買いました。",
    example_meaning: "Tôi đã mua một chiếc đồng hồ mới.",
    level: "N5",
    category: "Đồ vật"
  },
  {
    id: "n5_16",
    kanji: "来る",
    kana: "くる",
    romaji: "kuru",
    vietnamese: "Đến",
    example: "あした、私のうちへ来てください。",
    example_meaning: "Ngày mai hãy đến nhà tôi nhé.",
    level: "N5",
    category: "Hành động"
  },
  {
    id: "n5_17",
    kanji: "勉強",
    kana: "べんきょう",
    romaji: "benkyou",
    vietnamese: "Học hành, Học tập",
    example: "毎日、日本語を３時間勉強します。",
    example_meaning: "Mỗi ngày tôi học tiếng Nhật 3 tiếng.",
    level: "N5",
    category: "Hành động"
  },
  {
    id: "n5_18",
    kanji: "手紙",
    kana: "てがみ",
    romaji: "tegami",
    vietnamese: "Thư, Bức thư",
    example: "家族に手紙を書きました。",
    example_meaning: "Tôi đã viết thư cho gia đình.",
    level: "N5",
    category: "Đồ vật"
  },
  {
    id: "n5_19",
    kanji: "空港",
    kana: "くうこう",
    romaji: "kuukou",
    vietnamese: "Sân bay",
    example: "成田空港へ友達を迎えに行きます。",
    example_meaning: "Tôi đi đón bạn ở sân bay Narita.",
    level: "N5",
    category: "Địa điểm"
  },
  {
    id: "n5_20",
    kanji: "暑い",
    kana: "あつい",
    romaji: "atsui",
    vietnamese: "Nóng (thời tiết)",
    example: "今日はとても暑いですね。",
    example_meaning: "Hôm nay trời rất nóng nhỉ.",
    level: "N5",
    category: "Tính từ"
  },

  // --- JLPT N4 ---
  {
    id: "n4_1",
    kanji: "準備",
    kana: "じゅんび",
    romaji: "junbi",
    vietnamese: "Chuẩn bị",
    example: "旅行の準備をします。",
    example_meaning: "Tôi chuẩn bị cho chuyến đi du lịch.",
    level: "N4",
    category: "Hành động"
  },
  {
    id: "n4_2",
    kanji: "運転",
    kana: "うんてん",
    romaji: "unten",
    vietnamese: "Lái xe",
    example: "車の運転ができますか。",
    example_meaning: "Bạn có biết lái xe ô tô không?",
    level: "N4",
    category: "Hành động"
  },
  {
    id: "n4_3",
    kanji: "世界",
    kana: "せかい",
    romaji: "sekai",
    vietnamese: "Thế giới",
    example: "世界中を旅行したいです。",
    example_meaning: "Tôi muốn đi du lịch vòng quanh thế giới.",
    level: "N4",
    category: "Địa điểm"
  },
  {
    id: "n4_4",
    kanji: "簡単",
    kana: "かんたん",
    romaji: "kantan",
    vietnamese: "Đơn giản, Dễ dàng",
    example: "この試験は簡単でした。",
    example_meaning: "Kỳ thi này đã rất dễ.",
    level: "N4",
    category: "Tính từ"
  },
  {
    id: "n4_5",
    kanji: "説明",
    kana: "せつめい",
    romaji: "setsumei",
    vietnamese: "Giải thích",
    example: "使い方を詳しく説明します。",
    example_meaning: "Tôi sẽ giải thích chi tiết cách sử dụng.",
    level: "N4",
    category: "Hành động"
  },
  {
    id: "n4_6",
    kanji: "約束",
    kana: "やくそく",
    romaji: "yakusoku",
    vietnamese: "Hẹn, Hứa hẹn",
    example: "友達と映画に行く約束があります。",
    example_meaning: "Tôi có hẹn đi xem phim với bạn bè.",
    level: "N4",
    category: "Hành động"
  },
  {
    id: "n4_7",
    kanji: "便利",
    kana: "べんり",
    romaji: "benri",
    vietnamese: "Tiện lợi",
    example: "スマホはとても便利です。",
    example_meaning: "Điện thoại thông minh rất tiện lợi.",
    level: "N4",
    category: "Tính từ"
  },
  {
    id: "n4_8",
    kanji: "辞める",
    kana: "やめる",
    romaji: "yameru",
    vietnamese: "Từ bỏ, Nghỉ (việc)",
    example: "来月、会社を辞めます。",
    example_meaning: "Tháng sau tôi sẽ nghỉ việc ở công ty.",
    level: "N4",
    category: "Hành động"
  },
  {
    id: "n4_9",
    kanji: "注意",
    kana: "ちゅうい",
    romaji: "chuui",
    vietnamese: "Chú ý, Nhắc nhở",
    example: "車に注意してください。",
    example_meaning: "Hãy chú ý xe cộ nhé.",
    level: "N4",
    category: "Hành động"
  },
  {
    id: "n4_10",
    kanji: "紹介",
    kana: "しょうかい",
    romaji: "shoukai",
    vietnamese: "Giới thiệu",
    example: "自己紹介をしてください。",
    example_meaning: "Xin mời hãy tự giới thiệu bản thân.",
    level: "N4",
    category: "Hành động"
  },
  {
    id: "n4_11",
    kanji: "試合",
    kana: "しあい",
    romaji: "shiai",
    vietnamese: "Trận đấu",
    example: "明日のサッカーの試合を見に行きます。",
    example_meaning: "Tôi sẽ đi xem trận đấu bóng đá ngày mai.",
    level: "N4",
    category: "Giải trí"
  },
  {
    id: "n4_12",
    kanji: "安全",
    kana: "あんぜん",
    romaji: "anzen",
    vietnamese: "An toàn",
    example: "この町は夜amp;でも安全です。",
    example_meaning: "Thành phố này ban đêm cũng rất an toàn.",
    level: "N4",
    category: "Tính từ"
  },
  {
    id: "n4_13",
    kanji: "調べる",
    kana: "しらべる",
    romaji: "shiraberu",
    vietnamese: "Điều tra, Tìm hiểu",
    example: "辞書で言葉の意味を調べます。",
    example_meaning: "Tôi tìm ý nghĩa của từ vựng bằng từ điển.",
    level: "N4",
    category: "Hành động"
  },
  {
    id: "n4_14",
    kanji: "連絡",
    kana: "れんらく",
    romaji: "renraku",
    vietnamese: "Liên lạc",
    example: "遅れるときは電話で連絡してください。",
    example_meaning: "Khi bị trễ hãy liên lạc bằng điện thoại nhé.",
    level: "N4",
    category: "Hành động"
  },
  {
    id: "n4_15",
    kanji: "危険",
    kana: "kiken",
    romaji: "kiken",
    vietnamese: "Nguy hiểm",
    example: "あそこは車が多くて危険です。",
    example_meaning: "Chỗ kia nhiều xe cộ nên rất nguy hiểm.",
    level: "N4",
    category: "Tính từ"
  },

  // --- JLPT N3 ---
  {
    id: "n3_1",
    kanji: "解決",
    kana: "かいけつ",
    romaji: "kaiketsu",
    vietnamese: "Giải quyết",
    example: "この問題は無事に解決しました。",
    example_meaning: "Vấn đề này đã được giải quyết ổn thỏa.",
    level: "N3",
    category: "Hành động"
  },
  {
    id: "n3_2",
    kanji: "経験",
    kana: "けいけん",
    romaji: "keiken",
    vietnamese: "Kinh nghiệm",
    example: "日本で仕事の経験があります。",
    example_meaning: "Tôi có kinh nghiệm làm việc ở Nhật.",
    level: "N3",
    category: "Chung"
  },
  {
    id: "n3_3",
    kanji: "技術",
    kana: "ぎじゅつ",
    romaji: "gijutsu",
    vietnamese: "Kỹ thuật, Công nghệ",
    example: "日本のIT技術を学びたいです。",
    example_meaning: "Tôi muốn học hỏi công nghệ CNTT của Nhật Bản.",
    level: "N3",
    category: "Chung"
  },
  {
    id: "n3_4",
    kanji: "環境",
    kana: "かんきょう",
    romaji: "kankyou",
    vietnamese: "Môi trường",
    example: "自然環境を守ることが大切です。",
    example_meaning: "Bảo vệ môi trường tự nhiên là rất quan trọng.",
    level: "N3",
    category: "Chung"
  },
  {
    id: "n3_5",
    kanji: "緊張",
    kana: "きんちょう",
    romaji: "kinchou",
    vietnamese: "Căng thẳng, Hồi hộp",
    example: "面接の前はとても緊張しました。",
    example_meaning: "Tôi đã rất hồi hộp trước buổi phỏng vấn.",
    level: "N3",
    category: "Cảm xúc"
  },
  {
    id: "n3_6",
    kanji: "複雑",
    kana: "ふくざつ",
    romaji: "fukuzatsu",
    vietnamese: "Phức tạp",
    example: "この機械の使い方は複雑です。",
    example_meaning: "Cách sử dụng máy này rất phức tạp.",
    level: "N3",
    category: "Tính từ"
  },
  {
    id: "n3_7",
    kanji: "期待",
    kana: "きたい",
    romaji: "kitai",
    vietnamese: "Kỳ vọng, Mong đợi",
    example: "両親の期待に応えたいです。",
    example_meaning: "Tôi muốn đáp ứng kỳ vọng của bố mẹ.",
    level: "N3",
    category: "Cảm xúc"
  },
  {
    id: "n3_8",
    kanji: "習慣",
    kana: "しゅうかん",
    romaji: "shuukan",
    vietnamese: "Thói quen, Tập quán",
    example: "早寝早起きは良い習慣です。",
    example_meaning: "Ngủ sớm dậy sớm là một thói quen tốt.",
    level: "N3",
    category: "Chung"
  },
  {
    id: "n3_9",
    kanji: "絶対",
    kana: "ぜったい",
    romaji: "zettai",
    vietnamese: "Tuyệt đối, Chắc chắn",
    example: "約束は絶対に守ります。",
    example_meaning: "Tôi chắc chắn sẽ giữ lời hứa.",
    level: "N3",
    category: "Chung"
  },
  {
    id: "n3_10",
    kanji: "満足",
    kana: "まんぞく",
    romaji: "manzoku",
    vietnamese: "Thỏa mãn, Hài lòng",
    example: "今回の結果には満足しています。",
    example_meaning: "Tôi rất hài lòng với kết quả lần này.",
    level: "N3",
    category: "Cảm xúc"
  },
  {
    id: "n3_11",
    kanji: "開発",
    kana: "かいはつ",
    romaji: "kaihatsu",
    vietnamese: "Phát triển (phần mềm/sản phẩm)",
    example: "新しいソフトウェアを開発しています。",
    example_meaning: "Chúng tôi đang phát triển một phần mềm mới.",
    level: "N3",
    category: "Công việc"
  },
  {
    id: "n3_12",
    kanji: "調査",
    kana: "ちょうさ",
    romaji: "chousa",
    vietnamese: "Điều tra, Khảo sát",
    example: "市場調査の結果を報告します。",
    example_meaning: "Tôi báo cáo kết quả khảo sát thị trường.",
    level: "N3",
    category: "Công việc"
  },
  {
    id: "n3_13",
    kanji: "影響",
    kana: "えいきょう",
    romaji: "eikyou",
    vietnamese: "Ảnh hưởng",
    example: "天候は農作物の収穫に影響します。",
    example_meaning: "Thời tiết ảnh hưởng đến thu hoạch nông sản.",
    level: "N3",
    category: "Chung"
  },
  {
    id: "n3_14",
    kanji: "集中",
    kana: "しゅうちゅう",
    romaji: "shuuchuu",
    vietnamese: "Tập trung",
    example: "勉強に集中することができません。",
    example_meaning: "Tôi không thể tập trung vào việc học.",
    level: "N3",
    category: "Chung"
  },
  {
    id: "n3_15",
    kanji: "回復",
    kana: "かいふく",
    romaji: "kaifuku",
    vietnamese: "Hồi phục",
    example: "病気から早く回復することを祈ります。",
    example_meaning: "Tôi cầu mong bạn nhanh chóng hồi phục khỏi bệnh.",
    level: "N3",
    category: "Chung"
  }
];

// Export to make it available via ES Modules or simple script tag
if (typeof module !== 'undefined' && module.exports) {
  module.exports = vocabularyData;
}
