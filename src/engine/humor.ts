import {
  HUMOR_AXES,
  type HumorAxis,
  type HumorVector,
  type TraitAxis,
  type TraitVector,
} from '../types';

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

export function zeroHumor(): HumorVector {
  return HUMOR_AXES.reduce((acc, a) => {
    acc[a] = 0;
    return acc;
  }, {} as HumorVector);
}

// ---------------------------------------------------------------------------
// 潜在特性 → 笑い嗜好ベクトル
// 「性格傾向と笑いの特徴の対応」を線形写像で表現。1軸で決めず複数トレイトを合成。
// ---------------------------------------------------------------------------
const TRAIT_TO_HUMOR: Record<HumorAxis, Partial<Record<TraitAxis, number>>> = {
  incongruity: { novelty: 0.5, stimulation: 0.3, analytical: 0.2, verbalInterest: 0.15 },
  safety: {
    stimulation: -0.4,
    tensionTolerance: -0.35,
    novelty: -0.25,
    relationshipInterest: 0.15,
  },
  edge: {
    tensionTolerance: 0.45,
    stimulation: 0.3,
    extroversion: 0.15,
    relationshipInterest: -0.1,
  },
  tensionRelease: { tensionTolerance: 0.5, stimulation: 0.25, novelty: 0.15 },
  relational: { relationshipInterest: 0.55, analytical: -0.25, sociability: 0.25 },
  physical: {
    physicalVisual: 0.55,
    stimulation: 0.2,
    verbalInterest: -0.25,
    tempoPreference: 0.15,
  },
  verbal: { verbalInterest: 0.55, analytical: 0.35, planning: 0.1, physicalVisual: -0.2 },
  tempo: { tempoPreference: 0.5, stimulation: 0.25, extroversion: 0.15, attentionSpan: -0.2 },
  worldview: {
    novelty: 0.4,
    analytical: 0.3,
    verbalInterest: 0.25,
    extroversion: -0.15,
    stimulation: 0.1,
  },
};

/** トレイト(-1..1) → 笑い嗜好(0..1) */
export function traitToHumorPreference(traits: TraitVector): HumorVector {
  const pref = zeroHumor();
  for (const axis of HUMOR_AXES) {
    let z = 0;
    const coeffs = TRAIT_TO_HUMOR[axis];
    for (const t in coeffs) {
      const key = t as TraitAxis;
      z += (coeffs[key] ?? 0) * traits[key];
    }
    pref[axis] = clamp01(0.5 + z);
  }
  return pref;
}

// ---------------------------------------------------------------------------
// スタイルタグ/フォーマット → 笑い特徴ベクトル(候補側)
// ---------------------------------------------------------------------------
const TAG_HUMOR: Record<string, Partial<HumorVector>> = {
  // styleTags
  安心感: { safety: 0.5 },
  意外性: { incongruity: 0.5 },
  不一致: { incongruity: 0.45, worldview: 0.15 },
  毒: { edge: 0.55 },
  いじり: { edge: 0.4, relational: 0.2 },
  緊張と解放: { tensionRelease: 0.55 },
  協調性: { relational: 0.4, safety: 0.15 },
  関係性: { relational: 0.5 },
  身体性: { physical: 0.5 },
  リアクション: { physical: 0.45, tempo: 0.15 },
  言葉中心: { verbal: 0.5 },
  視覚中心: { physical: 0.4 },
  ハイテンポ: { tempo: 0.5 },
  スローテンポ: { verbal: 0.1, worldview: 0.1 },
  世界観: { worldview: 0.5 },
  日常: { safety: 0.35, relational: 0.25 },
  人柄: { safety: 0.3, relational: 0.3 },
  知的: { verbal: 0.4, worldview: 0.2 },
  ナンセンス: { worldview: 0.45, incongruity: 0.25 },
  王道: { safety: 0.35, verbal: 0.1 },
  エネルギッシュ: { tempo: 0.35, physical: 0.3 },
  癒やし: { safety: 0.5 },
  人情: { relational: 0.45, safety: 0.2 },
  // formats
  漫才: { verbal: 0.35, tempo: 0.2, relational: 0.1 },
  コント: { worldview: 0.3, physical: 0.2, incongruity: 0.15 },
  ピン芸: { worldview: 0.1, verbal: 0.1 },
  トーク: { relational: 0.35, verbal: 0.2 },
  大喜利: { verbal: 0.35, incongruity: 0.35 },
  ロケ: { physical: 0.3, relational: 0.25 },
  リアクション芸: { physical: 0.4 },
  モノマネ: { physical: 0.3, safety: 0.15 },
  キャラクター芸: { physical: 0.25, worldview: 0.2 },
  シュール: { worldview: 0.45, incongruity: 0.3 },
  '言葉・構造型': { verbal: 0.45, incongruity: 0.25 },
  '関係性・ラジオ型': { relational: 0.4, verbal: 0.2 },
  観察型: { verbal: 0.25, relational: 0.25, safety: 0.15 },
  '音楽・リズムネタ': { physical: 0.3, tempo: 0.3, safety: 0.15 },
  落語: { verbal: 0.45, worldview: 0.3, relational: 0.15 },
  // 番組向けタグ / programType トークン
  ネタ: { verbal: 0.3, tempo: 0.25, incongruity: 0.15 },
  ネタ番組: { verbal: 0.3, tempo: 0.25 },
  トーク番組: { relational: 0.4, verbal: 0.2 },
  ロケ番組: { physical: 0.3, relational: 0.25 },
  企画: { incongruity: 0.3, physical: 0.2, tempo: 0.15 },
  コンテスト: { verbal: 0.25, tempo: 0.25, tensionRelease: 0.2 },
  ドキュメンタリー: { verbal: 0.3, relational: 0.25 },
  初心者向け: { safety: 0.35 },
};

