import type {
  Channel,
  Entity,
  HumorVector,
  Program,
} from '../types';
import { deriveHumor, deriveVerbalVisualBalance } from '../engine/humor';
import { sanitizeLinks, sanitizeUrl } from '../engine/url';
import { RAW_COMEDIANS } from './entities.comedians';
import { RAW_COMEDIANS_2 } from './entities.comedians2';
import { RAW_COMEDIANS_3 } from './entities.comedians3';
import { RAW_RAKUGO } from './entities.rakugo';
import { RAW_RAKUGO_2 } from './entities.rakugo2';
import { RAW_RAKUGO_3 } from './entities.rakugo3';
import { RAW_PROGRAMS } from './programs';
import { RAW_CHANNELS } from './channels';

// ---------------------------------------------------------------------------
// 生データ(調査・確認済みの事実 + タグ)。laugh(笑い特徴ベクトル)や
// verbalVisualBalance 等の派生値はここでは持たず、ビルド時に導出する。
// ---------------------------------------------------------------------------
export type RawEntity = Omit<
  Entity,
  | 'humor'
  | 'verbalVisualBalance'
  | 'prerequisiteKnowledge'
  | 'recommendedMood'
  | 'recommendedDuration'
  | 'recommendationReason'
  | 'lastVerifiedDate'
> & {
  verbalVisualBalance?: number;
  prerequisiteKnowledge?: number;
  recommendedMood?: string[];
  recommendedDuration?: number;
  recommendationReason?: string;
  lastVerifiedDate?: string;
};

export type RawProgram = Omit<Program, 'humor'> & { humor?: HumorVector };

const DEFAULT_VERIFIED = '2026-07-21';

function moodFromTags(tags: string[]): string[] {
  const moods = new Set<string>();
  const has = (t: string) => tags.includes(t);
  if (has('癒やし') || has('安心感') || has('人柄') || has('日常')) {
    moods.add('少し疲れているとき');
    moods.add('リラックスしたいとき');
  }
  if (has('エネルギッシュ') || has('ハイテンポ') || has('身体性')) {
    moods.add('元気なとき');
    moods.add('気分を上げたいとき');
  }
  if (has('知的') || has('言葉中心') || has('世界観') || has('スローテンポ')) {
    moods.add('じっくり味わいたいとき');
  }
  if (has('意外性') || has('不一致') || has('ナンセンス')) {
    moods.add('新しい刺激がほしいとき');
  }
  if (moods.size === 0) moods.add('気軽に笑いたいとき');
  return [...moods];
}

function finalizeEntity(raw: RawEntity): Entity {
  const humor = deriveHumor({
    styleTags: raw.styleTags,
    primaryFormats: raw.primaryFormats,
    intensity: raw.intensity,
    pace: raw.pace,
    beginnerAccessibility: raw.beginnerAccessibility,
    verbalVisualBalance: raw.verbalVisualBalance,
  });
  const vvb =
    raw.verbalVisualBalance ??
    deriveVerbalVisualBalance({
      styleTags: raw.styleTags,
      primaryFormats: raw.primaryFormats,
    });
  const prereq =
    raw.prerequisiteKnowledge ??
    Math.max(1, Math.min(5, 6 - raw.beginnerAccessibility));
  const duration =
    raw.recommendedDuration ?? (raw.category === 'rakugo' ? 25 : 10);
  const website = sanitizeUrl(raw.officialWebsite);
  const videoLinks = sanitizeLinks(raw.officialVideoLinks);
  // sourceUrls 未指定なら、確認済みの公式一次情報(公式サイト/公式チャンネル)から導出
  const sources =
    raw.sourceUrls && raw.sourceUrls.length > 0
      ? raw.sourceUrls
      : [website, ...videoLinks.map((l) => l.url)].filter(
          (u): u is string => typeof u === 'string',
        );
  return {
    ...raw,
    verbalVisualBalance: vvb,
    prerequisiteKnowledge: prereq,
    humor,
    recommendedMood: raw.recommendedMood ?? moodFromTags(raw.styleTags),
    recommendedDuration: duration,
    recommendationReason: raw.recommendationReason ?? raw.oneLiner,
    // URL は許可リストで再検証(不許可は落とす)
    officialWebsite: website,
    officialVideoLinks: videoLinks,
    sourceUrls: sources,
    lastVerifiedDate: raw.lastVerifiedDate ?? DEFAULT_VERIFIED,
  };
}

function finalizeProgram(raw: RawProgram): Program {
  const humor =
    raw.humor ??
    deriveHumor({
      styleTags: raw.styleTags,
      primaryFormats: raw.programType,
      beginnerAccessibility: raw.beginnerAccessibility,
    });
  return {
    ...raw,
    humor,
    officialWebsite: sanitizeUrl(raw.officialWebsite),
    officialVideoLinks: sanitizeLinks(raw.officialVideoLinks),
  };
}

const rawEntities: RawEntity[] = [
  ...RAW_COMEDIANS,
  ...RAW_COMEDIANS_2,
  ...RAW_COMEDIANS_3,
  ...RAW_RAKUGO,
  ...RAW_RAKUGO_2,
  ...RAW_RAKUGO_3,
];

// ID重複を検出(ビルド時ガード)。重複があれば早期にエラーで気づけるようにする。
const seenIds = new Set<string>();
const duplicateIds: string[] = [];
for (const e of rawEntities) {
  if (seenIds.has(e.id)) duplicateIds.push(e.id);
  seenIds.add(e.id);
}
if (duplicateIds.length > 0) {
  throw new Error(`カタログに重複IDがあります: ${duplicateIds.join(', ')}`);
}

const entities: Entity[] = rawEntities.map(finalizeEntity);
const programs: Program[] = RAW_PROGRAMS.map(finalizeProgram);
const channels: Channel[] = RAW_CHANNELS.filter((c) => sanitizeUrl(c.url) !== null);

export const CATALOG = {
  entities,
  programs,
  channels,
};

export const CATALOG_STATS = {
  entities: entities.length,
  comedians: entities.filter((e) => e.category !== 'rakugo').length,
  rakugo: entities.filter((e) => e.category === 'rakugo').length,
  programs: programs.length,
  channels: channels.length,
  officialVideoLinks:
    entities.reduce((n, e) => n + e.officialVideoLinks.length, 0) +
    programs.reduce((n, p) => n + p.officialVideoLinks.length, 0) +
    channels.length,
};
