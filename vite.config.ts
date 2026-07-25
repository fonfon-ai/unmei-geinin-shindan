/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages のプロジェクトページ配下 (/unmei-geinin-shindan/) で
// アセットパスが壊れないように、本番ビルド時のみ base を設定する。
// リポジトリ名を変える場合は BASE_PATH 環境変数で上書きできる。
const repoBase = process.env.BASE_PATH ?? '/unmei-geinin-shindan/';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? repoBase : '/',
  plugins: [react()],
  build: {
    // 本番ビルドでソースマップを公開しない (要件: 不要な source map を公開しない)
    sourcemap: false,
    target: 'es2020',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
}));
