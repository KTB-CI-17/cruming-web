import React from 'react';

interface ProfileStatsProps {
    followers: number;
    following: number;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
                                                              followers,
                                                              following
                                                          }) => {
    return (
        <div className="flex items-center justify-center gap-8 bg-white rounded-lg p-2">
            <div className="flex items-center justify-center">
                <div className="text-center">
                    <span className="text-gray-600 text-sm">팔로워</span>
                    {' '}
                    <span className="font-bold text-gray-900">{followers}</span>
                </div>
            </div>
            <div className="w-px h-5 bg-gray-200" />
            <div className="flex items-center justify-center">
                <div className="text-center">
                    <span className="text-gray-600 text-sm">팔로잉</span>
                    {' '}
                    <span className="font-bold text-gray-900">{following}</span>
                </div>
            </div>
        </div>
    );
};