export interface HumorKnobs {
  styleTags: string[];
  primaryFormats: string[];
  intensity?: number; // 1..5
  pace?: number; // 1..5
  beginnerAccessibility?: number; // 1..5
  verbalVisualBalance?: number; // -2..2 (verbal- / visual+)
}

/** タグ・フォーマット・数値ノブから候補の笑い特徴ベクトル(0..1)を導出 */
export function deriveHumor(k: HumorKnobs): HumorVector {
  const v = zeroHumor();
  // 低いベース(その特徴が明示タグに無ければ弱い)
  for (const a of HUMOR_AXES) v[a] = 0.12;

  const apply = (tag: string) => {
    const contrib = TAG_HUMOR[tag];
    if (!contrib) return;
    for (const a in contrib) {
      v[a as HumorAxis] += contrib[a as HumorAxis] ?? 0;
    }
  };
  for (const t of k.styleTags) apply(t);
  for (const f of k.primaryFormats) apply(f);

  const intensity = k.intensity ?? 3;
  const pace = k.pace ?? 3;
  const beginner = k.beginnerAccessibility ?? 3;
  v.edge += (intensity - 3) * 0.06;
  v.tensionRelease += (intensity - 3) * 0.04;
  v.safety += (3 - intensity) * 0.05;
  v.tempo += (pace - 3) * 0.08;
  v.safety += (beginner - 3) * 0.03;

  if (typeof k.verbalVisualBalance === 'number') {
    v.verbal += -k.verbalVisualBalance * 0.05;
    v.physical += k.verbalVisualBalance * 0.05;
  }

  for (const a of HUMOR_AXES) v[a] = clamp01(v[a]);
  return v;
}

/** verbalVisualBalance をタグから推定(-2..2, verbal- / visual+) */
export function deriveVerbalVisualBalance(k: {
  styleTags: string[];
  primaryFormats: string[];
}): number {
  const h = deriveHumor(k);
  // physical と verbal の差を -2..2 にスケール
  const diff = h.physical - h.verbal; // -1..1
  return Math.max(-2, Math.min(2, Math.round(diff * 2)));
}

// ---------------------------------------------------------------------------
// 類似度
// ---------------------------------------------------------------------------
function dot(a: HumorVector, b: HumorVector): number {
  let s = 0;
  for (const ax of HUMOR_AXES) s += a[ax] * b[ax];
  return s;
}
function norm(a: HumorVector): number {
  return Math.sqrt(dot(a, a)) || 1e-9;
}

/** コサイン類似度(0..1)。嗜好の「形」で候補を評価する。 */
export function cosineSimilarity(a: HumorVector, b: HumorVector): number {
  return dot(a, b) / (norm(a) * norm(b));
}

/** ユーザーの強い軸を強調した嗜好ベクトル(上位の好みを効かせる) */
export function emphasize(pref: HumorVector, power = 1.8): HumorVector {
  const out = zeroHumor();
  for (const a of HUMOR_AXES) out[a] = Math.pow(pref[a], power);
  return out;
}

/** どの笑い軸が強いか(タイプ判定・説明生成に使用) */
export function dominantAxes(pref: HumorVector, n = 3): HumorAxis[] {
  return [...HUMOR_AXES].sort((x, y) => pref[y] - pref[x]).slice(0, n);
}
