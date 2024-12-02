import React from 'react';

interface FollowButtonProps {
    isFollowing: boolean;
    isFollowingMe?: boolean;
    onFollowClick: () => void;
    className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
                                                              isFollowing,
                                                              isFollowingMe,
                                                              onFollowClick,
                                                              className = ''
                                                          }) => {
    const getButtonStyle = () => {
        if (isFollowing) {
            return 'bg-gray-100 text-gray-700';
        }
        return 'bg-blue-500 text-white';
    };

    const getButtonText = () => {
        if (isFollowing) {
            return '팔로잉';
        }
        if (isFollowingMe) {
            return '맞팔로우';
        }
        return '팔로우';
    };

    return (
        <button
            onClick={onFollowClick}
            className={`
        px-6 py-2 rounded-lg font-medium text-sm
        transition-colors duration-200
        ${getButtonStyle()}
        ${className}
      `}
        >
            {getButtonText()}
        </button>
    );
};