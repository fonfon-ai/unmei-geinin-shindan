import { HeroArt } from './Art';
import { QUESTIONS } from '../data/questions';
import { CATALOG_STATS } from '../data/catalog';

export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <main className="app-shell landing">
      <span className="brand-badge">運命のお笑い診断</span>
      <h1>あなたを笑わせる、運命のお笑いが見つかる。</h1>
      <HeroArt />
      <p className="lead">
        休日の過ごし方や生活習慣、性格についての簡単な質問に答えるだけ。
        まだ知らない芸人・落語家・番組・動画との出会いを提案します。
      </p>
      <p className="desc">
        お笑いの知識はいりません。全{QUESTIONS.length}問・約2分。登録も不要です。
      </p>

      <button type="button" className="btn btn-primary" onClick={onStart}>
        無料で診断する →
      </button>

      <ul className="meta-list">
        <li>
          <b>あなたの回答はどこにも送信・保存されません。</b>{' '}
          診断はすべてブラウザの中だけで完結します。
        </li>
        <li>
          <b>{CATALOG_STATS.comedians}組の芸人・{CATALOG_STATS.rakugo}名の落語家</b>と、
          {CATALOG_STATS.programs}本の番組から、あなたに合う入口を提案します。
        </li>
        <li>
          昭和から令和の若手、落語まで。特定の世代・事務所に偏らないカタログです。
        </li>
      </ul>

      <p className="disclaimer">
        これは心理検査や医学的診断ではなく、エンターテインメント目的の推薦です。
        結果は「絶対」ではなく、新しい出会いのきっかけとしてお楽しみください。
      </p>
    </main>
  );
}
