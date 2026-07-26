# セキュリティポリシー

## 脆弱性の報告

セキュリティ上の問題を発見した場合は、公開の Issue に詳細（再現手順を含む）を書く前に、
可能であればリポジトリの「Security Advisories（Report a vulnerability）」機能を通じて非公開でご報告ください。
軽微なものは Issue でも構いません。対応でき次第、修正します。

## このアプリの設計上のセキュリティ特性

本サービスは完全静的なクライアントサイド・アプリケーションであり、攻撃対象領域を意図的に小さくしています。

- サーバー・データベース・認証を持たない（バックエンドがない）。
- 実行時に外部API・外部LLM・シークレットを使用しない。
- ユーザー入力（回答）を HTML として挿入しない。`dangerouslySetInnerHTML` を使用しない。
- `eval` / `new Function` / `document.write` を使用しない（ESLint でも禁止）。
- URL は許可リスト方式で検証し、`https` の公式ドメインのみを描画する。`javascript:` 等のスキームは拒否。
- 外部リンクには `rel="noopener noreferrer"` を付与する。
- URL のクエリ・ハッシュの内容を HTML として表示しない。
- 外部SNS（X・LINE等）への共有機能を持たない（結果を外部へ送信・投稿する導線がない）。
- 本番ビルドで source map を公開しない。
- Content-Security-Policy を meta タグで宣言（GitHub Pages で表現可能な範囲）。

詳細な監査結果は [docs/security-review.md](docs/security-review.md) を参照してください。

## 依存関係とCI

- 依存パッケージは必要最小限に留めています。
- Dependabot（`.github/dependabot.yml`）で npm と GitHub Actions の更新を週次で監視します。
- GitHub Actions は最小権限（既定 `permissions: {}`、デプロイジョブのみ `pages: write` / `id-token: write`）で構成し、`pull_request_target` は使用しません。
- `npm audit` で重大・高リスクの脆弱性がないことを確認しています。

## サポート範囲

最新の `main` ブランチのみをサポート対象とします。
