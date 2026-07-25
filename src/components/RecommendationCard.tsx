import type { OfficialVideoLink, RecommendationReasonView } from '../types';
import { CATEGORY_LABEL, ERA_LABEL, STATUS_LABEL } from './labels';

function ExternalLink({ link }: { link: OfficialVideoLink }) {
  return (
    <a className="link-chip" href={link.url} target="_blank" rel="noopener noreferrer">
      <span>▶ {link.title}</span>
      <span className="ext" aria-hidden="true">
        ↗
      </span>
      <span className="visually-hidden">（新しいタブで開く）</span>
    </a>
  );
}

export function RecommendationCard({ view }: { view: RecommendationReasonView }) {
  const e = view.entity;
  const isRakugo = e.category === 'rakugo';
  return (
    <article className="card rec-card">
      <div className="rec-top">
        <div>
          <div className="rec-name">{e.name}</div>
          <div className="rec-reading">{e.reading}</div>
        </div>
      </div>

      <div className="rec-badges">
        <span className="badge era">{ERA_LABEL[e.era]}</span>
        <span className="badge">{CATEGORY_LABEL[e.category] ?? ''}</span>
        {e.activeStatus !== 'active' && (
          <span className={`badge status-${e.activeStatus}`}>{STATUS_LABEL[e.activeStatus]}</span>
        )}
        {isRakugo && e.school && <span className="badge">{e.school}落語</span>}
        {isRakugo &&
          e.repertoireType?.slice(0, 2).map((r) => (
            <span key={r} className="badge">
              {r}
            </span>
          ))}
      </div>

      <p className="rec-reason">{view.reason}</p>

      {isRakugo && e.recommendedEntryPiece && (
        <p className="rec-reason" style={{ marginTop: -4 }}>
          <b>入口におすすめの演目：</b>
          {e.recommendedEntryPiece}
        </p>
      )}

      <div className="affinity" aria-label={`相性 ${view.affinity} パーセント`}>
        <span className="badge" aria-hidden="true">
          相性
        </span>
        <div className="affinity-track" aria-hidden="true">
          <div className="affinity-fill" style={{ width: `${view.affinity}%` }} />
        </div>
        <span className="affinity-num">{view.affinity}%</span>
      </div>

      {(e.officialVideoLinks.length > 0 || e.officialWebsite) && (
        <>
          <div className="link-row">
            {e.officialVideoLinks.map((l) => (
              <ExternalLink key={l.url} link={l} />
            ))}
            {e.officialWebsite && (
              <a
                className="link-chip"
                href={e.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
              >
                公式プロフィール
                <span className="ext" aria-hidden="true">
                  ↗
                </span>
              </a>
            )}
          </div>
          {e.officialVideoLinks[0] && (
            <p className="link-source">
              動画リンク元：{e.officialVideoLinks.map((l) => l.source).join(' / ')}
            </p>
          )}
        </>
      )}
    </article>
  );
}
