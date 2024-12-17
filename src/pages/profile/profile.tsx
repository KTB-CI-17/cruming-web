import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { ProfileInfo } from "../../components/profile/ProfileInfo";
import { FollowCountArea } from "../../components/profile/FollowCountArea";
import { FollowButton } from "../../components/profile/FollowButton";
import { useNavigate, useParams } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";
import TimelineList from "../../components/timeline/TimelineList";
import MoreActionsMenu from "../../components/common/MoreActionsMenu";
import { useProfileTimeline } from "../../hooks/timeline/useProfileTimeline";
import { useTimelineCRUD } from "../../hooks/timeline/useTimelineCRUD";

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
    const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

    const {
        timelines,
        isLoading: timelineLoading,
        isRefreshing,
        hasMore,
        fetchNextPage,
        fetchTimelines,
        setTimelines
    } = useProfileTimeline(id);

    const {
        selectedTimelineId,
        setSelectedTimelineId,
        handleTimelineAction
    } = useTimelineCRUD();

    useEffect(() => {
        fetchTimelines();
    }, [fetchTimelines]);

    const handleOptionsPress = (timelineId: number) => {
        setSelectedTimelineId(timelineId);
        setIsOptionsMenuOpen(true);
    };

    const handleMenuClose = () => {
        setIsOptionsMenuOpen(false);
        setSelectedTimelineId(null);
    };

    const handleDeleteSuccess = (id: number) => {
        setTimelines(prev => prev.filter(timeline => timeline.id !== id));
    };

    const handleDeleteClick = async () => {
        const success: boolean = await handleTimelineAction(selectedTimelineId!, 'delete');
        if (success) {
            handleDeleteSuccess(selectedTimelineId!);
        }
    };
    
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

    const handleEditClick = () => {
        navigate('/profile/edit');
    };

    const handleSettingsClick = () => {
        navigate('/profile/setting');
    };

    return (
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
                            onClick={handleEditClick}
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

                <div className="mt-6">
                    {timelineLoading ? (
                        <div className="flex justify-center items-center py-4">
                            <Loader className="animate-spin" size={24}/>
                        </div>
                    ) : (
                        <TimelineList
                            timelines={timelines || []}
                            isLoading={timelineLoading}
                            isRefreshing={isRefreshing}
                            onOptionsPress={handleOptionsPress}
                            hasMore={hasMore}
                            onLoadMore={fetchNextPage}
                        />
                    )}
                </div>

                <MoreActionsMenu
                    isOpen={isOptionsMenuOpen}
                    onClose={handleMenuClose}
                    onEdit={() => handleTimelineAction(selectedTimelineId!, 'edit')}
                    onDelete={handleDeleteClick}
                />
            </div>
        </div>
    );
}