import { describe, it, expect } from 'vitest';
import { CATALOG, CATALOG_STATS } from './catalog';
import { isHttpsAllowedUrl } from '../engine/url';
import { HUMOR_AXES } from '../types';

const { entities, programs, channels } = CATALOG;

describe('カタログのデータ健全性', () => {
  it('エンティティIDが重複しない', () => {
    const ids = entities.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('番組・チャンネルIDが重複しない', () => {
    const pids = programs.map((p) => p.id);
    expect(new Set(pids).size).toBe(pids.length);
    const cids = channels.map((c) => c.id);
    expect(new Set(cids).size).toBe(cids.length);
  });

  it('必須フィールドが揃い、数値が範囲内', () => {
    for (const e of entities) {
      expect(e.id).toBeTruthy();
      expect(e.name).toBeTruthy();
      expect(e.reading).toBeTruthy();
      expect(e.oneLiner).toBeTruthy();
      expect(e.primaryFormats.length).toBeGreaterThan(0);
      expect(e.styleTags.length).toBeGreaterThan(0);
      expect(e.beginnerAccessibility).toBeGreaterThanOrEqual(1);
      expect(e.beginnerAccessibility).toBeLessThanOrEqual(5);
      expect(e.intensity).toBeGreaterThanOrEqual(1);
      expect(e.intensity).toBeLessThanOrEqual(5);
      expect(e.pace).toBeGreaterThanOrEqual(1);
      expect(e.pace).toBeLessThanOrEqual(5);
      expect(['showa', 'heisei_early', 'heisei_late', 'reiwa', 'timeless']).toContain(e.era);
      expect(['active', 'hiatus', 'disbanded', 'deceased']).toContain(e.activeStatus);
      expect(e.lastVerifiedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('humor ベクトルは全軸 0..1', () => {
    for (const e of entities) {
      for (const a of HUMOR_AXES) {
        expect(e.humor[a]).toBeGreaterThanOrEqual(0);
        expect(e.humor[a]).toBeLessThanOrEqual(1);
      }
    }
  });

  it('掲載URLはすべて https の許可ドメインのみ', () => {
    const allUrls: string[] = [];
    for (const e of entities) {
      if (e.officialWebsite) allUrls.push(e.officialWebsite);
      e.officialVideoLinks.forEach((l) => allUrls.push(l.url));
    }
    for (const p of programs) {
      if (p.officialWebsite) allUrls.push(p.officialWebsite);
      p.officialVideoLinks.forEach((l) => allUrls.push(l.url));
    }
    for (const c of channels) allUrls.push(c.url);
    for (const u of allUrls) {
      expect(isHttpsAllowedUrl(u), `不許可URL: ${u}`).toBe(true);
    }
  });

  it('収録数が初版の目標を満たす', () => {
    expect(CATALOG_STATS.comedians).toBeGreaterThanOrEqual(80);
    expect(CATALOG_STATS.rakugo).toBeGreaterThanOrEqual(12);
    expect(CATALOG_STATS.programs).toBeGreaterThanOrEqual(30);
    // 公式動画/チャンネルリンク(検証済み)の合計
    expect(CATALOG_STATS.officialVideoLinks).toBeGreaterThanOrEqual(60);
  });

  it('世代を網羅する(昭和・平成・令和)', () => {
    const eras = new Set(entities.map((e) => e.era));
    expect(eras.has('showa')).toBe(true);
    expect(eras.has('heisei_late')).toBe(true);
    expect(eras.has('reiwa')).toBe(true);
  });

  it('落語(江戸・上方の双方)と現役/物故の双方を含む', () => {
    const rakugo = entities.filter((e) => e.category === 'rakugo');
    expect(rakugo.some((e) => e.school === '江戸')).toBe(true);
    expect(rakugo.some((e) => e.school === '上方')).toBe(true);
    expect(rakugo.some((e) => e.activeStatus === 'active')).toBe(true);
    expect(rakugo.some((e) => e.activeStatus === 'deceased')).toBe(true);
  });

  it('特定事務所に偏りすぎない(吉本以外が十分にある)', () => {
    const comedians = entities.filter((e) => e.category !== 'rakugo');
    const nonYoshimoto = comedians.filter((e) => !(e.agency ?? '').includes('吉本'));
    // 非吉本が全体の3割以上
    expect(nonYoshimoto.length / comedians.length).toBeGreaterThan(0.3);
  });

  it('番組は放送中/配信中と過去番組を区別している', () => {
    const statuses = new Set(programs.map((p) => p.status));
    expect(statuses.has('過去番組')).toBe(true);
    expect([...statuses].some((s) => s === '放送中' || s === '配信中' || s === '年次開催')).toBe(true);
  });
});
