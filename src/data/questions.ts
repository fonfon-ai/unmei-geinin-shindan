import type { Question } from '../types';

// ============================================================================
// 質問セット
// 設計方針:
//  - お笑いの知識・好みを直接聞かない。誰でも答えられる生活習慣/性格を聞く。
//  - 1つの回答が結果を過度に左右しないよう、各質問は複数の潜在特性に分散して寄与。
//  - 年齢・性別・飲酒・喫煙・MBTI は任意回答。飲酒/喫煙は良し悪しを評価しない。
//  - 年齢・性別は採点重み0(推薦に直接使わない)。MBTIは弱い多軸ヒントのみ。
//  - すべての質問に「わからない/回答しない」等の中立選択肢を用意。
// ============================================================================

export const QUESTIONS: Question[] = [
  {
    id: 'holiday',
    title: '理想の休日の過ごし方に近いのは?',
    category: 'lifestyle',
    options: [
      {
        id: 'out_active',
        label: '外に出て、人と会ったりイベントに行く',
        weights: { extroversion: 2, sociability: 1.5, stimulation: 1, physicalVisual: 0.5 },
      },
      {
        id: 'out_solo',
        label: '一人でふらっと出かけて散歩や買い物',
        weights: { extroversion: 0.5, novelty: 1, attentionSpan: 0.5 },
      },
      {
        id: 'home_relax',
        label: '家でのんびり、動画や本でくつろぐ',
        weights: { extroversion: -1.5, attentionSpan: 1, stimulation: -1 },
      },
      {
        id: 'home_hobby',
        label: '家で趣味や作業に没頭する',
        weights: { extroversion: -1, analytical: 1, attentionSpan: 1.5 },
      },
    ],
  },
  {
    id: 'food',
    title: '食べるものを選ぶとき、どちらが近い?',
    category: 'lifestyle',
    options: [
      {
        id: 'adventurous',
        label: '見たことのない料理や刺激的な味に挑戦したい',
        weights: { novelty: 2, stimulation: 1.5 },
      },
      {
        id: 'balanced',
        label: '新しいものも好きだけど、外れは避けたい',
        weights: { novelty: 0.5, planning: 0.5 },
      },
      {
        id: 'comfort',
        label: '安心できる定番の味に落ち着く',
        weights: { novelty: -1.5, stimulation: -1, tempoPreference: -0.5 },
      },
      { id: 'na', label: 'とくにこだわらない', weights: {}, neutral: true },
    ],
  },
  {
    id: 'eatout',
    title: '外食の頻度は?',
    category: 'lifestyle',
    options: [
      {
        id: 'often',
        label: 'よく行く(週の半分以上)',
        weights: { sociability: 1, extroversion: 1, novelty: 0.5 },
      },
      {
        id: 'sometimes',
        label: 'ときどき行く',
        weights: { sociability: 0.5 },
      },
      {
        id: 'rarely',
        label: 'ほとんど自炊・家で食べる',
        weights: { sociability: -1, planning: 0.5, attentionSpan: 0.5 },
      },
      { id: 'na', label: '回答しない', weights: {}, neutral: true },
    ],
  },
  {
    id: 'cleaning',
    title: '部屋の掃除・片付けは?',
    category: 'lifestyle',
    options: [
      {
        id: 'routine',
        label: '決めた頻度でこまめに片付ける',
        weights: { planning: 2, analytical: 1 },
      },
      {
        id: 'when_dirty',
        label: '気になったタイミングでやる',
        weights: { planning: 0.5 },
      },
      {
        id: 'burst',
        label: '思い立って一気にやる(ムラがある)',
        weights: { planning: -1.5, stimulation: 0.5, novelty: 0.5 },
      },
      { id: 'na', label: '回答しない', weights: {}, neutral: true },
    ],
  },
  {
    id: 'punctual',
    title: '待ち合わせには、いつも?',
    category: 'personality',
    options: [
      {
        id: 'early',
        label: '余裕をもって早めに着く',
        weights: { planning: 2, tensionTolerance: -0.5 },
      },
      {
        id: 'ontime',
        label: 'だいたい時間ちょうど',
        weights: { planning: 0.5 },
      },
      {
        id: 'late',
        label: 'ギリギリか、少し遅れがち',
        weights: { planning: -1.5, tensionTolerance: 1, tempoPreference: 0.5 },
      },
      { id: 'na', label: '待ち合わせをあまりしない', weights: {}, neutral: true },
    ],
  },
  {
    id: 'reply',
    title: 'LINEやメールの返信は?',
    category: 'personality',
    options: [
      {
        id: 'fast',
        label: 'すぐ返す。既読スルーは落ち着かない',
        weights: { relationshipInterest: 1.5, tempoPreference: 1, planning: 0.5 },
      },
      {
        id: 'moderate',
        label: '気づいたら返す、くらいのペース',
        weights: { relationshipInterest: 0.5 },
      },
      {
        id: 'slow',
        label: 'じっくり考えてから、または後回しにしがち',
        weights: { analytical: 1, tempoPreference: -1, extroversion: -0.5, verbalInterest: 0.5 },
      },
      { id: 'na', label: '人による', weights: {}, neutral: true },
    ],
  },
  {
    id: 'travel',
    title: '旅行に行くとき、あなたは?',
    category: 'personality',
    options: [
      {
        id: 'planner',
        label: '事前にしっかり計画を立てる',
        weights: { planning: 2, analytical: 0.5 },
      },
      {
        id: 'loose',
        label: 'ざっくり決めて、あとは流れで',
        weights: { planning: -0.5, novelty: 0.5, tensionTolerance: 0.5 },
      },
      {
        id: 'improv',
        label: 'ノリと勢い。その場の思いつきで動く',
        weights: { planning: -1.5, novelty: 1.5, stimulation: 1, physicalVisual: 0.5 },
      },
      { id: 'na', label: 'あまり旅行はしない', weights: {}, neutral: true },
    ],
  },
  {
    id: 'crowd',
    title: '大人数の集まりでは、どう振る舞うことが多い?',
    category: 'social',
    options: [
      {
        id: 'center',
        label: '場を回したり、話の中心にいることが多い',
        weights: { extroversion: 2, sociability: 1.5, tensionTolerance: 1, physicalVisual: 0.5 },
      },
      {
        id: 'connector',
        label: '聞き役や、みんなをつなぐ役に回る',
        weights: { relationshipInterest: 1.5, analytical: -0.5, sociability: 0.5 },
      },
      {
        id: 'observer',
        label: '少し引いて、様子を見ながら楽しむ',
        weights: { extroversion: -1, analytical: 1, tensionTolerance: -0.5 },
      },
      {
        id: 'tired',
        label: '正直、大人数は少し疲れる',
        weights: { extroversion: -1.5, sociability: -1.5 },
      },
    ],
  },
  {
    id: 'advice',
    title: '友人に悩みを相談されたら?',
    category: 'social',
    options: [
      {
        id: 'solve',
        label: 'まず原因を整理して、解決策を一緒に考える',
        weights: { analytical: 2, verbalInterest: 0.5 },
      },
      {
        id: 'empathize',
        label: 'とにかく気持ちに寄り添って聞く',
        weights: { analytical: -1.5, relationshipInterest: 1.5 },
      },
      {
        id: 'lighten',
        label: '軽く笑いに変えて、空気を和ませる',
        weights: { extroversion: 1, tensionTolerance: 1, relationshipInterest: 0.5 },
      },
      { id: 'na', label: '相手による', weights: {}, neutral: true },
    ],
  },
  {
    id: 'newshop',
    title: '気になる新しいお店を見つけたら?',
    category: 'personality',
    options: [
      {
        id: 'try_now',
        label: 'すぐ入ってみる',
        weights: { novelty: 2, stimulation: 1, extroversion: 0.5 },
      },
      {
        id: 'research',
        label: '口コミを調べてから決める',
        weights: { analytical: 1.5, planning: 1 },
      },
      {
        id: 'stick',
        label: '結局いつもの馴染みの店を選びがち',
        weights: { novelty: -1.5, stimulation: -0.5 },
      },
      { id: 'na', label: 'その時の気分', weights: {}, neutral: true },
    ],
  },
  {
    id: 'alone',
    title: '一人で過ごす時間について、近いのは?',
    category: 'personality',
    options: [
      {
        id: 'love',
        label: '一人時間は大好き。むしろ必要',
        weights: { extroversion: -1.5, attentionSpan: 1 },
      },
      {
        id: 'ok',
        label: '一人も人といるのも、どちらもいい',
        weights: {},
        neutral: true,
      },
      {
        id: 'prefer_people',
        label: 'できれば誰かと一緒にいたい',
        weights: { extroversion: 1.5, sociability: 1.5, relationshipInterest: 1 },
      },
    ],
  },
  {
    id: 'conversation',
    title: '会話や雑談で、思わず引き込まれるのは?',
    category: 'personality',
    options: [
      {
        id: 'wordplay',
        label: '言葉の選び方や、話の組み立てが巧みな話',
        weights: { verbalInterest: 1.5, analytical: 1 },
      },
      {
        id: 'story',
        label: '身振り手振りたっぷりの、勢いのある話',
        weights: { physicalVisual: 1.5, tempoPreference: 1, extroversion: 0.5 },
      },
      {
        id: 'human',
        label: '人間関係や「あるある」のリアルな話',
        weights: { relationshipInterest: 1.5, analytical: -0.5 },
      },
      {
        id: 'weird',
        label: '予想がつかない、変わった発想の話',
        weights: { novelty: 1.5, verbalInterest: 0.5, stimulation: 0.5 },
      },
    ],
  },
  {
    id: 'watchtime',
    title: '動画を見るとき、確保しやすい時間は?',
    category: 'media',
    options: [
      {
        id: 'short',
        label: '数分のスキマ時間が中心',
        weights: { attentionSpan: -1.5, tempoPreference: 1 },
      },
      {
        id: 'medium',
        label: '10〜20分くらいならまとめて見られる',
        weights: { attentionSpan: 0.5 },
      },
      {
        id: 'long',
        label: '30分以上、じっくり見るのも苦にならない',
        weights: { attentionSpan: 2, tempoPreference: -0.5, verbalInterest: 0.5 },
      },
      { id: 'na', label: '決まっていない', weights: {}, neutral: true },
    ],
  },
  {
    id: 'mood',
    title: '最近の気分や疲れ具合は?',
    category: 'media',
    options: [
      {
        id: 'energetic',
        label: '元気。刺激やテンションの高いものが欲しい',
        weights: { stimulation: 1.5, tempoPreference: 1, physicalVisual: 0.5 },
      },
      {
        id: 'neutral',
        label: 'ふつう。ほどよく楽しみたい',
        weights: {},
        neutral: true,
      },
      {
        id: 'tired',
        label: '少し疲れ気味。ほっとできるものがいい',
        weights: { stimulation: -1.5, tempoPreference: -1, tensionTolerance: -1 },
      },
      {
        id: 'numb',
        label: '何も考えずぼーっと笑いたい',
        weights: { attentionSpan: -1, analytical: -1 },
      },
    ],
  },
  // --- 任意回答(採点への影響は限定的) ---
  {
    id: 'drink',
    title: '1週間に飲むお酒の量は?',
    help: 'この質問は任意です。回答は良し悪しの評価には使いません。',
    category: 'lifestyle',
    optional: true,
    options: [
      {
        id: 'none',
        label: '飲まない',
        weights: {},
        neutral: true,
      },
      {
        id: 'light',
        label: 'ときどき少し',
        weights: { sociability: 0.3 },
      },
      {
        id: 'social',
        label: '人と会うときによく飲む',
        weights: { sociability: 0.7, extroversion: 0.5 },
      },
      {
        id: 'na',
        label: '回答しない',
        weights: {},
        neutral: true,
      },
    ],
  },
  {
    id: 'smoke',
    title: 'タバコは吸いますか?',
    help: 'この質問は任意です。回答は良し悪しの評価には使いません。未成年の方は「年齢的に該当しない」を選んでください。',
    category: 'lifestyle',
    optional: true,
    options: [
      { id: 'no', label: '吸わない', weights: {}, neutral: true },
      { id: 'yes', label: '吸う', weights: { tensionTolerance: 0.3 } },
      {
        id: 'underage',
        label: '年齢的に該当しない',
        weights: {},
        neutral: true,
      },
      { id: 'na', label: '回答しない', weights: {}, neutral: true },
    ],
  },
  {
    id: 'mbti',
    title: 'MBTI(16タイプ性格診断)を知っていれば教えてください',
    help: '任意です。MBTIだけで結果は決まりません。他の回答と合わせた弱いヒントとして使います。',
    category: 'demographic',
    optional: true,
    options: [
      {
        id: 'e_intuitive',
        label: 'E(外向)寄り・ひらめき重視',
        weights: { extroversion: 1, novelty: 0.8 },
      },
      {
        id: 'e_practical',
        label: 'E(外向)寄り・現実的',
        weights: { extroversion: 1, planning: 0.6 },
      },
      {
        id: 'i_intuitive',
        label: 'I(内向)寄り・ひらめき重視',
        weights: { extroversion: -1, novelty: 0.8, analytical: 0.5 },
      },
      {
        id: 'i_practical',
        label: 'I(内向)寄り・現実的',
        weights: { extroversion: -1, planning: 0.6 },
      },
      { id: 'unknown', label: '知らない / 回答しない', weights: {}, neutral: true },
    ],
  },
  {
    id: 'age',
    title: '年齢層を教えてください',
    help: '任意です。年齢は推薦理由には使いません(統計・将来の改善のためだけの任意項目)。',
    category: 'demographic',
    optional: true,
    options: [
      // 採点重み0: 年齢で結果を決めない。
      { id: 'teens', label: '10代', weights: {}, neutral: true },
      { id: 'twenties', label: '20代', weights: {}, neutral: true },
      { id: 'thirties_forties', label: '30〜40代', weights: {}, neutral: true },
      { id: 'fifties_plus', label: '50代以上', weights: {}, neutral: true },
      { id: 'na', label: '回答しない', weights: {}, neutral: true },
    ],
  },
  {
    id: 'gender',
    title: '性別を教えてください',
    help: '任意です。性別は推薦理由には使いません。',
    category: 'demographic',
    optional: true,
    options: [
      // 採点重み0: 性別で結果を決めない。
      { id: 'female', label: '女性', weights: {}, neutral: true },
      { id: 'male', label: '男性', weights: {}, neutral: true },
      { id: 'other', label: 'その他', weights: {}, neutral: true },
      { id: 'na', label: '回答しない', weights: {}, neutral: true },
    ],
  },
];

/** 採点に実質的に寄与する(重みを持つ選択肢がある)質問 */
export const SCORING_QUESTION_IDS = QUESTIONS.filter((q) =>
  q.options.some((o) => Object.keys(o.weights).length > 0),
).map((q) => q.id);
