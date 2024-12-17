/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_KAKAO_REST_API_KEY: string;
    readonly VITE_KAKAO_LOGIN_REDIRECT_URL: string;
    readonly VITE_BACKEND_API_BASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}