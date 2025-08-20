import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  base: mode === 'production' ? '/NumberGuessingGame/' : '/',
  build: {
    outDir: 'dist',
  },
}));
