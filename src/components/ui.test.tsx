import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import App from '../App';
import { Result } from './Result';
import { runDiagnosis } from '../engine';

afterEach(cleanup);

describe('UI レンダリング', () => {
  it('ランディングが表示され、診断を開始できる', () => {
    render(<App />);
    expect(screen.getByText('あなたを笑わせる、運命の芸人が見つかる。')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /無料で診断する/ }));
    // 最初の質問(radiogroup)が表示される
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getAllByRole('radio').length).toBeGreaterThan(0);
  });

  it('結果画面が主要セクションを描画する', () => {
    const result = runDiagnosis({ holiday: 'home_relax', mood: 'tired', watchtime: 'long' });
    render(<Result result={result} onRestart={() => {}} />);
    expect(screen.getByText(result.type.name)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'あなたの運命の芸人' })).toBeInTheDocument();
    // 共有プレビューにハッシュタグが含まれ、個別回答は含まれない
    const preview = screen.getByText(/#運命の芸人診断/);
    expect(preview.textContent).not.toMatch(/tired|home_relax|holiday/);
  });

  it('外部リンクはすべて rel="noopener noreferrer" と target="_blank"', () => {
    const result = runDiagnosis({ conversation: 'wordplay', watchtime: 'long' });
    const { container } = render(<Result result={result} onRestart={() => {}} />);
    const blankLinks = container.querySelectorAll('a[target="_blank"]');
    expect(blankLinks.length).toBeGreaterThan(0);
    blankLinks.forEach((a) => {
      expect(a.getAttribute('rel') ?? '').toContain('noopener');
      expect(a.getAttribute('rel') ?? '').toContain('noreferrer');
      // https 以外のスキームが描画されていない
      expect(a.getAttribute('href') ?? '').toMatch(/^https:\/\//);
    });
  });

  it('再診断ボタンが動作する(コールバック呼び出し)', () => {
    const result = runDiagnosis({});
    let restarted = false;
    render(<Result result={result} onRestart={() => (restarted = true)} />);
    fireEvent.click(screen.getByRole('button', { name: 'もう一度診断する' }));
    expect(restarted).toBe(true);
  });

  it('本命カードに相性表示と芸人名がある', () => {
    const result = runDiagnosis({ food: 'adventurous', newshop: 'try_now' });
    render(<Result result={result} onRestart={() => {}} />);
    const firstName = result.destined[0].entity.name;
    const matches = screen.getAllByText(firstName);
    expect(matches.length).toBeGreaterThan(0);
    // 相性%表記
    expect(within(document.body).getAllByText(/%$/).length).toBeGreaterThan(0);
  });
});
