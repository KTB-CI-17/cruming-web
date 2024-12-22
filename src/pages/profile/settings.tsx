import React from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        if (window.confirm('정말 로그아웃 하시겠습니까?')) {
            try {
                await logout();
                navigate('/login');
            } catch (error) {
                console.error('Logout failed:', error);
                alert('로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    // const handleDeleteAccount = () => {
    //     if (window.confirm('정말 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.')) {
    //         console.log("회원 탈퇴 처리");
    //         navigate('/login');
    //     }
    // };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-xl mx-auto">
                <div className="divide-y divide-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-4 text-left hover:bg-gray-50 focus:outline-none"
                    >
                        <span className="text-lg text-gray-700">로그아웃</span>
                    </button>

                    {/*<button*/}
                    {/*    onClick={handleDeleteAccount}*/}
                    {/*    className="w-full px-4 py-4 text-left hover:bg-gray-50 focus:outline-none"*/}
                    {/*>*/}
                    {/*    <span className="text-lg text-gray-700">회원 탈퇴</span>*/}
                    {/*</button>*/}
                </div>
            </div>
        </div>
    );
};

export default Settings;