import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0', // 외부에서 접근할 수 있도록 설정
        port: 5173, // 기본 포트 설정 (변경하지 않아도 괜찮음)
        open: true, // 서버 시작 시 자동으로 브라우저 열기 (선택 사항)
    },
    resolve: {
        alias: {
            '@': '/src', // 경로 별칭 설정
        }
    },
    envPrefix: 'VITE_', // 환경 변수 접두사 설정
});
