import React, { createContext, useState, useContext, useEffect } from 'react';
import { Auth } from '../types/auth';

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    user: Auth | null;
    loading: boolean;
    login: (provider: 'kakao' | 'naver') => Promise<void>;
    logout: () => Promise<void>;
    getValidToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<Auth | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (window.location.pathname === '/login') {
            setLoading(false);
            return;
        }
        checkAuth();
    }, []);

    const login = async (provider: 'kakao' | 'naver') => {
        if (provider === 'kakao') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_LOGIN_REDIRECT_URL}&response_type=code`;
            window.location.href = kakaoURL;
        }
    };

    const getValidToken = async (): Promise<string | null> => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return null;
        return accessToken;
    };

    async function checkAuth() {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }
            setIsAuthenticated(true);
            setLoading(false);
        } catch (error) {
            console.error('Error checking auth:', error);
            setLoading(false);
        }
    }

    async function logout() {
        try {
            localStorage.removeItem('accessToken');
            setIsAuthenticated(false);
            setUser(null);
            window.location.href = '/login';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            isAuthenticated,
            setIsAuthenticated,
            getValidToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};