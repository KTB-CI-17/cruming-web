import { useState, useEffect, useCallback } from 'react';
import { useTimelinePosts } from "../../hooks/timeline/useTimelinePosts";
import { useTimelineCRUD } from "../../hooks/timeline/useTimelineCRUD";
import { useTimelineMarkedDates } from "../../hooks/timeline/useTimelineMarkedDates";
import CustomCalendar from "../../components/timeline/CustomCalendar";
import TimelineList from "../../components/timeline/TimelineList";
import AddTimelineButton from "../../components/timeline/AddTimelineButton";
import TimelineWriteModal from "../../components/timeline/WriteModal";
import MoreActionsMenu from "../../components/common/MoreActionsMenu";

interface TimelinePageProps {
    userId?: string;
}

export default function TimelinePage({ userId }: TimelinePageProps) {
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

    const {
        markedDates,
        isLoadingDates,
        fetchMarkedDates
    } = useTimelineMarkedDates();

    const handleMonthChange = useCallback((date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        fetchMonthlyTimelines(year, month);
        fetchMarkedDates(year, month);
    }, [fetchMonthlyTimelines, fetchMarkedDates]);

    useEffect(() => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        fetchMonthlyTimelines(year, month);
        fetchMarkedDates(year, month);
    }, [fetchMonthlyTimelines, fetchMarkedDates, userId]);

    const handleOptionsPress = (timelineId: number) => {
        setSelectedTimelineId(timelineId);
        setIsOptionsMenuOpen(true);
    };

    const handleActionComplete = async (action: 'edit' | 'delete') => {
        if (selectedTimelineId) {
            const success = await handleTimelineAction(selectedTimelineId, action);
            if (success && action === 'delete') {
                setTimelines(prev => prev.filter(timeline => timeline.id !== selectedTimelineId));
                // 삭제 후 해당 월의 마킹 데이터 다시 조회
                const currentDate = new Date();
                fetchMarkedDates(currentDate.getFullYear(), currentDate.getMonth() + 1);
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
        fetchMarkedDates(year, month);  // 새로운 타임라인 생성 후 마킹 데이터 갱신
        handleModalClose();
    };

    const handleMenuClose = () => {
        setIsOptionsMenuOpen(false);
        setSelectedTimelineId(null);
    };

    return (
        <div className="max-w-screen-sm mx-auto w-full pt-6">
            <div className="flex flex-col gap-6">
                <div>
                    <div className="bg-white mb-4">
                        <CustomCalendar
                            markedDates={markedDates}
                            onMonthChange={handleMonthChange}
                            isLoading={isLoadingDates}
                        />
                    </div>

                    <TimelineList
                        timelines={timelines}
                        isLoading={isLoading}
                        isRefreshing={isRefreshing}
                        onOptionsPress={handleOptionsPress}
                        hasMore={hasMore}
                        onLoadMore={fetchNextPage}
                    />
                </div>

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
        </div>
    );
}