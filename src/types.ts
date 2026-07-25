// ============================================================================
// 運命の芸人診断 — 型定義
// このアプリは実行時にLLM/APIを一切使わず、以下の決定論的データ・ロジックだけで
// 動作する。回答は送信も保存もしない。
// ============================================================================

/** 潜在特性(トレイト)の軸。回答から推定する。値は概ね -1..1 に正規化。 */
export type TraitAxis =
  | 'extroversion' // 内向(-) / 外向(+)
  | 'planning' // 即興(-) / 計画(+)
  | 'stimulation' // 安定志向(-) / 刺激志向(+)
  | 'analytical' // 共感志向(-) / 分析志向(+)
  | 'sociability' // 少人数好み(-) / 社交的(+)
  | 'novelty' // 保守(-) / 新奇性志向(+)
  | 'tensionTolerance' // 気まずさ苦手(-) / 緊張耐性(+)
  | 'verbalInterest' // 言葉・構造への関心(低- / 高+)
  | 'relationshipInterest' // 人間関係への関心(低- / 高+)
  | 'tempoPreference' // ゆっくり(-) / 速い(+)
  | 'attentionSpan' // 短い(-) / じっくり(+)
  | 'physicalVisual'; // 視覚・身体表現への親和(低- / 高+)

export const TRAIT_AXES: TraitAxis[] = [
  'extroversion',
  'planning',
  'stimulation',
  'analytical',
  'sociability',
  'novelty',
  'tensionTolerance',
  'verbalInterest',
  'relationshipInterest',
  'tempoPreference',
  'attentionSpan',
  'physicalVisual',
];

/** 笑いの特徴軸。ユーザー嗜好と候補の双方をこの空間で表現し類似度を測る。値は 0..1。 */
export type HumorAxis =
  | 'incongruity' // 不一致・意外性
  | 'safety' // 安心感・安全性
  | 'edge' // 毒・いじり・優位性
  | 'tensionRelease' // 緊張と解放
  | 'relational' // 協調性・関係性
  | 'physical' // 身体性・リアクション・視覚
  | 'verbal' // 言葉中心・構造・知的
  | 'tempo' // テンポ(速さ)
  | 'worldview'; // 世界観・シュール・ナンセンス

export const HUMOR_AXES: HumorAxis[] = [
  'incongruity',
  'safety',
  'edge',
  'tensionRelease',
  'relational',
  'physical',
  'verbal',
  'tempo',
  'worldview',
];

export type TraitVector = Record<TraitAxis, number>;
export type HumorVector = Record<HumorAxis, number>;

/** 質問の選択肢 */
export interface QuestionOption {
  id: string;
  label: string;
  /** 回答が潜在特性に与える重み(-2..2 程度)。1問1軸に偏らせない。 */
  weights: Partial<Record<TraitAxis, number>>;
  /** 「わからない/回答しない/該当しない」など、採点に寄与しない中立選択肢 */
  neutral?: boolean;
}

export type QuestionCategory =
  | 'lifestyle'
  | 'personality'
  | 'social'
  | 'media'
  | 'demographic';

export interface Question {
  id: string;
  /** 見出し(短い) */
  title: string;
  /** 補足(任意) */
  help?: string;
  category: QuestionCategory;
  /** 任意回答か(スキップ可能)。年齢・性別・飲酒・喫煙・MBTIは true。 */
  optional?: boolean;
  options: QuestionOption[];
}

/** ユーザーの回答。key=questionId, value=optionId。未回答は欠落 or null。 */
export type Answers = Record<string, string | null | undefined>;

// ---------------------------------------------------------------------------
// カタログ(推薦候補)
// ---------------------------------------------------------------------------

export type EntityCategory =
  | 'comedian_duo'
  | 'comedian_group'
  | 'comedian_solo'
  | 'rakugo';

export type Era = 'showa' | 'heisei_early' | 'heisei_late' | 'reiwa' | 'timeless';

