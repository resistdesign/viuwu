import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/viuwu/' : '/',
  build: {
    target: 'es2022',
  },
});
