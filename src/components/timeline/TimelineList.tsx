import { Loader2 } from 'lucide-react';
import { Timeline } from '../../types/timeline';
import TimelineCard from './TimelineCard';
import { format } from 'date-fns';

interface TimelineListProps {
    timelines: Timeline[];
    isLoading: boolean;
    isRefreshing: boolean;
    onTimelineClick: (timeline: Timeline) => void;
    onOptionsPress: (timelineId: number) => void;
}

export default function TimelineList({
                                         timelines,
                                         isLoading,
                                         isRefreshing,
                                         onTimelineClick,
                                         onOptionsPress
                                     }: TimelineListProps) {
    const formatDateForDisplay = (date: string) => {
        return format(new Date(date), 'yyyy. MM. dd.');
    };

    if (isLoading || isRefreshing) {
        return (
            <div className="flex justify-center py-4 bg-white">
                <Loader2 className="w-6 h-6 animate-spin text-[#735BF2]" />
            </div>
        );
    }

    if (timelines.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p>등록된 타임라인이 없습니다.</p>
                <p className="mt-2">새로운 타임라인을 등록해보세요!</p>
            </div>
        );
    }

    return (
        <div className="px-4 bg-white">
            {timelines.map((timeline) => (
                <TimelineCard
                    key={timeline.id}
                    timeline={{
                        ...timeline,
                        date: formatDateForDisplay(timeline.date)
                    }}
                    onClick={() => onTimelineClick(timeline)}
                    showOptions={true}
                    onOptionsPress={() => onOptionsPress(timeline.id)}
                />
            ))}
        </div>
    );
}