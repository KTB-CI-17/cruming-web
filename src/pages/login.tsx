import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

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
                            src={'/src/assets/logo.png'}
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
                            src={'/src/assets/icon/kakao.png'}
                            alt="카카오 로고"
                            className="w-5 h-5 mr-2"
                        />
                        <span className="text-black font-medium">카카오 로그인</span>
                    </button>

                    <button
                        onClick={() => handleSocialLogin('naver')}
                        className="flex items-center justify-center w-full px-4 py-3 bg-[#03C75A] rounded-lg shadow-md transition-transform hover:scale-[1.02]"
                    >
                        <img
                            src={'/src/assets/icon/naver.png'}
                            alt="네이버 로고"
                            className="w-5 h-5 mr-2"
                        />
                        <span className="text-white font-medium">네이버 로그인</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;