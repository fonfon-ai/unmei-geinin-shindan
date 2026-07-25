import type { DiagnosisResult } from '../types';

// アプリの公開URL(共有時に付与)。回答内容は一切含めない。
export const APP_URL = 'https://fonfon-ai.github.io/unmei-geinin-shindan/';
export const HASHTAG = '運命のお笑い診断';

/**
 * SNS共有文(固定テンプレート)。
 * 含めるのは診断タイプ名と本命芸人名のみ。
 * 年齢・性別・飲酒・喫煙・MBTI・個別回答は一切含めない。
 */
export function buildShareText(result: DiagnosisResult): string {
  const topName = result.destined[0]?.entity.name ?? '運命のお笑い';
  return [
    `私の運命のお笑いは『${topName}』でした！`,
    `診断タイプは「${result.type.name}」。`,
    `生活と性格から、あなたを笑わせる芸人を診断します。`,
    `#${HASHTAG}`,
  ].join('\n');
}

/** X(Twitter)共有インテントURL。値はすべて encodeURIComponent 済み。 */
export function buildXShareUrl(result: DiagnosisResult): string {
  const text = buildShareText(result);
  const params = new URLSearchParams({ text, url: APP_URL });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/** LINE 共有URL(公式共有プラグイン)。 */
export function buildLineShareUrl(): string {
  const params = new URLSearchParams({ url: APP_URL });
  return `https://social-plugins.line.me/lp/share?${params.toString()}`;
}

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

export function buildWebShareData(result: DiagnosisResult): ShareData {
  return {
    title: '運命のお笑い診断',
    text: buildShareText(result),
    url: APP_URL,
  };
}
