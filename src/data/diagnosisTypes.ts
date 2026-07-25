import type { DiagnosisType, HumorAxis, HumorVector } from '../types';

// 補助: 部分指定から完全な HumorVector を作る(未指定は 0.2)
function hv(partial: Partial<Record<HumorAxis, number>>): HumorVector {
  const base: HumorVector = {
    incongruity: 0.2,
    safety: 0.2,
    edge: 0.2,
    tensionRelease: 0.2,
    relational: 0.2,
    physical: 0.2,
    verbal: 0.2,
    tempo: 0.2,
    worldview: 0.2,
  };
  return { ...base, ...partial };
}

// ============================================================================
// 診断タイプ(12種)
// 各タイプは「笑い嗜好空間」上の中心ベクトル(centroid)を持ち、
// ユーザーの嗜好ベクトルに最も近いタイプを決定論的に選ぶ。
// 名称・コピーは独自。参考サイトの表現は一切流用しない。
// ============================================================================
export const DIAGNOSIS_TYPES: DiagnosisType[] = [
  {
    id: 'royal-safe',
    name: '王道ど真ん中タイプ',
    catchphrase: 'むずかしいことは抜き。まっすぐ笑いたい。',
    persona:
      'あなたは、奇をてらうより「分かりやすくて気持ちいい」ものに素直に反応するタイプ。周りの人と一緒に、安心して声を出して笑える時間を大切にします。',
    humorAffinity:
      '誰が見ても伝わる王道の会話劇や、間の良い掛け合いと相性が良さそう。まずは鉄板の一本から入るのが近道です。',
    accent: '#e8963a',
    centroid: hv({ safety: 0.9, relational: 0.55, verbal: 0.45, tempo: 0.45 }),
  },
  {
    id: 'surprise-hunter',
    name: '意外性ハンタータイプ',
    catchphrase: '「そう来たか」に、いちばん弱い。',
    persona:
      'あなたは、予想を気持ちよく裏切られる瞬間にワクワクするタイプ。ありきたりより、視点のズレや発想の飛躍に惹かれます。',
    humorAffinity:
      '不意打ちの展開や、常識をずらすボケと好相性。仕掛けの効いたネタほど刺さりやすいでしょう。',
    accent: '#3aa8c',
    centroid: hv({ incongruity: 0.9, worldview: 0.5, verbal: 0.5 }),
  },
  {
    id: 'spice-edge',
    name: 'ピリ辛スパイスタイプ',
    catchphrase: 'ちょっと毒っ気があるくらいが、ちょうどいい。',
    persona:
      'あなたは、キレのある視点やちょっとした毒っ気にスカッとするタイプ。優等生的すぎる笑いより、鋭さや本音が効いた笑いを好みます。',
    humorAffinity:
      '切れ味のあるツッコミや、社会や人間をチクリと刺す笑いと相性良し。ただし初心者は口当たりのマイルドな入口から。',
    accent: '#c8503f',
    centroid: hv({ edge: 0.9, tempo: 0.5, verbal: 0.45, incongruity: 0.35 }),
  },
  {
    id: 'tension-release',
    name: '緊張と緩和マニアタイプ',
    catchphrase: '「うわ、どうなるの」からの解放が快感。',
    persona:
      'あなたは、ハラハラする空気や気まずさが、一気にほどける瞬間に強い快感を覚えるタイプ。安全なだけの笑いには少し物足りなさを感じます。',
    humorAffinity:
      '張り詰めた間や、危うさを笑いに変える芸と好相性。振り幅の大きいネタほど楽しめます。',
    accent: '#7a5bb0',
    centroid: hv({ tensionRelease: 0.9, incongruity: 0.45, edge: 0.45, verbal: 0.35 }),
  },
  {
    id: 'human-observer',
    name: '人間観察しみじみタイプ',
    catchphrase: '「あるある」に、うんうん頷いてしまう。',
    persona:
      'あなたは、人と人の関係や日常のリアルににじむおかしみに反応するタイプ。派手さより、共感できる細やかさに心を動かされます。',
    humorAffinity:
      '日常観察や、二人の関係性がにじむ会話劇と好相性。じんわり効いてくる笑いが似合います。',
    accent: '#4f8fca',
    centroid: hv({ relational: 0.9, safety: 0.5, verbal: 0.45 }),
  },
  {
    id: 'physical-blast',
    name: '体で笑う爆発タイプ',
    catchphrase: '理屈より先に、体が笑ってる。',
    persona:
      'あなたは、考える前に思わず吹き出す、勢いとリアクションの笑いが好きなタイプ。動きや表情の面白さがダイレクトに刺さります。',
    humorAffinity:
      '体を張った芸や、大きなリアクション、視覚的なインパクトと好相性。言葉が分からなくても楽しめる笑いが得意です。',
    accent: '#e0684f',
    centroid: hv({ physical: 0.9, tempo: 0.7, edge: 0.35 }),
  },
  {
    id: 'word-maze',
    name: '言葉の迷宮タイプ',
    catchphrase: '巧みな言い回しに、ゾクッとする。',
    persona:
      'あなたは、言葉選びや構成の妙にこそ面白さを感じるタイプ。じっくり味わえる、計算された笑いに惹かれます。',
    humorAffinity:
      '言葉遊びや緻密に組み立てられたネタ、構造で笑わせる芸と好相性。落語の入口としても好適です。',
    accent: '#2f7d92',
    centroid: hv({ verbal: 0.9, worldview: 0.5, incongruity: 0.4 }),
  },
  {
    id: 'hi-tempo',
    name: 'ハイテンポ中毒タイプ',
    catchphrase: '間を置かれると、ちょっと退屈。',
    persona:
      'あなたは、スピード感とたたみかけるリズムに心地よさを感じるタイプ。テンポの良い掛け合いに乗せられて笑ってしまいます。',
    humorAffinity:
      '手数の多いしゃべくりや、勢いで押し切るネタと好相性。短い動画でもサクッと楽しめます。',
    accent: '#d98a2b',
    centroid: hv({ tempo: 0.9, physical: 0.5, edge: 0.4, incongruity: 0.35 }),
  },
  {
    id: 'surreal-dweller',
    name: 'シュール世界の住人タイプ',
    catchphrase: '意味が分からないのに、なぜか笑える。',
    persona:
      'あなたは、独特の世界観や不条理さに強く惹かれるタイプ。説明のつかない可笑しさを、むしろ心地よく感じます。',
    humorAffinity:
      '独自の世界観を持つコントや、ナンセンスで不条理な笑いと好相性。人を選ぶけれど、ハマると抜けられません。',
    accent: '#8a6ab0',
    centroid: hv({ worldview: 0.9, incongruity: 0.6, verbal: 0.4 }),
  },
  {
    id: 'connoisseur-slow',
    name: 'じっくり玄人タイプ',
    catchphrase: '腰を据えて、たっぷり味わいたい。',
    persona:
      'あなたは、短い刺激より、じっくり世界に浸れる笑いを好むタイプ。語りや間合いの奥行きを楽しめる、味わい派です。',
    humorAffinity:
      '落語や、じっくり聞かせる話芸、世界観の深いネタと好相性。腰を据えて向き合うほど面白くなります。',
    accent: '#9c7b3f',
    centroid: hv({ verbal: 0.8, worldview: 0.6, relational: 0.45, tempo: 0.15 }),
  },
  {
    id: 'warm-healing',
    name: 'ぬくもり癒やしタイプ',
    catchphrase: 'とがった笑いより、ほっとする笑いを。',
    persona:
      'あなたは、笑いに刺激より安心感やあたたかさを求めるタイプ。人柄のにじむ、優しい笑いに癒やされます。',
    humorAffinity:
      '人当たりのやわらかい芸や、ほのぼのした空気の笑いと好相性。疲れているときにこそ効きます。',
    accent: '#5aa86f',
    centroid: hv({ safety: 0.9, relational: 0.6, tempo: 0.3 }),
  },
  {
    id: 'explorer',
    name: '新規開拓チャレンジャータイプ',
    catchphrase: '見たことないものほど、試したい。',
    persona:
      'あなたは、まだ知らない笑いにこそ好奇心が働くタイプ。刺激も意外性も、幅広く受け止められるバランス型の冒険家です。',
    humorAffinity:
      '尖ったネタから変わった世界観まで、振れ幅の大きい笑いを楽しめます。いろいろな芸人を横断して開拓するのが吉。',
    accent: '#b0603f',
    centroid: hv({ incongruity: 0.7, edge: 0.6, worldview: 0.5, tempo: 0.5 }),
  },
];

export const DIAGNOSIS_TYPE_IDS = DIAGNOSIS_TYPES.map((t) => t.id);
