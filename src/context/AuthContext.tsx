import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (provider: 'kakao' | 'naver') => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        // 로컬 스토리지나 토큰을 확인하여 인증 상태 초기화
        const token = localStorage.getItem('auth_token');
        setIsAuthenticated(!!token);
    }, []);

    const login = async (provider: 'kakao' | 'naver') => {
        try {
            // 소셜 로그인 로직 구현
            // 성공 시 토큰을 로컬 스토리지에 저장
            const token = 'dummy_token'; // 실제 인증 토큰으로 대체
            localStorage.setItem('auth_token', token);
            setIsAuthenticated(true);
        } catch (error) {
            console.error(`${provider} login failed:`, error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
