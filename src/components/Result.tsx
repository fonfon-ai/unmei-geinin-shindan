import { useState } from 'react';
import type { DiagnosisResult, Program } from '../types';
import { RecommendationCard } from './RecommendationCard';
import { TypeEmblem } from './Art';
import {
  buildShareText,
  buildXShareUrl,
  buildLineShareUrl,
  buildWebShareData,
} from '../engine/share';

const REPO_URL = 'https://github.com/fonfon-ai/unmei-geinin-shindan';

function ProgramCard({ program }: { program: Program }) {
  return (
    <article className="card program-card">
      <div className="pc-name">{program.name}</div>
      <div className="rec-badges">
        <span className="badge era">{program.status}</span>
        <span className="badge">{program.broadcaster}</span>
        {program.programType.slice(0, 2).map((t) => (
          <span key={t} className="badge">
            {t}
          </span>
        ))}
      </div>
      <p className="rec-reason">{program.oneLiner}</p>
      {(program.officialVideoLinks.length > 0 || program.officialWebsite) && (
        <div className="link-row">
          {program.officialVideoLinks.map((l) => (
            <a
              key={l.url}
              className="link-chip"
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              ▶ {l.title}
              <span className="ext" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
          {program.officialWebsite && (
            <a
              className="link-chip"
              href={program.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
            >
              公式サイト
              <span className="ext" aria-hidden="true">
                ↗
              </span>
            </a>
          )}
        </div>
      )}
    </article>
  );
}

function ShareSection({ result }: { result: DiagnosisResult }) {
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }

  async function nativeShare() {
    const data = buildWebShareData(result);
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        /* ユーザーがキャンセルした等。無視。 */
      }
    } else {
      window.open(buildXShareUrl(result), '_blank', 'noopener,noreferrer');
    }
  }

  async function copyText() {
    const text = `${buildShareText(result)}\n${buildWebShareData(result).url}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast('共有文をコピーしました');
    } catch {
      showToast('コピーできませんでした');
    }
  }

  return (
    <section className="section" aria-labelledby="share-h">
      <div className="card share-card">
        <h2 id="share-h">結果をシェアする</h2>
        <p className="section-lead" style={{ marginBottom: 4 }}>
          共有されるのはタイプ名と芸人名だけ。あなたの回答は含まれません。
        </p>
        <div className="share-preview" aria-hidden="true">
          {buildShareText(result)}
        </div>
        <div className="share-buttons">
          <button type="button" className="btn btn-primary" onClick={nativeShare}>
            シェアする
          </button>
          <a
            className="btn btn-ghost"
            href={buildXShareUrl(result)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Xで投稿
          </a>
          <a
            className="btn btn-ghost"
            href={buildLineShareUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            LINEで送る
          </a>
          <button type="button" className="btn btn-ghost" onClick={copyText}>
            文をコピー
          </button>
        </div>
      </div>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </section>
  );
}

export function Result({
  result,
  onRestart,
}: {
  result: DiagnosisResult;
  onRestart: () => void;
}) {
  const { type } = result;
  return (
    <main className="app-shell result" style={{ ['--type-accent' as string]: type.accent }}>
      <header className="result-hero">
        <TypeEmblem accent={type.accent} seed={type.id} />
        <p className="type-kicker">あなたの診断タイプは</p>
        <h1 className="type-name">{type.name}</h1>
        <p className="type-catch">{type.catchphrase}</p>
      </header>

      <section className="section" aria-labelledby="persona-h">
        <div className="section-head">
          <h2 id="persona-h">あなたと笑いの相性</h2>
        </div>
        <div className="card persona-card">
          <p>{type.persona}</p>
          <p>{type.humorAffinity}</p>
        </div>
      </section>

      {result.firstVideos.length > 0 && (
        <section className="section" aria-labelledby="first-h">
          <div className="card first-video-card">
            <h2 id="first-h">まずはこの公式動画から</h2>
            <p className="watch-hint">
              迷ったら、まずは{result.suggestedMinutes}分だけ見てみてください。
            </p>
            <div className="video-list">
              {result.firstVideos.map((v) => (
                <a
                  key={v.url}
                  className="video-item"
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    <span className="vi-title">▶ {v.title}</span>
                    <br />
                    <span className="vi-src">{v.source}</span>
                  </span>
                  <span aria-hidden="true">↗</span>
                  <span className="visually-hidden">（新しいタブで開く）</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="destined-h">
        <div className="section-head">
          <h2 id="destined-h">あなたの運命のお笑い</h2>
        </div>
        <p className="section-lead">まずはこの人たちから。ピンと来た一組で大丈夫です。</p>
        <div className="rec-grid">
          {result.destined.map((v) => (
            <RecommendationCard key={v.entity.id} view={v} />
          ))}
        </div>
      </section>

      {result.beginner.length > 0 && (
        <section className="section" aria-labelledby="beginner-h">
          <div className="section-head">
            <h2 id="beginner-h">お笑い初心者にもおすすめ</h2>
          </div>
          <p className="section-lead">前提知識なしで、すっと笑える入りやすい人たちです。</p>
          <div className="rec-grid">
            {result.beginner.map((v) => (
              <RecommendationCard key={v.entity.id} view={v} />
            ))}
          </div>
        </section>
      )}

      {result.programs.length > 0 && (
        <section className="section" aria-labelledby="program-h">
          <div className="section-head">
            <h2 id="program-h">入口におすすめの番組</h2>
          </div>
          <div className="program-list">
            {result.programs.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        </section>
      )}

      {result.surprise && (
        <section className="section" aria-labelledby="surprise-h">
          <div className="section-head">
            <h2 id="surprise-h">意外に合うかもしれない一組</h2>
          </div>
          <p className="section-lead">
            いつもの好みとは少し違うけれど、試すと発見があるかもしれません。
          </p>
          <div className="rec-grid">
            <RecommendationCard view={result.surprise} />
          </div>
        </section>
      )}

      {result.crossGeneration && (
        <section className="section" aria-labelledby="cross-h">
          <div className="section-head">
            <h2 id="cross-h">別の世代からの一組</h2>
          </div>
          <p className="section-lead">世代を越えて、あなたに響きそうな笑いです。</p>
          <div className="rec-grid">
            <RecommendationCard view={result.crossGeneration} />
          </div>
        </section>
      )}

      {result.rakugo && (
        <section className="section" aria-labelledby="rakugo-h">
          <div className="section-head">
            <h2 id="rakugo-h">落語の入口に</h2>
          </div>
          <p className="section-lead">
            言葉で情景を描く話芸。まずはこの一人（と演目）から覗いてみては。
          </p>
          <div className="rec-grid">
            <RecommendationCard view={result.rakugo} />
          </div>
        </section>
      )}

      <ShareSection result={result} />

      <div className="result-actions">
        <button type="button" className="btn btn-primary" onClick={onRestart}>
          もう一度診断する
        </button>
      </div>

      <footer className="footer">
        <div className="foot-links">
          <a href={`${REPO_URL}/blob/main/PRIVACY.md`} target="_blank" rel="noopener noreferrer">
            プライバシー
          </a>
          <a href={`${REPO_URL}/blob/main/docs/data-sources.md`} target="_blank" rel="noopener noreferrer">
            情報の出典
          </a>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
            仕組み・ソース
          </a>
        </div>
        <p>
          回答はブラウザ内だけで処理し、サーバーへの送信も端末への保存もしません。
          アクセス解析も使用していません。これは心理検査や医学的診断ではなく、
          エンターテインメント目的の推薦です。
        </p>
        <p>
          芸人・落語家・番組情報は{result.destined[0]?.entity.lastVerifiedDate ?? '2026-07-21'}
          時点で公式情報をもとに確認したものです。配信状況は変わることがあります。
        </p>
      </footer>
    </main>
  );
}
