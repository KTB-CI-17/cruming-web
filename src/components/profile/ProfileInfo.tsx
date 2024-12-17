import React from 'react';
import { Settings, MapPin, Ruler } from 'lucide-react';
import { UserProfile } from "../../types/user";
import ProfileAvatar from '../common/ProfileAvatar';

interface ProfileInfoProps {
    profile: UserProfile;
    onSettingsClick?: () => void;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({
                                                            profile,
                                                            onSettingsClick
                                                        }) => {
    return (
        <div className="flex flex-col items-center w-full">
            {/* Settings Button */}
            {profile.isMe && onSettingsClick && (
                <div className="self-end mb-4">
                    <button
                        onClick={onSettingsClick}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                    >
                        <Settings size={20} />
                    </button>
                </div>
            )}

            {/* Profile Image */}
            <div className="w-[120px] h-[120px] mb-4">
                <ProfileAvatar
                    userProfile={profile.profile}
                    userNickname={profile.nickname}
                    userId={profile.id}
                    size="xl"
                />
            </div>

            {/* Basic Info */}
            <div className="text-center mb-4">
                <h1 className="text-xl font-bold mb-1">{profile.nickname}</h1>
                {profile.instagramId && (
                    <a
                        href={`https://instagram.com/${profile.instagramId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 text-sm"
                    >
                        @{profile.instagramId}
                    </a>
                )}
            </div>

            {/* Physical Info */}
            <div className="flex gap-6 mb-4">
                {profile.height && (
                    <div className="flex items-center gap-1 text-gray-600">
                        <Ruler size={18} />
                        <span className="text-sm">키: {profile.height}cm</span>
                    </div>
                )}
                {profile.armReach && (
                    <div className="flex items-center gap-1 text-gray-600">
                        <Ruler size={18} className="rotate-90" />
                        <span className="text-sm">팔 길이: {profile.armReach}cm</span>
                    </div>
                )}
            </div>

            {/* Gym Info */}
            {profile.homeGym && (
                <div className="flex items-center gap-1 text-gray-600 mb-4">
                    <MapPin size={18} />
                    <span className="text-sm">{profile.homeGym}</span>
                </div>
            )}

            {/* Introduction */}
            {profile.intro && (
                <p className="text-center text-gray-700 px-4 max-w-md">
                    {profile.intro}
                </p>
            )}
        </div>
    );
};