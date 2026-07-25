import { useCallback, useEffect, useState } from 'react';
import { Landing } from './components/Landing';
import { Quiz } from './components/Quiz';
import { Analyzing } from './components/Analyzing';
import { Result } from './components/Result';
import { runDiagnosis } from './engine';
import type { Answers, DiagnosisResult } from './types';

type Phase = 'landing' | 'quiz' | 'analyzing' | 'result';

export default function App() {
  const [phase, setPhase] = useState<Phase>('landing');
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // フェーズが変わったら先頭へスクロール(結果や質問の頭出し)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [phase]);

  const start = useCallback(() => setPhase('quiz'), []);
  const exitToLanding = useCallback(() => setPhase('landing'), []);

  const handleComplete = useCallback((answers: Answers) => {
    // 決定論的診断(ブラウザ内で完結)。回答は保存も送信もしない。
    setResult(runDiagnosis(answers));
    setPhase('analyzing');
  }, []);

  const restart = useCallback(() => {
    setResult(null);
    setPhase('quiz');
  }, []);

  switch (phase) {
    case 'quiz':
      return <Quiz onComplete={handleComplete} onExit={exitToLanding} />;
    case 'analyzing':
      return <Analyzing onDone={() => setPhase('result')} />;
    case 'result':
      return result ? (
        <Result result={result} onRestart={restart} />
      ) : (
        <Landing onStart={start} />
      );
    case 'landing':
    default:
      return <Landing onStart={start} />;
  }
}
