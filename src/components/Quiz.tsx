import { useEffect, useRef, useState } from 'react';
import { QUESTIONS } from '../data/questions';
import type { Answers } from '../types';

const CATEGORY_LABEL: Record<string, string> = {
  lifestyle: '生活習慣',
  personality: '性格',
  social: '人づきあい',
  media: '視聴スタイル',
  demographic: '任意項目',
};

export function Quiz({
  onComplete,
  onExit,
}: {
  onComplete: (answers: Answers) => void;
  onExit: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const advanceTimer = useRef<number | null>(null);

  const total = QUESTIONS.length;
  const q = QUESTIONS[index];
  const progress = Math.round((index / total) * 100);

  useEffect(() => {
    // 新しい質問にフォーカスを移し、スクリーンリーダーに読み上げさせる
    headingRef.current?.focus();
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, [index]);

  function goNext(next: Answers) {
    if (index + 1 >= total) {
      onComplete(next);
    } else {
      setIndex((i) => i + 1);
    }
  }

  function choose(optionId: string) {
    const next = { ...answers, [q.id]: optionId };
    setAnswers(next);
    // 選択のフィードバックを見せてから進む
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => goNext(next), 260);
  }

  function skip() {
    const next = { ...answers, [q.id]: null };
    setAnswers(next);
    goNext(next);
  }

  function back() {
    if (index === 0) {
      onExit();
    } else {
      setIndex((i) => i - 1);
    }
  }

  return (
    <main className="app-shell">
      <div className="quiz-top">
        <span className="progress-label">
          質問 {index + 1} / {total}
        </span>
        <button type="button" className="btn btn-ghost" onClick={back} style={{ minHeight: 40, padding: '6px 16px' }}>
          ← 戻る
        </button>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={index}
        aria-label="診断の進捗"
      >
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <p className="q-category">{CATEGORY_LABEL[q.category] ?? ''}</p>
      <h1 className="q-title" tabIndex={-1} ref={headingRef}>
        {q.title}
        {q.optional && <span className="q-optional">任意</span>}
      </h1>
      {q.help && <p className="q-help">{q.help}</p>}

      <div className="options" role="radiogroup" aria-label={q.title}>
        {q.options.map((opt) => {
          const selected = answers[q.id] === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-pressed={selected}
              className={`option${opt.neutral ? ' neutral' : ''}`}
              onClick={() => choose(opt.id)}
            >
              <span className="tick" aria-hidden="true">
                ✓
              </span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      <div className="quiz-nav">
        <span className="visually-hidden" aria-live="polite">
          質問 {index + 1} / {total}
        </span>
        {q.optional ? (
          <button type="button" className="btn btn-ghost" onClick={skip}>
            この質問をスキップ
          </button>
        ) : (
          <span />
        )}
      </div>
    </main>
  );
}
