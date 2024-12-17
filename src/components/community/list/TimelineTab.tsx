import { useState, useCallback } from 'react';
import ErrorState from "./ErrorState";
import TimelineList from "../../timeline/TimelineList";
import AddTimelineButton from "../../timeline/AddTimelineButton";
import TimelineWriteModal from "../../timeline/WriteModal";
import MoreActionsMenu from "../../common/MoreActionsMenu";
import {useTimelinePosts} from "../../../hooks/timeline/useTimelinePosts";
import {useTimelineCRUD} from "../../../hooks/timeline/useTimelineCRUD";

const TimelineTab = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

    const {
        timelines,
        isLoading,
        isRefreshing,
        fetchMonthlyTimelines,
        setTimelines,
        hasMore,
        fetchNextPage
    } = useTimelinePosts();

    const {
        selectedTimelineId,
        setSelectedTimelineId,
        handleTimelineAction
    } = useTimelineCRUD();

    const handleOptionsPress = (timelineId: number) => {
        setSelectedTimelineId(timelineId);
        setIsOptionsMenuOpen(true);
    };

    const handleActionComplete = async (action: 'edit' | 'delete') => {
        if (selectedTimelineId) {
            const success = await handleTimelineAction(selectedTimelineId, action);
            if (success && action === 'delete') {
                setTimelines(prev => prev.filter(timeline => timeline.id !== selectedTimelineId));
            }
            setIsOptionsMenuOpen(false);
            setSelectedTimelineId(null);
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const handleCreateSuccess = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        fetchMonthlyTimelines(year, month);
        handleModalClose();
    };

    const handleMenuClose = () => {
        setIsOptionsMenuOpen(false);
        setSelectedTimelineId(null);
    };

    const handleRetry = useCallback(() => {
        const now = new Date();
        fetchMonthlyTimelines(now.getFullYear(), now.getMonth() + 1);
    }, [fetchMonthlyTimelines]);

    if (isLoading && timelines.length === 0) {
        return <div className="p-4 text-center">로딩 중...</div>;
    }

    if (!timelines.length && !isLoading) {
        return <ErrorState onRetry={handleRetry} />;
    }

    return (
        <div className="flex flex-col gap-6">
            <TimelineList
                timelines={timelines}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                onOptionsPress={handleOptionsPress}
                hasMore={hasMore}
                onLoadMore={fetchNextPage}
            />

            <AddTimelineButton onClick={() => setIsModalVisible(true)} />

            <TimelineWriteModal
                isOpen={isModalVisible}
                onClose={handleModalClose}
                onCreateSuccess={handleCreateSuccess}
            />

            <MoreActionsMenu
                isOpen={isOptionsMenuOpen}
                onClose={handleMenuClose}
                onEdit={() => handleActionComplete('edit')}
                onDelete={() => handleActionComplete('delete')}
            />
        </div>
    );
};

export default TimelineTab;