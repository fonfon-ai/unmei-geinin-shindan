// ============================================================================
// URL 許可リスト検証
// セキュリティ要件:
//  - https のみ許可
//  - 推薦データ内のURLを許可リスト方式で検証(公式ドメインのみ)
//  - javascript: / data: 等のスキームは不可
//  - 検証を通らないURLはUIに一切描画しない(安全側にフォールバック)
// ============================================================================

/** 許可する登録ドメイン(サフィックス一致)。すべて公式事務所/放送局/公式配信/公式チャンネル。 */
export const ALLOWED_HOST_SUFFIXES: string[] = [
  // 動画・配信
  'youtube.com',
  'youtu.be',
  'nhk.or.jp',
  'nhk.jp',
  'tver.jp',
  'abema.tv',
  // 事務所・レーベル
  'yoshimoto.co.jp',
  'maseki.co.jp',
  'p-jinriki.com',
  'titan-net.co.jp',
  'watanabepro.co.jp',
  'horipro.co.jp',
  'shochikugeino.co.jp',
  'sma.co.jp',
  'sunmusic-gp.co.jp',
  'grapecom.jp',
  'kdashstage.jp',
  'ash-d.info',
  'twinkle-co.co.jp',
  'gateagency.jp',
  'bampeiyu.com',
  'izawaoffice.jp',
  'nichien-pro.jp',
  'chatterbox.co.jp',
  'jam-house.co.jp',
  'hagimoto-kikaku.co.jp',
  'kohen.works',
  '82style.co.jp',
  '565656.co.jp',
  'tanabe-agency.co.jp',
  'ohtapro.co.jp',
  'sonymusic.co.jp',
  'ken-on.co.jp',
  'asaikikaku.co.jp',
  'dudes.jp',
  'thegeese.jp',
  'sarabaseisyunnohikari.com',
  'manzaikyokai.org',
  'tukitei.com',
  'yonedanji.jp',
  'katsuraniyo.com',
  'kintalo.com',
  'hiroshi0214.com',
  'amb-co.jp',
  'mikan-usup.com',
  'matsuura-kodai.com',
  // 落語 協会・団体
  'rakugo-kyokai.jp',
  'geikyo.com',
  'kamigata.jp',
  'kamigatarakugo.jp',
  'beicho.co.jp',
  'rakugo-kyokai.or.jp',
  'ntv.co.jp', // 笑点(日本テレビ)
  // 放送局(番組公式)
  'tv-asahi.co.jp',
  'asahi.co.jp', // 朝日放送(ABC)
  'fujitv.co.jp',
  'tbs.co.jp',
  'tv-tokyo.co.jp',
  'ktv.jp',
  'ytv.co.jp',
  'mbs.jp',
  'tsk-tv.com',
  // 賞レース・大会 公式
  'm-1gp.com',
  'king-of-conte.com',
  'r-1gp.com',
  'highschool-manzai.com',
  // 配信
  'primevideo.com',
  'amazon.co.jp',
  'netflix.com',
];

export function isHttpsAllowedUrl(raw: string): boolean {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return false;
  }
  if (u.protocol !== 'https:') return false;
  // 認証情報埋め込み(user:pass@)を拒否
  if (u.username || u.password) return false;
  const host = u.hostname.toLowerCase();
  return ALLOWED_HOST_SUFFIXES.some(
    (suffix) => host === suffix || host.endsWith('.' + suffix),
  );
}

/** リンク配列を検証し、許可URLのみ残す */
export function sanitizeLinks<T extends { url: string }>(links: T[] | undefined): T[] {
  if (!links) return [];
  return links.filter((l) => l && typeof l.url === 'string' && isHttpsAllowedUrl(l.url));
}

/** 単一URL(officialWebsite)の検証。不許可なら null。 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return isHttpsAllowedUrl(url) ? url : null;
}
