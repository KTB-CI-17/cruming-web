import { Loader } from 'lucide-react';
import { ProfileInfo } from "../../components/profile/ProfileInfo";
import { FollowCountArea } from "../../components/profile/FollowCountArea";
import { FollowButton } from "../../components/profile/FollowButton";
import { useNavigate, useParams } from "react-router-dom";
import {useProfile} from "../../hooks/useProfile";

const ProfileButton = ({
                           onClick,
                           className = ''
                       }: {
    onClick: () => void;
    className?: string;
}) => {
    return (
        <button
            onClick={onClick}
            className={`
                px-6 py-2 rounded-lg font-medium text-sm
                transition-colors duration-200
                bg-gray-100 text-gray-700
                ${className}
            `}
        >
            프로필 수정
        </button>
    );
};

export default function ProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profile, loading, error, toggleFollow } = useProfile(id);

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
        navigate('/profile/edit');
    };

    return (
        <div className="flex flex-col h-full bg-white page-container">
            <div className="max-w-screen-sm mx-auto w-full pt-6">
                <div className="flex flex-col gap-6">
                    <ProfileInfo
                        profile={profile}
                        onSettingsClick={profile.isMe ? handleSettingsClick : undefined}
                    />

                    <FollowCountArea
                        userId={profile.id}
                        followers={profile.followerCount}
                        following={profile.followingCount}
                        isMe={profile.isMe}
                    />

                    <div className="flex justify-center">
                        {profile.isMe ? (
                            <ProfileButton
                                onClick={handleSettingsClick}
                                className="w-[200px]"
                            />
                        ) : (
                            <FollowButton
                                isFollowing={profile.isFollowing || false}
                                isFollowingMe={profile.isFollowingMe}
                                onFollowClick={toggleFollow}
                                className="w-[200px]"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}