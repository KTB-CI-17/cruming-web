interface ImportMetaEnv {
    readonly VITE_KAKAO_REST_API_KEY: string;
    readonly VITE_KAKAO_LOGIN_REDIRECT_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}