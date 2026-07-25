import '@testing-library/jest-dom/vitest';

// jsdom は window.scrollTo を実装しないためテスト用にスタブ化する
window.scrollTo = () => {};
