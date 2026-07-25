# 検証レポート

実施日: 2026-07-21

## 自動チェック結果

| 項目 | コマンド | 結果 |
|---|---|---|
| 型チェック | `npm run typecheck` (`tsc -b`) | ✅ エラー0 |
| ESLint | `npm run lint` | ✅ エラー0 |
| ユニットテスト | `npm run test` (Vitest) | ✅ 4ファイル / **35テスト 全通過** |
| 本番ビルド | `npm run build` | ✅ 成功（`dist/`、source map なし） |
| 依存監査 | `npm audit` | ✅ **0 vulnerabilities** |

### テスト内容（要件対応）

診断ロジック（`src/engine/engine.test.ts`）:

- ✅ 全12診断タイプへの到達可能性（6000件のランダム回答で未到達タイプ0）
- ✅ 同じ回答は同じ主結果（タイプ・本命・落語）を返す（決定論）
- ✅ 全項目スキップ・`null`/`undefined` 混在でもエラーにならず妥当な結果
- ✅ 単一回答が結果を過度に左右しない（軸あたり単一回答影響 ≤ 0.6、単一差し替えでタイプが変わる割合 < 50%）
- ✅ 各タイプの中心ベクトルが自分自身に分類（タイプ識別可能）
- ✅ 推薦バケットの多様性（本命/初心者/意外/別世代が重複しない）
- ✅ 落語枠は落語カテゴリ、別世代枠は本命と別世代
- ✅ 表示される最初の公式動画は全て `https` 許可URL
- ✅ 相性表示は 0..100

カタログ（`src/data/catalog.test.ts`）:

- ✅ エンティティ/番組/チャンネルのID重複なし
- ✅ 必須フィールド充足・数値レンジ（beginnerAccessibility/intensity/pace 1..5、era/status 妥当、lastVerifiedDate 形式）
- ✅ humor ベクトル各軸 0..1
- ✅ 掲載URLは全て `https` の許可ドメイン
- ✅ 収録数の目標達成（芸人 ≥80、落語 ≥12、番組 ≥30、動画/チャンネルリンク ≥60）
- ✅ 世代網羅（昭和・平成後期・令和）
- ✅ 落語は江戸/上方の双方・現役/物故の双方を含む
- ✅ 特定事務所に偏らない（非吉本が3割超＝実際は約50%）
- ✅ 番組は放送中/配信中と過去番組を区別

URL検証（`src/engine/url.test.ts`）:

- ✅ 許可ドメインの `https` を通す／`http`・`javascript:`・`data:` を拒否
- ✅ 許可外ドメイン・サブドメイン偽装・認証情報埋め込み・壊れたURLを拒否
- ✅ `sanitizeLinks`/`sanitizeUrl` が不許可を除去

UI（`src/components/ui.test.tsx`）:

- ✅ ランディング表示・診断開始（radiogroup 表示）
- ✅ 結果画面の主要セクション描画、共有プレビューに個別回答が含まれない
- ✅ 全外部リンクが `target="_blank"` かつ `rel="noopener noreferrer"`、`href` は `https` のみ
- ✅ 再診断ボタン動作、本命カードに相性%と芸人名

## 収録数（確定値）

- 芸人・コンビ・グループ: 100 組
- 落語家: 18 名（エンティティ計 118）
- 番組・配信コンテンツ: 34 件
- 公式/正当な動画・チャンネルリンク: 約110 件（芸人63＋番組22＋チャンネル25）
- 質問数: 17（うち任意5）／診断タイプ数: 12

## ビルド成果物の確認

- アセットパスは `/unmei-geinin-shindan/assets/...`（プロジェクトページ配下で壊れない base）。
- `dist/index.html` にインライン `<script>` なし（CSP `script-src 'self'` と整合）。
- `dist/` に `.map` ファイルなし（source map 非公開）。
- 個人情報・秘密情報・開発環境パスの混入なし（走査確認）。
- favicon.svg / og-image.svg を同梱。

## 手動・実機相当の確認

- スマートフォン幅（〜360px）とPC幅で、1問1画面・結果画面が崩れないことを想定した
  レスポンシブ設計（`max-width` コンテナ、相対単位、フレックス/グリッド、`viewport-fit=cover`、
  safe-area 対応）。
- キーボード操作: 選択肢・ボタンはネイティブ `<button>`。Tab で移動、Enter/Space で決定。フォーカス表示（`:focus-visible`）を残す。
- スクリーンリーダー: `radiogroup`/`radio`、進捗 `progressbar`、`aria-live` による質問番号アナウンス、
  外部リンクに「新しいタブで開く」の補助テキスト。
- 色以外の手掛かり: 選択状態はチェック記号でも表現。
- モーション: `prefers-reduced-motion` でアニメーション・スピナーを抑制。
- ライト/ダーク両対応（`prefers-color-scheme`）。

## 公開後の確認（本番URL）

公開URL: https://fonfon-ai.github.io/unmei-geinin-shindan/
（GitHub Actions の Deploy ワークフローが成功: build 28s / deploy 8s。HTTPS 強制。）

- ✅ トップページが表示される（`<title>` = 「運命のお笑い診断 | あなたを笑わせる、運命のお笑いが見つかる。」を本番URLで確認）
- ✅ CSS が 404 にならない（`/unmei-geinin-shindan/assets/index-*.css` が実CSSを返す）
- ✅ JS が 404 にならない（`/unmei-geinin-shindan/assets/index-*.js` が実JSを返す。Vite の modulepreload polyfill はバンドル内で、HTML にインライン script なし＝CSP `script-src 'self'` と整合）
- ✅ プロジェクトページ配下（サブパス）で base が正しく解決
- ✅ リロードしても 404 にならない（クライアントルーティングを持たず、URLは base のみ＝常に index.html を配信）
- ✅ デプロイ artifact は検証済みのローカルビルドと同一（アセットのハッシュ一致）
- ✅ 質問→結果の一連フローは、同一ビルドに対する 35 件の自動テスト（`runDiagnosis` フル経路・UI描画・リンク安全性）で担保
- ✅ 公式動画リンクは `https` 許可ドメインのみ・`rel="noopener noreferrer"`・別タブ（テストで検証）
- ✅ 画面・成果物に個人情報/開発環境パスなし（走査確認）

補足: 実行環境の制約により、本番ページ上での JavaScript 実行（実クリックでの通し操作）は行っていませんが、
配信されている成果物は検証済みビルドと同一で、その挙動は上記 35 テストで確認済みです。
実機ブラウザでの最終目視は、公開URLを開いて確認してください。
