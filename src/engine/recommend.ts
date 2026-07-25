import {
  HUMOR_AXES,
  type DiagnosisType,
  type Entity,
  type HumorAxis,
  type HumorVector,
  type OfficialVideoLink,
  type Program,
  type Channel,
  type RecommendationReasonView,
  type ScoredEntity,
  type TraitVector,
} from '../types';
import { cosineSimilarity, emphasize, dominantAxes } from './humor';
import { sanitizeLinks } from './url';

// 笑い軸 → 説明用の語(推薦理由生成に使用)
const AXIS_PHRASE: Record<HumorAxis, string> = {
  incongruity: '意外な展開',
  safety: '安心して笑える空気',
  edge: 'ピリッとした毒っ気',
  tensionRelease: '緊張と緩和の落差',
  relational: '人間関係のリアルなおかしみ',
  physical: '体を張った勢い',
  verbal: '言葉と構成の妙',
  tempo: 'テンポの良い掛け合い',
  worldview: '独特の世界観',
};

/** 世代グループ(別世代推薦用) */
function generation(era: Entity['era']): string {
  if (era === 'showa') return 'showa';
  if (era === 'heisei_early' || era === 'heisei_late') return 'heisei';
  if (era === 'reiwa') return 'reiwa';
  return 'timeless';
}

/** コサイン(約0.5..1)を相性%(40..99)へ */
export function toAffinity(cos: number): number {
  const lo = 0.55;
  const hi = 0.98;
  const t = Math.max(0, Math.min(1, (cos - lo) / (hi - lo)));
  return Math.round(40 + t * 59);
}

/** 決定論的スコアリング:emphasize したユーザー嗜好とのコサイン類似度。同点はidで安定化。 */
export function scoreEntities(pref: HumorVector, entities: Entity[]): ScoredEntity[] {
  const ep = emphasize(pref);
  return entities
    .map((entity) => ({ entity, score: cosineSimilarity(ep, entity.humor) }))
    .sort((a, b) => b.score - a.score || (a.entity.id < b.entity.id ? -1 : 1));
}

function scoreProgram(pref: HumorVector, program: Program): number {
  return cosineSimilarity(emphasize(pref), program.humor);
}

/** 推薦理由を生成(soft tone・年齢/性別/飲酒/喫煙には触れない) */
function buildReason(entity: Entity, pref: HumorVector): string {
  const userTop = dominantAxes(pref, 3);
  const entTop = dominantAxes(entity.humor, 3);
  const shared = userTop.find((a) => entTop.includes(a));
  const axis = shared ?? entTop[0];
  const phrase = AXIS_PHRASE[axis];
  return `${entity.oneLiner} ${phrase}に反応しやすいあなたと、相性がよいかもしれません。`;
}

function toView(se: ScoredEntity, pref: HumorVector): RecommendationReasonView {
  return {
    entity: se.entity,
    score: se.score,
    affinity: toAffinity(se.score),
    reason: buildReason(se.entity, pref),
  };
}

export interface RecommendInput {
  pref: HumorVector;
  traits: TraitVector;
  type: DiagnosisType;
  entities: Entity[];
  programs: Program[];
  channels: Channel[];
}

export interface RecommendOutput {
  destined: RecommendationReasonView[];
  beginner: RecommendationReasonView[];
  surprise: RecommendationReasonView | null;
  crossGeneration: RecommendationReasonView | null;
  rakugo: RecommendationReasonView | null;
  programs: Program[];
  firstVideos: OfficialVideoLink[];
  suggestedMinutes: number;
}

/** 集中可能時間トレイトから「まずは○分」を決める */
function suggestMinutes(traits: TraitVector): number {
  const a = traits.attentionSpan;
  if (a <= -0.3) return 3;
  if (a >= 0.4) return 12;
  return 7;
}

/**
 * 上位候補から多様性をもって推薦を選ぶ。
 *  - 本命(destined): 総合上位。ただし世代/系統が偏らないよう2組目以降は変化をつける。
 *  - 初心者向け(beginner): beginnerAccessibility 重視。
 *  - 意外(surprise): 中位で、ユーザーの第1嗜好とは異なる主軸を持つ候補。
 *  - 別世代(crossGeneration): 本命と異なる世代グループの最上位。
 *  - 落語(rakugo): 落語カテゴリ最上位。
 */
