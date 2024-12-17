import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

interface TokenResponse {
    accessToken: string;
}

const KakaoCallback = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const isProcessing = useRef(false);

    useEffect(() => {
        const sendCodeToBackend = async () => {
            if (isProcessing.current) return;
            isProcessing.current = true;

            const searchParams = new URLSearchParams(window.location.search);
            const code = searchParams.get('code');

            if (!code) {
                setIsLoading(false);
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get<TokenResponse>(
                    'http://localhost:8080/api/v1/auth/code',
                    {
                        params: { code },
                        withCredentials: true
                    }
                );

                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                
                await new Promise(resolve => setTimeout(resolve, 100));
                
                setIsAuthenticated(true);
                navigate('/timeline', { replace: true });
            } catch (error) {
                console.error('Error during login:', error);
                navigate('/login', { replace: true });
            } finally {
                setIsLoading(false);
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