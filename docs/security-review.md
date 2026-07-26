# セキュリティレビュー

実施日: 2026-07-21 / 対象: 公開前の `main` 相当

## サマリ

完全静的なクライアントサイド・アプリで攻撃対象領域は小さい。要件のセキュリティ項目を確認し、
重大・高リスクの既知脆弱性は解消済み（`npm audit`: 0 件）。ビルド成果物に秘密情報・個人情報・
開発環境パスの混入なし。

## チェックリストと結果

| 項目 | 結果 | 補足 |
|---|---|---|
| 秘密鍵・APIキー・トークン・認証情報をコードに含めない | ✅ | 実行時にシークレット不要。ソース/成果物を走査し検出なし |
| `.env`・認証ファイル・個人設定・ローカルパスをコミットしない | ✅ | `.gitignore` で除外。トラッキング対象に該当ファイルなし |
| `.gitignore` を適切に設定 | ✅ | node_modules/dist/coverage/各種鍵・env・credentials 等を除外 |
| ユーザー回答を送信・保存・追跡しない | ✅ | バックエンド無し。localStorage/Cookie/解析いずれも未使用 |
| Google Analytics 等・広告SDKを導入しない | ✅ | 解析/広告コードなし |
| フォーム入力を HTML として挿入しない | ✅ | ユーザー入力は選択肢IDのみ。文字列を dangerouslySetInnerHTML 等で挿入しない |
| `dangerouslySetInnerHTML` 不使用 | ✅ | ESLint ルールで禁止 |
| `eval` / `new Function` / `document.write` 不使用 | ✅ | ESLint（no-eval, no-implied-eval, 独自 no-restricted-syntax）で禁止 |
| 外部リンクに `rel="noopener noreferrer"` | ✅ | 全外部リンクに付与（UIテストで検証） |
| `javascript:` URL を許可しない | ✅ | URL検証で `https` 以外を拒否（テストで検証） |
| 推薦データ内URLを許可リスト方式で検証 | ✅ | `src/engine/url.ts`。許可ドメインの `https` のみ描画 |
| URL は `https` のみ許可 | ✅ | 同上 |
| URLパラメータ/ハッシュを HTML 表示しない | ✅ | クエリ/ハッシュを読み取って描画する処理なし |
| 外部SNSへの共有機能を持たない | ✅ | X/LINE等への共有ボタンは実装しない。結果を外部送信・投稿する導線なし |
| 不要な外部通信を発生させない | ✅ | 実行時通信は外部リンクの別タブ遷移のみ |
| 不要な依存を追加しない / `npm audit` | ✅ | 依存は必要最小限。`npm audit`: **0 vulnerabilities** |
| GitHub Actions を最小権限に | ✅ | 既定 `permissions: {}`、deployのみ `pages: write`/`id-token: write` |
| Pages 公開以外の書き込み権限を与えない | ✅ | build ジョブは `contents: read` のみ |
| `pull_request_target` を使用しない | ✅ | 使用なし |
| Actions のバージョン固定 | ✅ | 公式 Pages Actions を安定メジャー（v4/v5）で固定（将来 SHA 固定も可） |
| 信頼できない入力を shell へ展開しない | ✅ | ワークフローに未検証入力の shell 展開なし |
| Dependabot 設定 | ✅ | `.github/dependabot.yml`（npm・Actions を週次） |
| SECURITY.md / PRIVACY.md | ✅ | 作成済み |
| 差別的な結果を生成しない | ✅ | 年齢・性別・飲酒・喫煙で結果を直接決めない（重み0/極小）。推薦理由にも出さない |
| 本番で source map を公開しない | ✅ | `build.sourcemap: false`。`dist/` に `.map` なし |

## Content-Security-Policy（meta）

`index.html` に meta CSP を宣言:

```
default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self';
style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';
connect-src 'self'; frame-src 'none'; form-action 'none'; manifest-src 'self'
```

- 本番ビルドの HTML にインライン `<script>` は無く（確認済み）、`script-src 'self'` で成立。
- `style-src` に `'unsafe-inline'` を含むのは、React の style 属性と Vite 注入スタイルのため。
- 外部リンク（YouTube/TVer等）は「別タブへのナビゲーション」であり CSP の `fetch` 制約対象外のため正常に開く。
- **GitHub Pages は HTTP レスポンスヘッダーを設定できない**ため、`frame-ancestors` や
  `X-Frame-Options`・`Strict-Transport-Security` 等のヘッダーは本アプリからは付与できない
  （meta では `frame-ancestors` は無効）。この制約を正しく認識しており、ヘッダー設定済みと誤認していない。
  クリックジャッキング耐性を厳密化する場合は、ヘッダーを付与できるホスティングが必要。

## 依存関係の監査

- `npm audit`: **0 vulnerabilities**。
- 監査対応の記録: 新しく公開された `brace-expansion` の DoS 系アドバイザリ（dev ツールの
  eslint→minimatch 依存）を、eslint を v10 系へ更新し `brace-expansion` を修正版(5.0.8)に固定して解消。
  なお当該依存は開発時のみで、公開される `dist/` には含まれない。

## ビルド成果物・ソースの走査

- `dist/` と `src/`・設定ファイルを走査し、Windowsユーザー名・絶対パス（`C:\Users` 等）・
  個人メール・実名・GitHubトークン・AWSキー・秘密鍵ヘッダを**検出せず**。
- 画面上に個人情報や開発環境パスを表示する箇所なし。

## Git identity

- 新規コミットは、リポジトリの公開用 identity `fonfon-ai <279184718+fonfon-ai@users.noreply.github.com>`
  （GitHub の noreply メール）でのみ行う。実名・個人メールは使用しない。
- 既存の他リポジトリの Git 履歴は書き換えない（本プロジェクトは新規ディレクトリで独立初期化）。
