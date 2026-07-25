import type { Channel } from '../types';

// ============================================================================
// 公式YouTubeチャンネル(調査・確認済み / 確認日 2026-07-21)
// いずれも本文取得でチャンネル名と運営者(公式)を確認したもの。
// 初心者が「最初に見る公式動画」の供給源として使う。
// ============================================================================
export const RAW_CHANNELS: Channel[] = [
  {
    id: 'yoshimoto-kogyo-channel', name: '吉本興業チャンネル', owner: '吉本興業',
    url: 'https://www.youtube.com/@yoshimotokogyo', goodFor: '所属芸人のネタや企画を幅広く視聴できる',
    relatedFormats: ['ネタ番組', '企画', 'トーク番組'], sourceUrls: ['https://www.youtube.com/@yoshimotokogyo'], confidence: 'high',
  },
  {
    id: 'fany-studio-channel', name: 'FANYStudioチャンネル公式', owner: 'よしもと／FANY',
    url: 'https://www.youtube.com/@fany8113', goodFor: 'よしもとのオリジナル番組をほぼ毎日配信',
    relatedFormats: ['ネタ番組', '企画', 'トーク番組'], sourceUrls: ['https://www.youtube.com/@fany8113'], confidence: 'high',
  },
  {
    id: 'shochiku-geino-channel', name: '松竹芸能 公式チャンネル', owner: '松竹芸能',
    url: 'https://www.youtube.com/@shochikugeino', goodFor: '松竹芸能所属芸人のネタや独自企画を配信',
    relatedFormats: ['ネタ番組', '企画', 'トーク番組'], sourceUrls: ['https://www.youtube.com/@shochikugeino'], confidence: 'high',
  },
  {
    id: 'watanabe-owarai-channel', name: 'ワタナベお笑い公式チャンネル', owner: 'ワタナベエンターテインメント',
    url: 'https://www.youtube.com/@owarai_watanabe', goodFor: 'ワタナベ所属芸人のネタ動画を配信',
    relatedFormats: ['ネタ番組', '企画'], sourceUrls: ['https://www.youtube.com/@owarai_watanabe'], confidence: 'high',
  },
  {
    id: 'horipro-com-channel', name: 'ホリプロコムお笑いチャンネル', owner: 'ホリプロコム',
    url: 'https://www.youtube.com/@HORIPROCOM', goodFor: 'HORIPRO COM LIVEのネタ動画を配信',
    relatedFormats: ['ネタ番組', '企画'], sourceUrls: ['https://www.youtube.com/@HORIPROCOM'], confidence: 'high',
  },
  {
    id: 'm1-grand-prix-channel', name: 'M-1グランプリ 公式', owner: 'M-1グランプリ事務局（吉本興業・朝日放送）',
    url: 'https://www.youtube.com/@m1grandprix', goodFor: '漫才日本一を決める大会の名場面を視聴',
    relatedFormats: ['コンテスト', 'ネタ番組'], sourceUrls: ['https://www.youtube.com/@m1grandprix'], confidence: 'high',
  },
  {
    id: 'king-of-conte-channel', name: 'キングオブコント 公式', owner: 'TBS',
    url: 'https://www.youtube.com/@KINGOFCONTE', goodFor: 'コント日本一を決める大会の映像を視聴',
    relatedFormats: ['コンテスト', 'ネタ番組'], sourceUrls: ['https://www.youtube.com/@KINGOFCONTE'], confidence: 'high',
  },
  {
    id: 'r1-grand-prix-channel', name: 'R-1グランプリ 公式', owner: 'R-1グランプリ事務局（吉本興業・関西テレビ）',
    url: 'https://www.youtube.com/@r-1641', goodFor: 'ピン芸日本一を決める大会のネタを視聴',
    relatedFormats: ['コンテスト', 'ネタ番組'], sourceUrls: ['https://www.youtube.com/@r-1641'], confidence: 'high',
  },
  {
    id: 'the-second-channel', name: '【公式】THE SECOND 〜漫才トーナメント〜', owner: 'フジテレビ',
    url: 'https://www.youtube.com/@thesecond_cx', goodFor: '結成16年以上の漫才師の対戦を視聴できる',
    relatedFormats: ['コンテスト', 'ネタ番組'], sourceUrls: ['https://www.youtube.com/@thesecond_cx'], confidence: 'high',
  },
  {
    id: 'abema-variety', name: 'ABEMA バラエティ【公式】', owner: 'ABEMA',
    url: 'https://www.youtube.com/@Variety_ABEMA', goodFor: 'ABEMAのお笑い・バラエティ番組の映像',
    relatedFormats: ['企画', 'トーク番組', 'ネタ番組'], sourceUrls: ['https://www.youtube.com/@Variety_ABEMA'], confidence: 'high',
  },
  {
    id: 'contents-league', name: 'お笑いネタ動画 コンテンツリーグ', owner: 'コンテンツリーグ（吉本興業）',
    url: 'https://www.youtube.com/@ContentsLeague', goodFor: '多数の芸人のネタを無料でまとめて視聴できる',
    relatedFormats: ['ネタ番組'], sourceUrls: ['https://www.youtube.com/@ContentsLeague'], confidence: 'high',
  },
  {
    id: 'nobrock-tv', name: '佐久間宣行のNOBROCK TV', owner: '佐久間宣行',
    url: 'https://www.youtube.com/@NOBROCKTV', goodFor: '芸人の企画・トークで今の笑いを幅広く知れる',
    relatedFormats: ['企画', 'トーク番組', 'コンテスト'], sourceUrls: ['https://www.youtube.com/@NOBROCKTV'], confidence: 'high',
  },
  {
    id: 'kamaitachi-channel', name: 'かまいたちチャンネル', owner: 'かまいたち（吉本興業）',
    url: 'https://www.youtube.com/@kamaitachi.channel', goodFor: '有名コンビの雑談・企画で気軽に笑いへ入門',
    relatedFormats: ['トーク番組', '企画'], sourceUrls: ['https://www.youtube.com/@kamaitachi.channel'], confidence: 'high',
  },
  {
    id: 'shimofuri-tube', name: 'しもふりチューブ', owner: '霜降り明星（吉本興業）',
    url: 'https://www.youtube.com/@shimofuritube', goodFor: 'M-1王者の毎日投稿企画をテンポ良く楽しめる',
    relatedFormats: ['トーク番組', '企画'], sourceUrls: ['https://www.youtube.com/@shimofuritube'], confidence: 'high',
  },
  {
    id: 'mitorizu-discovery', name: '見取り図ディスカバリーチャンネル', owner: '見取り図（吉本興業）',
    url: 'https://www.youtube.com/@mtrz_discovery', goodFor: '人気コンビの企画・ロケで親しみやすく笑える',
    relatedFormats: ['企画', 'ロケ番組', 'トーク番組'], sourceUrls: ['https://www.youtube.com/@mtrz_discovery'], confidence: 'high',
  },
  {
    id: 'kukikaidan-channel', name: '空気階段チャンネル', owner: '空気階段（吉本興業）',
    url: 'https://www.youtube.com/@kukikaidan_channel', goodFor: 'キングオブコント王者のコントを無料で楽しめる',
    relatedFormats: ['ネタ番組', 'トーク番組'], sourceUrls: ['https://www.youtube.com/@kukikaidan_channel'], confidence: 'high',
  },
  {
    id: 'laland-lalatune', name: 'ララチューン【ラランド公式】', owner: 'ラランド',
    url: 'https://www.youtube.com/@lalatuune', goodFor: '男女コンビの企画・トークで気軽に笑える',
    relatedFormats: ['企画', 'トーク番組'], sourceUrls: ['https://www.youtube.com/@lalatuune'], confidence: 'high',
  },
  {
    id: 'exit-rintaro', name: 'EXITりんたろー。のYouTubeチャンネル', owner: 'EXIT りんたろー。（吉本興業）',
    url: 'https://www.youtube.com/@rinpani', goodFor: '企画・トークで気軽に今どきの笑いに触れられる',
    relatedFormats: ['企画', 'トーク番組'], sourceUrls: ['https://www.youtube.com/@rinpani'], confidence: 'high',
  },
  {
    id: 'mitorizu-jan', name: '見取り図じゃん【公式】', owner: 'テレビ朝日「見取り図じゃん」',
    url: 'https://www.youtube.com/@mitorizujan', goodFor: '見取り図MCの地上波番組を無料で楽しめる',
    relatedFormats: ['トーク番組', '企画'], sourceUrls: ['https://www.youtube.com/@mitorizujan'], confidence: 'high',
  },
  {
    id: 'fuji-tv-official', name: 'フジテレビ公式', owner: 'フジテレビ',
    url: 'https://www.youtube.com/@fujitv', goodFor: 'フジのバラエティ・お笑い番組の映像を視聴',
    relatedFormats: ['企画', 'トーク番組', 'ネタ番組'], sourceUrls: ['https://www.youtube.com/@fujitv'], confidence: 'medium',
  },
  {
    id: 'rakugo-kyokai', name: '一般社団法人落語協会', owner: '一般社団法人落語協会',
    url: 'https://www.youtube.com/channel/UCUc7tai_P55ZPGl1m2RcwOg', goodFor: '本物の落語を無料で観て伝統話芸に入門できる',
    relatedFormats: ['落語'], sourceUrls: ['https://www.youtube.com/channel/UCUc7tai_P55ZPGl1m2RcwOg'], confidence: 'high',
  },
  {
    id: 'rakugo-geijutsu-kyokai', name: '公益社団法人 落語芸術協会', owner: '公益社団法人落語芸術協会（芸協）',
    url: 'https://www.youtube.com/channel/UCTf61506mv_XhKYWZE2jE4A', goodFor: '寄席の落語・演芸を無料で視聴でき入門向き',
    relatedFormats: ['落語'], sourceUrls: ['https://www.youtube.com/channel/UCTf61506mv_XhKYWZE2jE4A'], confidence: 'high',
  },
  {
    id: 'asakusa-engei-hall', name: '浅草演芸ホールチャンネル', owner: '浅草演芸ホール',
    url: 'https://www.youtube.com/channel/UCXDWPLeQXfXa9Q82vJheo4A', goodFor: '老舗寄席の演芸情報で寄席文化に触れられる',
    relatedFormats: ['落語'], sourceUrls: ['https://www.youtube.com/channel/UCXDWPLeQXfXa9Q82vJheo4A'], confidence: 'high',
  },
  {
    id: 'tokyo03-official', name: '東京03 Official YouTube Channel', owner: '東京03（プロダクション人力舎）',
    url: 'https://www.youtube.com/channel/UConIcs8o0z5vYTamGtq-Lsw', goodFor: '珠玉のコントを字幕付きで毎月無料公開',
    relatedFormats: ['ネタ番組'], sourceUrls: ['https://www.youtube.com/channel/UConIcs8o0z5vYTamGtq-Lsw'], confidence: 'high',
  },
  {
    id: 'pekopa-channel', name: 'ぺこぱチャンネル', owner: 'ぺこぱ（サンミュージック）',
    url: 'https://www.youtube.com/channel/UCcsNOvN9dLCLXv4phWvcIvg', goodFor: '人気コンビの企画動画で気軽に笑える',
    relatedFormats: ['企画', 'トーク番組'], sourceUrls: ['https://www.youtube.com/channel/UCcsNOvN9dLCLXv4phWvcIvg'], confidence: 'high',
  },
];
