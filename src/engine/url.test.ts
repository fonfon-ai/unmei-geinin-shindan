/* eslint-disable no-script-url -- 危険スキームを拒否することを検証するため、意図的に含める */
import { describe, it, expect } from 'vitest';
import { isHttpsAllowedUrl, sanitizeLinks, sanitizeUrl } from './url';

describe('URL 許可リスト検証', () => {
  it('https の許可ドメインは通す', () => {
    expect(isHttpsAllowedUrl('https://www.youtube.com/@m1grandprix')).toBe(true);
    expect(isHttpsAllowedUrl('https://profile.yoshimoto.co.jp/talent/detail?id=22')).toBe(true);
    expect(isHttpsAllowedUrl('https://tver.jp/series/xxx')).toBe(true);
  });

  it('http は拒否する', () => {
    expect(isHttpsAllowedUrl('http://www.youtube.com/@x')).toBe(false);
  });

  it('javascript: / data: 等の危険スキームを拒否する', () => {
    expect(isHttpsAllowedUrl('javascript:alert(1)')).toBe(false);
    expect(isHttpsAllowedUrl('data:text/html,<script>1</script>')).toBe(false);
    expect(isHttpsAllowedUrl('JavaScript:alert(1)')).toBe(false);
  });

  it('許可リスト外のドメインを拒否する', () => {
    expect(isHttpsAllowedUrl('https://evil.example.com/')).toBe(false);
    expect(isHttpsAllowedUrl('https://youtube.com.evil.com/')).toBe(false);
    expect(isHttpsAllowedUrl('https://notyoutube.com/')).toBe(false);
  });

  it('認証情報埋め込みURLを拒否する', () => {
    expect(isHttpsAllowedUrl('https://user:pass@www.youtube.com/')).toBe(false);
  });

  it('壊れたURLを拒否する', () => {
    expect(isHttpsAllowedUrl('not a url')).toBe(false);
    expect(isHttpsAllowedUrl('')).toBe(false);
  });

  it('sanitizeLinks は不許可リンクを除去する', () => {
    const links = [
      { url: 'https://www.youtube.com/@ok', title: 'ok', source: 's' },
      { url: 'http://bad', title: 'bad', source: 's' },
      { url: 'https://evil.com', title: 'evil', source: 's' },
    ];
    expect(sanitizeLinks(links)).toHaveLength(1);
    expect(sanitizeLinks(undefined)).toEqual([]);
  });

  it('sanitizeUrl は不許可を null にする', () => {
    expect(sanitizeUrl('https://www.maseki.co.jp/talent/x')).toBe('https://www.maseki.co.jp/talent/x');
    expect(sanitizeUrl('http://x')).toBeNull();
    expect(sanitizeUrl(null)).toBeNull();
  });
});