export type ActiveStatus = 'active' | 'hiatus' | 'disbanded' | 'deceased';

export type Confidence = 'high' | 'medium' | 'low';

export interface OfficialVideoLink {
  title: string;
  url: string;
  source: string;
}

/** 芸人・落語家などの推薦候補 */
export interface Entity {
  id: string;
  name: string;
  reading: string;
  category: EntityCategory;
  era: Era;
  activeStatus: ActiveStatus;
  agency?: string;
  /** 落語のみ: 江戸/上方 */
  school?: '江戸' | '上方';
  /** 落語のみ: 古典/新作/滑稽噺/人情噺 */
  repertoireType?: string[];
  /** 落語のみ: 初心者向け演目 */
  recommendedEntryPiece?: string | null;
  primaryFormats: string[];
  styleTags: string[];
  oneLiner: string;
  /** 1..5 初心者の見やすさ */
  beginnerAccessibility: number;
  /** 1..5 刺激の強さ */
  intensity: number;
  /** 1..5 テンポ */
  pace: number;
  /** -2..2 言葉中心(-) 〜 視覚/身体中心(+) */
  verbalVisualBalance: number;
  /** 1..5 前提知識の必要度 */
  prerequisiteKnowledge: number;
  /** タグから導出した笑い特徴ベクトル(0..1) */
  humor: HumorVector;
  /** おすすめの気分 */
  recommendedMood: string[];
  /** 目安視聴時間(分) */
  recommendedDuration: number;
  recommendationReason: string;
  officialWebsite: string | null;
  officialVideoLinks: OfficialVideoLink[];
  sourceUrls: string[];
  lastVerifiedDate: string;
  confidence: Confidence;
}

export type ProgramStatus = '放送中' | '配信中' | '過去番組' | '年次開催';

export interface Program {
  id: string;
  name: string;
  reading: string;
  programType: string[];
  broadcaster: string;
  status: ProgramStatus;
  beginnerAccessibility: number;
  styleTags: string[];
  humor: HumorVector;
  oneLiner: string;
  officialWebsite: string | null;
  officialVideoLinks: OfficialVideoLink[];
  sourceUrls: string[];
  statusVerifiedDate: string;
  confidence: Confidence;
}

export interface Channel {
  id: string;
  name: string;
  owner: string;
  url: string;
  goodFor: string;
  relatedFormats: string[];
  sourceUrls: string[];
  confidence: Confidence;
}

// ---------------------------------------------------------------------------
// 診断タイプ・結果
// ---------------------------------------------------------------------------

export interface DiagnosisType {
  id: string;
  name: string;
  catchphrase: string;
  /** 人物像・笑いとの相性の説明テンプレート */
  persona: string;
  humorAffinity: string;
  accent: string; // アクセントカラー(CSS変数キー用)
  /** タイプ判定の中心ベクトル(笑い嗜好空間) */
  centroid: HumorVector;
}

export interface ScoredEntity {
  entity: Entity;
  score: number;
}

export interface RecommendationReasonView {
  entity: Entity;
  score: number;
  /** 0..100 の相性表示 */
  affinity: number;
  reason: string;
}

export interface DiagnosisResult {
  type: DiagnosisType;
  humorPreference: HumorVector;
  traits: TraitVector;
  /** 本命の運命の芸人(2-3組) */
  destined: RecommendationReasonView[];
  /** 初心者向け(1-3) */
  beginner: RecommendationReasonView[];
  /** 意外な推薦(1) */
  surprise: RecommendationReasonView | null;
  /** 別世代(1) */
  crossGeneration: RecommendationReasonView | null;
  /** 落語(1) */
  rakugo: RecommendationReasonView | null;
  /** おすすめ番組(1-3) */
  programs: Program[];
  /** 最初に見る公式動画(2-4) */
  firstVideos: OfficialVideoLink[];
  /** まずは何分だけ見る提案 */
  suggestedMinutes: number;
}
