import React from 'react';

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

    const handleDeleteAccount = () => {
        if (window.confirm('정말 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.')) {
            console.log("회원 탈퇴 처리");
            navigate('/login');
        }
    };

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

                    <button
                        onClick={handleDeleteAccount}
                        className="w-full px-4 py-4 text-left hover:bg-gray-50 focus:outline-none"
                    >
                        <span className="text-lg text-gray-700">회원 탈퇴</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// src/pages/profile/ProfilePage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useProfile } from "../../hooks/useProfile";
import { ProfileInfo } from "../../components/profile/ProfileInfo";
import { ProfileStats } from "../../components/profile/ProfileStats";
import { FollowButton } from "../../components/profile/FollowButton";
import {useAuth} from "../../context/AuthContext";

export default function ProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profile, loading, error, handleFollow } = useProfile(id);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="animate-spin" size={24} />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-gray-600">프로필을 불러올 수 없습니다.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-500 hover:underline"
                >
                    뒤로 가기
                </button>
            </div>
        );
    }

    const handleSettingsClick = () => {
        navigate('/settings');
    };

    return (
        <div className="page-container">
            <div className="flex flex-col gap-6">
                <ProfileInfo
                    profile={profile}
                    onSettingsClick={profile.isMe ? handleSettingsClick : undefined}
                />

                <ProfileStats
                    followers={profile.followerCount}
                    following={profile.followingCount}
                />

                {!profile.isMe && (
                    <div className="flex justify-center">
                        <FollowButton
                            isFollowing={profile.isFollowing || false}
                            isFollowingMe={profile.isFollowingMe}
                            onFollowClick={handleFollow}
                            className="w-[200px]"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export { Settings };