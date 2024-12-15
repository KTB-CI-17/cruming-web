import { useState, useEffect } from 'react';
import { Timeline } from "../../types/timeline";
import { useTimelinePosts } from "../../hooks/timeline/useTimelinePosts";
import { useTimelineCRUD } from "../../hooks/timeline/useTimelineCRUD";
import CustomCalendar from "../../components/timeline/CustomCalendar";
import TimelineList from "../../components/timeline/TimelineList";
import AddTimelineButton from "../../components/timeline/AddTimelineButton";
import TimelineWriteModal from "../../components/timeline/WriteModal";
import MoreActionsMenu from "../../components/common/MoreActionsMenu";
import {useTimelineCalendar} from "../../hooks/timeline/useTimelineCalender";

export default function TimelinePage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

    const {
        timelines,
        isLoading,
        isRefreshing,
        fetchMonthlyTimelines,
        setTimelines
    } = useTimelinePosts();

    const {
        handleMonthChange,
        getMarkedDates
    } = useTimelineCalendar((year, month) => fetchMonthlyTimelines(year, month));

    const {
        selectedTimelineId,
        setSelectedTimelineId,
        handleTimelineAction
    } = useTimelineCRUD();

    useEffect(() => {
        const currentDate = new Date();
        fetchMonthlyTimelines(currentDate.getFullYear(), currentDate.getMonth() + 1);
    }, [fetchMonthlyTimelines]);

    const handleOptionsPress = (timelineId: number) => {
        setSelectedTimelineId(timelineId);
        setIsOptionsMenuOpen(true);
    };

    const handleTimelineClick = (timeline: Timeline) => {
        console.log('타임라인 클릭:', timeline.id);
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

    return (
        <div className="min-h-screen bg-white">
            <div>
                <div className="bg-white mb-4">
                    <CustomCalendar
                        markedDates={getMarkedDates(timelines)}
                        onMonthChange={handleMonthChange}
                    />
                </div>

                <TimelineList
                    timelines={timelines}
                    isLoading={isLoading}
                    isRefreshing={isRefreshing}
                    onTimelineClick={handleTimelineClick}
                    onOptionsPress={handleOptionsPress}
                />
            </div>

            <AddTimelineButton onClick={() => setIsModalVisible(true)} />

            <TimelineWriteModal
                isOpen={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onCreateSuccess={() => {
                    const currentDate = new Date();
                    fetchMonthlyTimelines(currentDate.getFullYear(), currentDate.getMonth() + 1);
                }}
            />

            <MoreActionsMenu
                isOpen={isOptionsMenuOpen}
                onClose={() => {
                    setIsOptionsMenuOpen(false);
                    setSelectedTimelineId(null);
                }}
                onEdit={() => handleActionComplete('edit')}
                onDelete={() => handleActionComplete('delete')}
            />
        </div>
    );
}