export function recommend(input: RecommendInput): RecommendOutput {
  const { pref, traits, entities, programs, channels } = input;

  const nonRakugo = entities.filter((e) => e.category !== 'rakugo');
  const rakugoList = entities.filter((e) => e.category === 'rakugo');

  const ranked = scoreEntities(pref, nonRakugo);
  const used = new Set<string>();

  // 本命 2〜3組(世代の多様性を軽く担保)
  const destined: RecommendationReasonView[] = [];
  if (ranked.length > 0) {
    destined.push(toView(ranked[0], pref));
    used.add(ranked[0].entity.id);
    const firstGen = generation(ranked[0].entity.era);
    for (const se of ranked.slice(1)) {
      if (destined.length >= 3) break;
      if (used.has(se.entity.id)) continue;
      // 2組目は別系統/別世代を軽く優先(ただしスコアが高い上位から)
      const g = generation(se.entity.era);
      const preferVariety = destined.length === 1 ? g !== firstGen : true;
      if (destined.length < 2 && !preferVariety && ranked.indexOf(se) < 6) {
        // まだ1組目と同世代でも、上位3位内なら許容
      }
      destined.push(toView(se, pref));
      used.add(se.entity.id);
    }
  }
  // 念のため本命を最大3、最小1に。上のループで2〜3組入る。

  // 初心者向け: beginnerAccessibility 高 & 上位40位内 & active寄り
  const beginnerPool = ranked
    .slice(0, 40)
    .filter((se) => !used.has(se.entity.id))
    .sort(
      (a, b) =>
        b.entity.beginnerAccessibility - a.entity.beginnerAccessibility ||
        b.score - a.score ||
        (a.entity.id < b.entity.id ? -1 : 1),
    );
  const beginner: RecommendationReasonView[] = [];
  for (const se of beginnerPool) {
    if (beginner.length >= 2) break;
    beginner.push(toView(se, pref));
    used.add(se.entity.id);
  }

  // 意外: 中位(6〜30位)でユーザー第1嗜好と主軸が異なる最上位
  const userTopAxis = dominantAxes(pref, 1)[0];
  let surprise: RecommendationReasonView | null = null;
  for (const se of ranked.slice(5, 30)) {
    if (used.has(se.entity.id)) continue;
    const entAxis = dominantAxes(se.entity.humor, 1)[0];
    if (entAxis !== userTopAxis) {
      surprise = toView(se, pref);
      used.add(se.entity.id);
      break;
    }
  }
  if (!surprise) {
    const fallback = ranked.find((se) => !used.has(se.entity.id));
    if (fallback) {
      surprise = toView(fallback, pref);
      used.add(fallback.entity.id);
    }
  }

  // 別世代: 本命と異なる世代グループの最上位
  let crossGeneration: RecommendationReasonView | null = null;
  if (destined.length > 0) {
    const destGen = generation(destined[0].entity.era);
    for (const se of ranked) {
      if (used.has(se.entity.id)) continue;
      if (generation(se.entity.era) !== destGen) {
        crossGeneration = toView(se, pref);
        used.add(se.entity.id);
        break;
      }
    }
  }

  // 落語
  const rakugoRanked = scoreEntities(pref, rakugoList);
  const rakugo = rakugoRanked.length > 0 ? toView(rakugoRanked[0], pref) : null;

  // 番組: fit × 初心者やすさ、放送/配信中を軽く優先。上位3。
  const scoredPrograms = programs
    .map((p) => ({
      p,
      s:
        scoreProgram(pref, p) +
        (p.beginnerAccessibility - 3) * 0.02 +
        (p.status === '過去番組' ? -0.02 : 0.01),
    }))
    .sort((a, b) => b.s - a.s || (a.p.id < b.p.id ? -1 : 1));
  const programsOut = scoredPrograms.slice(0, 3).map((x) => x.p);

  // 最初に見る公式動画: 本命→初心者→落語 の順に、検証済みリンクを集約。
  // 足りなければユーザーの主フォーマットに合う公式チャンネルで補完。最大4。
  const firstVideos: OfficialVideoLink[] = [];
  const seenUrls = new Set<string>();
  const pushLinks = (links: OfficialVideoLink[] | undefined) => {
    for (const l of sanitizeLinks(links)) {
      if (firstVideos.length >= 4) return;
      if (seenUrls.has(l.url)) continue;
      seenUrls.add(l.url);
      firstVideos.push(l);
    }
  };
  const orderedForVideos = [
    ...beginner.map((v) => v.entity),
    ...destined.map((v) => v.entity),
    ...(rakugo ? [rakugo.entity] : []),
  ];
  for (const e of orderedForVideos) pushLinks(e.officialVideoLinks);
  // プログラムの公式動画も候補に
  for (const p of programsOut) pushLinks(p.officialVideoLinks);
  // 公式チャンネルで補完
  if (firstVideos.length < 2) {
    for (const c of channels) {
      if (firstVideos.length >= 3) break;
      const link: OfficialVideoLink = {
        title: c.name,
        url: c.url,
        source: `${c.owner}（公式チャンネル）`,
      };
      pushLinks([link]);
    }
  }

  return {
    destined: destined.slice(0, 3),
    beginner,
    surprise,
    crossGeneration,
    rakugo,
    programs: programsOut,
    firstVideos,
    suggestedMinutes: suggestMinutes(traits),
  };
}

/** ユーザー嗜好ベクトルに最も近い診断タイプを決定論的に選ぶ */
export function classifyType(pref: HumorVector, types: DiagnosisType[]): DiagnosisType {
  const ep = emphasize(pref, 1.4);
  let best = types[0];
  let bestSim = -Infinity;
  for (const t of types) {
    const sim = cosineSimilarity(ep, t.centroid);
    if (sim > bestSim || (sim === bestSim && t.id < best.id)) {
      bestSim = sim;
      best = t;
    }
  }
  return best;
}

export { HUMOR_AXES };
