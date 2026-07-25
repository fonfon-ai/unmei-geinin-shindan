import { DIAGNOSIS_TYPES } from '../data/diagnosisTypes';
import { CATALOG } from '../data/catalog';
import type { Answers, DiagnosisResult } from '../types';
import { computeTraits } from './traits';
import { traitToHumorPreference } from './humor';
import { classifyType, recommend } from './recommend';

/**
 * 診断のメインエントリ。回答 → トレイト → 笑い嗜好 → タイプ判定 → 推薦。
 * すべて決定論的。同じ回答は必ず同じ主結果を返す。実行時にLLM/APIは使わない。
 */
export function runDiagnosis(answers: Answers): DiagnosisResult {
  const traits = computeTraits(answers);
  const pref = traitToHumorPreference(traits);
  const type = classifyType(pref, DIAGNOSIS_TYPES);
  const rec = recommend({
    pref,
    traits,
    type,
    entities: CATALOG.entities,
    programs: CATALOG.programs,
    channels: CATALOG.channels,
  });
  return {
    type,
    humorPreference: pref,
    traits,
    destined: rec.destined,
    beginner: rec.beginner,
    surprise: rec.surprise,
    crossGeneration: rec.crossGeneration,
    rakugo: rec.rakugo,
    programs: rec.programs,
    firstVideos: rec.firstVideos,
    suggestedMinutes: rec.suggestedMinutes,
  };
}

export { DIAGNOSIS_TYPES } from '../data/diagnosisTypes';
export { CATALOG } from '../data/catalog';
