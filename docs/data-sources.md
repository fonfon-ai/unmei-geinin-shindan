# 情報の出典と確認日

**確認日: 2026-07-21**（各エントリの `lastVerifiedDate` / 番組は `statusVerifiedDate`）

## 確認方法

芸人・落語家・番組・チャンネルの事実確認は、Web検索・公式ページの取得により行いました。
情報源は以下の優先順位に従います。

1. 所属事務所の公式プロフィール
2. 芸人・落語家・番組・放送局の公式サイト
3. 公式YouTubeチャンネル
4. TVer・NHK・放送局・公式配信ページ
5. 本人の公式サイト・公式SNS
6. 信頼できる一次情報（賞レース公式・お笑いナタリー等）

まとめサイト・無断転載動画・出所不明の切り抜きは推薦・出典に用いていません。

各エントリの `sourceUrls` には、確認に用いた一次情報（公式プロフィールURL・公式チャンネルURL等）を
格納しています（許可ドメインの `https` URLのみ）。

## URLの掲載基準（重要）

- 掲載する `officialWebsite` / `officialVideoLinks` / チャンネルURL は、**実際に検索・取得で確認できたもののみ**です。想像でURLや動画IDを作っていません。
- 動画リンクは原則として**公式チャンネル（`@ハンドル` または `/channel/ID`）や公式配信ページ（TVer等）**を指します。個別動画IDへのディープリンクは、リンク切れや権利状況の変化に弱く、正確な帰属確認が難しいため、初版では原則採用していません（安定性と権利安全性を優先）。
- URLはコード（`src/engine/url.ts`）で `https`・許可ドメインを再検証し、通らないものはUIに一切描画しません。
- 確認できなかったURLは `null` / `[]` とし、架空データで補完していません。

## 出典として用いた主なドメイン

- 事務所公式: `profile.yoshimoto.co.jp` / `yoshimoto.co.jp`, `maseki.co.jp`, `p-jinriki.com`,
  `titan-net.co.jp`, `watanabepro.co.jp`, `horipro.co.jp`(`com.horipro.co.jp`),
  `shochikugeino.co.jp`, `sma.co.jp`, `sunmusic-gp.co.jp`, `grapecom.jp`, `kdashstage.jp`,
  `ash-d.info`, `twinkle-co.co.jp`, `bampeiyu.com`, `izawaoffice.jp`, `nichien-pro.jp`,
  `chatterbox.co.jp`, `ken-on.co.jp`, `kohen.works`, `565656.co.jp`, `ohtapro.co.jp`,
  `hagimoto-kikaku.co.jp`
- 落語 協会・事務所: `rakugo-kyokai.jp`（落語協会）, `geikyo.com`（落語芸術協会）,
  `kamigatarakugo.jp`（上方落語協会）, `beicho.co.jp`（米朝事務所）
- 動画・配信: `youtube.com`, `tver.jp`, `nhk.jp`/`nhk.or.jp`, `abema.tv`,
  `primevideo.com`/`amazon.co.jp`, `netflix.com`
- 賞レース・放送局: `m-1gp.com`, `king-of-conte.com`, `r-1gp.com`,
  `tv-asahi.co.jp`, `asahi.co.jp`, `fujitv.co.jp`, `tbs.co.jp`, `tv-tokyo.co.jp`,
  `ntv.co.jp`, `ktv.jp`, `tsk-tv.com`

## 確認中に反映した主な訂正・注意点

事実確認の過程で判明し、データに反映した主な点（抜粋）:

- 所属の訂正: さまぁ〜ず＝ホリプロ、ハリウッドザコシショウ＝ソニー(SMA)、ランジャタイ＝グレープカンパニー、
  サルゴリラ＝吉本、どぶろっく＝浅井企画、JP＝研音、TIM＝ワタナベ、江頭2:50＝ばんぺいゆ、清水ミチコ＝ジャムハウス 等。
- 状態: 和牛（2024年3月解散）、天竺鼠（2026年1月解散）、ラーメンズ（小林賢太郎引退により実質活動終了＝hiatus）、
  ロンドンブーツ1号2号（2025年解散）、志村けん・いかりや長介ら故人 を正確に区別。
- 番組の放送局訂正: ゴッドタン/あちこちオードリー＝テレビ東京、ドキュメンタル/FREEZE＝Amazon Prime、
  LIGHTHOUSE＝星野源×若林（Netflix、佐久間宣行演出）、神田伯山の黒歴史＝NHK。
- 読み: 東京03＝「とうきょうゼロさん」、ダウ90000＝「ダウきゅうまん」。
- 落語の代数・物故: 志ん朝(3代目/2001没)、圓生(6代目/1979没)、小三治(10代目/2021没)、
  米朝(3代目/2015没)、枝雀(2代目/1999没)、談志(7代目/2011没)、文枝(6代目/現役・新作) 等を確認。
  上方落語協会の正しいドメインは `kamigatarakugo.jp`。講談師の神田伯山は落語家ではないため除外。

## 配信状況・情報の鮮度について

放送/配信状況は変化します。本データは確認日時点の情報であり、視聴時にリンク切れや配信終了の
可能性があります。`activeStatus` / `status` / `lastVerifiedDate` を手がかりに、必要に応じて
公式情報で最新状況をご確認ください。将来の再検証時は、リンクの生存・状態・出典の見直しを推奨します。
