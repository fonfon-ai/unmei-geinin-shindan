// 独自の抽象SVGアート(人物写真・ロゴ等は一切使用しない)。
// 決定論的に seed から形を作るので、同じタイプは同じ絵になる。

export function HeroArt() {
  return (
    <svg
      className="hero-art"
      viewBox="0 0 320 180"
      role="img"
      aria-label="笑いの吹き出しと星を配した抽象イラスト"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="1" stopColor="#c8503f" />
        </linearGradient>
      </defs>
      <circle cx="70" cy="80" r="46" fill="var(--accent-soft)" />
      <rect x="120" y="34" width="150" height="92" rx="22" fill="url(#g1)" opacity="0.92" />
      <path d="M150 126 l-14 22 l30 -14 z" fill="url(#g1)" opacity="0.92" />
      <circle cx="165" cy="80" r="9" fill="#fff" />
      <circle cx="205" cy="80" r="9" fill="#fff" />
      <path d="M158 96 q22 22 54 0" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" />
      <g fill="var(--accent)">
        <path d="M40 30 l4 10 l10 2 l-8 7 l2 11 l-8 -6 l-9 6 l2 -11 l-8 -7 l11 -2 z" />
      </g>
      <circle cx="286" cy="40" r="6" fill="var(--accent)" />
      <circle cx="30" cy="140" r="5" fill="#c8503f" />
    </svg>
  );
}

/** タイプごとのエンブレム。accent 色と id からユニークな幾何模様を生成。 */
export function TypeEmblem({ accent, seed }: { accent: string; seed: string }) {
  // seed から擬似乱数(決定論的)
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rot = h % 360;
  const petals = 5 + (h % 4);
  const points = Array.from({ length: petals }, (_, i) => {
    const a = (Math.PI * 2 * i) / petals + (rot * Math.PI) / 180;
    const r = 34;
    return `${44 + Math.cos(a) * r},${44 + Math.sin(a) * r}`;
  }).join(' ');
  return (
    <svg
      className="type-emblem"
      viewBox="0 0 88 88"
      role="img"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="44" cy="44" r="42" fill="none" stroke={accent} strokeWidth="2" opacity="0.5" />
      <polygon points={points} fill={accent} opacity="0.18" />
      <polygon points={points} fill="none" stroke={accent} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="44" cy="44" r="8" fill={accent} />
    </svg>
  );
}
