import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useTimelinePosts } from "../../hooks/timeline/useTimelinePosts";
import { Timeline } from "../../types/timeline";
import CustomCalendar from "../../components/timeline/CustomCalendar";
import TimelineCard from "../../components/timeline/TimelineCard";
import AddTimelineButton from "../../components/timeline/AddTimelineButton";
import TimelineWriteModal from "../../components/timeline/WriteModal";
import MoreActionsMenu from "../../components/common/MoreActionsMenu";
import {api} from "../../config/axios";

export default function TimelinePage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
    const [selectedTimelineId, setSelectedTimelineId] = useState<number | null>(null);

    const {
        timelines,
        isLoading,
        isRefreshing,
        fetchMonthlyTimelines,
        setTimelines
    } = useTimelinePosts();

    // 달력 월 변경 핸들러
    const handleMonthChange = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        fetchMonthlyTimelines(year, month);
    };

    // 컴포넌트 마운트 시 현재 월의 데이터 로드
    useEffect(() => {
        const currentDate = new Date();
        fetchMonthlyTimelines(currentDate.getFullYear(), currentDate.getMonth() + 1);
    }, [fetchMonthlyTimelines]);

    const deleteTimeline = async (id: number) => {
        try {
            await api.delete(`/timelines/${id}`);
            setTimelines(prev => prev.filter(timeline => timeline.id !== id));
            alert('삭제되었습니다.');
        } catch (error) {
            console.error('Failed to delete timeline:', error);
            alert('삭제에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleTimelineAction = (id: number, action: 'edit' | 'delete') => {
        if (action === 'delete') {
            if (confirm('활동 기록을 삭제하시겠습니까?')) {
                deleteTimeline(id);
            }
        } else if (action === 'edit') {
            // TODO: 수정 기능 구현
            alert('수정 기능은 준비 중입니다.');
        }
    };

    const handleOptionsPress = (timelineId: number) => {
        setSelectedTimelineId(timelineId);
        setIsOptionsMenuOpen(true);
    };

    const formatDateForDisplay = (date: string) => {
        return format(new Date(date), 'yyyy. MM. dd.');
    };

    const activeMarkedDates = timelines.reduce((acc, timeline) => ({
        ...acc,
        [timeline.date]: {
            customStyles: {
                container: {
                    borderBottomWidth: 2,
                    borderBottomColor: '#735BF2',
                }
            }
        }
    }), {});

    const handleTimelineClick = (timeline: Timeline) => {
        // TODO: 상세 페이지로 이동
        console.log('타임라인 클릭:', timeline.id);
    };

    return (
        <div className="min-h-screen bg-white">
            <div>
                {/* Calendar */}
                <div className="bg-white mb-4">
                    <CustomCalendar
                        markedDates={activeMarkedDates}
                        onMonthChange={handleMonthChange}
                    />
                </div>

                {/* 타임라인 목록 */}
                <div className="px-4 bg-white">
                    {(isLoading || isRefreshing) && (
                        <div className="flex justify-center py-4 bg-white">
                            <Loader2 className="w-6 h-6 animate-spin text-[#735BF2]" />
                        </div>
                    )}

                    {/* Timeline Cards */}
                    {!isLoading && !isRefreshing && timelines.map((timeline) => (
                        <TimelineCard
                            key={timeline.id}
                            timeline={{
                                ...timeline,
                                date: formatDateForDisplay(timeline.date)
                            }}
                            onClick={() => handleTimelineClick(timeline)}
                            showOptions={true}
                            onOptionsPress={() => handleOptionsPress(timeline.id)}
                        />
                    ))}

                    {/* 데이터가 없을 때 */}
                    {!isLoading && !isRefreshing && timelines.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <p>등록된 타임라인이 없습니다.</p>
                            <p className="mt-2">새로운 타임라인을 등록해보세요!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 플로팅 액션 버튼 */}
            <AddTimelineButton onClick={() => setIsModalVisible(true)} />

            {/* 타임라인 작성 모달 */}
            <TimelineWriteModal
                isOpen={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onCreateSuccess={() => {
                    const currentDate = new Date();
                    fetchMonthlyTimelines(currentDate.getFullYear(), currentDate.getMonth() + 1);
                }}
            />

            {/* 옵션 메뉴 */}
            <MoreActionsMenu
                isOpen={isOptionsMenuOpen}
                onClose={() => {
                    setIsOptionsMenuOpen(false);
                    setSelectedTimelineId(null);
                }}
                onEdit={() => {
                    if (selectedTimelineId) {
                        handleTimelineAction(selectedTimelineId, 'edit');
                    }
                }}
                onDelete={() => {
                    if (selectedTimelineId) {
                        handleTimelineAction(selectedTimelineId, 'delete');
                    }
                }}
            />
        </div>
    );
}