import React from 'react';
import {useNavigate, useLocation, Navigate} from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import mainLogo from '@/assets/logo.png';
import kakaoIcon from '@/assets/icon/kakao.png';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, login } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/timelines" replace />;
    }

    const handleSocialLogin = async (provider: 'kakao' | 'naver') => {
        try {
            await login(provider);
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (error) {
            console.error(`${provider} login failed:`, error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md space-y-8 p-8">
                <h1 className="text-2xl text-[#6B4EFF] text-center font-medium leading-9">
                    나 만 의 클 라 이 밍<br />커 뮤 니 티
                </h1>

                <div className="flex justify-center">
                    <div className="w-64 h-64 mb-4">
                        <img
                            src={mainLogo}
                            alt="로고"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => handleSocialLogin('kakao')}
                        className="flex items-center justify-center w-full px-4 py-3 bg-[#FEE500] rounded-lg shadow-md transition-transform hover:scale-[1.02]"
                    >
                        <img
                            src={kakaoIcon}
                            alt="카카오 로고"
                            className="w-5 h-5 mr-2"
                        />
                        <span className="text-black font-medium">카카오 로그인</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;