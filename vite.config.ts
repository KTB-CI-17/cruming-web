import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    define: {
      __KAKAO_KEY__: `"${env.VITE_KAKAO_REST_API_KEY}"`,
      __KAKAO_REDIRECT__: `"${env.VITE_KAKAO_LOGIN_REDIRECT_URL}"`
    }
  }
});