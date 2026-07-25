# カタログ方針

## 収録数（初版）

| 区分 | 収録数 | 初版目標 |
|---|---|---|
| 芸人・コンビ・グループ | 100 組 | 80（可能なら100+） |
| 落語家 | 18 名 | 12 |
| 番組・配信コンテンツ | 34 件 | 30 |
| 公式/正当な動画・チャンネルリンク | 約110 件 | 60 |

（芸人100 + 落語家18 = 118 エンティティ。動画リンクは各エントリの公式YouTubeチャンネル63件＋番組の公式動画/配信22件＋公式チャンネル一覧25件の合計。）

## 網羅の方針

### 時代

昭和・平成前期・平成後期・令和・現在伸びている若手を網羅。結成年だけで機械的に分類せず、
主な活動時期・ブレイク時期を考慮して `era` を判定（例: とんねるずはブレイクが昭和のため `showa`）。
故人・解散・活動休止・現役を `activeStatus` で明確に区別。

### 形式

漫才・コント・ピン芸・トーク・大喜利・ロケ・リアクション・モノマネ・キャラクター芸・シュール・
言葉/構造型・関係性/ラジオ型・観察型・音楽/リズムネタ・落語 を網羅。

### 所属・系統

特定事務所に偏らない。**芸人の約半数（50組）は吉本興業以外**（人力舎・タイタン・ワタナベ・
ソニー(SMA)・マセキ・太田プロ・グレープカンパニー・ホリプロ/ホリプロコム・松竹芸能・
ケイダッシュステージ・サンミュージック・チャッターボックス・研音・浅井企画・ニチエン 等）。
テレビ中心/劇場中心/ラジオ・YouTube・ネットから入りやすい候補をバランスよく含む。

### 落語

初心者が名前を知っている/入口にしやすいメジャーな落語家を中心に、古典/新作・江戸/上方・
滑稽噺/人情噺・初心者向け・短時間で見やすい演目 をバランスよく収録。名跡・代数・現役/物故を
正確に記載し、同名の落語家を混同しない。講談師（神田伯山等）は落語家ではないため含めない。

## 構造化データ項目

各候補は以下を持つ（`src/types.ts` の `Entity`）。派生値（`humor`, `verbalVisualBalance`,
`prerequisiteKnowledge`, `recommendedMood`, `recommendedDuration`, `sourceUrls`）は
`src/data/catalog.ts` のビルド時に、確認済みの事実・タグ・公式URLから導出する。

`id / name / reading / category / era / activeStatus / primaryFormats / styleTags /
personalityAffinity(=humor) / intensity / pace / verbalVisualBalance / beginnerAccessibility /
prerequisiteKnowledge / recommendedMood / recommendedDuration / recommendationReason /
officialWebsite / officialVideoLinks / sourceUrls / lastVerifiedDate`（落語は加えて `school /
repertoireType / recommendedEntryPiece`）。

## 正確性・掲載基準

- 実在が確認できない候補・URLは掲載しない。**架空データで数を埋めない。**
- URL・動画タイトルを想像で作らない。確認できないものは `null` / `[]` とする。
- 動画は「公式チャンネル/正当な権利者による公開・実在確認済み・URL確認済み・初心者への推薦理由を説明できる」もののみ。まとめサイト・無断転載・出所不明の切り抜きは掲載しない。
- 番組は現在放送/配信中か過去番組かを `status` で区別し、確認日（`statusVerifiedDate`）を持つ。
- URLは許可リスト方式・`https` のみをコードで検証（`src/engine/url.ts`）。検証を通らないURLはUIに描画しない。

## 画像・著作権

- 芸人写真・番組画像・ロゴ・似顔絵を一切複製・再配布・ホットリンクしない。
- 初版は独自の図形・配色・文字・CSS装飾でデザインする。人物写真は使わない。
- 動画は初版では**公式チャンネル等への安全なテキストリンク/カード**を優先し、埋め込みは行わない
  （外部通信・Cookieの複雑化を避けるため）。
