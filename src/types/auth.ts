export interface Auth {
    id: string;
    nickname: string;
    profileImage?: string;
}

export interface AuthResponse {
    user: Auth;
    token: string;
}