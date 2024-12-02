import { useParams, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import {useProfile} from "../../hooks/useProfile.ts";
import {ProfileInfo} from "../../components/profile/ProfileInfo.tsx";
import {ProfileStats} from "../../components/profile/ProfileStats.tsx";
import {FollowButton} from "../../components/profile/FollowButton.tsx";

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