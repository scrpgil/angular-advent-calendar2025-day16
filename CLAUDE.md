# CLAUDE.md

このファイルはClaude Codeがこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

マイクロインタラクションのデモを実装したAngularアプリケーション。motion.jsを使用したアニメーションコンポーネントを多数含む。

## 技術スタック

- **フレームワーク**: Angular 21
- **アニメーション**: motion.js (旧Framer Motion)
- **スタイリング**: Tailwind CSS 4
- **テスト**: Vitest
- **言語**: TypeScript 5.9

## コマンド

- `npm start` - 開発サーバー起動
- `npm run build` - プロダクションビルド
- `npm test` - テスト実行

## デプロイメント

GitHub Pagesへのデプロイは`.github/workflows/deploy.yml`で自動化されている。

- mainブランチへのpush時に自動デプロイ
- `angular.json`の`baseHref`設定（production）でパスを調整
- デプロイ先: `https://scrpgil.github.io/angular-advent-calendar2025-day16/`

## コード規約

### Angularコンポーネント

- Signal APIを使用 (`signal()`, `computed()`, `effect()`)
- Input/Output APIを使用 (`input()`, `output()`, `input.required()`)
- `afterNextRender()`でDOM操作を行う
- `viewChild()`, `viewChildren()`で要素参照を取得
- テンプレートは`.html`ファイルに分離

### motion.jsアニメーション

DOM APIを使用してアニメーションを適用：

```typescript
import { animate } from 'motion';

// afterNextRender内でDOM要素にアニメーションを設定
afterNextRender(() => {
  animate(element, { scale: 1.2 }, { duration: 0.3 });
});
```

### ファイル構成

コンポーネントは`src/app/components/`配下に配置：
- `component-name/component-name.ts` - コンポーネントクラス
- `component-name/component-name.html` - テンプレート

### ソースコード表示

デモページでソースコードを表示する際は、コード重複を避けるためGitHub Raw URLから動的に取得する。
ハードコードされたソースコードをバンドルに含めない設計。

### Prettier設定

- printWidth: 100
- singleQuote: true
- HTMLファイルはangularパーサーを使用
