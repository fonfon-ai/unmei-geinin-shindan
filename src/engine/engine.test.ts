import { describe, it, expect } from 'vitest';
import { runDiagnosis } from './index';
import { DIAGNOSIS_TYPES } from '../data/diagnosisTypes';
import { classifyType } from './recommend';
import { maxSingleAnswerInfluence } from './traits';
import { QUESTIONS } from '../data/questions';
import { isHttpsAllowedUrl } from './url';
import type { Answers } from '../types';

// 決定論的な擬似乱数(テスト再現性のため)
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomAnswers(rng: () => number, skipProb = 0.12): Answers {
  const a: Answers = {};
  for (const q of QUESTIONS) {
    if (rng() < skipProb) {
      a[q.id] = null;
    } else {
      const opt = q.options[Math.floor(rng() * q.options.length)];
      a[q.id] = opt.id;
    }
  }
  return a;
}

describe('診断ロジック', () => {
  it('全問スキップでもエラーにならず、妥当な結果を返す', () => {
    const r = runDiagnosis({});
    expect(r.type).toBeTruthy();
    expect(r.destined.length).toBeGreaterThanOrEqual(1);
    for (const a of Object.values(r.humorPreference)) {
      expect(a).toBeGreaterThanOrEqual(0);
      expect(a).toBeLessThanOrEqual(1);
    }
  });

  it('空回答と undefined 混在でも落ちない', () => {
    expect(() => runDiagnosis({ holiday: undefined, food: null })).not.toThrow();
  });

  it('同じ回答は同じ主結果(タイプ・本命)を返す(決定論)', () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 50; i++) {
      const ans = randomAnswers(rng);
      const r1 = runDiagnosis(ans);
      const r2 = runDiagnosis({ ...ans });
      expect(r1.type.id).toBe(r2.type.id);
      expect(r1.destined.map((d) => d.entity.id)).toEqual(r2.destined.map((d) => d.entity.id));
      expect(r1.rakugo?.entity.id).toBe(r2.rakugo?.entity.id);
    }
  });

  it('全12タイプの中心ベクトルはそれぞれ自分自身に分類される(タイプが識別可能)', () => {
    for (const t of DIAGNOSIS_TYPES) {
      expect(classifyType(t.centroid, DIAGNOSIS_TYPES).id).toBe(t.id);
    }
  });

  it('全診断タイプにランダム回答から到達できる(到達可能性)', () => {
    const rng = mulberry32(7);
    const seen = new Set<string>();
    for (let i = 0; i < 6000; i++) {
      seen.add(runDiagnosis(randomAnswers(rng)).type.id);
    }
    const missing = DIAGNOSIS_TYPES.filter((t) => !seen.has(t.id)).map((t) => t.id);
    expect(missing, `未到達タイプ: ${missing.join(', ')}`).toEqual([]);
  });

  it('単一回答が結果を過度に左右しない(1軸あたりの単一回答影響が上限以下)', () => {
    expect(maxSingleAnswerInfluence()).toBeLessThanOrEqual(0.6);
  });

  it('単一回答の変更でタイプが変わるのは少数(独裁的な質問がない)', () => {
    const rng = mulberry32(99);
    let changes = 0;
    let trials = 0;
    for (let b = 0; b < 40; b++) {
      const base = randomAnswers(rng);
      const baseType = runDiagnosis(base).type.id;
      for (const q of QUESTIONS) {
        for (const opt of q.options) {
          if (base[q.id] === opt.id) continue;
          trials++;
          const varied = { ...base, [q.id]: opt.id };
          if (runDiagnosis(varied).type.id !== baseType) changes++;
        }
      }
    }
    // 単一回答の差し替えでタイプが変わる割合は半数未満(過半数は不変)
    expect(changes / trials).toBeLessThan(0.5);
  });

  it('推薦バケットの多様性:主要枠のエンティティが重複しない', () => {
    const rng = mulberry32(123);
    for (let i = 0; i < 40; i++) {
      const r = runDiagnosis(randomAnswers(rng));
      const ids = [
        ...r.destined.map((d) => d.entity.id),
        ...r.beginner.map((d) => d.entity.id),
        r.surprise?.entity.id,
        r.crossGeneration?.entity.id,
      ].filter(Boolean) as string[];
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('落語枠は落語カテゴリのエンティティ', () => {
    const rng = mulberry32(5);
    for (let i = 0; i < 30; i++) {
      const r = runDiagnosis(randomAnswers(rng));
      if (r.rakugo) expect(r.rakugo.entity.category).toBe('rakugo');
    }
  });

  it('別世代枠は本命と異なる世代グループ', () => {
    const gen = (era: string) =>
      era === 'showa' ? 'showa' : era === 'reiwa' ? 'reiwa' : era === 'timeless' ? 'timeless' : 'heisei';
    const rng = mulberry32(321);
    for (let i = 0; i < 40; i++) {
      const r = runDiagnosis(randomAnswers(rng));
      if (r.crossGeneration && r.destined[0]) {
        expect(gen(r.crossGeneration.entity.era)).not.toBe(gen(r.destined[0].entity.era));
      }
    }
  });

  it('表示される最初の公式動画はすべて https 許可URL', () => {
    const rng = mulberry32(888);
    for (let i = 0; i < 60; i++) {
      const r = runDiagnosis(randomAnswers(rng));
      for (const v of r.firstVideos) {
        expect(isHttpsAllowedUrl(v.url)).toBe(true);
      }
    }
  });

  it('相性(affinity)は 0..100 の範囲', () => {
    const rng = mulberry32(2024);
    for (let i = 0; i < 30; i++) {
      const r = runDiagnosis(randomAnswers(rng));
      for (const d of r.destined) {
        expect(d.affinity).toBeGreaterThanOrEqual(0);
        expect(d.affinity).toBeLessThanOrEqual(100);
      }
    }
  });
});
