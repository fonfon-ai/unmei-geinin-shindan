import { QUESTIONS } from '../data/questions';
import { TRAIT_AXES, type Answers, type TraitAxis, type TraitVector } from '../types';

function zeroTraits(): TraitVector {
  return TRAIT_AXES.reduce((acc, a) => {
    acc[a] = 0;
    return acc;
  }, {} as TraitVector);
}

/**
 * 各軸の正規化係数 = 全質問について「その軸に最も強く効く選択肢の絶対重み」を合計。
 * 生スコアをこれで割ると概ね [-1, 1] に収まる。1問が過度に支配しない設計の裏付けにもなる。
 */
const AXIS_SCALE: Record<TraitAxis, number> = (() => {
  const scale = zeroTraits();
  for (const q of QUESTIONS) {
    for (const axis of TRAIT_AXES) {
      let maxAbs = 0;
      for (const opt of q.options) {
        const w = Math.abs(opt.weights[axis] ?? 0);
        if (w > maxAbs) maxAbs = w;
      }
      scale[axis] += maxAbs;
    }
  }
  // 0除算防止
  for (const axis of TRAIT_AXES) if (scale[axis] === 0) scale[axis] = 1;
  return scale;
})();

/** 1つの質問・軸が最終トレイトに与えうる最大寄与(単一回答の支配度検証に使用) */
export function maxSingleAnswerInfluence(): number {
  let maxInfluence = 0;
  for (const q of QUESTIONS) {
    for (const axis of TRAIT_AXES) {
      for (const opt of q.options) {
        const infl = Math.abs(opt.weights[axis] ?? 0) / AXIS_SCALE[axis];
        if (infl > maxInfluence) maxInfluence = infl;
      }
    }
  }
  return maxInfluence;
}

/**
 * 回答から潜在特性ベクトルを算出。
 * 未回答/中立は寄与0。全問スキップなら全軸0(中立)を返し、エラーにしない。
 */
export function computeTraits(answers: Answers): TraitVector {
  const raw = zeroTraits();
  for (const q of QUESTIONS) {
    const chosen = answers[q.id];
    if (!chosen) continue;
    const opt = q.options.find((o) => o.id === chosen);
    if (!opt) continue;
    for (const axis of TRAIT_AXES) {
      const w = opt.weights[axis];
      if (w) raw[axis] += w;
    }
  }
  const normalized = zeroTraits();
  for (const axis of TRAIT_AXES) {
    // clamp to [-1, 1] を保証
    const v = raw[axis] / AXIS_SCALE[axis];
    normalized[axis] = Math.max(-1, Math.min(1, v));
  }
  return normalized;
}

/** 何問に実質回答したか(採点対象の重み付き選択肢) */
export function answeredScoringCount(answers: Answers): number {
  let n = 0;
  for (const q of QUESTIONS) {
    const chosen = answers[q.id];
    if (!chosen) continue;
    const opt = q.options.find((o) => o.id === chosen);
    if (opt && Object.keys(opt.weights).length > 0) n++;
  }
  return n;
}
