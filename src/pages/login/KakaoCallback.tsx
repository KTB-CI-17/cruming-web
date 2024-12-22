import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { api } from '../../config/axios';

interface TokenResponse {
    accessToken: string;
}

const KakaoCallback = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');

        const sendCodeToBackend = async () => {
            if (!code) {
                setIsLoading(false);
                navigate('/login');
                return;
            }

            try {
                const response = await api.get<TokenResponse>(
                    '/auth/code',
                    {
                        params: { code }
                    }
                );

                localStorage.setItem('accessToken', response.data.accessToken);
                setIsAuthenticated(true);
                setIsLoading(false);
                navigate('/', { replace: true });
            } catch (error) {
                console.error('Error during login:', error);
                setIsLoading(false);
                navigate('/login', { replace: true });
            }
        };

        sendCodeToBackend();
    }, [navigate, setIsAuthenticated]);

    if (isLoading) {
        return <div>로그인 처리중...</div>;
    }

    return null;
};

export default KakaoCallback;