import { useEffect, useState } from 'react';

const STEPS = [
  'あなたの回答を読み解いています',
  '笑いの好みの傾向を推定しています',
  '運命の芸人を探しています',
];

export function Analyzing({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const total = reduce ? 400 : 1900;
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setStep(1), total * 0.33));
    timers.push(window.setTimeout(() => setStep(2), total * 0.66));
    timers.push(window.setTimeout(onDone, total));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [onDone]);

  return (
    <main className="app-shell analyzing" aria-busy="true">
      <div className="spinner" aria-hidden="true" />
      <h2 aria-live="polite">{STEPS[step]}…</h2>
      <p>すべてこの端末の中だけで計算しています。</p>
      <ol className="analyzing-steps">
        {STEPS.map((s, i) => (
          <li key={s} className={i <= step ? 'on' : ''}>
            {i < step ? '✓ ' : i === step ? '… ' : '　'}
            {s}
          </li>
        ))}
      </ol>
    </main>
  );
}
