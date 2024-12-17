import { useState, useEffect, useCallback } from 'react';
import { useTimelinePosts } from "../../hooks/timeline/useTimelinePosts";
import { useTimelineCRUD } from "../../hooks/timeline/useTimelineCRUD";
import { useTimelineMarkedDates } from "../../hooks/timeline/useTimelineMarkedDates";
import CustomCalendar from "../../components/timeline/CustomCalendar";
import TimelineList from "../../components/timeline/TimelineList";
import AddTimelineButton from "../../components/timeline/AddTimelineButton";
import TimelineWriteModal from "../../components/timeline/WriteModal";
import MoreActionsMenu from "../../components/common/MoreActionsMenu";

export default function TimelinePage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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
        setCurrentMonth(date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        fetchMonthlyTimelines(year, month);
        fetchMarkedDates(year, month);
    }, [fetchMonthlyTimelines, fetchMarkedDates]);

    useEffect(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;

        fetchMonthlyTimelines(year, month);
        fetchMarkedDates(year, month);
    }, [fetchMonthlyTimelines, fetchMarkedDates, currentMonth]);

    const handleOptionsPress = (timelineId: number) => {
        setSelectedTimelineId(timelineId);
        setIsOptionsMenuOpen(true);
    };

    const handleDeleteSuccess = (id: number) => {
        setTimelines(prev => prev.filter(timeline => timeline.id !== id));

        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;
        fetchMarkedDates(year, month);
    };

    const handleDeleteClick = async () => {
        const success: boolean = await handleTimelineAction(selectedTimelineId!, 'delete');
        if (success) {
            handleDeleteSuccess(selectedTimelineId!);
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const handleCreateSuccess = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;

        fetchMonthlyTimelines(year, month);
        fetchMarkedDates(year, month);
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
                    onEdit={() => handleTimelineAction(selectedTimelineId!, 'edit')}
                    onDelete={handleDeleteClick}
                />
            </div>
        </div>
    );
}